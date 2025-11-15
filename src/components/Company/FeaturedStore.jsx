"use client"

import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ShoppingCart, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"

const FeaturedStore = ({ maxProducts = 8, showViewAll = true }) => {
  const { slug } = useParams()
  const [selectedGender, setSelectedGender] = useState([])
  const [selectedAgeGroup, setSelectedAgeGroup] = useState([])
  const [selectedSize, setSelectedSize] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)

  const products = [
    {
      id: 1,
      name: "Blouse and belted skirt",
      image: "",
      price: "₦300,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 2,
      name: "Pink ankara mixed gown",
      image: "",
      price: "₦300,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 3,
      name: "A-shaped gown",
      image: "",
      price: "₦300,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 4,
      name: "Blouse and belted skirt",
      image: "",
      price: "₦300,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 5,
      name: "Ankara suit",
      image: "",
      price: "₦300,000",
      gender: "Male",
      ageGroup: "Adult",
    },
    {
      id: 6,
      name: "Brown ball gown",
      image: "",
      price: "₦300,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 7,
      name: "Male Suit",
      image: "",
      price: "₦300,000",
      gender: "Male",
      ageGroup: "Adult",
    },
    {
      id: 8,
      name: "Flared gown",
      image: "",
      price: "₦300,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 9,
      name: "Casual shirt",
      image: "",
      price: "₦250,000",
      gender: "Male",
      ageGroup: "Adult",
    },
    {
      id: 10,
      name: "Evening dress",
      image: "",
      price: "₦350,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 11,
      name: "Denim jacket",
      image: "",
      price: "₦280,000",
      gender: "Male",
      ageGroup: "Adult",
    },
    {
      id: 12,
      name: "Summer dress",
      image: "",
      price: "₦320,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 13,
      name: "Business suit",
      image: "",
      price: "₦400,000",
      gender: "Male",
      ageGroup: "Adult",
    },
    {
      id: 14,
      name: "Party gown",
      image: "",
      price: "₦380,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 15,
      name: "Sports jacket",
      image: "",
      price: "₦290,000",
      gender: "Male",
      ageGroup: "Adult",
    },
    {
      id: 16,
      name: "Cocktail dress",
      image: "",
      price: "₦360,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 17,
      name: "Polo shirt",
      image: "",
      price: "₦200,000",
      gender: "Male",
      ageGroup: "Adult",
    },
    {
      id: 18,
      name: "Maxi dress",
      image: "",
      price: "₦340,000",
      gender: "Female",
      ageGroup: "Adult",
    },
    {
      id: 19,
      name: "Blazer",
      image: "",
      price: "₦420,000",
      gender: "Male",
      ageGroup: "Adult",
    },
    {
      id: 20,
      name: "Designer gown",
      image: "",
      price: "₦500,000",
      gender: "Female",
      ageGroup: "Adult",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our featured store</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="md:col-span-1">
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900">Filter</h3>

              {/* Gender Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Gender</h4>
                <div className="space-y-2">
                  {["Male", "Female"].map((gender) => (
                    <label key={gender} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGender.includes(gender)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGender([...selectedGender, gender])
                          } else {
                            setSelectedGender(selectedGender.filter((g) => g !== gender))
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age Group Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Age group</h4>
                <div className="space-y-2">
                  {["Adult", "Children"].map((age) => (
                    <label key={age} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAgeGroup.includes(age)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAgeGroup([...selectedAgeGroup, age])
                          } else {
                            setSelectedAgeGroup(selectedAgeGroup.filter((a) => a !== age))
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Size</h4>
                <div className="space-y-2">
                  {["Small", "Medium", "Large"].map((size) => (
                    <label key={size} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSize.includes(size)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSize([...selectedSize, size])
                          } else {
                            setSelectedSize(selectedSize.filter((s) => s !== size))
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-semibold text-gray-900">Ankara styles</h3>
                <p className="text-sm text-gray-600">Male & Female</p>
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white">
                <option>Sort by: Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {products.slice(0, maxProducts).map((product) => (
                <Link 
                  key={product.id} 
                  to={`/company/${slug}/product/${product.id}`}
                  className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative bg-gray-200 h-48 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">{product.name}</h4>
                    <p className="text-xs text-gray-600 mb-3">
                      {product.gender} • {product.ageGroup}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{product.price}</span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          // Add to cart logic here
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                {[1, 2, 3, 4, "...", 28].map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                      page === 1
                        ? "bg-blue-600 text-white"
                        : page === "..."
                          ? "text-gray-600 cursor-default"
                          : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>
              {showViewAll && (
                <Link 
                  to={`/company/${slug}/product`}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
                >
                  View all
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedStore
