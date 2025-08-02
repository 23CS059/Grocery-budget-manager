import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import GroceryItem from "@/models/GroceryItem"
import { validateGroceryItem } from "@/utils/validation"

export async function PUT(request, { params }) {
  try {
    await dbConnect()

    const body = await request.json()
    const validation = validateGroceryItem(body)

    if (!validation.isValid) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 })
    }

    const quantity = Number.parseFloat(body.quantity)
    const price = Number.parseFloat(body.price)
    const totalPrice = Number((quantity * price).toFixed(2))

    const item = await GroceryItem.findByIdAndUpdate(
      params.id,
      {
        name: body.name.trim(),
        quantity: quantity,
        price: price,
        category: body.category,
        totalPrice: totalPrice,
      },
      { new: true, runValidators: true },
    )

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error("Error updating grocery item:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect()

    const item = await GroceryItem.findByIdAndDelete(params.id)

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: {} })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
