import { getTenants, createTenant } from '../controllers/tenantController.js';
import { verifyToken } from './_verifyToken.js';
import { connectDB } from '../db.js';

export default async function handler(req, res) {
  await connectDB();
  try {
    req.user = verifyToken(req);
    if (req.method === 'GET') return getTenants(req, res);
    if (req.method === 'POST') return createTenant(req, res);
    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
}
