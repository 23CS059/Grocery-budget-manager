import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import GroceryItem from "@/models/GroceryItem"
import Budget from "@/models/Budget"

export async function GET() {
  try {
    console.log("🔍 Running debug check...")

    await dbConnect()
    console.log("✅ Database connected")

    const items = await GroceryItem.find({}).limit(5)
    const budgets = await Budget.find({}).limit(5)

    const itemCount = await GroceryItem.countDocuments()
    const budgetCount = await Budget.countDocuments()

    console.log(`Items found: ${itemCount}`)
    console.log(`Budgets found: ${budgetCount}`)

    return NextResponse.json({
      success: true,
      data: {
        database: "connected",
        itemCount,
        budgetCount,
        sampleItems: items,
        sampleBudgets: budgets,
        environment: {
          mongoUri: process.env.MONGODB_URI ? "set" : "missing",
          nodeEnv: process.env.NODE_ENV,
        },
      },
    })
  } catch (error) {
    console.error("❌ Debug check failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
