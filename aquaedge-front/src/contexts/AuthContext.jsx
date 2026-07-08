import { useCallback, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/authApi'
import { AuthContext } from './authContextValue'

function extractAccessToken(data) {
  return data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token || ''
}

function extractUser(data) {
  return data?.user || data?.data?.user || data?.data || null
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('aquaedge_token') || '')
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('aquaedge_user')
    try {
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      localStorage.removeItem('aquaedge_user')
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    localStorage.setItem('aquaedge_token', nextToken)

    if (nextUser) {
      localStorage.setItem('aquaedge_user', JSON.stringify(nextUser))
    } else {
      localStorage.removeItem('aquaedge_user')
    }
  }, [])

  const clearSession = useCallback(() => {
    setToken('')
    setUser(null)
    localStorage.removeItem('aquaedge_token')
    localStorage.removeItem('aquaedge_user')
  }, [])

  const getCurrentUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getMe()
      const nextUser = extractUser(currentUser) || currentUser
      setUser(nextUser)

      if (nextUser) {
        localStorage.setItem('aquaedge_user', JSON.stringify(nextUser))
      }

      return nextUser
    } catch (error) {
      clearSession()
      throw error
    } finally {
      setLoading(false)
    }
  }, [clearSession])

  const login = useCallback(
    async (email, password) => {
      try {
        const data = await authApi.login({ email, password })
        const nextToken = extractAccessToken(data)
        const nextUser = extractUser(data)

        if (!nextToken) {
          throw new Error('La respuesta de login no incluyó un token.')
        }

        persistSession(nextToken, nextUser)
        return { token: nextToken, user: nextUser }
      } catch (error) {
        clearSession()
        throw error
      } finally {
        setLoading(false)
      }
    },
    [clearSession, persistSession],
  )

  const logout = useCallback(() => {
    const logoutRequest = authApi.logout().catch(() => null)
    clearSession()
    setLoading(false)
    void logoutRequest

    if (window.location.pathname !== '/login') {
      window.location.assign('/login')
    }
  }, [clearSession])

  useEffect(() => {
    let mounted = true

    async function validateSession() {
      setLoading(true)

      try {
        if (!token) return

        const currentUser = await authApi.getMe()
        if (!mounted) return
        const nextUser = extractUser(currentUser) || currentUser
        setUser(nextUser)
        if (nextUser) localStorage.setItem('aquaedge_user', JSON.stringify(nextUser))
      } catch {
        if (mounted) clearSession()
      } finally {
        if (mounted) setLoading(false)
      }
    }

    validateSession()
    return () => {
      mounted = false
    }
  }, [clearSession, token])

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      getCurrentUser,
      isAuthenticated: Boolean(token),
      loading,
    }),
    [getCurrentUser, loading, login, logout, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
