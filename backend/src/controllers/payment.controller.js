import crypto from 'crypto';
import mongoose from 'mongoose';
import { Order, Payment, Notification } from '../models/index.js';
import { publishNotification } from '../sockets/server.socket.js';
import { ok } from '../utils/response.js';

// Dummy gateway for testing the payment flow. No real money moves.
// Outcome is decided on the server from the test card / UPI id, the way a real gateway would.
export const TEST_CARDS = {
  '4111111111111111': { ok: true },
  '5555555555554444': { ok: true },
  '4000000000000002': { ok: false, message: 'Card declined by the bank.' },
  '4000000000009995': { ok: false, message: 'Insufficient funds.' },
};
const TEST_UPI = { 'success@dummy': { ok: true }, 'failure@dummy': { ok: false, message: 'UPI payment was declined.' } };

const fail = (res, status, message) => res.status(status).json({ success: false, message });
const wait = ms => new Promise(r => setTimeout(r, ms));

async function ownOrder(req, id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Order.findOne({ _id: id, user: req.user.id });
}

export async function createDummyPayment(req, res) {
  const order = await ownOrder(req, req.body.orderId);
  if (!order) return fail(res, 404, 'Order not found.');
  if (order.paymentMethod !== 'online') return fail(res, 400, 'This order is not an online payment order.');
  if (order.paymentStatus === 'paid') return fail(res, 409, 'This order is already paid.');
  if (order.status === 'cancelled') return fail(res, 409, 'This order was cancelled.');
  const payment = await Payment.create({
    order: order._id,
    provider: 'dummy',
    providerOrderId: 'dummy_order_' + crypto.randomBytes(6).toString('hex'),
    amount: order.total,
    status: 'created',
  });
  return ok(res, { payment: { id: payment._id, providerOrderId: payment.providerOrderId, amount: payment.amount, currency: payment.currency }, mode: 'dummy' });
}

export async function confirmDummyPayment(req, res) {
  const { paymentId, method, card, upi } = req.body;
  if (!mongoose.isValidObjectId(paymentId)) return fail(res, 400, 'Invalid payment.');
  const payment = await Payment.findById(paymentId);
  const order = payment && (await ownOrder(req, payment.order));
  if (!payment || !order) return fail(res, 404, 'Payment not found.');
  if (payment.status === 'captured') return ok(res, { status: 'paid', message: 'Payment already received.', order });

  let outcome;
  if (method === 'upi') {
    outcome = TEST_UPI[String(upi || '').trim().toLowerCase()] || { ok: false, message: 'Invalid test UPI ID. Use success@dummy.' };
  } else {
    const number = String(card?.number || '').replace(/\s+/g, '');
    const cvv = String(card?.cvv || '');
    if (!/^\d{12,19}$/.test(number)) return fail(res, 400, 'Enter a valid card number.');
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(String(card?.expiry || ''))) return fail(res, 400, 'Enter expiry as MM/YY.');
    if (!/^\d{3,4}$/.test(cvv)) return fail(res, 400, 'Enter a valid CVV.');
    outcome = TEST_CARDS[number] || { ok: false, message: 'Unknown test card. Use 4111 1111 1111 1111.' };
  }

  await wait(900); // feel like a real gateway round trip

  if (!outcome.ok) {
    payment.status = 'failed';
    await payment.save();
    order.paymentStatus = 'failed';
    order.timeline.push({ status: order.status, note: 'Payment failed: ' + outcome.message });
    await order.save();
    return ok(res, { status: 'failed', message: outcome.message, order });
  }

  payment.providerPaymentId = 'dummy_pay_' + crypto.randomBytes(6).toString('hex');
  payment.status = 'captured';
  payment.signatureVerifiedAt = new Date(); // a live gateway would verify its HMAC signature here
  await payment.save();
  order.paymentStatus = 'paid';
  order.timeline.push({ status: order.status, note: 'Payment received (test mode)' });
  await order.save();

  try {
    const short = String(order._id).slice(-7).toUpperCase();
    const notices = await Promise.all([
      Notification.create({ user: req.user.id, audience: 'customer', title: 'Payment received', body: `Payment for order ${short} was successful.`, kind: 'payment', href: '/account' }),
      Notification.create({ audience: 'admin', title: 'Payment received', body: `Order ${short} was paid online (₹${order.total.toFixed(2)}).`, kind: 'payment', href: '/admin?tab=orders' }),
    ]);
    notices.forEach(publishNotification);
  } catch (err) {
    console.error('Payment notifications failed:', err.message);
  }
  return ok(res, { status: 'paid', message: 'Payment successful.', order });
}
