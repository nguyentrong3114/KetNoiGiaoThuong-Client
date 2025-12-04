import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  // ❗ XÓA DEMO — THAY BẰNG MẢNG RỖNG
  const faqs = [];

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Câu hỏi thường gặp</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FAQ list */}
          <div className="md:col-span-2 space-y-4">
            {/* Nếu chưa có FAQ */}
            {faqs.length === 0 && (
              <p className="text-gray-500 text-sm italic">Chưa có câu hỏi nào trong hệ thống.</p>
            )}

            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg bg-white overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <span className="font-medium text-gray-900 text-left">{faq.question}</span>

                  <ChevronDown
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help card */}
          <div className="border border-gray-200 rounded-lg p-8 bg-white text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <HelpCircle size={32} className="text-gray-400" />
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">Bạn cần thêm hỗ trợ?</h3>

            <p className="text-sm text-gray-600 mb-6">
              Hãy liên hệ đội ngũ chăm sóc khách hàng của chúng tôi.
            </p>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition">
              Gửi email hỗ trợ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
