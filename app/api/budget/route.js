import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Budget from "@/models/Budget"
import { validateBudget } from "@/utils/validation"
import { getCurrentMonth } from "@/utils/dateUtils"
import { getUserFromRequest } from "@/utils/auth"

export async function GET(request) {
  try {
    console.log("🔄 Fetching budget...")
    await dbConnect()

    const userId = getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const currentMonth = getCurrentMonth()
    const [year, month] = currentMonth.split("-")

    console.log(`Looking for budget: ${currentMonth}, year: ${year}`)

    let budget = await Budget.findOne({
      userId: userId,
      month: currentMonth,
      year: Number.parseInt(year),
    })

    if (!budget) {
      console.log("No budget found, creating default...")
      budget = await Budget.create({
        monthlyBudget: 500,
        weeklyBudget: 115.47,
        userId: userId,
        month: currentMonth,
        year: Number.parseInt(year),
      })
      console.log("✅ Default budget created")
    } else {
      console.log("✅ Budget found:", budget.monthlyBudget)
    }

    return NextResponse.json({ success: true, data: budget })
  } catch (error) {
    console.error("❌ Budget API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: "Failed to fetch or create budget",
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    console.log("🔄 Updating budget...")
    await dbConnect()

    const userId = getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Budget update data:", body)

    const validation = validateBudget(body)

    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    const currentMonth = getCurrentMonth()
    const [year, month] = currentMonth.split("-")
    const monthlyBudget = Number.parseFloat(body.monthlyBudget)
    const weeklyBudget = Number((monthlyBudget / 4.33).toFixed(2))

    const budget = await Budget.findOneAndUpdate(
      {
        userId: userId,
        month: currentMonth,
        year: Number.parseInt(year),
      },
      {
        monthlyBudget: monthlyBudget,
        weeklyBudget: weeklyBudget,
        userId: userId,
        month: currentMonth,
        year: Number.parseInt(year),
      },
      { new: true, upsert: true, runValidators: true },
    )

    console.log("✅ Budget updated:", budget.monthlyBudget)
    return NextResponse.json({ success: true, data: budget })
  } catch (error) {
    console.error("❌ Budget update error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
