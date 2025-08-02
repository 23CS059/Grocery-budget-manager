import mongoose from "mongoose"

const BudgetSchema = new mongoose.Schema(
  {
    monthlyBudget: {
      type: Number,
      required: [true, "Please set a monthly budget"],
      min: [0, "Budget must be greater than or equal to 0"],
    },
    weeklyBudget: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      default: "default-user",
    },
    month: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

BudgetSchema.pre("save", function (next) {
  if (this.isModified("monthlyBudget") || this.isNew) {
    this.weeklyBudget = Number((this.monthlyBudget / 4.33).toFixed(2))
  }
  next()
})

export default mongoose.models.Budget || mongoose.model("Budget", BudgetSchema)
