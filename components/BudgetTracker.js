"use client"

import { useState, useEffect } from "react"

export default function BudgetTracker({ spending, onBudgetUpdate }) {
  const [budget, setBudget] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newBudget, setNewBudget] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBudget()
  }, [])

  const fetchBudget = async () => {
    try {
      const response = await fetch("/api/budget")
      const result = await response.json()
      if (result.success) {
        setBudget(result.data)
        setNewBudget(result.data.monthlyBudget.toString())
      }
    } catch (error) {
      console.error("Error fetching budget:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBudget = async () => {
    try {
      const response = await fetch("/api/budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ monthlyBudget: Number.parseFloat(newBudget) }),
      })

      const result = await response.json()
      if (result.success) {
        setBudget(result.data)
        setIsEditing(false)
        onBudgetUpdate(result.data)
      } else {
        alert("Failed to update budget")
      }
    } catch (error) {
      alert("Error updating budget")
    }
  }

  if (loading) {
    return <div className="budget-tracker loading">Loading budget...</div>
  }

  if (!budget) {
    return <div className="budget-tracker error">Failed to load budget</div>
  }

  const monthlyRemaining = budget.monthlyBudget - spending.monthlySpending
  const weeklyRemaining = budget.weeklyBudget - spending.weeklySpending
  const monthlyPercentage = (spending.monthlySpending / budget.monthlyBudget) * 100
  const weeklyPercentage = (spending.weeklySpending / budget.weeklyBudget) * 100

  const isMonthlyOverBudget = spending.monthlySpending > budget.monthlyBudget
  const isWeeklyOverBudget = spending.weeklySpending > budget.weeklyBudget

  return (
    <div className="budget-tracker">
      <div className="budget-header">
        <h2>Budget Tracker</h2>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn-edit-budget">
            Edit Budget
          </button>
        ) : (
          <div className="budget-edit">
            <input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder="Monthly budget"
              step="0.01"
              min="0"
            />
            <button onClick={handleUpdateBudget} className="btn-save">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="budget-cards">
        <div className={`budget-card ${isMonthlyOverBudget ? "over-budget" : ""}`}>
          <h3>Monthly Budget</h3>
          <div className="budget-amount">${budget.monthlyBudget.toFixed(2)}</div>
          <div className="spending-info">
            <div className="spent">Spent: ${spending.monthlySpending.toFixed(2)}</div>
            <div className={`remaining ${isMonthlyOverBudget ? "over" : ""}`}>
              {isMonthlyOverBudget ? "Over by" : "Remaining"}: ${Math.abs(monthlyRemaining).toFixed(2)}
            </div>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isMonthlyOverBudget ? "over-budget" : ""}`}
              style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="percentage">{monthlyPercentage.toFixed(1)}% used</div>
        </div>

        <div className={`budget-card ${isWeeklyOverBudget ? "over-budget" : ""}`}>
          <h3>Weekly Budget</h3>
          <div className="budget-amount">${budget.weeklyBudget.toFixed(2)}</div>
          <div className="spending-info">
            <div className="spent">Spent: ${spending.weeklySpending.toFixed(2)}</div>
            <div className={`remaining ${isWeeklyOverBudget ? "over" : ""}`}>
              {isWeeklyOverBudget ? "Over by" : "Remaining"}: ${Math.abs(weeklyRemaining).toFixed(2)}
            </div>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${isWeeklyOverBudget ? "over-budget" : ""}`}
              style={{ width: `${Math.min(weeklyPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="percentage">{weeklyPercentage.toFixed(1)}% used</div>
        </div>
      </div>

      {(isMonthlyOverBudget || isWeeklyOverBudget) && (
        <div className="budget-warning">⚠️ You've exceeded your budget! Consider reviewing your spending.</div>
      )}
    </div>
  )
}
