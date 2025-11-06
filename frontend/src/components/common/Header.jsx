import React, { useState } from 'react'
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { showLoginRequired } from './loginRequiredAlert'

const Header = () => {
  const { itemCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    toast.success('Đăng xuất thành công!')
    navigate('/home')
    setIsLoggingOut(false)
  }

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar bg-dark text-white text-center py-2">
        <small>Fashion Forward, Style Beyond Limits</small>
      </div>
      
      {/* Main Navbar */}
      <Navbar expand="lg" className="navbar-custom py-3" sticky="top">
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} to="/home" className="brand-logo">
            <span className="logo-icon"><i className="fas fa-tshirt"></i></span>
            <span className="brand-text">Pure Wear</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Center Navigation */}
            <Nav className="navbar-nav-center">
              <Nav.Link as={Link} to="/home" className="nav-item-custom">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/shop?category=kids" className="nav-item-custom">
                Kids
              </Nav.Link>
              <Nav.Link as={Link} to="/shop?category=men" className="nav-item-custom">
                Mens
              </Nav.Link>
              <Nav.Link as={Link} to="/shop?category=women" className="nav-item-custom">
                Women
              </Nav.Link>
            </Nav>
            
            {/* Right side icons */}
            <Nav className="navbar-nav-right">
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle as="a" className="nav-icon" style={{ cursor: 'pointer' }}>
                    <i className="fas fa-user"></i>
                    <span className="ms-2 d-none d-lg-inline">{user.name}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/account">
                      <i className="fas fa-user-circle me-2"></i>
                      Tài khoản
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/account/orders">
                      <i className="fas fa-box me-2"></i>
                      Đơn hàng
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} disabled={isLoggingOut}>
                      <i className="fas fa-sign-out-alt me-2"></i>
                      {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <>
                  <Link to="/login" className="nav-icon" title="Đăng nhập">
                    <i className="fas fa-sign-in-alt"></i>
                    <span className="ms-2 d-none d-lg-inline">Đăng nhập</span>
                  </Link>
                  <Link to="/register" className="nav-icon" title="Đăng ký">
                    <i className="fas fa-user-plus"></i>
                    <span className="ms-2 d-none d-lg-inline">Đăng ký</span>
                  </Link>
                </>
              )}
              
              <a
                href="#"
                className="nav-icon position-relative"
                onClick={async (e) => {
                  e.preventDefault()
                  if (user) {
                    navigate('/cart')
                  } else {
                    const result = await showLoginRequired()
                    if (result.isConfirmed) navigate('/login')
                    else if (result.isDenied) navigate('/register')
                  }
                }}
                aria-label="Giỏ hàng"
              >
                <i className="fas fa-shopping-bag"></i>
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </a>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header

