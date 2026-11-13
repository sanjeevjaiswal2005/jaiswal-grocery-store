import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const userSchema = new Schema({ name:{type:String,required:true,trim:true,maxlength:80}, email:{type:String,required:true,unique:true,lowercase:true,trim:true,index:true}, password:{type:String,required:true,select:false}, phone:{type:String,trim:true}, role:{type:String,enum:['customer','super-admin','admin','inventory-manager','order-manager'],default:'customer'}, active:{type:Boolean,default:true} },opts);
export const User=model('User',userSchema);
