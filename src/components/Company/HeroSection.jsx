import { CheckCircle } from "lucide-react"

const HeroSection = () => {
  return (
    <section className="bg-blue-300 py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-12 text-sm">
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 text-gray-700">
            <CheckCircle size={16} className="text-blue-600" />
            <span>Free Register</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 text-gray-700">
            <CheckCircle size={16} className="text-blue-600" />
            <span>Great Service</span>
          </div>
          <div className="bg-white rounded-full px-4 py-2 flex items-center gap-2 text-gray-700">
            <CheckCircle size={16} className="text-blue-600" />
            <span>Easy payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Getting the best and latest style has never <span className="text-orange-500">been easier!</span>
            </h1>
            <p className="text-gray-700 mb-8">
              <span className="font-semibold">FashionForAll</span> is a platform that helps to make fashion accessible
              to all. It brings fashion to your doorstep!
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Shop collections
              </button>
              <button className="border-2 border-red-500 text-red-500 hover:bg-red-50 font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Watch reviews
              </button>
            </div>
          </div>

          {/* Right Content - Images */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full h-80">
              {/* Main circular image */}
              <div className="absolute left-0 top-0 w-48 h-48 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <img src="/woman-in-colorful-dress.jpg" alt="Model 1" className="w-40 h-40 rounded-full object-cover" />
              </div>

              {/* Secondary circular image */}
              <div className="absolute right-0 top-12 w-40 h-40 bg-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <img src="" alt="Model 2" className="w-32 h-32 rounded-full object-cover" />
              </div>

              {/* Small product images */}
              <div className="absolute bottom-0 left-8 flex gap-2">
                <div className="w-16 h-16 bg-gray-300 rounded-lg border-2 border-white shadow-md"></div>
                <div className="w-16 h-16 bg-gray-300 rounded-lg border-2 border-white shadow-md"></div>
                <div className="w-16 h-16 bg-gray-300 rounded-lg border-2 border-white shadow-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
