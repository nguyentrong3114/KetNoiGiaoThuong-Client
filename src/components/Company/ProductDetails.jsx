const ProductDetails = () => {
  return (
    <div className="w-full">
      {/* Left Column - Specs and Description */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">A-shaped gown</h3>
        <p className="text-gray-600 mb-6">VN 400.000</p>

        {/* Specifications Table */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Size</td>
                <td className="py-3 text-gray-900">Free size</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Material</td>
                <td className="py-3 text-gray-900">Ankara</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Style</td>
                <td className="py-3 text-gray-900">Vintage</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Weight (kg/m)</td>
                <td className="py-3 text-gray-900">Medium solid</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Pattern and print</td>
                <td className="py-3 text-gray-900">Printed</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Occasion</td>
                <td className="py-3 text-gray-900">Casual</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Fit</td>
                <td className="py-3 text-gray-900">TBU</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Closure</td>
                <td className="py-3 text-gray-900">Natural elastic</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-600 font-medium">Dimension</td>
                <td className="py-3 text-gray-900">1917/1987</td>
              </tr>
              <tr>
                <td className="py-3 text-gray-600 font-medium">Product Type</td>
                <td className="py-3 text-gray-900">
                  <a href="#" className="text-blue-600 underline">Request for measurement</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          Lorem ipsum dolor sit amet, consectetur. Quam nihil impedit quo minus id quod maxime placeat facere possimus,
          omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut
          rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Add to cart
          </button>
          <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Pay immediately
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
