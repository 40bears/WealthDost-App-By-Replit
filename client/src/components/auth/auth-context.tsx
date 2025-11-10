import { User } from "@/types";
import { createContext, useCallback, useContext, useEffect, useState, useRef } from "react";

export interface AuthContext {
  isAuthenticated: boolean
  login: (userData: User) => Promise<void>
  logout: () => Promise<void>
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = !!user

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        if (userData.isLoggedIn) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }, [])

  const login = useCallback(async (userData: User) => {
    // Store in localStorage first
    localStorage.setItem('user', JSON.stringify(userData))

    // Update state
    setUser(userData)

    // Wait for multiple animation frames to ensure state propagates to all consumers
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(resolve, 50)
        })
      })
    })
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}