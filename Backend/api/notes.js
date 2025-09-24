import { getNotes, createNote, updateNote, deleteNote } from '../controllers/notesController.js';
import { verifyToken } from './_verifyToken.js';
import { connectDB } from '../db.js';

export default async function handler(req, res) {
  await connectDB();
  try {
    req.user = verifyToken(req);
    if (req.method === 'GET') return getNotes(req, res);
    if (req.method === 'POST') return createNote(req, res);
    if (req.method === 'PUT') return updateNote(req, res);
    if (req.method === 'DELETE') return deleteNote(req, res);
    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
}
