import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, register as apiRegister, me as apiMe, logout as apiLogout, api } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra token và lấy thông tin user khi load app
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await apiMe()
      setUser(res.data)
    } catch (error) {
      // Token không hợp lệ hoặc hết hạn
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password, password_confirmation) => {
    setLoading(true)
    try {
      const res = await apiRegister({ name, email, password, password_confirmation })
      console.log('✅ Register response:', res.data)
      const { user, access_token } = res.data
      
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(user)
      console.log('✅ Token saved:', access_token.substring(0, 20) + '...')
      console.log('✅ User set:', user)
      
      return { success: true }
    } catch (error) {
      console.error('❌ Register error:', error.response?.data || error.message)
      const message = error.response?.data?.message || 'Đăng ký thất bại'
      const errors = error.response?.data?.errors || {}
      return { success: false, message, errors }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    setLoading(true)
    try {
      console.log('🔄 Attempting login with:', email)
      const res = await apiLogin(email, password)
      console.log('✅ Login response:', res.data)
      const { user, access_token } = res.data
      
      localStorage.setItem('token', access_token)
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(user)
      console.log('✅ Token saved:', access_token.substring(0, 20) + '...')
      console.log('✅ User set:', user)
      
      return { success: true }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message)
      const message = error.response?.data?.message || 'Đăng nhập thất bại'
      const errors = error.response?.data?.errors || {}
      return { success: false, message, errors }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      // Ignore error
    }
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)