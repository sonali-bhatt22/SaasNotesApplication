import mongoose from 'mongoose';

// Tenant Schema
//mongoose.connect("mongodb+srv://bhattsonali36:4DOmutpOfbJUVcTH@cluster0.0ckw3.mongodb.net/SaasNotesApp")
//console.log("db connected")
const tenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  maxNotes: { type: Number, default: 3 },
}, { timestamps: true });

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], required: true },
  tenantId: { type: String, required: true },
}, { timestamps: true });

// Compound index for unique email per tenant
userSchema.index({ email: 1, tenantId: 1 }, { unique: true });

// Note Schema
const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tenantId: { type: String, required: true },
  userId: { type: String, required: true },
}, { timestamps: true });

noteSchema.index({ tenantId: 1 });

// Models
export const Tenant = mongoose.model('Tenant', tenantSchema);
export const User = mongoose.model('User', userSchema);
export const Note = mongoose.model('Note', noteSchema);

// Database connection
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};