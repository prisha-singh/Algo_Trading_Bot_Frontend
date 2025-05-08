import axios from "axios"

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Error:", error)
    return Promise.reject(error)
  },
)

export default api
