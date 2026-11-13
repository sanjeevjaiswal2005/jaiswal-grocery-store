import mongoose from 'mongoose';
import { Product, Wishlist } from '../models/index.js';
import { ok } from '../utils/response.js';

export async function getWishlist(req,res){const row=await Wishlist.findOne({user:req.user.id}).populate({path:'products',match:{active:true},populate:{path:'category',select:'name'}});return ok(res,{items:row?.products||[]});}
export async function setWishlist(req,res){const ids=[...new Set((req.body.productIds||[]).filter(mongoose.isValidObjectId))];const products=await Product.find({_id:{$in:ids},active:true}).select('_id');const row=await Wishlist.findOneAndUpdate({user:req.user.id},{user:req.user.id,products:products.map(p=>p._id)},{new:true,upsert:true}).populate('products');return ok(res,{items:row.products});}
