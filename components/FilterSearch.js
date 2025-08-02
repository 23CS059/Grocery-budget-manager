"use client"

const categories = ["all", "Fruits", "Vegetables", "Dairy", "Meat", "Snacks", "Beverages", "Grains", "Other"]

export default function FilterSearch({ onFilterChange, onSearchChange, currentFilter, currentSearch }) {
  return (
    <div className="filter-search">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search items..."
          value={currentSearch}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-buttons">
        <span className="filter-label">Filter by category:</span>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onFilterChange(category)}
            className={`filter-btn ${currentFilter === category ? "active" : ""}`}
          >
            {category === "all" ? "All" : category}
          </button>
        ))}
      </div>
    </div>
  )
}
