import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './components/Home'
import Shop from './components/Shop'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import RequireAuth from './components/common/RequireAuth'
import AccountLayout from './components/account/AccountLayout'
import Orders from './components/account/Orders'
import OrderDetail from './components/account/OrderDetail'
import ChangePassword from './components/account/ChangePassword'
import Checkout from './components/Checkout'
import LoadingSpinner from './components/common/LoadingSpinner'
import { useAuth } from './context/AuthContext'

// Landing redirect: if logged in -> go to account, else -> login
const LandingRedirect = () => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner message="Đang kiểm tra phiên đăng nhập..." />
  return user ? <Navigate to="/account" replace /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingRedirect/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route element={<RequireAuth />}> 
          <Route path="/cart" element={<Cart/>} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/account" element={<AccountLayout />}> 
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="password" element={<ChangePassword />} />
          </Route>
        </Route>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
