import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const addressSchema = new Schema({ user:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true},label:{type:String,default:'Home'},name:{type:String,required:true},phone:{type:String,required:true},line1:{type:String,required:true},line2:String,city:{type:String,required:true},state:{type:String,required:true},pincode:{type:String,required:true},isDefault:{type:Boolean,default:false} },opts);
export const Address=model('Address',addressSchema);
