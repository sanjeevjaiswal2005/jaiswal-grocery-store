import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const reviewSchema = new Schema({ product:{type:Schema.Types.ObjectId,ref:'Product',required:true,index:true}, user:{type:Schema.Types.ObjectId,ref:'User',required:true,index:true}, rating:{type:Number,required:true,min:1,max:5}, comment:{type:String,trim:true,maxlength:1200}, approved:{type:Boolean,default:false}, moderatedBy:{type:Schema.Types.ObjectId,ref:'User'} },opts);
reviewSchema.index({product:1,user:1},{unique:true});
export const Review=model('Review',reviewSchema);
