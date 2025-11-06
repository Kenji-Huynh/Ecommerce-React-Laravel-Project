// Mock data cho products - sẽ được thay thế bằng API call thực tế
export const mockProducts = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    category: "men",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    rating: 4.5,
    reviewCount: 24,
    isOnSale: true,
    isNew: false,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Navy"],
    description: "Premium quality cotton t-shirt with modern fit"
  },
  {
    id: 2,
    name: "Casual Denim Jacket",
    category: "men",
    price: 89.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?w=400&h=500&fit=crop",
    rating: 4.8,
    reviewCount: 16,
    isOnSale: false,
    isNew: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blue", "Black"],
    description: "Classic denim jacket for casual everyday wear"
  },
  {
    id: 3,
    name: "Elegant Dress",
    category: "women",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
    rating: 4.7,
    reviewCount: 32,
    isOnSale: true,
    isNew: false,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Red"],
    description: "Elegant dress perfect for special occasions"
  },
  {
    id: 4,
    name: "Cozy Sweater",
    category: "women",
    price: 59.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    rating: 4.3,
    reviewCount: 18,
    isOnSale: false,
    isNew: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Pink", "Gray"],
    description: "Soft and cozy sweater for chilly days"
  },
  {
    id: 5,
    name: "Kids Fun T-Shirt",
    category: "kids",
    price: 19.99,
    originalPrice: 24.99,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop",
    rating: 4.6,
    reviewCount: 28,
    isOnSale: true,
    isNew: false,
    sizes: ["2T", "3T", "4T", "5T", "6T"],
    colors: ["Blue", "Red", "Yellow"],
    description: "Colorful and fun t-shirt for active kids"
  },
  {
    id: 6,
    name: "Classic Jeans",
    category: "men",
    price: 69.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    rating: 4.4,
    reviewCount: 41,
    isOnSale: false,
    isNew: false,
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["Blue", "Black"],
    description: "Classic fit jeans for everyday comfort"
  },
  {
    id: 7,
    name: "Summer Blouse",
    category: "women",
    price: 45.99,
    originalPrice: 55.99,
    image: "https://images.unsplash.com/photo-1564993719576-7b00be5b55d9?w=400&h=500&fit=crop",
    rating: 4.5,
    reviewCount: 22,
    isOnSale: true,
    isNew: false,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
    description: "Light and airy summer blouse"
  },
  {
    id: 8,
    name: "Kids Hoodie",
    category: "kids",
    price: 34.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop",
    rating: 4.7,
    reviewCount: 15,
    isOnSale: false,
    isNew: true,
    sizes: ["4", "6", "8", "10", "12"],
    colors: ["Gray", "Navy", "Red"],
    description: "Comfortable hoodie for kids outdoor activities"
  },
  {
    id: 9,
    name: "Business Shirt",
    category: "men",
    price: 49.99,
    originalPrice: 65.99,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
    rating: 4.6,
    reviewCount: 38,
    isOnSale: true,
    isNew: false,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Light Blue"],
    description: "Professional business shirt for office wear"
  },
  {
    id: 10,
    name: "Stylish Skirt",
    category: "women",
    price: 39.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=400&h=500&fit=crop",
    rating: 4.2,
    reviewCount: 19,
    isOnSale: false,
    isNew: true,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Brown"],
    description: "Stylish skirt perfect for any occasion"
  },
  {
    id: 11,
    name: "Kids Dress",
    category: "kids",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop",
    rating: 4.8,
    reviewCount: 25,
    isOnSale: true,
    isNew: false,
    sizes: ["2T", "3T", "4T", "5T", "6T", "7", "8"],
    colors: ["Pink", "Purple", "White"],
    description: "Beautiful dress for special occasions"
  },
  {
    id: 12,
    name: "Casual Polo",
    category: "men",
    price: 35.99,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop",
    rating: 4.4,
    reviewCount: 33,
    isOnSale: false,
    isNew: false,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "White", "Green"],
    description: "Comfortable polo shirt for casual wear"
  }
]

// Helper functions để filter và sort products
export const filterProducts = (products, filters) => {
  let filtered = [...products]

  // Filter by category
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(product => product.category === filters.category)
  }

  // Filter by price range
  if (filters.priceRange && filters.priceRange.length === 2) {
    const [minPrice, maxPrice] = filters.priceRange
    filtered = filtered.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    )
  }

  // Filter by sizes
  if (filters.sizes && filters.sizes.length > 0) {
    filtered = filtered.filter(product =>
      product.sizes.some(size => filters.sizes.includes(size))
    )
  }

  // Filter by colors
  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter(product =>
      product.colors.some(color => filters.colors.includes(color))
    )
  }

  return filtered
}

export const sortProducts = (products, sortBy) => {
  const sorted = [...products]

  switch (sortBy) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    case 'newest':
      return sorted.sort((a, b) => b.isNew - a.isNew)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    default:
      return sorted
  }
}

// Pagination helper
export const paginateProducts = (products, page = 1, itemsPerPage = 9) => {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  return {
    products: products.slice(startIndex, endIndex),
    totalPages: Math.ceil(products.length / itemsPerPage),
    currentPage: page,
    totalItems: products.length,
    hasNextPage: endIndex < products.length,
    hasPrevPage: page > 1
  }
}