import { Notification } from '../models/index.js';
import { ok } from '../utils/response.js';

export async function getNotifications(req,res){const filter=req.user.role==='customer'?{user:req.user.id}:{audience:'admin'};const [items,unread]=await Promise.all([Notification.find(filter).sort({createdAt:-1}).limit(50),Notification.countDocuments({...filter,readAt:null})]);return ok(res,{items,unread});}
export async function readNotification(req,res){const filter=req.user.role==='customer'?{_id:req.params.id,user:req.user.id}:{_id:req.params.id,audience:'admin'};const n=await Notification.findOneAndUpdate(filter,{readAt:new Date()},{new:true});if(!n)return res.status(404).json({success:false,message:'Notification not found.'});return ok(res,{notification:n});}
