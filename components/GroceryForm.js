"use client"

import { useState } from "react"

const categories = ["Fruits", "Vegetables", "Dairy", "Meat", "Snacks", "Beverages", "Grains", "Other"]

export default function GroceryForm({ item = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    quantity: item?.quantity || "",
    price: item?.price || "",
    category: item?.category || "Other",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      const url = item ? `/api/grocery-items/${item._id}` : "/api/grocery-items"
      const method = item ? "PUT" : "POST"

      console.log("Submitting form data:", formData)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("API response:", result)

      if (result.success) {
        onSubmit(result.data)
        if (!item) {
          setFormData({ name: "", quantity: "", price: "", category: "Other" })
        }
      } else {
        if (result.errors) {
          setErrors(result.errors)
        } else {
          setErrors({ general: result.error || "An error occurred" })
        }
      }
    } catch (error) {
      console.error("Network error:", error)
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grocery-form">
      <div className="form-group">
        <label htmlFor="name">Item Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? "error" : ""}
          placeholder="Enter item name"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className={errors.quantity ? "error" : ""}
            placeholder="0"
            step="0.1"
            min="0.1"
          />
          {errors.quantity && <span className="error-message">{errors.quantity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="price">Price per Unit ($) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "error" : ""}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.price && <span className="error-message">{errors.price}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className={errors.category ? "error" : ""}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      {errors.general && <div className="error-message general-error">{errors.general}</div>}

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Saving..." : item ? "Update Item" : "Add Item"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
