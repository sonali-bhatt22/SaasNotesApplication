import { login, register } from '../controllers/authController.js';
import { connectDB } from '../db.js';

export default async function handler(req, res) {
  await connectDB();
  if (req.method === 'POST') {
    if (req.url.endsWith('/login')) return login(req, res);
    if (req.url.endsWith('/register')) return register(req, res);
  }
  res.status(405).json({ error: 'Method Not Allowed' });
}
