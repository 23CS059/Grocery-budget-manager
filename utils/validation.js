export function validateGroceryItem(data) {
  const errors = {}

  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Name is required"
  }

  if (!data.quantity || isNaN(data.quantity) || Number.parseFloat(data.quantity) <= 0) {
    errors.quantity = "Quantity must be a positive number"
  }

  if (!data.price || isNaN(data.price) || Number.parseFloat(data.price) < 0) {
    errors.price = "Price must be a valid number greater than or equal to 0"
  }

  if (!data.category) {
    errors.category = "Category is required"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateBudget(data) {
  const errors = {}

  if (!data.monthlyBudget || isNaN(data.monthlyBudget) || Number.parseFloat(data.monthlyBudget) <= 0) {
    errors.monthlyBudget = "Monthly budget must be a positive number"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export function validateUser(data, isLogin = false) {
  const errors = {}

  if (!isLogin) {
    if (!data.name || data.name.trim().length === 0) {
      errors.name = "Name is required"
    } else if (data.name.trim().length > 50) {
      errors.name = "Name cannot be more than 50 characters"
    }
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email is required"
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    errors.email = "Please provide a valid email"
  }

  if (!data.password || data.password.length === 0) {
    errors.password = "Password is required"
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
