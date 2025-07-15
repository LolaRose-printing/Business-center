import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email, password, company, userType, username, firstName, lastName } = await request.json();

  if (!email || !password || !userType) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }
  
  if (company && (company.length < 3 || company.length > 128)) {
    return NextResponse.json({ message: "Company must be 3-128 characters" }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        company,
        userType,
        username,
        firstName,
        lastName,
      },
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}
