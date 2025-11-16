import { FiPhone, FiMail, FiMessageCircle } from "react-icons/fi";

const ContactCompany = () => {
  return (
    <section className="py-20 bg-blue-700 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>

        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-10">
          Nếu bạn có nhu cầu hợp tác hoặc cần tư vấn thêm, vui lòng liên hệ qua các kênh sau:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition text-center">
            <FiMessageCircle className="text-white text-4xl mx-auto mb-3" />
            <p className="font-semibold">Chat Zalo</p>
            <a
              href="https://zalo.me/0123456789"
              target="_blank"
              className="text-blue-200 underline mt-1 block"
            >
              0123 456 789
            </a>
          </div>

          <div className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition text-center">
            <FiPhone className="text-white text-4xl mx-auto mb-3" />
            <p className="font-semibold">Hotline</p>
            <span className="text-blue-200 mt-1 block">0909 999 999</span>
          </div>

          <div className="bg-white/10 p-6 rounded-xl hover:bg-white/20 transition text-center">
            <FiMail className="text-white text-4xl mx-auto mb-3" />
            <p className="font-semibold">Email hỗ trợ</p>
            <a href="mailto:support@company.vn" className="text-blue-200 underline mt-1 block">
              support@company.vn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCompany;
