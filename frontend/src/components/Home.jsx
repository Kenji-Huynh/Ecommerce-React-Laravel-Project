import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Header from './common/Header'
import Footer from './common/Footer'
import ProductCard from './common/ProductCard'
import LoadingSpinner from './common/LoadingSpinner'
import { getProducts } from '../services/api'

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([])
  const [newItems, setNewItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Lấy sản phẩm từ API
        const result = await getProducts()
        // Laravel paginate: result.data là mảng sản phẩm
        const products = Array.isArray(result?.data) ? result.data : []
        // Lọc sản phẩm nổi bật
        setFeaturedItems(products.filter(p => p.is_featured).slice(0, 4))
        // Sản phẩm mới (8 sản phẩm mới nhất)
        setNewItems(products.slice(0, 8))
      } catch (e) {
        console.error('Lỗi khi tải sản phẩm:', e)
        setError('Không tải được sản phẩm')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) return <div className="container py-5"><LoadingSpinner /></div>
  if (error) return <div className="container py-5 text-danger text-center">{error}</div>

  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <Container fluid className="p-0">
          <Row className="g-0 min-vh-100">
            {/* Left side - Hero Content */}
            <Col lg={6} className="d-flex align-items-center">
              <div className="hero-content-container w-100">
                <div className="hero-content">
                  <h1 className="hero-title">
                    Simple<br />
                    is More
                  </h1>
                  <p className="hero-subtitle">
                    Discover our collection of premium clothing designed for modern lifestyle
                  </p>
                  <Link to="/shop" className="btn hero-btn">
                    Shop Now
                  </Link>
                </div>
              </div>
            </Col>

            {/* Right side - Hero Image */}
            <Col lg={6}>
              <div className="hero-image-container">
                <div className="hero-image">
                  <img 
                    src="/src/assets/images/banner-hero.jpg" 
                    alt="Fashion Collection"
                    className="banner-img"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.parentElement.innerHTML = `
                        <div class="image-placeholder">
                          <h3>Fashion Image</h3>
                          <p>Premium Collection</p>
                        </div>
                      `
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Categories Section */}
      <section className="featured-categories py-5">
        <Container>
          <Row>
            <Col>
              <div className="text-center mb-5">
                <h2 className="section-title">Shop by Category</h2>
                <p className="section-subtitle">
                  Discover our carefully curated collections designed for every style and occasion
                </p>
              </div>
            </Col>
          </Row>
          
          <Row className="g-4">
            {/* Men's Category */}
            <Col lg={4} md={6}>
              <Link to="/shop?category=men" className="text-decoration-none">
                <div className="category-card">
                  <div className="category-image">
                    <img 
                      src="/src/assets/images/male.jpg" 
                      alt="Men's Fashion"
                      className="category-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop'
                      }}
                    />
                    <div className="category-overlay">
                      <h3>Men's Collection</h3>
                      <p>Sophisticated & Modern</p>
                    </div>
                  </div>
                  <div className="category-info p-4">
                    <h4 className="category-title">Men's Fashion</h4>
                    <p className="category-desc">
                      Discover timeless pieces and contemporary styles for the modern gentleman
                    </p>
                  </div>
                </div>
              </Link>
            </Col>

            {/* Women's Category */}
            <Col lg={4} md={6}>
              <Link to="/shop?category=women" className="text-decoration-none">
                <div className="category-card">
                  <div className="category-image">
                    <img 
                      src="/src/assets/images/female.jpg" 
                      alt="Women's Fashion"
                      className="category-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1494790108755-2616c326ca45?w=400&h=500&fit=crop'
                      }}
                    />
                    <div className="category-overlay">
                      <h3>Women's Collection</h3>
                      <p>Elegant & Chic</p>
                    </div>
                  </div>
                  <div className="category-info p-4">
                    <h4 className="category-title">Women's Fashion</h4>
                    <p className="category-desc">
                      Elegant designs and versatile pieces for every woman's wardrobe
                    </p>
                  </div>
                </div>
              </Link>
            </Col>

            {/* Kids Category */}
            <Col lg={4} md={6}>
              <Link to="/shop?category=kids" className="text-decoration-none">
                <div className="category-card">
                  <div className="category-image">
                    <img 
                      src="/src/assets/images/kids.jpg" 
                      alt="Kids Fashion"
                      className="category-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop'
                      }}
                    />
                    <div className="category-overlay">
                      <h3>Kids Collection</h3>
                      <p>Fun & Comfortable</p>
                    </div>
                  </div>
                  <div className="category-info p-4">
                    <h4 className="category-title">Kids Fashion</h4>
                    <p className="category-desc">
                      Comfortable and playful clothing designed for active little ones
                    </p>
                  </div>
                </div>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Brand Values Section */}
      <section className="brand-values py-5 bg-light">
        <Container>
          <Row>
            <Col>
              <div className="text-center mb-5">
                <h2 className="section-title">Why Choose Pure Wear</h2>
                <p className="section-subtitle">
                  We're committed to providing you with the best fashion experience
                </p>
              </div>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col lg={4} md={6}>
              <div className="value-card text-center">
                <div className="value-icon">
                  <i className="fas fa-leaf"></i>
                </div>
                <h4>Sustainable Fashion</h4>
                <p>
                  We're committed to eco-friendly practices and sustainable materials 
                  in all our collections.
                </p>
              </div>
            </Col>
            
            <Col lg={4} md={6}>
              <div className="value-card text-center">
                <div className="value-icon">
                  <i className="fas fa-award"></i>
                </div>
                <h4>Premium Quality</h4>
                <p>
                  Every piece is crafted with attention to detail using the finest 
                  materials and construction techniques.
                </p>
              </div>
            </Col>
            
            <Col lg={4} md={6}>
              <div className="value-card text-center">
                <div className="value-icon">
                  <i className="fas fa-shipping-fast"></i>
                </div>
                <h4>Fast Delivery</h4>
                <p>
                  Free shipping on orders over $50 with fast and reliable delivery 
                  to your doorstep.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section py-5">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <div className="newsletter-content">
                <h2 className="newsletter-title mb-3">Stay Updated</h2>
                <p className="newsletter-subtitle mb-4">
                  Subscribe to our newsletter and be the first to know about new collections, 
                  exclusive offers, and fashion tips.
                </p>
                <form className="newsletter-form">
                  <div className="input-group mb-3">
                    <input 
                      type="email" 
                      className="form-control newsletter-input" 
                      placeholder="Enter your email address"
                      required
                    />
                    <button className="btn btn-newsletter" type="submit">
                      Subscribe
                    </button>
                  </div>
                </form>
                <small className="newsletter-disclaimer text-muted">
                  We respect your privacy. Unsubscribe at any time.
                </small>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="featured-products py-4">
        <Container>
          <h2 className="mb-3 section-title">Sản phẩm nổi bật</h2>
          <Row className="g-3">
            {featuredItems.length > 0 ? (
              featuredItems.map(product => (
                <Col key={product.id} xs={6} md={3}>
                  <ProductCard product={product} />
                </Col>
              ))
            ) : (
              <Col>
                <p className="text-center">Không có sản phẩm nổi bật</p>
              </Col>
            )}
          </Row>
        </Container>
      </section>

      {/* New Products */}
      <section className="new-products py-4">
        <Container>
          <h2 className="mb-3 section-title">Sản phẩm mới</h2>
          <Row className="g-3">
            {newItems.map(product => (
              <Col key={product.id} xs={6} md={3}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Link to="/shop" className="btn btn-outline-dark">
              Xem thêm sản phẩm
            </Link>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  )
}

export default Home