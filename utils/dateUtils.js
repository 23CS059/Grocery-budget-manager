export function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
}

export function getCurrentWeek() {
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  return startOfWeek.toISOString().split("T")[0]
}

export function getMonthName(monthString) {
  const [year, month] = monthString.split("-")
  const date = new Date(year, month - 1)
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export function isCurrentWeek(date) {
  const itemDate = new Date(date)
  const now = new Date()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  return itemDate >= startOfWeek && itemDate <= endOfWeek
}

export function isCurrentMonth(date) {
  const itemDate = new Date(date)
  const now = new Date()
  return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear()
}
