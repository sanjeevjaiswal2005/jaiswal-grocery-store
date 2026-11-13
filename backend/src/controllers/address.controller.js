import { Address } from "../models/index.js";
import { ok } from "../utils/response.js";

export async function listAddresses(req, res) {
  return ok(res, {
    items: await Address.find({ user: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    }),
  });
}
export async function addAddress(req, res) {
  const data = { ...req.body, user: req.user.id };
  if (data.isDefault)
    await Address.updateMany({ user: req.user.id }, { isDefault: false });
  const address = await Address.create(data);
  return res.status(201).json({ success: true, data: { address } });
}
export async function updateAddress(req, res) {
  if (req.body.isDefault)
    await Address.updateMany({ user: req.user.id }, { isDefault: false });
  const address = await Address.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true },
  );
  if (!address)
    return res
      .status(404)
      .json({ success: false, message: "Address not found." });
  return ok(res, { address });
}
export async function deleteAddress(req, res) {
  const address = await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!address)
    return res
      .status(404)
      .json({ success: false, message: "Address not found." });
  return ok(res, {});
}
