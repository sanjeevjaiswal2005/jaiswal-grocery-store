import 'dotenv/config';
import mongoose from 'mongoose';
import { createServer } from 'node:http';
import app from './app.js';
import { attachSocket } from './sockets/server.socket.js';
import { connectDB } from './config/db.js';

const port=process.env.PORT||5000;
if(!process.env.MONGODB_URI||!process.env.JWT_SECRET){console.error('MONGODB_URI and JWT_SECRET are required. Copy backend/.env.example to backend/.env.');process.exit(1);}
try{await connectDB();const server=createServer(app);attachSocket(server);server.listen(port,()=>console.log(`Jaiswal Grocery API listening on ${port}`));}catch(error){console.error('Could not connect to MongoDB:',error.message);process.exit(1);}
