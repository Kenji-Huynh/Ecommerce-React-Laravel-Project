import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getCart as apiGetCart, saveCart as apiSaveCart, clearCartApi } from '../services/api'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()

  // Key theo tài khoản để không bị trùng giữa các user
  const storageKey = user ? `cart:${user.id}` : 'cart:guest'

  // Trạng thái giỏ hàng
  const [cartItems, setCartItems] = useState([])

  // Đồng bộ giỏ hàng khi user thay đổi (login/logout)
  useEffect(() => {
    const load = async () => {
      try {
        if (user) {
          // Nếu có giỏ guest thì merge vào server cart một lần khi login
          const guestRaw = localStorage.getItem('cart:guest')
          let guestItems = []
          if (guestRaw) {
            try { guestItems = JSON.parse(guestRaw) || [] } catch { guestItems = [] }
          }

          // Lấy cart trên server
          const res = await apiGetCart()
          const serverItems = Array.isArray(res.data?.items) ? res.data.items : []

          // Merge: cộng dồn quantity theo product.id
          const mergedMap = new Map()
          for (const it of [...serverItems, ...guestItems]) {
            const id = it.id
            if (!id) continue
            const prev = mergedMap.get(id) || { ...it, quantity: 0 }
            mergedMap.set(id, { ...prev, quantity: (prev.quantity || 0) + (it.quantity || 0) })
          }
          const merged = Array.from(mergedMap.values())

          setCartItems(merged)
          // Lưu lại về server và xóa guest cart
          await apiSaveCart(merged)
          localStorage.removeItem('cart:guest')
          // Đồng bộ localStorage theo key của user
          localStorage.setItem(storageKey, JSON.stringify(merged))
        } else {
          // Guest: đọc từ cart:guest
          const savedCart = localStorage.getItem('cart:guest')
          setCartItems(savedCart ? JSON.parse(savedCart) : [])
        }
      } catch {
        // Nếu lỗi API, fallback về localStorage theo key hiện tại
        const savedCart = localStorage.getItem(storageKey)
        setCartItems(savedCart ? JSON.parse(savedCart) : [])
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // Lưu mỗi khi cartItems thay đổi
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems))
    if (user) {
      // Gửi lên server (fire-and-forget)
      apiSaveCart(cartItems).catch(() => {})
    }
  }, [cartItems, storageKey, user])

  // Đồng bộ ngay lập tức lên server để tránh mất trạng thái khi logout nhanh
  const syncServerCart = async (items) => {
    try {
      if (user) {
        if (!items || items.length === 0) {
          // Xóa sạch trên server để đảm bảo không còn hàng cũ
          await clearCartApi()
        } else {
          await apiSaveCart(items)
        }
      }
    } catch (e) {
      // Chỉ log, không chặn UI
      console.debug('Cart sync failed (non-blocking):', e?.response?.data || e?.message)
    }
  }

  // Thêm sản phẩm vào giỏ
  const addToCart = (product, quantity = 1) => {
    console.log('Adding to cart:', product, quantity)
    const exist = cartItems.find(item => item.id === product.id)
    const updated = exist
      ? cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...cartItems, { ...product, quantity }]
    setCartItems(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    syncServerCart(updated)
  }

  // Xóa sản phẩm khỏi giỏ
  const removeFromCart = (productId) => {
    const updated = cartItems.filter(item => item.id !== productId)
    setCartItems(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    syncServerCart(updated)
  }

  // Sửa số lượng sản phẩm
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return
    const updated = cartItems.map(item => item.id === productId ? { ...item, quantity } : item)
    setCartItems(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
    syncServerCart(updated)
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([])
    localStorage.setItem(storageKey, JSON.stringify([]))
    syncServerCart([])
  }

  // Tính tổng tiền
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity, 
    0
  )

  // Tính tổng số sản phẩm
  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity, 
    0
  )

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}