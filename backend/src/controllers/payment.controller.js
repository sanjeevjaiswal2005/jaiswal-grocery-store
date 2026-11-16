import crypto from 'crypto';
import mongoose from 'mongoose';
import { Order, Payment, Notification, StoreSetting } from '../models/index.js';
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


// Shared by the dummy gateway, Razorpay verify and the Razorpay webhook. Safe to call twice.
export async function markPaid(order, payment, providerPaymentId, note = 'Payment received') {
  if (payment.status === 'captured' && order.paymentStatus === 'paid') return false;
  payment.providerPaymentId = providerPaymentId;
  payment.status = 'captured';
  payment.signatureVerifiedAt = new Date();
  await payment.save();
  order.paymentStatus = 'paid';
  order.timeline.push({ status: order.status, note });
  await order.save();
  try {
    const short = String(order._id).slice(-7).toUpperCase();
    const notices = await Promise.all([
      Notification.create({ user: order.user, audience: 'customer', title: 'Payment received', body: `Payment for order ${short} was successful.`, kind: 'payment', href: '/account' }),
      Notification.create({ audience: 'admin', title: 'Payment received', body: `Order ${short} was paid online (₹${order.total.toFixed(2)}).`, kind: 'payment', href: '/admin?tab=orders' }),
    ]);
    notices.forEach(publishNotification);
  } catch (err) {
    console.error('Payment notifications failed:', err.message);
  }
  return true;
}

async function ownOrder(req, id) {
  if (!mongoose.isValidObjectId(id)) return null;
  return Order.findOne({ _id: id, user: req.user.id });
}

export async function createDummyPayment(req, res) {
  if (razorpayEnabled()) return fail(res, 404, 'Not available.');
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
  if (razorpayEnabled()) return fail(res, 404, 'Not available.');
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

  await markPaid(order, payment, 'dummy_pay_' + crypto.randomBytes(6).toString('hex'), 'Payment received (test mode)');
  return ok(res, { status: 'paid', message: 'Payment successful.', order });
}

// ---------- Razorpay (live gateway) ----------
const rzpKeys = () => ({ id: process.env.RAZORPAY_KEY_ID, secret: process.env.RAZORPAY_KEY_SECRET });
export const razorpayEnabled = () => Boolean(rzpKeys().id && rzpKeys().secret);
const hmac = (secret, text) => crypto.createHmac('sha256', secret).update(text).digest('hex');
const safeEqual = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };

export async function paymentConfig(req, res) {
  return ok(res, { provider: razorpayEnabled() ? 'razorpay' : 'dummy', keyId: razorpayEnabled() ? rzpKeys().id : undefined, upiQr: await upiQrEnabled(), upiVpa: process.env.UPI_VPA || undefined, upiName: process.env.UPI_NAME || undefined });
}

export async function createRazorpayPayment(req, res) {
  if (!razorpayEnabled()) return fail(res, 503, 'Online payments are not configured.');
  const order = await ownOrder(req, req.body.orderId);
  if (!order) return fail(res, 404, 'Order not found.');
  if (order.paymentMethod !== 'online') return fail(res, 400, 'This order is not an online payment order.');
  if (order.paymentStatus === 'paid') return fail(res, 409, 'This order is already paid.');
  if (order.status === 'cancelled') return fail(res, 409, 'This order was cancelled.');
  const { id, secret } = rzpKeys();
  const r = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64') },
    body: JSON.stringify({ amount: Math.round(order.total * 100), currency: 'INR', receipt: String(order._id), notes: { orderId: String(order._id) } }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { console.error('Razorpay order failed:', data?.error?.description || r.status); return fail(res, 502, 'Could not start the payment. Please try again.'); }
  await Payment.create({ order: order._id, provider: 'razorpay', providerOrderId: data.id, amount: order.total, currency: data.currency, status: 'created' });
  return ok(res, { keyId: id, razorpayOrderId: data.id, amount: data.amount, currency: data.currency, name: req.user.name, email: req.user.email });
}

export async function verifyRazorpayPayment(req, res) {
  if (!razorpayEnabled()) return fail(res, 503, 'Online payments are not configured.');
  const { razorpay_order_id: rzpOrderId, razorpay_payment_id: rzpPaymentId, razorpay_signature: signature } = req.body;
  if (!rzpOrderId || !rzpPaymentId || !signature) return fail(res, 400, 'Missing payment details.');
  const payment = await Payment.findOne({ provider: 'razorpay', providerOrderId: rzpOrderId });
  const order = payment && (await ownOrder(req, payment.order));
  if (!payment || !order) return fail(res, 404, 'Payment not found.');
  if (!safeEqual(hmac(rzpKeys().secret, rzpOrderId + '|' + rzpPaymentId), signature)) {
    payment.status = 'failed'; await payment.save();
    order.paymentStatus = 'failed'; order.timeline.push({ status: order.status, note: 'Payment verification failed' }); await order.save();
    return fail(res, 400, 'Payment verification failed.');
  }
  await markPaid(order, payment, rzpPaymentId, 'Payment received (Razorpay)');
  return ok(res, { status: 'paid', message: 'Payment successful.', order });
}

// Razorpay calls this even if the customer closes the tab right after paying.
export async function razorpayWebhook(req, res) {
  const whSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!whSecret) return res.status(503).end();
  const sig = req.get('x-razorpay-signature');
  if (!req.rawBody || !sig || !safeEqual(hmac(whSecret, req.rawBody), sig)) return res.status(400).end();
  const entity = req.body?.payload?.payment?.entity;
  if (req.body?.event === 'payment.captured' && entity?.order_id) {
    const payment = await Payment.findOne({ provider: 'razorpay', providerOrderId: entity.order_id });
    const order = payment && (await Order.findById(payment.order));
    if (payment && order) await markPaid(order, payment, entity.id, 'Payment received (Razorpay webhook)');
  }
  return res.json({ received: true });
}

// ---------- Manual UPI QR (temporary): customer pays the store QR, admin confirms the UTR ----------
export async function upiQrEnabled() {
  const row = await StoreSetting.findOne({ key: 'upiQrEnabled' });
  return row ? row.value !== false : true; // on unless an admin switched it off
}

export async function submitUpiQr(req, res) {
  const order = await ownOrder(req, req.body.orderId);
  if (!order) return fail(res, 404, 'Order not found.');
  if (order.paymentMethod !== 'upi-qr') return fail(res, 400, 'This order does not use UPI QR payment.');
  if (order.paymentStatus === 'paid') return fail(res, 409, 'This order is already paid.');
  if (order.status === 'cancelled') return fail(res, 409, 'This order was cancelled.');
  const utr = String(req.body.utr || '').trim().toUpperCase();
  if (utr && !/^[A-Z0-9]{8,30}$/.test(utr)) return fail(res, 400, 'That transaction ID looks wrong. It has 12 digits or letters. You can also leave it empty.');
  if (utr) {
    const clash = await Order.findOne({ _id: { $ne: order._id }, paymentRef: utr });
    if (clash) return fail(res, 409, 'This transaction ID was already used for another order.');
  }
  order.paymentRef = utr || undefined;
  order.paymentStatus = 'verifying';
  order.timeline.push({ status: order.status, note: utr ? 'UPI payment submitted, UTR ' + utr : 'UPI payment submitted (no UTR)' });
  await order.save();
  await Payment.create({ order: order._id, provider: 'upi-qr', providerPaymentId: utr || undefined, amount: order.total, status: 'authorized' });
  try {
    const short = String(order._id).slice(-7).toUpperCase();
    const n = await Notification.create({ audience: 'admin', title: 'Verify UPI payment', body: `Order ${short}: ₹${order.total.toFixed(2)} paid by UPI QR${utr ? `, UTR ${utr}` : ' (no UTR given)'}. Check your PhonePe app for this amount and confirm.`, kind: 'payment', href: '/admin?tab=orders' });
    publishNotification(n);
  } catch (err) { console.error('UPI notification failed:', err.message); }
  return ok(res, { status: 'verifying', message: 'Thanks! We will confirm your payment shortly.', order });
}

export async function reviewUpiQr(req, res) {
  const order = mongoose.isValidObjectId(req.params.id) && (await Order.findById(req.params.id));
  if (!order) return fail(res, 404, 'Order not found.');
  if (order.paymentMethod !== 'upi-qr') return fail(res, 400, 'This order does not use UPI QR payment.');
  if (order.paymentStatus !== 'verifying') return fail(res, 409, 'There is no payment waiting for review on this order.');
  const payment = await Payment.findOne({ order: order._id, provider: 'upi-qr' }).sort({ createdAt: -1 });
  const short = String(order._id).slice(-7).toUpperCase();
  if (req.body.action === 'confirm') {
    if (payment) await markPaid(order, payment, order.paymentRef || 'upi-qr-manual', 'Payment confirmed by store (UPI QR)');
    else { order.paymentStatus = 'paid'; await order.save(); }
    return ok(res, { order });
  }
  if (req.body.action === 'reject') {
    if (payment) { payment.status = 'failed'; await payment.save(); }
    order.paymentStatus = 'failed';
    order.timeline.push({ status: order.status, note: 'UPI payment could not be verified' });
    await order.save();
    try {
      const n = await Notification.create({ user: order.user, audience: 'customer', title: 'Payment not verified', body: `We could not verify the UPI payment for order ${short}. Please check the transaction ID and submit again.`, kind: 'payment', href: '/account' });
      publishNotification(n);
    } catch (err) { console.error('Reject notification failed:', err.message); }
    return ok(res, { order });
  }
  return fail(res, 400, 'Invalid action.');
}
