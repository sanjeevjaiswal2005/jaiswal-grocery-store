import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const productSchema = new Schema({ name:{type:String,required:true,trim:true,index:'text'}, slug:{type:String,required:true,unique:true}, description:{type:String,default:''}, image:{type:String,default:''}, images:[String], category:{type:Schema.Types.ObjectId,ref:'Category',index:true}, brand:String, unit:{type:String,default:'each'}, price:{type:Number,required:true,min:0}, compareAtPrice:{type:Number,min:0}, stock:{type:Number,default:0,min:0}, lowStockAt:{type:Number,default:8}, sku:{type:String,trim:true}, featured:{type:Boolean,default:false}, active:{type:Boolean,default:true}, rating:{type:Number,default:0}, reviewCount:{type:Number,default:0} },opts);
productSchema.index({active:1,category:1,price:1});
export const Product=model('Product',productSchema);
