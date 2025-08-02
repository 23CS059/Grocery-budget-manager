import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import GroceryItem from "@/models/GroceryItem"
import { validateGroceryItem } from "@/utils/validation"
import { getUserFromRequest } from "@/utils/auth"

export async function GET(request) {
  try {
    console.log("🔄 Fetching grocery items...")
    await dbConnect()

    const userId = getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const query = { userId: userId }

    if (category && category !== "all") {
      query.category = category
    }

    if (search) {
      query.name = { $regex: search, $options: "i" }
    }

    console.log("Query:", query)
    const items = await GroceryItem.find(query).sort({ dateAdded: -1 })
    console.log(`✅ Found ${items.length} items`)

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error("❌ Error fetching items:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: "Failed to fetch grocery items",
      },
      { status: 500 },
    )
  }
}

export async function POST(request) {
  try {
    console.log("🔄 Creating new grocery item...")
    await dbConnect()

    const userId = getUserFromRequest(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    console.log("Item data:", body)

    const validation = validateGroceryItem(body)

    if (!validation.isValid) {
      console.log("❌ Validation failed:", validation.errors)
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    const quantity = Number.parseFloat(body.quantity)
    const price = Number.parseFloat(body.price)
    const totalPrice = Number((quantity * price).toFixed(2))

    const itemData = {
      name: body.name.trim(),
      quantity: quantity,
      price: price,
      category: body.category,
      totalPrice: totalPrice,
      userId: userId,
      dateAdded: new Date(),
    }

    console.log("Creating item with data:", itemData)
    const item = await GroceryItem.create(itemData)
    console.log("✅ Item created:", item.name)

    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch (error) {
    console.error("❌ Error creating grocery item:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: "Failed to create grocery item",
      },
      { status: 500 },
    )
  }
}
