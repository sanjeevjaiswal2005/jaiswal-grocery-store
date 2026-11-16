import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const orderSchema = new Schema({ user:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true}, items:[{product:{type:Schema.Types.ObjectId,ref:'Product'},name:String,image:String,unit:String,price:Number,quantity:Number}], subtotal:{type:Number,required:true}, discount:{type:Number,default:0}, couponCode:String, deliveryFee:{type:Number,default:0}, total:{type:Number,required:true}, paymentMethod:{type:String,enum:['cod','online','upi-qr','razorpay'],default:'cod'}, paymentRef:String, paymentStatus:{type:String,enum:['pending','verifying','paid','failed','refunded'],default:'pending'}, status:{type:String,enum:['placed','confirmed','processing','packed','out-for-delivery','delivered','cancelled'],default:'placed',index:true}, address:{name:String,phone:String,line1:String,line2:String,city:String,state:String,pincode:String}, timeline:[{status:String,note:String,at:{type:Date,default:Date.now}}] },opts);
orderSchema.index({createdAt:-1});
export const Order=model('Order',orderSchema);
