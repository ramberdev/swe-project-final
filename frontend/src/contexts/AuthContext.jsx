import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token')
    if (token) {
      // Verify token and get user info
      fetchUserInfo()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserInfo = async () => {
    try {
      // Get user info from token or use a default approach
      // For now, we'll store basic user info in token or use a workaround
      // This would need to be implemented based on your backend's token structure
      const token = localStorage.getItem('access_token')
      if (token) {
        // Decode token to get user info (simplified - in production use proper JWT decoding)
        // For MVP, we'll set a basic authenticated state
        setIsAuthenticated(true)
        // You may want to add an endpoint to get current user info
        // For now, we'll handle it gracefully
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const params = new URLSearchParams()
      params.append('username', email)
      params.append('password', password)
      
      const response = await api.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      
      const { access_token } = response.data
      localStorage.setItem('access_token', access_token)
      
      await fetchUserInfo()
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      // Auto-login after registration
      if (response.data) {
        await login(userData.email, userData.password)
      }
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUserInfo,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

