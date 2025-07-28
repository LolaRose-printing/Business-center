import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/database';

export const routeConfig = {
  runtime: "nodejs",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      username,
      password,
      company,
      accountType,
      firstName,
      lastName,
    } = body;

    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        accountType,
        company,
        firstName,
        lastName,
        // other defaults will be used automatically
      },
    });

    return NextResponse.json({ userId: newUser.id }, { status: 201 });

  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
