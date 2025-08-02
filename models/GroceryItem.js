import mongoose from "mongoose"

const GroceryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name for the grocery item"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Please provide a quantity"],
      min: [0.1, "Quantity must be greater than 0"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: [0, "Price must be greater than or equal to 0"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: ["Fruits", "Vegetables", "Dairy", "Meat", "Snacks", "Beverages", "Grains", "Other"],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: String,
      default: "default-user",
    },
  },
  {
    timestamps: true,
  },
)

GroceryItemSchema.pre("save", function (next) {
  if (this.isModified("quantity") || this.isModified("price") || this.isNew) {
    this.totalPrice = Number((this.quantity * this.price).toFixed(2))
  }
  next()
})

export default mongoose.models.GroceryItem || mongoose.model("GroceryItem", GroceryItemSchema)
