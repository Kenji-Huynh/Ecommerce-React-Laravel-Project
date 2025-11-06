import React, { useMemo, useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder, createPaymentIntent } from '../services/api'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { formatMoney } from '../services/currency'

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    shipping_name: user?.name || '',
    shipping_email: user?.email || '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zipcode: '',
    shipping_country: 'Vietnam',
    payment_method: 'cod',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const stripePromise = useMemo(() => {
    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    return pk ? loadStripe(pk) : null
  }, [])

  const placeOrderCODOrPaypal = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!cartItems.length) {
      setError('Giỏ hàng đang trống.')
      setSubmitting(false)
      return
    }

    try {
      const payload = {
        items: cartItems.map(it => ({
          product_id: it.id,
          quantity: it.quantity,
          size: it.size || null,
          color: it.color || null,
        })),
        ...form,
      }
  const { data } = await createOrder(payload)
      toast.success('Đặt hàng thành công!')
      clearCart()
      // Điều hướng đến trang chi tiết đơn hàng vừa đặt
      const orderId = data?.id || data?.order?.id
      if (orderId) {
        navigate(`/account/orders/${orderId}`)
      } else {
        navigate('/account/orders')
      }
      return data
    } catch (e) {
      const msg = e.response?.data?.message || 'Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin.'
      setError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  // Thanh toán bằng thẻ - component con để dùng hook của Stripe
  const CardPaymentSection = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [cardComplete, setCardComplete] = useState(false)

    const handlePay = async (e) => {
      e.preventDefault()
      setSubmitting(true)
      setError('')

      if (!stripe || !elements) {
        setError('Stripe chưa sẵn sàng, vui lòng tải lại trang.')
        setSubmitting(false)
        return
      }

      if (!cartItems.length) {
        setError('Giỏ hàng đang trống.')
        setSubmitting(false)
        return
      }

      try {
        // 1) Tạo PaymentIntent trên server (tính tổng tiền từ DB)
        const { data: intent } = await createPaymentIntent()
        const clientSecret = intent?.data?.clientSecret || intent?.clientSecret
        if (!clientSecret) throw new Error('Không lấy được clientSecret')

        const cardElement = elements.getElement(CardElement)
        if (!cardElement) throw new Error('Không tìm thấy phần nhập thẻ')
        if (!cardComplete) {
          setError('Thông tin thẻ chưa đầy đủ. Vui lòng nhập đủ số thẻ, ngày hết hạn và CVC.')
          setSubmitting(false)
          return
        }

        // 2) Xác nhận thanh toán trên client
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: form.shipping_name,
              email: form.shipping_email,
              phone: form.shipping_phone,
            },
          },
          shipping: {
            name: form.shipping_name,
            address: {
              line1: form.shipping_address,
              city: form.shipping_city,
              state: form.shipping_state,
              postal_code: form.shipping_zipcode,
              // Chuyển tên quốc gia sang mã ISO-2 (mặc định VN)
              country: (() => {
                const raw = (form.shipping_country || 'VN').trim()
                return raw.length === 2 ? raw.toUpperCase() : 'VN'
              })(),
            },
            phone: form.shipping_phone,
          },
        })

        if (result.error) {
          throw new Error(result.error.message || 'Thanh toán thất bại')
        }

        const pi = result.paymentIntent
        if (pi?.status !== 'succeeded') {
          throw new Error('Thanh toán chưa hoàn tất')
        }

        // 3) Tạo đơn hàng sau khi thanh toán thành công
        const payload = {
          items: cartItems.map(it => ({
            product_id: it.id,
            quantity: it.quantity,
            size: it.size || null,
            color: it.color || null,
          })),
          ...form,
          payment_method: 'card',
        }
        const { data } = await createOrder(payload)
        toast.success('Thanh toán thành công và đã tạo đơn hàng!')
        clearCart()
        const orderId = data?.id || data?.order?.id
        if (orderId) {
          navigate(`/account/orders/${orderId}`)
        } else {
          navigate('/account/orders')
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Thanh toán thất bại.'
        setError(msg)
        toast.error(msg)
      } finally {
        setSubmitting(false)
      }
    }

    return (
      <>
        <div className="mb-3">
          <Form.Label>Thông tin thẻ</Form.Label>
          <div className="form-control p-2">
            <CardElement
              options={{ hidePostalCode: true }}
              onChange={(e) => setCardComplete(!!e.complete)}
            />
          </div>
          <small className="text-muted d-block mt-2">Dùng thẻ test 4242 4242 4242 4242 - 12/34 - 123</small>
        </div>
        <div className="d-flex gap-2">
          <Button onClick={handlePay} className="btn-gold" disabled={submitting || !stripe || !cardComplete}>
            {submitting ? 'Đang thanh toán...' : 'Thanh toán & Đặt hàng'}
          </Button>
          <Link to="/cart" className="btn btn-outline-secondary">Quay lại giỏ hàng</Link>
        </div>
      </>
    )
  }

  return (
    <section className="py-5" style={{ background: '#f8f9fa' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <h2 className="mb-1"><i className="fas fa-credit-card me-2"/>Thanh toán</h2>
            <div className="text-muted">Hoàn tất thông tin giao hàng và đặt hàng</div>
          </Col>
        </Row>

        {!cartItems.length ? (
          <Card className="text-center p-5">
            <Card.Body>
              <h5>Giỏ hàng trống</h5>
              <p className="text-muted">Vui lòng thêm sản phẩm trước khi thanh toán.</p>
              <Link className="btn btn-gold" to="/shop">
                <i className="fas fa-shopping-bag me-2"/>Tiếp tục mua sắm
              </Link>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            <Col md={7} className="mb-3">
              <Card className="shadow-sm">
                <Card.Header className="bg-white"><strong>Thông tin giao hàng</strong></Card.Header>
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={placeOrderCODOrPaypal}>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control name="shipping_name" value={form.shipping_name} onChange={handleChange} required />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="shipping_email" value={form.shipping_email} onChange={handleChange} required />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control name="shipping_phone" value={form.shipping_phone} onChange={handleChange} required />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Quốc gia</Form.Label>
                        <Form.Control name="shipping_country" value={form.shipping_country} onChange={handleChange} required />
                      </Col>
                    </Row>
                    <div className="mb-3">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control name="shipping_address" value={form.shipping_address} onChange={handleChange} required />
                    </div>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Thành phố</Form.Label>
                        <Form.Control name="shipping_city" value={form.shipping_city} onChange={handleChange} required />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Tỉnh/Bang</Form.Label>
                        <Form.Control name="shipping_state" value={form.shipping_state} onChange={handleChange} />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Mã bưu chính</Form.Label>
                        <Form.Control name="shipping_zipcode" value={form.shipping_zipcode} onChange={handleChange} />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Phương thức thanh toán</Form.Label>
                        <Form.Select name="payment_method" value={form.payment_method} onChange={handleChange} required>
                          <option value="cod">Thanh toán khi nhận hàng (COD)</option>
                          <option value="card">Thẻ tín dụng/ghi nợ</option>
                          <option value="paypal">PayPal</option>
                        </Form.Select>
                      </Col>
                    </Row>
                    <div className="mb-3">
                      <Form.Label>Ghi chú</Form.Label>
                      <Form.Control as="textarea" rows={3} name="notes" value={form.notes} onChange={handleChange} />
                    </div>

                    {form.payment_method === 'card' ? (
                      stripePromise ? (
                        <Elements stripe={stripePromise}>
                          <CardPaymentSection />
                        </Elements>
                      ) : (
                        <Alert variant="warning">Thiếu VITE_STRIPE_PUBLISHABLE_KEY. Vui lòng cấu hình .env (frontend).</Alert>
                      )
                    ) : (
                      <div className="d-flex gap-2">
                        <Button type="submit" className="btn-gold" disabled={submitting}>
                          {submitting ? 'Đang đặt hàng...' : 'Đặt hàng'}
                        </Button>
                        <Link to="/cart" className="btn btn-outline-secondary">Quay lại giỏ hàng</Link>
                      </div>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={5}>
              <Card className="shadow-sm">
                <Card.Header className="bg-white"><strong>Tóm tắt đơn hàng</strong></Card.Header>
                <Card.Body>
                  {cartItems.map(it => (
                    <div key={it.id} className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <div className="fw-semibold">{it.name}</div>
                        <small className="text-muted">SL: {it.quantity}</small>
                      </div>
                      <div className="fw-bold">{formatMoney(Number(it.price||0) * it.quantity)}</div>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span>Tạm tính</span>
                    <strong>{formatMoney(Number(cartTotal))}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Phí vận chuyển</span>
                    <strong>{formatMoney(10)}</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Thuế</span>
                    <strong>{formatMoney(0)}</strong>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fs-5">
                    <span>Tổng cộng</span>
                    <strong>{formatMoney(Number(cartTotal) + 10)}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  )
}

export default Checkout
