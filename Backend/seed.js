import dotenv from "dotenv";
import mongoose from "mongoose";
import { Tenant, User } from "./db.js"; // adjust path if needed

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🌱 Connected to DB");

    // clear old data
    await Tenant.deleteMany({});
    await User.deleteMany({});

    // tenants
    const acme = await Tenant.create({ slug: "acme", name: "Acme Corp", plan: "free" });
    const globex = await Tenant.create({ slug: "globex", name: "Globex Inc", plan: "free" });

    // users (plain text passwords for assignment)
    await User.create([
      { email: "admin@acme.test", password: "password", role: "admin", tenantId: acme._id },
      { email: "user@acme.test", password: "password", role: "member", tenantId: acme._id },
      { email: "admin@globex.test", password: "password", role: "admin", tenantId: globex._id },
      { email: "user@globex.test", password: "password", role: "member", tenantId: globex._id },
    ]);

    console.log("✅ Seed data inserted");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding DB:", err);
    process.exit(1);
  }
};

seed();
