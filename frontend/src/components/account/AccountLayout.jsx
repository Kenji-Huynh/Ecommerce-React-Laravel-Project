import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Header from '../common/Header'
import Footer from '../common/Footer'

const AccountLayout = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async (e) => {
    e.preventDefault()
    await logout()
    navigate('/login')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="container py-4 flex-grow-1">
        <div className="row">
          <aside className="col-12 col-md-3 mb-4">
            <div className="list-group">
              <div className="list-group-item active">
                <i className="fas fa-user-circle me-2"></i>
                {user?.name || 'Tài khoản'}
              </div>
              <NavLink to="/account/orders" className={({isActive}) => `list-group-item list-group-item-action ${isActive ? 'fw-bold' : ''}`}>
                <i className="fas fa-box me-2"></i>
                Orders
              </NavLink>
              <NavLink to="/account/password" className={({isActive}) => `list-group-item list-group-item-action ${isActive ? 'fw-bold' : ''}`}>
                <i className="fas fa-key me-2"></i>
                Change password
              </NavLink>
              <a href="#" className="list-group-item list-group-item-action text-danger" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </a>
            </div>
          </aside>
          <main className="col-12 col-md-9">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AccountLayout
