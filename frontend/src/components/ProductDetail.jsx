import { formatMoney } from '../services/currency'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from './common/Header'
import Footer from './common/Footer'
import ProductCard from './common/ProductCard'
import LoadingSpinner from './common/LoadingSpinner'
import { getProduct, imageUrl } from '../services/api'
import { useCart } from '../context/CartContext'
import { Container, Row, Col, Button, Badge } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { showLoginRequired } from './common/loginRequiredAlert'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    ;(async () => {
      try {
        setLoading(true)
        const res = await getProduct(id)
        console.log('API Response:', res)
        
        // Backend trả về object có product và related_products
        const productData = res?.product || res?.data?.product || res?.data || res
        const relatedData = res?.related_products || res?.data?.related_products || []
        
        setProduct(productData)
        setSelectedImage(imageUrl(productData.main_image))
        setRelatedProducts(relatedData)
        
        console.log('Product:', productData)
        console.log('Related Products:', relatedData)
      } catch (err) {
        console.error('Error loading product:', err)
        setError('Không tìm thấy sản phẩm')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      const result = await showLoginRequired()
      if (result.isConfirmed) navigate('/login')
      else if (result.isDenied) navigate('/register')
      return
    }
    addToCart(product, quantity)
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`)
  }

  if (loading) return <div className="container py-5"><LoadingSpinner /></div>
  if (error) return <div className="container py-5 text-danger text-center">{error}</div>
  if (!product) return null

  const images = [
    imageUrl(product.main_image),
    ...(product.images || []).map(img => imageUrl(img.image_path))
  ]

  return (
    <>
      <Header />
      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Trang chủ</a></li>
            <li className="breadcrumb-item"><a href="/shop">Sản phẩm</a></li>
            <li className="breadcrumb-item active">{product.name}</li>
          </ol>
        </nav>

        <Row className="g-4 mb-5">
          {/* Hình ảnh sản phẩm */}
          <Col lg={6}>
            <div className="product-images">
              {/* Ảnh chính */}
              <div className="main-image mb-3">
                <img
                  src={selectedImage || imageUrl(product.main_image)}
                  alt={product.name}
                  className="img-fluid rounded shadow-sm"
                  style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                  loading="eager"
                  onError={(e) => { e.currentTarget.src = '/vite.svg' }}
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="d-flex gap-2 overflow-auto">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      className={`img-thumbnail cursor-pointer ${selectedImage === img ? 'border-primary' : ''}`}
                      style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                      loading="lazy"
                      onClick={() => setSelectedImage(img)}
                      onError={(e) => { e.currentTarget.src = '/vite.svg' }}
                    />
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Thông tin sản phẩm */}
          <Col lg={6}>
            <div className="product-info">
              {/* Badges */}
              <div className="mb-2">
                {product.is_new && <Badge bg="success" className="me-2">Mới</Badge>}
                {product.is_featured && <Badge bg="warning" text="dark" className="me-2">Nổi bật</Badge>}
                {product.discount > 0 && <Badge bg="danger">-{product.discount}%</Badge>}
              </div>

              <h2 className="mb-3">{product.name}</h2>

              {/* Giá */}
              <div className="mb-3">
                <span className="fs-3 fw-bold text-primary">
                  {formatMoney(Number(product.price || 0))}
                </span>
                {product.compare_price && product.compare_price > product.price && (
                  <span className="fs-5 text-muted text-decoration-line-through ms-3">
                    {formatMoney(Number(product.compare_price))}
                  </span>
                )}
              </div>

              {/* Mô tả */}
              <p className="text-muted mb-4">{product.description || 'Chưa có mô tả'}</p>

              {/* Thông tin chi tiết */}
              <div className="mb-4">
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td className="fw-bold" style={{width: '150px'}}>SKU:</td>
                      <td>{product.sku || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Danh mục:</td>
                      <td>{product.category?.name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Tình trạng:</td>
                      <td>
                        {product.in_stock ? (
                          <Badge bg="success">Còn hàng ({product.stock_quantity || 0})</Badge>
                        ) : (
                          <Badge bg="danger">Hết hàng</Badge>
                        )}
                      </td>
                    </tr>
                    {product.sizes && product.sizes.length > 0 && (
                      <tr>
                        <td className="fw-bold">Sizes:</td>
                        <td>{product.sizes.join(', ')}</td>
                      </tr>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <tr>
                        <td className="fw-bold">Màu sắc:</td>
                        <td>{product.colors.join(', ')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Số lượng */}
              <div className="mb-4">
                <label className="form-label fw-bold">Số lượng:</label>
                <div className="d-flex align-items-center gap-3">
                  <div className="input-group" style={{width: '150px'}}>
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      className="form-control text-center" 
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Nút thêm giỏ hàng */}
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  {product.in_stock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </Button>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4">
                  <strong>Tags: </strong>
                  {product.tags.map((tag, idx) => (
                    <Badge key={idx} bg="secondary" className="me-2">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* Sản phẩm gợi ý */}
        {relatedProducts.length > 0 && (
          <section className="related-products mt-5 pt-5 border-top">
            <h3 className="text-center mb-4">Sản phẩm liên quan</h3>
            <Row className="g-4">
              {relatedProducts.map(relProduct => (
                <Col key={relProduct.id} sm={6} md={4} lg={3}>
                  <ProductCard product={relProduct} />
                </Col>
              ))}
            </Row>
          </section>
        )}
      </div>
      <Footer />
    </>
  )
}

export default ProductDetail