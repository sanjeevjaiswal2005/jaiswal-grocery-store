import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const couponSchema = new Schema({ code:{type:String,required:true,unique:true,uppercase:true,trim:true}, type:{type:String,enum:['percent','fixed'],required:true}, value:{type:Number,required:true,min:0}, minimumOrder:{type:Number,default:0,min:0}, maximumDiscount:{type:Number,min:0}, startsAt:Date, expiresAt:Date, usageLimit:{type:Number,min:1}, usageCount:{type:Number,default:0}, perCustomerLimit:{type:Number,default:1,min:1}, usedBy:[{user:{type:Schema.Types.ObjectId,ref:'User'},count:{type:Number,default:0}}], active:{type:Boolean,default:true} },opts);
export const Coupon=model('Coupon',couponSchema);
