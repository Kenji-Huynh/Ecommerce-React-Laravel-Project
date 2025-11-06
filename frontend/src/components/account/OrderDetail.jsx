import { formatMoney } from '../../services/currency'
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder, imageUrl } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const RowItem = ({ label, children }) => (
  <div className="d-flex justify-content-between py-1 border-bottom">
    <span className="text-muted">{label}</span>
    <span className="fw-semibold">{children}</span>
  </div>
)

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const data = await getOrder(id)
        setOrder(data)
      } catch (e) {
        setError(e.response?.data?.message || 'Không tải được chi tiết đơn hàng')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <LoadingSpinner message="Đang tải chi tiết đơn hàng..." />
  if (error) return <div className="alert alert-danger">{error}</div>
  if (!order) return null

  const fmt = (n) => formatMoney(n)

  return (
    <section className="py-3">
      <div className="d-flex align-items-center mb-3">
        <Link to="/account/orders" className="btn btn-outline-secondary btn-sm me-2">
          <i className="fas fa-arrow-left me-1"/>Quay lại
        </Link>
        <h4 className="mb-0">Đơn hàng #{order.order_number || order.id}</h4>
        <span className="badge bg-secondary ms-2 align-self-start">{order.status || 'pending'}</span>
      </div>

      <div className="row g-3">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white"><strong>Sản phẩm</strong></div>
            <div className="card-body">
              {Array.isArray(order.items) && order.items.length ? (
                order.items.map((it) => (
                  <div key={it.id} className="d-flex align-items-center py-2 border-bottom">
                    <div className="me-3" style={{ width: 60, height: 60 }}>
                      {it.product?.main_image ? (
                        <img
                          src={imageUrl(it.product.main_image)}
                          alt={it.product_name}
                          className="rounded"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ width: '60px', height: '60px' }}>
                          <i className="fas fa-image text-muted"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{it.product_name}</div>
                      <small className="text-muted">SL: {it.quantity}{it.size ? ` • Size: ${it.size}` : ''}{it.color ? ` • Màu: ${it.color}` : ''}</small>
                    </div>
                    <div className="fw-semibold">{fmt(Number(it.price) * Number(it.quantity))}</div>
                  </div>
                ))
              ) : (
                <div className="text-muted">Không có sản phẩm</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm mb-3">
            <div className="card-header bg-white"><strong>Tóm tắt</strong></div>
            <div className="card-body">
              <RowItem label="Tạm tính">{fmt(order.subtotal)}</RowItem>
              <RowItem label="Thuế">{fmt(order.tax)}</RowItem>
              <RowItem label="Phí vận chuyển">{fmt(order.shipping)}</RowItem>
              {Number(order.discount) > 0 && (
                <RowItem label="Giảm giá">-{fmt(order.discount)}</RowItem>
              )}
              <div className="d-flex justify-content-between pt-2 fs-5">
                <span>Tổng cộng</span>
                <strong>{fmt(order.total)}</strong>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-header bg-white"><strong>Giao hàng & Thanh toán</strong></div>
            <div className="card-body small">
              <div className="mb-2">
                <div className="text-muted">Người nhận</div>
                <div>{order.shipping_name}</div>
                <div>{order.shipping_phone}</div>
                <div>{order.shipping_email}</div>
              </div>
              <div className="mb-2">
                <div className="text-muted">Địa chỉ</div>
                <div>{order.shipping_address}</div>
                <div>{order.shipping_city}{order.shipping_state ? `, ${order.shipping_state}` : ''}</div>
                <div>{order.shipping_country}{order.shipping_zipcode ? `, ${order.shipping_zipcode}` : ''}</div>
              </div>
              <div className="mb-2">
                <div className="text-muted">Phương thức thanh toán</div>
                <div className="text-uppercase">{order.payment_method}</div>
                <div className="text-muted">Trạng thái: {order.payment_status || 'pending'}</div>
              </div>
              <div className="text-muted">Thời gian đặt: {new Date(order.created_at).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderDetail
