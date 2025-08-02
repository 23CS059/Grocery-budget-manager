"use client"

import './globals.css'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import GroceryForm from "../components/GroceryForm"
import GroceryList from "../components/GroceryList"
import BudgetTracker from "../components/BudgetTracker"
import FilterSearch from "../components/FilterSearch"
import SpendingOverview from "../components/SpendingOverview"

export default function Home() {
  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [spending, setSpending] = useState({
    monthlySpending: 0,
    weeklySpending: 0,
    categorySpending: {},
  })
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user && authChecked) {
      fetchItems()
      fetchSpending()
    }
  }, [user, authChecked])

  useEffect(() => {
    if (user && authChecked) {
      fetchItems()
    }
  }, [filter, search, user, authChecked])

  const checkAuth = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch("/api/auth/me", {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const result = await response.json()
        setUser(result.data.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      if (error.name === "AbortError") {
        console.error("Auth check timed out")
      }
      router.push("/login")
    } finally {
      setAuthChecked(true)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if logout fails
      router.push("/login")
    }
  }

  const fetchItems = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const params = new URLSearchParams()
      if (filter !== "all") params.append("category", filter)
      if (search) params.append("search", search)

      const response = await fetch(`/api/grocery-items?${params}`, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setItems(result.data)
        }
      } else if (response.status === 401) {
        router.push("/login")
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching items:", error)
      }
    }
  }

  const fetchSpending = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch("/api/spending", {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSpending(result.data)
        }
      } else if (response.status === 401) {
        router.push("/login")
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching spending:", error)
      }
    }
  }

  const handleAddItem = (newItem) => {
    setItems((prev) => [newItem, ...prev])
    fetchSpending() // Refresh spending data
  }

  const handleUpdateItem = (updatedItem) => {
    setItems((prev) => prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)))
    fetchSpending() // Refresh spending data
  }

  const handleDeleteItem = (deletedId) => {
    setItems((prev) => prev.filter((item) => item._id !== deletedId))
    fetchSpending() // Refresh spending data
  }

  const handleBudgetUpdate = () => {
    // Budget updated, no need to refresh items
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading your grocery budget...</div>
      </div>
    )
  }

  if (!authChecked) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Checking authentication...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="loading-container">
        <div className="loading-text">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <div className="">
          <div className="header-left">
            <h1>🛒 Grocery Budget Manager</h1>
            <p>Track your grocery spending and stay within budget</p>
          </div>
          <div className="">
            <div className="user-info">
              <span className="welcome-message">Welcome, {user.name}!</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="left-column">
          <section className="add-item-section">
            <h2>Add New Item</h2>
            <GroceryForm onSubmit={handleAddItem} />
          </section>

          <section className="overview-section">
            <SpendingOverview spending={spending} />
          </section>
        </div>

        <div className="right-column">
          <section className="budget-section">
            <BudgetTracker spending={spending} onBudgetUpdate={handleBudgetUpdate} />
          </section>

          <section className="items-section">
            <div className="section-header">
              <h2>Your Grocery Items</h2>
              <div className="items-count">{items.length} items</div>
            </div>

            <FilterSearch
              onFilterChange={setFilter}
              onSearchChange={setSearch}
              currentFilter={filter}
              currentSearch={search}
            />

            <GroceryList items={items} onUpdate={handleUpdateItem} onDelete={handleDeleteItem} />
          </section>
        </div>
      </div>
    </div>
  )
}
