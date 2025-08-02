import mongoose from "mongoose"
import { fileURLToPath } from "url"
import { dirname } from "path"

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Dynamic imports for ES modules
const { default: User } = await import("../models/User.js")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/grocery-budget"

const testUser = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
}

async function createTestUser() {
  try {
    console.log("🔄 Connecting to MongoDB...")
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    })
    console.log("✅ Connected to MongoDB")

    // Check if user already exists
    const existingUser = await User.findOne({ email: testUser.email })
    if (existingUser) {
      console.log("⚠️  Test user already exists")
      console.log(`Email: ${existingUser.email}`)
      console.log(`Name: ${existingUser.name}`)
      process.exit(0)
    }

    // Create test user
    console.log("👤 Creating test user...")
    const user = await User.create(testUser)
    console.log("✅ Test user created successfully!")
    console.log(`Email: ${user.email}`)
    console.log(`Name: ${user.name}`)
    console.log(`Password: ${testUser.password}`)

    process.exit(0)
  } catch (error) {
    console.error("❌ Error creating test user:", error)
    process.exit(1)
  }
}

createTestUser()
