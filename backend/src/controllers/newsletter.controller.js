import { NewsletterSubscription } from '../models/index.js';

export async function subscribeNewsletter(req,res){const email=String(req.body.email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>180)return res.status(400).json({success:false,message:'Enter a valid email address.'});await NewsletterSubscription.updateOne({email},{$set:{active:true}},{upsert:true});return res.status(201).json({success:true,data:{},message:'You’re on the list. Watch your inbox for good things.'});}
