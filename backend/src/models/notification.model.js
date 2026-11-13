import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const notificationSchema = new Schema({ user:{type:Schema.Types.ObjectId,ref:'User',index:true}, audience:{type:String,enum:['customer','admin'],default:'customer'}, title:String, body:String, kind:String, href:String, readAt:Date },opts);
export const Notification=model('Notification',notificationSchema);
