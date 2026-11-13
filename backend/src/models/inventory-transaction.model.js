import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const inventorySchema = new Schema({ product:{type:Schema.Types.ObjectId,ref:'Product',required:true,index:true}, user:{type:Schema.Types.ObjectId,ref:'User'}, delta:Number, reason:String, reference:String },opts);
export const InventoryTransaction=model('InventoryTransaction',inventorySchema);
