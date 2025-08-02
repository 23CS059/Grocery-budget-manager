import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Import models with proper path resolution
const modelsPath = join(__dirname, "../models")

// Dynamic imports for ES modules
const { default: GroceryItem } = await import("../models/GroceryItem.js")
const { default: Budget } = await import("../models/Budget.js")

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI not defined in .env file");
}
const MONGODB_URI = process.env.MONGODB_URI;


const sampleItems = [
  {
    name: "Bananas",
    quantity: 6,
    price: 0.5,
    category: "Fruits",
    userId: "default-user",
    totalPrice: 3.0,
    dateAdded: new Date(),
  },
  {
    name: "Milk",
    quantity: 1,
    price: 3.99,
    category: "Dairy",
    userId: "default-user",
    totalPrice: 3.99,
    dateAdded: new Date(),
  },
  {
    name: "Chicken Breast",
    quantity: 2,
    price: 8.99,
    category: "Meat",
    userId: "default-user",
    totalPrice: 17.98,
    dateAdded: new Date(),
  },
  {
    name: "Spinach",
    quantity: 1,
    price: 2.49,
    category: "Vegetables",
    userId: "default-user",
    totalPrice: 2.49,
    dateAdded: new Date(),
  },
  {
    name: "Bread",
    quantity: 1,
    price: 2.99,
    category: "Grains",
    userId: "default-user",
    totalPrice: 2.99,
    dateAdded: new Date(),
  },
]

const getCurrentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

const sampleBudget = {
  monthlyBudget: 400,
  weeklyBudget: 92.37, // 400 / 4.33
  userId: "default-user",
  month: getCurrentMonth(),
  year: new Date().getFullYear(),
}

async function seedDatabase() {
  try {
    console.log("🔄 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
    console.log("✅ Connected to MongoDB")

    // Clear existing data
    console.log("🧹 Clearing existing data...")
    const deletedItems = await GroceryItem.deleteMany({})
    const deletedBudgets = await Budget.deleteMany({})
    console.log(`Deleted ${deletedItems.deletedCount} items and ${deletedBudgets.deletedCount} budgets`)

    // Insert sample items one by one for better error handling
    console.log("📦 Inserting sample grocery items...")
    const insertedItems = []
    for (const itemData of sampleItems) {
      try {
        const item = await GroceryItem.create(itemData)
        insertedItems.push(item)
        console.log(`✅ Added: ${item.name} - $${item.totalPrice}`)
      } catch (error) {
        console.error(`❌ Failed to add ${itemData.name}:`, error.message)
      }
    }

    // Insert sample budget
    console.log("💰 Inserting sample budget...")
    try {
      const budget = await Budget.create(sampleBudget)
      console.log(`✅ Budget created: $${budget.monthlyBudget}/month ($${budget.weeklyBudget}/week)`)
    } catch (error) {
      console.error("❌ Failed to create budget:", error.message)
      console.error("Budget data:", sampleBudget)
    }

    // Verify data
    const finalItemCount = await GroceryItem.countDocuments()
    const finalBudgetCount = await Budget.countDocuments()

    console.log(`\n📊 Final counts:`)
    console.log(`Items: ${finalItemCount}`)
    console.log(`Budgets: ${finalBudgetCount}`)

    if (finalItemCount > 0 && finalBudgetCount > 0) {
      console.log("\n🎉 Database seeded successfully!")
    } else {
      console.log("\n⚠️  Seeding completed with some issues")
    }

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    console.error("Full error:", error.stack)
    process.exit(1)
  }
}

seedDatabase()
