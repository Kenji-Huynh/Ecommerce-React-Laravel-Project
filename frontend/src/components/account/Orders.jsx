import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserOrders, imageUrl } from '../../services/api'
import LoadingSpinner from '../common/LoadingSpinner'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getUserOrders()
        // Hỗ trợ các dạng phản hồi: mảng trực tiếp, paginator (data), hoặc wrapper {orders}
        const list = Array.isArray(data) ? data : (data.data || data.orders || [])
        setOrders(list)
      } catch (e) {
        setError(e.response?.data?.message || 'Không tải được danh sách đơn hàng')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <LoadingSpinner message="Đang tải đơn hàng..." />
  if (error) return <div className="alert alert-danger">{error}</div>

  if (!orders.length) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fas fa-box-open fa-3x mb-3"></i>
        <p>Chưa có đơn hàng nào.</p>
      </div>
    )
  }

  return (
    <div>
      <h4 className="mb-3">Đơn hàng của bạn</h4>
      <div className="list-group">
        {orders.map((o) => (
          <Link key={o.id} to={`/account/orders/${o.id}`} className="list-group-item list-group-item-action">
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-1">Order #{o.order_number || o.id}</h6>
              <small className="text-muted">{new Date(o.created_at).toLocaleString()}</small>
            </div>
            <div className="mb-1">
              <span className="badge bg-secondary me-2">{o.status || 'pending'}</span>
              <strong>Total:</strong> {(o.total || o.total_amount || 0).toLocaleString()} đ
            </div>
            {Array.isArray(o.items) && o.items.length > 0 && (
              <div className="mt-2">
                {o.items.slice(0, 3).map((it) => (
                  <span key={it.id || `${o.id}-${it.product_id}`} className="me-2">
                    {it.image && (
                      <img src={imageUrl(it.image)} alt={it.name} width={40} height={40} style={{ objectFit: 'cover' }} />
                    )}
                  </span>
                ))}
                {o.items.length > 3 && <small className="text-muted"> +{o.items.length - 3} more</small>}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Orders
