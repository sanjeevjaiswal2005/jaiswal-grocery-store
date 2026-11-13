import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';

const app=express();
app.use(helmet());
app.use(cors({origin:process.env.CLIENT_ORIGIN||'http://localhost:5173',credentials:true}));
app.use(express.json({limit:'1mb'}));
app.use(cookieParser());
app.use(morgan('tiny'));
app.use('/api/v1',routes);
app.use(notFound);
app.use(errorHandler);

export default app;
