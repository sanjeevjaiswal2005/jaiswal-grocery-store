import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const wishlistSchema = new Schema({ user:{type:Schema.Types.ObjectId,ref:'User',required:true,unique:true}, products:[{type:Schema.Types.ObjectId,ref:'Product'}] },opts);
export const Wishlist=model('Wishlist',wishlistSchema);
