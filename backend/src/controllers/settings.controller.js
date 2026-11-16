import { StoreSetting, AuditLog } from '../models/index.js';
import { ok } from '../utils/response.js';

export async function publicSettings(req,res){const rows=await StoreSetting.find({key:{$in:['storeName','deliveryFee','freeDeliveryThreshold','minimumOrder']}});return ok(res,{settings:Object.fromEntries(rows.map(r=>[r.key,r.value]))});}
export async function adminSettings(req,res){const rows=await StoreSetting.find().sort({key:1});return ok(res,{settings:Object.fromEntries(rows.map(r=>[r.key,r.value]))});}
export async function updateSettings(req,res){const allowed=['storeName','deliveryFee','freeDeliveryThreshold','minimumOrder','phone','email','address','businessHours','paymentMethods','upiQrEnabled','socialLinks'];const entries=Object.entries(req.body.settings||{}).filter(([key])=>allowed.includes(key));for(const [key,value] of entries)await StoreSetting.findOneAndUpdate({key},{$set:{value}},{upsert:true,new:true});await AuditLog.create({actor:req.user.id,action:'store.settings.update',entity:'StoreSetting',details:{keys:entries.map(([key])=>key)}});return adminSettings(req,res);}
