import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(0)

  const faqs = [
    {
      question: "How can I become a vendor on the app?",
      answer: "Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.",
    },
    {
      question: "Is there a way I can reach out to the seller directly?",
      answer: "Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.",
    },
    {
      question: "What if I want a refund?",
      answer: "Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.",
    },
    {
      question: "Can I request for a particular material?",
      answer: "Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently asked question</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FAQ Accordion */}
          <div className="md:col-span-2 space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 text-left">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-gray-400 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help Card */}
          <div className="border border-gray-200 rounded-lg p-8 bg-white flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <HelpCircle size={32} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Do you have more questions?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Lorem ipsum dolor sit amet consectetur. Quam libero velit faucibus consequuntur.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
              Send a direct mail
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
