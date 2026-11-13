import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const deliverySlotSchema = new Schema({label:{type:String,required:true},startsAt:{type:Date,required:true},endsAt:{type:Date,required:true},capacity:{type:Number,required:true,min:1},active:{type:Boolean,default:true}},opts);
export const DeliverySlot=model('DeliverySlot',deliverySlotSchema);
