import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongodb"
import User from "../../../../models/User"
import { getUserFromRequest } from "../../../../utils/auth"

export async function GET(request) {
  try {
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Database timeout")), 3000))

    const authPromise = (async () => {
      await dbConnect()

      const userId = getUserFromRequest(request)

      if (!userId) {
        return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
      }

      const user = await User.findById(userId)

      if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      })
    })()

    return await Promise.race([authPromise, timeoutPromise])
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 401 })
  }
}
