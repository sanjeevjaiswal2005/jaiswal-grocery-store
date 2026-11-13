import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Vercel serverless entry: reuse one DB connection across warm invocations.
let ready;

export default async function handler(req, res) {
  try {
    ready ??= connectDB();
    await ready;
  } catch (error) {
    ready = undefined;
    console.error('Could not connect to MongoDB:', error.message);
    return res.status(503).json({ success: false, message: 'Service temporarily unavailable.' });
  }
  return app(req, res);
}
