import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap'
import { useSearchParams } from 'react-router-dom'
import Header from './common/Header'
import Footer from './common/Footer'
import ProductCard from './common/ProductCard'
import LoadingSpinner from './common/LoadingSpinner'
import { getProducts } from '../services/api'

const filterProducts = (products, filters) => {
  let list = [...products]
  // Lọc theo category nếu sản phẩm có category hoặc category_id
  if (filters.category && filters.category !== 'all') {
    const key = filters.category.toLowerCase()
    list = list.filter(p => {
      // Kiểm tra category.slug trước (chính xác nhất)
      if (p.category?.slug) {
        return p.category.slug.toLowerCase() === key
      }
      // Fallback: kiểm tra category.name với exact match
      if (p.category?.name) {
        return p.category.name.toLowerCase() === key
      }
      // Fallback cuối: nếu category là string
      if (p.category && typeof p.category === 'string') {
        return p.category.toLowerCase() === key
      }
      return false
    })
  }
  // Lọc theo priceRange
  list = list.filter(p => Number(p.price || 0) <= Number(filters.priceRange?.[1] ?? Infinity))
  // Lọc size
  if (filters.sizes?.length) {
    list = list.filter(p => Array.isArray(p.sizes) && filters.sizes.some(s => p.sizes.includes(s)))
  }
  return list
}

const sortProducts = (products, sortBy) => {
  const list = [...products]
  switch (sortBy) {
    case 'name-desc':
      return list.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
    case 'price-low':
      return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    case 'price-high':
      return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    case 'newest':
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    default:
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }
}

const paginateProducts = (products, page, perPage) => {
  const total = products.length
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const current = Math.min(Math.max(1, page), totalPages)
  const start = (current - 1) * perPage
  const end = start + perPage
  return {
    products: products.slice(start, end),
    totalPages,
    hasPrevPage: current > 1,
    hasNextPage: current < totalPages,
  }
}

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryFromUrl = searchParams.get('category') || 'all'

  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'name')
  const [filters, setFilters] = useState({
    category: categoryFromUrl,
    priceRange: [0, 1000],
    sizes: [],
    colors: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredProducts, setFilteredProducts] = useState([])
  const [paginatedData, setPaginatedData] = useState({})
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const itemsPerPage = 9

  useEffect(() => {
    const newCategory = searchParams.get('category') || 'all'
    setFilters(prev => ({ ...prev, category: newCategory }))
    setCurrentPage(1)
  }, [searchParams])

  // Lấy sản phẩm từ API
  useEffect(() => {
    (async () => {
      try {
        const res = await getProducts()
        // Laravel paginate: res.data là mảng sản phẩm
        setItems(Array.isArray(res?.data) ? res.data : [])
      } catch {
        setError('Không tải được danh sách sản phẩm')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Filter + sort khi items/filters/sortBy đổi
  useEffect(() => {
    let products = filterProducts(items, filters)
    products = sortProducts(products, sortBy)
    setFilteredProducts(products)
    setCurrentPage(1)
  }, [items, filters, sortBy])

  // Phân trang
  useEffect(() => {
    const paginated = paginateProducts(filteredProducts, currentPage, itemsPerPage)
    setPaginatedData(paginated)
  }, [filteredProducts, currentPage])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
    const newSearchParams = new URLSearchParams(searchParams)
    if (filterType === 'category') {
      if (value === 'all') newSearchParams.delete('category')
      else newSearchParams.set('category', value)
      setSearchParams(newSearchParams)
    }
  }

  const handleSizeFilter = (size, checked) => {
    setFilters(prev => ({
      ...prev,
      sizes: checked ? [...prev.sizes, size] : prev.sizes.filter(s => s !== size),
    }))
  }

  const handleSortChange = newSortBy => {
    setSortBy(newSortBy)
    const newSearchParams = new URLSearchParams(searchParams)
    if (newSortBy === 'name') newSearchParams.delete('sortBy')
    else newSearchParams.set('sortBy', newSortBy)
    setSearchParams(newSearchParams)
  }

  const resetFilters = () => {
    setFilters({ category: 'all', priceRange: [0, 1000], sizes: [], colors: [] })
    setSortBy('name')
    setSearchParams({})
  }

  const getCategoryDisplayName = (category) => {
    switch (category) {
      case 'men': return "Men's Fashion"
      case 'women': return "Women's Fashion"
      case 'kids': return "Kids Collection"
      default: return "All Products"
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <div className="container py-5"><LoadingSpinner /></div>
  if (error) return <div className="container py-5 text-danger text-center">{error}</div>

  return (
    <>
      <Header />

      <section className="page-header">
        <Container>
          <div className="text-center">
            <h1>{getCategoryDisplayName(filters.category)}</h1>
            <p>
              {filters.category === 'all'
                ? 'Discover our premium collection'
                : `Explore our ${getCategoryDisplayName(filters.category).toLowerCase()}`}
            </p>
          </div>
        </Container>
      </section>

      <section className="shop-content py-5">
        <Container>
          <Row>
            <Col lg={3} className="mb-4">
              <Card className="filter-card">
                <Card.Header>
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0"><i className="fas fa-filter me-2"></i>Filters</h5>
                    <Button variant="link" size="sm" onClick={resetFilters} className="text-decoration-none p-0">
                      Clear All
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Category</h6>
                    <Form.Select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="mb-3"
                    >
                      <option value="all">All Categories</option>
                      <option value="men">Men's</option>
                      <option value="women">Women's</option>
                      <option value="kids">Kids</option>
                    </Form.Select>
                  </div>

                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Price Range</h6>
                    <Form.Range
                      min={0}
                      max={1000}
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                      className="mb-2"
                    />
                    <div className="price-display">
                      <small className="text-muted">
                        $0 - ${filters.priceRange[1]}
                      </small>
                    </div>
                  </div>

                  <div className="filter-section mb-4">
                    <h6 className="filter-title">Size</h6>
                    <div className="size-options">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                        <Form.Check
                          key={size}
                          type="checkbox"
                          id={`size-${size}`}
                          label={size}
                          checked={filters.sizes.includes(size)}
                          onChange={(e) => handleSizeFilter(size, e.target.checked)}
                          className="mb-2"
                        />
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={9}>
              <div className="sort-bar d-flex justify-content-between align-items-center mb-4">
                <div className="results-count">
                  <span className="text-muted">
                    Showing {paginatedData.products?.length || 0} of {filteredProducts.length} products
                    {filters.category !== 'all' && (<span> in {getCategoryDisplayName(filters.category)}</span>)}
                  </span>
                </div>
                <div className="sort-options d-flex align-items-center">
                  <label className="me-2 text-muted">Sort by:</label>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="name">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </Form.Select>
                </div>
              </div>

              <Row className="products-grid">
                {paginatedData.products?.length > 0 ? (
                  paginatedData.products.map(product => (
                    <Col md={6} lg={4} key={product.id} className="mb-4">
                      <ProductCard product={product} />
                    </Col>
                  ))
                ) : (
                  <Col xs={12}>
                    <div className="text-center py-5">
                      <i className="fas fa-search fa-3x text-muted mb-3"></i>
                      <h4 className="text-muted">No products found</h4>
                      <Button variant="outline-primary" onClick={resetFilters}>
                        Reset Filters
                      </Button>
                    </div>
                  </Col>
                )}
              </Row>

              {paginatedData.totalPages > 1 && (
                <div className="pagination-container d-flex justify-content-center mt-5">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${!paginatedData.hasPrevPage ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={!paginatedData.hasPrevPage}>
                          Previous
                        </button>
                      </li>
                      {[...Array(paginatedData.totalPages)].map((_, index) => {
                        const page = index + 1
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                          </li>
                        )
                      })}
                      <li className={`page-item ${!paginatedData.hasNextPage ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={!paginatedData.hasNextPage}>
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </>
  )
}

export default Shop