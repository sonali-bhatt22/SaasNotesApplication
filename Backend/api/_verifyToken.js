import jwt from "jsonwebtoken";

export function verifyToken(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) throw { status: 401, message: "No token provided" };
  if (!process.env.JWT_SECRET) throw { status: 500, message: "JWT_SECRET not set" };
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw { status: 403, message: "Invalid token" };
  }
}
