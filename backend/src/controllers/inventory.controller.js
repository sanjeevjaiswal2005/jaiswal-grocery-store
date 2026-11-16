import mongoose from "mongoose";
import {
  Product,
  Notification,
  InventoryTransaction,
  AuditLog,
} from "../models/index.js";
import { publishNotification } from "../sockets/server.socket.js";
import { ok } from "../utils/response.js";

export async function adjustInventory(req, res) {
  const delta = Number(req.body.delta);
  if (!Number.isInteger(delta) || delta === 0)
    return res
      .status(400)
      .json({
        success: false,
        message: "Enter a non-zero whole number for the stock adjustment.",
      });
  const filter = { _id: req.params.productId, active: true };
  if (delta < 0) filter.stock = { $gte: Math.abs(delta) };
  const product = await Product.findOneAndUpdate(
    filter,
    { $inc: { stock: delta } },
    { new: true },
  );
  if (!product)
    return res
      .status(409)
      .json({
        success: false,
        message:
          "Product was not found or this adjustment would make stock negative.",
      });
  await InventoryTransaction.create({
    product: product._id,
    user: req.user.id,
    delta,
    reason: String(req.body.reason || "Manual stock adjustment").slice(0, 120),
  });
  await AuditLog.create({
    actor: req.user.id,
    action: "inventory.adjust",
    entity: "Product",
    entityId: String(product._id),
    details: { delta, reason: req.body.reason },
  });
  if (product.stock <= product.lowStockAt) {
    const notification = await Notification.create({
      audience: "admin",
      title: product.stock === 0 ? "Product out of stock" : "Low stock alert",
      body: `${product.name} has ${product.stock} unit(s) remaining.`,
      kind: "inventory",
      href: "/admin/products",
    });
    publishNotification(notification);
  }
  return ok(res, { product });
}
export async function inventoryHistory(req, res) {
  const filter = {};
  if (req.query.productId && mongoose.isValidObjectId(req.query.productId))
    filter.product = req.query.productId;
  const items = await InventoryTransaction.find(filter)
    .populate("product", "name sku")
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(200);
  return ok(res, { items });
}
