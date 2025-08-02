import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Auth API routes are working!",
    timestamp: new Date().toISOString(),
  })
}
