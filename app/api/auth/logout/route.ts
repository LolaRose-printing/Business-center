import { NextResponse } from "next/server";
import { serialize } from "cookie";

export const runtime = "nodejs"; // <-- use this instead of routeConfig

export async function POST() {
  const expiredCookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
    sameSite: "lax",
  });

  const response = NextResponse.json({ message: "Logged out" });
  response.headers.set("Set-Cookie", expiredCookie);
  return response;
}
