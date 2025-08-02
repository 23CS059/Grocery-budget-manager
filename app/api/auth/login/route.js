import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { validateUser } from "@/utils/validation"
import { generateToken, createAuthResponse } from "@/utils/auth"

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const validation = validateUser(body, true)

    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: body.email.toLowerCase() }).select("+password")

    if (!user) {
      return NextResponse.json({ success: false, errors: { email: "Invalid email or password" } }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(body.password)
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, errors: { password: "Invalid email or password" } }, { status: 401 })
    }

    // Generate token
    const token = generateToken(user._id)

    // Create response
    const responseData = createAuthResponse(user, token)
    const response = NextResponse.json(responseData)

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
