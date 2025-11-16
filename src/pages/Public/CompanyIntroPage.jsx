import { Link, useParams } from "react-router-dom";
import { FiPhone, FiMail, FiMessageCircle, FiCheckCircle, FiArrowLeft } from "react-icons/fi";

const CompanyIntroPage = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* BACK BUTTON */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <Link
          to={`/company/${slug}`}
          className="inline-flex items-center gap-2 text-blue-700 font-semibold hover:underline"
        >
          <FiArrowLeft size={20} /> Quay lại trang công ty
        </Link>
      </div>

      {/* HEADER BANNER */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 px-6 mt-4 rounded-b-3xl shadow-xl">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Giới thiệu về <span className="text-yellow-300">{slug}</span>
          </h1>

          <p className="text-blue-100 text-lg max-w-3xl mx-auto leading-relaxed">
            Chúng tôi là đơn vị tiên phong trong lĩnh vực thương mại & dịch vụ, mang đến giải pháp
            hiện đại và tối ưu cho hàng triệu khách hàng trên toàn quốc.
          </p>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* TEXT */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Tổng quan doanh nghiệp</h2>

            <p className="text-gray-700 leading-relaxed">
              <strong>{slug}</strong> được thành lập với mục tiêu mang đến các sản phẩm chất lượng
              và dịch vụ uy tín. Chúng tôi không ngừng cải tiến, ứng dụng công nghệ tiên tiến để đem
              lại lợi ích cao nhất cho khách hàng.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Với đội ngũ chuyên nghiệp và quy trình vận hành chuẩn hóa, chúng tôi tự tin mang đến
              sự hài lòng vượt mong đợi.
            </p>
          </div>

          {/* IMAGE - AI */}
          <div className="relative">
            <div className="absolute w-full h-full bg-blue-300/20 blur-2xl rounded-3xl"></div>

            <img
              src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?q=80&w=1600"
              alt="Company intro"
              className="relative rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* VISION – MISSION */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900">Tầm nhìn – Sứ mệnh – Giá trị cốt lõi</h2>
          <p className="text-gray-600 mt-4">
            Những nguyên tắc tạo nên bản sắc và sự phát triển của chúng tôi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {/* Vision */}
          <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Tầm nhìn</h3>
            <p className="text-gray-700 leading-relaxed">
              Trở thành doanh nghiệp dẫn đầu trong ngành, mang đến chất lượng và đổi mới bền vững.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Sứ mệnh</h3>
            <p className="text-gray-700 leading-relaxed">
              Phục vụ khách hàng bằng tâm huyết, sự sáng tạo và tinh thần trách nhiệm cao nhất.
            </p>
          </div>

          {/* Core values */}
          <div className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Giá trị cốt lõi</h3>

            <ul className="space-y-3 mt-4">
              {["Uy tín", "Tận tâm", "Sáng tạo", "Hiệu quả"].map((val, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <FiCheckCircle className="text-green-600" />
                  {val}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20 bg-blue-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>
        <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10">
          Hãy liên hệ để được tư vấn và hỗ trợ từ đội ngũ <strong>{slug}</strong>.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg hover:bg-white/20 transition shadow">
            <FiMessageCircle className="text-white text-4xl mx-auto mb-3" />
            <p className="font-semibold">Zalo</p>
            <span className="text-blue-200">0123 456 789</span>
          </div>

          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg hover:bg-white/20 transition shadow">
            <FiPhone className="text-white text-4xl mx-auto mb-3" />
            <p className="font-semibold">Hotline</p>
            <span className="text-blue-200">0909 999 999</span>
          </div>

          <div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg hover:bg-white/20 transition shadow">
            <FiMail className="text-white text-4xl mx-auto mb-3" />
            <p className="font-semibold">Email</p>
            <span className="text-blue-200">support@company.vn</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CompanyIntroPage;
