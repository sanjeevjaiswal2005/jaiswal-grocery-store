import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const settingSchema = new Schema({ key:{type:String,unique:true}, value:Schema.Types.Mixed },opts);
export const StoreSetting=model('StoreSetting',settingSchema);
