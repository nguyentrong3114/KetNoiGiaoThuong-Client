import React from "react";
import FadeIn from "../../components/FadeIn";
import { Link } from "react-router-dom";

const ContactPage = () => {
  return (
    <div className="bg-gray-50">
      {/* 🌟 HERO */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-20">
        <FadeIn delay={0.1}>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">Liên hệ với chúng tôi</h1>
            <p className="text-blue-100 mt-4 text-lg max-w-2xl mx-auto">
              Đội ngũ hỗ trợ luôn sẵn sàng đồng hành cùng bạn 24/7.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* 📞 THÔNG TIN LIÊN HỆ */}
      <section className="py-16">
        <FadeIn delay={0.15}>
          <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>

              <div className="space-y-5 text-gray-700">
                <p>
                  <strong>📍 Địa chỉ:</strong> 12 Nguyễn Văn Bảo, Gò Vấp, TP. Hồ Chí Minh
                </p>
                <p>
                  <strong>📞 Hotline:</strong> 1900 1234
                </p>
                <p>
                  <strong>📧 Email:</strong> support@ketnoigiaothuong.vn
                </p>
                <p>
                  <strong>⏰ Giờ làm việc:</strong> 08:00 – 21:00 (Thứ 2 – Chủ nhật)
                </p>
              </div>

              {/* Nút Chat */}
              <div className="mt-10">
                <Link
                  to="/chat"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition shadow-md"
                >
                  💬 Chat hỗ trợ ngay
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white shadow-lg p-8 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Gửi thông tin cho chúng tôi</h3>

              <form className="space-y-5">
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <textarea
                  rows="4"
                  placeholder="Nội dung liên hệ"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                ></textarea>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Gửi yêu cầu
                </button>
              </form>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* MAP */}
      <section>
        <FadeIn delay={0.2}>
          <iframe
            title="map"
            src="https://maps.google.com/maps?q=Nguyen%20Van%20Bao%20Go%20Vap&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-72 border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </FadeIn>
      </section>
    </div>
  );
};

export default ContactPage;
