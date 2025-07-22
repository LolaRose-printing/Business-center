import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';  // your prisma client
import { hashPassword } from '@/lib/auth'; // your hashing util

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      username,
      password,
      company,
      accountType,
      firstName,
      lastName,
    } = body;

    // Validate inputs...

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        company: company || null,
        accountType,
        firstName: firstName || null,
        lastName: lastName || null,
      },
    });

    return NextResponse.json({ message: 'User created', userId: user.id }, { status: 201 });
  } catch (error) {
    console.error('REGISTER API ERROR:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}
