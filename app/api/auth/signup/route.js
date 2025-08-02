import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"
import { validateUser } from "@/utils/validation"
import { generateToken, createAuthResponse } from "@/utils/auth"

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const validation = validateUser(body, false)

    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }
    const existingUser = await User.findOne({ email: body.email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json(
        { success: false, errors: { email: "User with this email already exists" } },
        { status: 400 },
      )
    }

    const user = await User.create({
      name: body.name.trim(),
      email: body.email.toLowerCase().trim(),
      password: body.password,
    })

    const token = generateToken(user._id)

    const responseData = createAuthResponse(user, token)
    const response = NextResponse.json(responseData, { status: 201 })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
