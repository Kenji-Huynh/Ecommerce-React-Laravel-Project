import { formatMoney } from '../../services/currency'
import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { imageUrl } from '../../services/api'
import { showLoginRequired } from './loginRequiredAlert'
import { toast } from 'react-toastify'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Default values nếu product không có đầy đủ thông tin
  const {
    id = 1,
    name = 'Product Name',
    category = 'Category',
    price = 0,
    originalPrice = null,
    image = 'https://via.placeholder.com/300x400?text=Product',
    rating = 0,
    reviewCount = 0,
    isOnSale = false,
    isNew = false
  } = product || {}

  const handleAddToCart = async () => {
    if (!user) {
      const result = await showLoginRequired()
      if (result.isConfirmed) navigate('/login')
      else if (result.isDenied) navigate('/register')
      return
    }
    addToCart(product, 1)
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  const handleQuickView = () => {
    // Navigate đến trang chi tiết sản phẩm
    navigate(`/product/${id}`)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>)
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>)
    }

    return stars
  }

  // Lấy hình ảnh từ main_image hoặc fallback về image
  const imgSrc = imageUrl(product?.main_image || image);

  return (
  <Card className="product-card">
      <div className="product-image-container">
        {/* Product Badges */}
        {(isNew || isOnSale) && (
          <div className="product-badges">
            {isNew && (
              <span className="product-badge badge-new">New</span>
            )}
            {isOnSale && (
              <span className="product-badge badge-sale">Sale</span>
            )}
          </div>
        )}

        {/* Product Image */}
        <div className="product-image">
          <img 
            src={imgSrc}
            alt={name}
            className="product-img"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = '/vite.svg' }}
          />
          
          {/* Overlay with buttons */}
          <div className="product-overlay">
            <div className="overlay-buttons">
              <Button 
                variant="light" 
                size="sm"
                className="btn-icon"
                onClick={handleQuickView}
              >
                <i className="fas fa-eye"></i>
              </Button>
              <Button 
                variant="light"
                size="sm"
                className="btn-icon"
                onClick={handleAddToCart}
              >
                <i className="fas fa-shopping-cart"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card.Body className="product-info">
        {/* Product Category */}
        <small className="product-category text-uppercase">
          {typeof category === 'object' && category !== null ? category.name : category}
        </small>

        {/* Product Title */}
        <Card.Title className="product-title">
          <Link to={`/product/${id}`} className="product-title-link text-decoration-none">
            {name}
          </Link>
        </Card.Title>

        {/* Product Rating */}
        <div className="product-rating mb-2">
          <div className="stars">
            {renderStars(rating)}
          </div>
          <small className="text-muted ms-2">
            ({reviewCount} reviews)
          </small>
        </div>

        {/* Product Price */}
        <div className="product-price mb-3">
          <span className="price-current fw-bold">
            {formatMoney(Number(price || 0))}
          </span>
          {originalPrice && (
            <>
              <span className="price-original text-muted text-decoration-line-through ms-2">
                {formatMoney(Number(originalPrice || 0))}
              </span>
              <span className="discount-percent badge bg-danger ms-2">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          variant="outline-primary" 
          className="add-to-cart-btn w-100"
          onClick={handleAddToCart}
        >
          <i className="fas fa-shopping-cart me-2"></i>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  )
}

export default ProductCard