import axios from 'axios'

const base = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
export const api = axios.create({
  baseURL: `${base}/api`,
  withCredentials: false, // Tắt cookies - dùng Bearer token thay vì session
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// Bổ sung alias để không lỗi import trong AuthContext
export const authApi = api

// Auth APIs
export const register = (data) => api.post('/register', data)
export const login = (email, password) => api.post('/login', { email, password })
export const me = () => api.get('/user')
export const logout = () => api.post('/logout')

// Cart APIs (per-user)
export const getCart = () => api.get('/cart')
export const saveCart = (items) => api.post('/cart', { items })
export const clearCartApi = () => api.delete('/cart')

// Account APIs
export const getUserOrders = () => api.get('/user/orders')
export const changePassword = (current_password, password, password_confirmation) =>
  api.post('/user/change-password', { current_password, password, password_confirmation })

// Orders (Checkout)
export const createOrder = (payload) => api.post('/orders', payload)

// Payments (Stripe)
export const createPaymentIntent = () => api.post('/payments/create-intent')

// Single order detail
export const getOrder = async (id) => {
  const { data } = await api.get(`/orders/${id}`)
  return data
}

export const getProducts = async (params = {}) => {
  // Lấy tất cả sản phẩm bằng cách set per_page lớn hoặc gọi nhiều trang
  const { data } = await api.get('/products', { 
    params: {
      ...params,
      per_page: 100 // Lấy tối đa 100 sản phẩm (có thể tăng nếu cần)
    }
  })
  return data
}

export const getProduct = async (id) => {
  const { data } = await api.get(`/products/${id}`)
  return data
}

// Helper build URL ảnh từ path lưu trong DB (vd: products/abc.jpg)
export const imageUrl = (path) => {
  if (!path) return '/vite.svg' // Fallback image
  
  // Nếu path đã là URL tuyệt đối (http, https) - Cloudinary hoặc external URL
  if (/^https?:\/\//i.test(path)) return path
  
  // Nếu path đã bắt đầu bằng /storage hoặc /public
  if (path.startsWith('/storage') || path.startsWith('/public')) return `${base}${path}`
  
  // Mặc định: ảnh lưu trong storage Laravel
  return `${base}/storage/${path}`
}