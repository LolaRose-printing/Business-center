import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const TOKEN_NAME = "token";

// Hash password
export async function hashPassword(password: string) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

// Create JWT token
export function createToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// Verify JWT token
export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

// Create cookie string for token
export function createTokenCookie(token: string) {
  return serialize(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  });
}

// Parse token from cookie header
export function parseTokenCookie(cookieHeader: string | undefined) {
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  return cookies[TOKEN_NAME];
}
