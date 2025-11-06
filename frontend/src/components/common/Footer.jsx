import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="footer-section text-light py-5">
      <Container>
        <Row>
          {/* Brand Section */}
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-logo mb-3">
              <i className="fas fa-tshirt me-2"></i>
              <span className="h4 text-white">Pure Wear</span>
            </div>
            <p className="footer-description mb-4">
              Premium fashion for the modern lifestyle. We believe in quality, style, and sustainability.
            </p>
            <div className="social-links">
              <a href="#" className="social-link me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link me-3">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </Col>

          {/* Shop Links */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title mb-3">Shop</h5>
            <ul className="footer-list list-unstyled">
              <li><Link to="/shop?category=men">Men's Fashion</Link></li>
              <li><Link to="/shop?category=women">Women's Fashion</Link></li>
              <li><Link to="/shop?category=kids">Kids Collection</Link></li>
              <li><Link to="/shop">All Products</Link></li>
            </ul>
          </Col>

          {/* Support Links */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title mb-3">Support</h5>
            <ul className="footer-list list-unstyled">
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#returns">Returns</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </Col>

          {/* Company Links */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title mb-3">Company</h5>
            <ul className="footer-list list-unstyled">
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#sustainability">Sustainability</a></li>
              <li><a href="#press">Press</a></li>
            </ul>
          </Col>

          {/* Legal Links */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title mb-3">Legal</h5>
            <ul className="footer-list list-unstyled">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
            </ul>
          </Col>
        </Row>

        <hr className="footer-divider my-4" />

        <Row className="align-items-center">
          <Col md={6}>
            <p className="footer-copyright mb-0">
              © 2025 Pure Wear. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="payment-methods">
              <span className="me-2">We accept:</span>
              <i className="fab fa-cc-visa me-2"></i>
              <i className="fab fa-cc-mastercard me-2"></i>
              <i className="fab fa-cc-amex me-2"></i>
              <i className="fab fa-cc-paypal"></i>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer