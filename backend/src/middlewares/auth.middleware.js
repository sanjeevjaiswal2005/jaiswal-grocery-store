import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async(req,res,next)=>{
  const token=req.cookies[process.env.COOKIE_NAME||'jaiswal_token'];
  if(!token) return res.status(401).json({success:false,message:'Please sign in to continue.'});
  try { const payload=jwt.verify(token,process.env.JWT_SECRET); req.user=await User.findById(payload.sub); if(!req.user?.active) return res.status(401).json({success:false,message:'This account is unavailable.'}); next(); }
  catch { return res.status(401).json({success:false,message:'Your session has expired. Please sign in again.'}); }
});
export const allowRoles=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({success:false,message:'You do not have access to this area.'});
