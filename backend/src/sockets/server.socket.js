import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { User } from '../models/index.js';

let io;
export function attachSocket(server){
  io=new Server(server,{cors:{origin:process.env.CLIENT_ORIGIN||'http://localhost:5173',credentials:true}});
  io.use(async(socket,next)=>{try{const token=parse(socket.handshake.headers.cookie||'')[process.env.COOKIE_NAME||'jaiswal_token'];if(!token)return next(new Error('Authentication required'));const payload=jwt.verify(token,process.env.JWT_SECRET);const user=await User.findById(payload.sub);if(!user?.active)return next(new Error('Account unavailable'));socket.data.user={id:String(user._id),role:user.role};next();}catch{next(new Error('Authentication required'));}});
  io.on('connection',socket=>{socket.join(`user:${socket.data.user.id}`);if(['super-admin','admin','inventory-manager','order-manager'].includes(socket.data.user.role))socket.join('admins');});
  return io;
}
export function publishNotification(notification){if(!io)return;const room=notification.audience==='admin'?'admins':`user:${notification.user}`;io.to(room).emit('notification:new',{id:String(notification._id),title:notification.title,body:notification.body,kind:notification.kind,href:notification.href,createdAt:notification.createdAt});}
