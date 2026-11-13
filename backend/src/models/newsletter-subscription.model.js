import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const newsletterSchema = new Schema({email:{type:String,required:true,unique:true,lowercase:true,trim:true},active:{type:Boolean,default:true}},opts);
export const NewsletterSubscription=model('NewsletterSubscription',newsletterSchema);
