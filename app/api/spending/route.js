import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import GroceryItem from "@/models/GroceryItem"
import { isCurrentWeek, isCurrentMonth } from "@/utils/dateUtils"
import { getUserFromRequest } from "@/utils/auth"

export async function GET(request) {
  try {
    await dbConnect()

    const userId = getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const items = await GroceryItem.find({ userId: userId })

    const monthlySpending = items
      .filter((item) => isCurrentMonth(item.dateAdded))
      .reduce((total, item) => total + item.totalPrice, 0)

    const weeklySpending = items
      .filter((item) => isCurrentWeek(item.dateAdded))
      .reduce((total, item) => total + item.totalPrice, 0)

    // Category breakdown for current month
    const categorySpending = items
      .filter((item) => isCurrentMonth(item.dateAdded))
      .reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + item.totalPrice
        return acc
      }, {})

    return NextResponse.json({
      success: true,
      data: {
        monthlySpending: Math.round(monthlySpending * 100) / 100,
        weeklySpending: Math.round(weeklySpending * 100) / 100,
        categorySpending,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
