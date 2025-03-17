import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  return NextResponse.json({
    session,
    userEmail: session?.user?.email,
    isAuthenticated: !!session
  });
} 