'use client'

import { useState } from 'react'

const ProductShowcase = () => {
  const [currentImage, setCurrentImage] = useState(0)

  const images = [
    '',
    '',
    '',
    '',
  ]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="px-0 mx-0 my-0 py-0">
      {/* Main Product Image */}
      <div className="relative bg-gradient-to-br from-pink-200 via-pink-100 to-purple-200 rounded-2xl overflow-hidden mb-6">
        <div className="aspect-square flex items-center justify-center">
          <img
            src={images[currentImage] || "/placeholder.svg"}
            alt="Product"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Product Title and Price */}
      <h2 className="text-xl font-semibold text-gray-900 text-left mb-2">A-shaped gown</h2>
      <p className="text-sm text-gray-600 mb-4">by Fashion-4</p>
      <p className="text-2xl font-bold text-red-600 mb-6">VN 400.000</p>

      {/* Thumbnail Images */}
      <div className="flex gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
              idx === currentImage ? 'border-blue-600' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img src={img || "/placeholder.svg"} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProductShowcase
