"use client"

export default function SpendingOverview({ spending }) {
  const categoryEntries = Object.entries(spending.categorySpending || {})
  const totalCategories = categoryEntries.length

  return (
    <div className="spending-overview">
      <h2>Spending Overview</h2>

      <div className="spending-summary">
        <div className="summary-card">
          <h3>This Week</h3>
          <div className="amount">${spending.weeklySpending.toFixed(2)}</div>
        </div>
        <div className="summary-card">
          <h3>This Month</h3>
          <div className="amount">${spending.monthlySpending.toFixed(2)}</div>
        </div>
      </div>

      {totalCategories > 0 && (
        <div className="category-breakdown">
          <h3>Category Breakdown (This Month)</h3>
          <div className="category-list">
            {categoryEntries
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="category-item">
                  <span className={`category-name category-${category.toLowerCase()}`}>{category}</span>
                  <span className="category-amount">${amount.toFixed(2)}</span>
                  <div className="category-bar">
                    <div
                      className="category-fill"
                      style={{
                        width: `${(amount / spending.monthlySpending) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
