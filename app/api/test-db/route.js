import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import GroceryItem from "@/models/GroceryItem"
import Budget from "@/models/Budget"

export async function GET() {
  try {
    console.log("Testing database connection...")
    await dbConnect()

    const itemCount = await GroceryItem.countDocuments()
    const budgetCount = await Budget.countDocuments()

    console.log(`Items in database: ${itemCount}`)
    console.log(`Budgets in database: ${budgetCount}`)

    return NextResponse.json({
      success: true,
      data: {
        connected: true,
        itemCount,
        budgetCount,
        message: "Database connection successful",
      },
    })
  } catch (error) {
    console.error("Database test failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
