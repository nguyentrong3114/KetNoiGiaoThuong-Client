import { ArrowRight } from "lucide-react"

const PromoBanner = () => {
  return (
    <section className="py-12 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded-3xl overflow-hidden p-8 md:p-12 relative">
          {/* Geometric shapes background */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-700 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-10 translate-x-1/3 translate-y-1/3"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
            {/* Left - Image */}
            <div className="flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <img
                    src=""
                    alt="Trendy Styles"
                    className="w-56 h-56 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="bg-purple-100 rounded-2xl p-8 md:p-10">
              <h3 className="text-orange-500 font-semibold text-lg mb-2">Trendy Styles..</h3>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-4">Thousands Styles More!</h2>
              <p className="text-gray-700 text-sm mb-8">
                Having a pet means you have more joy, a new friend, a happy person who will always be with you to have
                fun. We have 200+ different pets that can meet your needs!
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                  Shop collections
                  <ArrowRight size={18} />
                </button>
                <button className="border-2 border-red-500 text-red-500 hover:bg-red-50 font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  See How it Works
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
