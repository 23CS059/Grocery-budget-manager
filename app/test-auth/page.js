"use client"

import { useState } from "react"

export default function TestAuthPage() {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)

  const testEndpoint = async (endpoint, method = "GET", body = null) => {
    setLoading(true)
    try {
      const options = {
        method,
        headers: {
          "Content-Type": "application/json",
        },
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()

      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          status: response.status,
          data,
          success: response.ok,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [endpoint]: {
          status: "ERROR",
          data: { error: error.message },
          success: false,
        },
      }))
    }
    setLoading(false)
  }

  const testSignup = () => {
    testEndpoint("/api/auth/signup", "POST", {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    })
  }

  const testLogin = () => {
    testEndpoint("/api/auth/login", "POST", {
      email: "test@example.com",
      password: "password123",
    })
  }

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>🔧 Auth API Test Page</h1>
      <p>Use this page to test if the authentication API routes are working.</p>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => testEndpoint("/api/test-auth")} disabled={loading}>
          Test Basic API
        </button>
        <button onClick={() => testEndpoint("/api/auth/me")} disabled={loading}>
          Test Auth Check
        </button>
        <button onClick={testSignup} disabled={loading}>
          Test Signup
        </button>
        <button onClick={testLogin} disabled={loading}>
          Test Login
        </button>
        <button onClick={() => testEndpoint("/api/auth/logout", "POST")} disabled={loading}>
          Test Logout
        </button>
      </div>

      {loading && <p>Testing...</p>}

      <div>
        <h2>Results:</h2>
        <pre style={{ background: "#f5f5f5", padding: "10px", overflow: "auto" }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  )
}
