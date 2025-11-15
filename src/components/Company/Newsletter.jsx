import { ArrowRight } from "lucide-react"
import { useState } from "react"

const Newsletter = () => {
  const [email, setEmail] = useState("")

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto bg-blue-500 rounded-2xl p-8 md:p-12">
        <h2 className="text-white text-center font-semibold mb-8 text-lg">
          Sign Up Now So Your Selected Item Are Saved To Your Personal Cart.
        </h2>

        <div className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none border-0"
          />
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg transition-colors whitespace-nowrap flex items-center justify-center gap-2">
            Sign up now
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
