import { NextResponse } from "next/server";
import { prisma } from "@/lib/database"; // shared Prisma client
import { verifyPassword, createToken, createTokenCookie } from "@/lib/auth";

export const config = {
  runtime: "edge",
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    console.log("Login attempt for email:", email);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.warn("User not found for email:", email);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      console.warn("Invalid password for user:", email);
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = createToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", createTokenCookie(token));

    console.log("Login successful for user:", email);

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
