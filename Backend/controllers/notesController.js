import { Note, Tenant } from "../db.js";
import mongoose from "mongoose";

export const createNote = async (req, res) => {
  try {
    const { tenantId, email } = req.user;
    const tenantObjectId = new mongoose.Types.ObjectId(tenantId);
    const { title, content } = req.body;

    // Get tenant to check plan and note limits
    const tenant = await Tenant.findById(tenantObjectId);
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    // Check note limit for free plan
    if (tenant.plan === "free") {
      const noteCount = await Note.countDocuments({ tenantId: tenantObjectId });
      if (noteCount >= tenant.maxNotes) {
        return res.status(403).json({ error: "Upgrade to Pro required" });
      }
    }

    const newNote = new Note({
      title,
      content,
      tenantId: tenantObjectId,
      userId: new mongoose.Types.ObjectId(req.user.userId), // Use userId from JWT token
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const notes = await Note.find({ tenantId: new mongoose.Types.ObjectId(tenantId) }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const note = await Note.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
      tenantId: new mongoose.Types.ObjectId(tenantId),
    });
    
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { title, content } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.id), tenantId: new mongoose.Types.ObjectId(tenantId) },
      { 
        ...(title && { title }), 
        ...(content && { content }) 
      },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const note = await Note.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(req.params.id),
      tenantId: new mongoose.Types.ObjectId(tenantId),
    });
    
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

