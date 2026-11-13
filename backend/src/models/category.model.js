import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const categorySchema = new Schema({ name:{type:String,required:true,trim:true}, slug:{type:String,required:true,unique:true}, description:String, image:String, sortOrder:{type:Number,default:0}, active:{type:Boolean,default:true} },opts);
export const Category=model('Category',categorySchema);
