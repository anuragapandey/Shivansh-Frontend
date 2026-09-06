import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { apiRequest } from '../lib/api.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'a1_chips_access_token'
const USER_KEY = 'a1_chips_user'

const readStoredUser = () => {
  try {
    const value = localStorage.getItem(USER_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  const saveSession = useCallback((payload) => {
    if (payload.session?.access_token) {
      localStorage.setItem(TOKEN_KEY, payload.session.access_token)
    }

    if (payload.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      setUser(payload.user)
    }
  }, [])

  const login = useCallback(
    async (credentials) => {
      const payload = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      })
      saveSession(payload)
      setIsAuthOpen(false)
      return payload
    },
    [saveSession],
  )

  const signup = useCallback(
    async (form) => {
      const payload = await apiRequest('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      saveSession(payload)
      setIsAuthOpen(false)
      return payload
    },
    [saveSession],
  )

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthOpen,
      openAuth: () => setIsAuthOpen(true),
      closeAuth: () => setIsAuthOpen(false),
      login,
      signup,
      logout,
    }),
    [isAuthOpen, login, logout, signup, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
