import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Auction/Card";
import Modal from "../../components/Modal";
import FadeIn from "../../components/FadeIn"; // ⭐ IMPORT ANIMATION

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const featureRef = useRef(null);

  const features = [
    {
      title: "Mạng lưới rộng khắp",
      desc: "Kết nối với hàng nghìn doanh nghiệp trên toàn quốc, mở rộng cơ hội hợp tác.",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857..."
          />
        </svg>
      ),
    },
    {
      title: "Đáng tin cậy",
      desc: "Hệ thống xác minh chặt chẽ, đảm bảo chất lượng và uy tín của đối tác.",
      color: "bg-green-100",
      iconColor: "text-green-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2..."
          />
        </svg>
      ),
    },
    {
      title: "Hiệu quả cao",
      desc: "Công nghệ AI giúp tối ưu hóa việc tìm kiếm và kết nối đối tác phù hợp.",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7..."
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ⭐ HERO SECTION (có FadeIn) */}
      <FadeIn delay={0.1}>
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')] opacity-10"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              Kết nối doanh nghiệp
              <br />
              <span className="text-blue-200 font-semibold">Phát triển bền vững</span>
            </h1>

            <p className="text-lg md:text-xl mb-10 text-blue-50 max-w-3xl mx-auto leading-relaxed">
              Nền tảng giao thương hàng đầu Việt Nam...
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => featureRef.current?.scrollIntoView({ behavior: "smooth" })}
              >
                Bắt đầu ngay
              </Button>

              <Link to="/about">
                <Button variant="outline" size="lg">
                  Tìm hiểu thêm
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ⭐ FEATURES SECTION (FadeIn) */}
      <FadeIn delay={0.15}>
        <section ref={featureRef} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-lg text-gray-600 mb-16">
              Chúng tôi cung cấp giải pháp toàn diện để kết nối và phát triển kinh doanh
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-16 h-16 ${f.color} ${f.iconColor} rounded-full 
                    flex items-center justify-center mx-auto mb-6`}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{f.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ⭐ STATS SECTION (FadeIn) */}
      <FadeIn delay={0.2}>
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Thành tựu của chúng tôi</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { num: "10,000+", text: "Doanh nghiệp tham gia", color: "text-blue-600" },
                { num: "50,000+", text: "Giao dịch thành công", color: "text-green-600" },
                { num: "5 năm", text: "Kinh nghiệm hoạt động", color: "text-purple-600" },
                { num: "24/7", text: "Hỗ trợ khách hàng", color: "text-orange-600" },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-lg hover:bg-gray-50 transition">
                  <div className={`text-4xl font-extrabold ${item.color} mb-2`}>{item.num}</div>
                  <p className="text-gray-700 font-medium">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ⭐ CTA SECTION (FadeIn) */}
      <FadeIn delay={0.25}>
        <section className="py-20 bg-blue-700 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Tham gia cộng đồng doanh nghiệp lớn nhất Việt Nam ngay hôm nay
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button variant="outline" size="lg">
                Đăng ký miễn phí
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="primary" size="lg">
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </section>
      </FadeIn>

      {/* MODAL */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Thông tin thêm">
        <p className="text-gray-700 leading-relaxed">
          Nền tảng <strong>Kết Nối Giao Thương</strong> giúp doanh nghiệp Việt Nam...
        </p>
      </Modal>
    </div>
  );
};

export default HomePage;
