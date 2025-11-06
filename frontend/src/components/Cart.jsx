import { formatMoney } from '../services/currency'
import React, { useState } from 'react'
import { Container, Row, Col, Table, Button, Form, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Header from './common/Header'
import Footer from './common/Footer'

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const navigate = useNavigate()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')

  // Debug: Log cart items
  console.log('Cart Items:', cartItems)
  console.log('Cart Total:', cartTotal)

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/60'
    if (imagePath.startsWith('http')) return imagePath
    return `http://127.0.0.1:8000/storage/${imagePath}`
  }

  // Handle coupon code
  const applyCoupon = () => {
    const validCoupons = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME': 15,
    }
    
    if (validCoupons[couponCode.toUpperCase()]) {
      setDiscount(validCoupons[couponCode.toUpperCase()])
      setCouponMessage(`Coupon applied! You saved ${validCoupons[couponCode.toUpperCase()]}%`)
    } else {
      setDiscount(0)
      setCouponMessage('Invalid coupon code')
    }
  }

  const subtotal = cartTotal
  const tax = subtotal * 0.1
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal + tax - discountAmount

  return (
    <>
      <Header />
      
      <section className="page-header" style={{
        background: 'linear-gradient(135deg, var(--primary-gold) 0%, var(--secondary-gold) 100%)',
        padding: '60px 0',
        color: 'white'
      }}>
        <Container>
          <div className="text-center">
            <h1 className="mb-3"><i className="fas fa-shopping-cart me-3"></i>Giỏ Hàng</h1>
            <p className="mb-0">Xem lại và chỉnh sửa các sản phẩm đã chọn</p>
          </div>
        </Container>
      </section>
      
      <section className="cart-section py-5">
        <Container>
          {cartItems.length === 0 ? (
            <Card className="text-center py-5 shadow-sm">
              <Card.Body>
                <i className="fas fa-shopping-cart fa-5x text-muted mb-4" style={{ opacity: 0.3 }}></i>
                <h3 className="mb-3">Giỏ hàng trống</h3>
                <p className="text-muted mb-4">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                <Link to="/shop" className="btn btn-primary btn-lg">
                  <i className="fas fa-shopping-bag me-2"></i>
                  Tiếp tục mua sắm
                </Link>
              </Card.Body>
            </Card>
          ) : (
            <Row>
              <Col lg={8}>
                <Card className="mb-4 shadow-sm">
                  <Card.Header className="bg-white border-bottom">
                    <h5 className="mb-0">
                      <i className="fas fa-list me-2 text-primary"></i>
                      Sản phẩm trong giỏ ({cartItems.length})
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Table responsive className="cart-table align-middle">
                      <thead className="bg-light">
                        <tr>
                          <th style={{ width: '45%' }}>Sản phẩm</th>
                          <th style={{ width: '15%' }}>Giá</th>
                          <th style={{ width: '20%' }}>Số lượng</th>
                          <th style={{ width: '15%' }}>Tổng</th>
                          <th style={{ width: '5%' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map(item => (
                          <tr key={item.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img 
                                  src={getImageUrl(item.main_image || item.image)} 
                                  alt={item.name} 
                                  style={{ 
                                    width: 80, 
                                    height: 80, 
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef'
                                  }}
                                  className="me-3"
                                />
                                <div>
                                  <h6 className="mb-1 fw-bold">{item.name}</h6>
                                  {/* Category can be a string or an object; render safely as text */}
                                  {(() => {
                                    const categoryLabel = typeof item.category === 'string'
                                      ? item.category
                                      : (item?.category?.name || item?.category_name || '')
                                    return categoryLabel ? (
                                      <small className="text-muted d-block">
                                        <i className="fas fa-tag me-1"></i>{categoryLabel}
                                      </small>
                                    ) : null
                                  })()}
                                  {item.size && <small className="text-muted d-block">Kích thước: {item.size}</small>}
                                  {item.color && (
                                    <div className="mt-1">
                                      <span 
                                        className="color-dot" 
                                        style={{ 
                                          backgroundColor: item.color,
                                          display: 'inline-block',
                                          width: 14,
                                          height: 14,
                                          borderRadius: '50%',
                                          marginRight: 5,
                                          border: '2px solid #dee2e6'
                                        }}
                                      ></span>
                                      <small className="text-muted">{item.color}</small>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="fw-bold text-primary">
                                {formatMoney(Number(item.price || 0))}
                              </span>
                            </td>
                            <td>
                              <div className="quantity-control d-flex align-items-center">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  style={{ width: '32px', height: '32px', padding: 0 }}
                                >
                                  <i className="fas fa-minus"></i>
                                </Button>
                                <Form.Control
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="mx-2 text-center fw-bold"
                                  style={{ width: '60px', border: '2px solid #e9ecef' }}
                                />
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  style={{ width: '32px', height: '32px', padding: 0 }}
                                >
                                  <i className="fas fa-plus"></i>
                                </Button>
                              </div>
                            </td>
                            <td>
                              <span className="fw-bold text-success fs-5">
                                {formatMoney(Number(item.price || 0) * item.quantity)}
                              </span>
                            </td>
                            <td>
                              <Button 
                                variant="link" 
                                className="text-danger p-0"
                                onClick={() => removeFromCart(item.id)}
                                title="Xóa sản phẩm"
                              >
                                <i className="fas fa-trash-alt fa-lg"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                  <Card.Footer className="bg-light d-flex justify-content-between align-items-center">
                    <Button variant="outline-danger" onClick={clearCart}>
                      <i className="fas fa-trash-alt me-2"></i>
                      Xóa tất cả
                    </Button>
                    <Link to="/shop" className="btn btn-outline-primary">
                      <i className="fas fa-shopping-bag me-2"></i>
                      Tiếp tục mua sắm
                    </Link>
                  </Card.Footer>
                </Card>
              </Col>
              
              <Col lg={4}>
                {/* Coupon Code Card */}
                <Card className="mb-3 shadow-sm">
                  <Card.Header className="bg-white border-bottom">
                    <h6 className="mb-0">
                      <i className="fas fa-ticket-alt me-2 text-success"></i>
                      Mã giảm giá
                    </h6>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-2">
                      <div className="input-group">
                        <Form.Control
                          type="text"
                          placeholder="Nhập mã giảm giá"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          style={{ borderRight: 'none' }}
                        />
                        <Button 
                          variant="primary" 
                          onClick={applyCoupon}
                          style={{ borderLeft: 'none' }}
                        >
                          Áp dụng
                        </Button>
                      </div>
                    </Form.Group>
                    {couponMessage && (
                      <Alert 
                        variant={discount > 0 ? 'success' : 'danger'} 
                        className="mb-0 py-2 px-3"
                        style={{ fontSize: '0.875rem' }}
                      >
                        {couponMessage}
                      </Alert>
                    )}
                    <small className="text-muted d-block mt-2">
                      <i className="fas fa-info-circle me-1"></i>
                      Thử: SAVE10, SAVE20, WELCOME
                    </small>
                  </Card.Body>
                </Card>

                {/* Order Summary Card */}
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-receipt me-2"></i>
                      Tóm tắt đơn hàng
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Tạm tính:</span>
                      <span className="fw-bold">{formatMoney(subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Phí vận chuyển:</span>
                      <span className="text-success fw-bold">Miễn phí</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Thuế (10%):</span>
                      <span>{formatMoney(tax)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="d-flex justify-content-between mb-2 text-success">
                        <span>
                          <i className="fas fa-tag me-1"></i>
                          Giảm giá ({discount}%):
                        </span>
                        <span className="fw-bold">-{formatMoney(discountAmount)}</span>
                      </div>
                    )}
                    <hr className="my-3" />
                    <div className="d-flex justify-content-between mb-4">
                      <span className="fs-5 fw-bold">Tổng cộng:</span>
                      <span className="fs-4 fw-bold text-danger">{formatMoney(total)}</span>
                    </div>
                    <Button 
                      onClick={() => navigate('/checkout')}
                      className="w-100 py-3 fw-bold btn-gold"
                      size="lg"
                    >
                      <i className="fas fa-lock me-2"></i>
                      Thanh toán
                    </Button>
                    <div className="text-center mt-3">
                      <small className="text-muted">
                        <i className="fas fa-shield-alt me-1"></i>
                        Thanh toán an toàn & bảo mật
                      </small>
                    </div>
                  </Card.Body>
                </Card>
                
                {/* Payment Methods Card */}
                <Card className="mt-3 shadow-sm">
                  <Card.Body className="text-center">
                    <h6 className="mb-3">Phương thức thanh toán</h6>
                    <div className="payment-icons d-flex justify-content-center gap-3 flex-wrap">
                      <i className="fab fa-cc-visa fa-2x text-primary"></i>
                      <i className="fab fa-cc-mastercard fa-2x" style={{ color: '#eb001b' }}></i>
                      <i className="fab fa-cc-paypal fa-2x text-info"></i>
                      <i className="fas fa-wallet fa-2x text-warning"></i>
                      <i className="fas fa-money-bill-wave fa-2x text-success"></i>
                    </div>
                  </Card.Body>
                </Card>

                {/* Trust Badges */}
                <Card className="mt-3 shadow-sm border-0" style={{ background: '#f8f9fa' }}>
                  <Card.Body className="py-3">
                    <div className="d-flex align-items-center justify-content-around text-center">
                      <div>
                        <i className="fas fa-shipping-fast fa-2x text-primary mb-2"></i>
                        <div><small className="fw-bold">Giao hàng nhanh</small></div>
                      </div>
                      <div>
                        <i className="fas fa-undo fa-2x text-success mb-2"></i>
                        <div><small className="fw-bold">Đổi trả 7 ngày</small></div>
                      </div>
                      <div>
                        <i className="fas fa-headset fa-2x text-info mb-2"></i>
                        <div><small className="fw-bold">Hỗ trợ 24/7</small></div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      <Footer />
    </>
  )
}

export default Cart