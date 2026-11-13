import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const opts = { timestamps: true };

const auditLogSchema = new Schema({actor:{type:Schema.Types.ObjectId,ref:'User'},action:{type:String,required:true},entity:String,entityId:String,details:Schema.Types.Mixed,ip:String},opts);
export const AuditLog=model('AuditLog',auditLogSchema);
