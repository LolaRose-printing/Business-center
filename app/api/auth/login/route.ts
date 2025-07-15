import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyPassword, createToken, createTokenCookie } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = createToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", createTokenCookie(token));
    return response;
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
