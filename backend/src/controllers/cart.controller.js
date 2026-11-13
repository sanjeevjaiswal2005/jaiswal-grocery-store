import mongoose from 'mongoose';
import { Cart } from '../models/index.js';
import { ok } from '../utils/response.js';

export async function getCart(req,res){const cart=await Cart.findOne({user:req.user.id}).populate('items.product');return ok(res,{items:cart?.items||[]});}
export async function setCart(req,res){const items=req.body.items||[];const normalized=items.filter(i=>mongoose.isValidObjectId(i.productId)).map(i=>({product:i.productId,quantity:Math.max(1,Math.min(99,Number(i.quantity)||1))}));const cart=await Cart.findOneAndUpdate({user:req.user.id},{user:req.user.id,items:normalized},{new:true,upsert:true}).populate('items.product');return ok(res,{items:cart.items});}
