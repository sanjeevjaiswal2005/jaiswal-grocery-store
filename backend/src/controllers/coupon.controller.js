import { Coupon, AuditLog } from '../models/index.js';
import { ok } from '../utils/response.js';
import { couponDiscount, findValidCoupon } from '../services/coupon.service.js';

export async function validateCoupon(req,res){const subtotal=Number(req.body.subtotal);if(!Number.isFinite(subtotal)||subtotal<0)return res.status(400).json({success:false,message:'Please provide a valid order subtotal.'});try{const coupon=await findValidCoupon(req.body.code,req.user.id,subtotal);return ok(res,{code:coupon.code,discount:couponDiscount(coupon,subtotal),total:subtotal-couponDiscount(coupon,subtotal)});}catch(error){return res.status(error.status||400).json({success:false,message:error.message});}}
export async function adminCoupons(req,res){return ok(res,{items:await Coupon.find().sort({createdAt:-1})});}
export async function createCoupon(req,res){const coupon=await Coupon.create({...req.body,code:String(req.body.code).trim().toUpperCase()});await AuditLog.create({actor:req.user.id,action:'coupon.create',entity:'Coupon',entityId:String(coupon._id)});return res.status(201).json({success:true,data:{coupon}});}
export async function updateCoupon(req,res){const coupon=await Coupon.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!coupon)return res.status(404).json({success:false,message:'Coupon not found.'});await AuditLog.create({actor:req.user.id,action:'coupon.update',entity:'Coupon',entityId:String(coupon._id)});return ok(res,{coupon});}
