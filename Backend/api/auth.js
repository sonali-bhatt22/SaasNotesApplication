import { login, register } from '../../controllers/authController.js';
import { connectDB } from '../../db.js';

export default async function handler(req, res) {
  await connectDB();

  const path = req.url.split('/').pop(); // last part of URL

  if (req.method === 'POST') {
    if (path === 'login') return login(req, res);
    if (path === 'register') return register(req, res);
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}
