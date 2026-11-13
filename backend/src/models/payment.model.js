import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const paymentSchema = new Schema({order:{type:Schema.Types.ObjectId,ref:'Order',required:true,index:true},provider:String,providerOrderId:String,providerPaymentId:String,amount:Number,currency:{type:String,default:'INR'},status:{type:String,enum:['created','authorized','captured','failed','refunded'],default:'created'},signatureVerifiedAt:Date},opts);
export const Payment=model('Payment',paymentSchema);
