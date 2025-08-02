"use client"

import { useState } from "react"
import GroceryForm from "./GroceryForm"

export default function GroceryList({ items, onUpdate, onDelete }) {
  const [editingItem, setEditingItem] = useState(null)

  const handleEdit = (item) => {
    setEditingItem(item)
  }

  const handleUpdate = (updatedItem) => {
    onUpdate(updatedItem)
    setEditingItem(null)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await fetch(`/api/grocery-items/${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          onDelete(id)
        } else {
          alert("Failed to delete item")
        }
      } catch (error) {
        alert("Error deleting item")
      }
    }
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No grocery items found. Add your first item to get started!</p>
      </div>
    )
  }

  return (
    <div className="grocery-list">
      {items.map((item) => (
        <div key={item._id} className="grocery-item">
          {editingItem && editingItem._id === item._id ? (
            <GroceryForm item={editingItem} onSubmit={handleUpdate} onCancel={handleCancelEdit} />
          ) : (
            <>
              <div className="item-info">
                <h3>{item.name}</h3>
                <div className="item-details">
                  <span className="quantity">Qty: {item.quantity}</span>
                  <span className="price">${item.price.toFixed(2)} each</span>
                  <span className="total">${item.totalPrice.toFixed(2)} total</span>
                  <span className={`category category-${item.category.toLowerCase()}`}>{item.category}</span>
                </div>
                <div className="item-date">Added: {new Date(item.dateAdded).toLocaleDateString()}</div>
              </div>
              <div className="item-actions">
                <button onClick={() => handleEdit(item)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
