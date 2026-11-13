import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const cartSchema = new Schema({ user:{type:Schema.Types.ObjectId,ref:'User',required:true,unique:true}, items:[{product:{type:Schema.Types.ObjectId,ref:'Product'},quantity:{type:Number,min:1}}] },opts);
export const Cart=model('Cart',cartSchema);
