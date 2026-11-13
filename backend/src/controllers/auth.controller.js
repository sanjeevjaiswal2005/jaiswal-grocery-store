import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { ok } from '../utils/response.js';

export const safeUser=u=>({id:u._id,name:u.name,email:u.email,role:u.role,phone:u.phone});
export async function register(req,res){const {name,email,password}=req.body; if(await User.exists({email:email.toLowerCase()}))return res.status(409).json({success:false,message:'An account with this email already exists.'}); const user=await User.create({name,email,password:await bcrypt.hash(password,12)}); issueCookie(user,res); return res.status(201).json({success:true,data:{user:safeUser(user)}});}
export async function login(req,res){const user=await User.findOne({email:req.body.email.toLowerCase()}).select('+password'); if(!user||!await bcrypt.compare(req.body.password,user.password))return res.status(401).json({success:false,message:'Email or password is incorrect.'}); if(!user.active)return res.status(403).json({success:false,message:'This account is unavailable.'}); issueCookie(user,res); return ok(res,{user:safeUser(user)});}
function issueCookie(user,res){const token=jwt.sign({sub:user.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN||'7d'});res.cookie(process.env.COOKIE_NAME||'jaiswal_token',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:7*86400000});}
export function logout(req,res){res.clearCookie(process.env.COOKIE_NAME||'jaiswal_token',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax'});return ok(res,{},'Signed out.');}
export async function me(req,res){return ok(res,{user:safeUser(req.user)});}
