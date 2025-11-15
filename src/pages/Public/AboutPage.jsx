import FadeIn from "../../components/FadeIn";

const AboutPage = () => {
  return (
    <div className="text-gray-800">
      {/* 🌟 HERO */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-24">
        <FadeIn delay={0.1}>
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
              Về Chúng Tôi
            </h1>
            <p className="text-xl mt-6 max-w-3xl mx-auto text-blue-100">
              Nền tảng giao thương hiện đại – nơi doanh nghiệp kết nối, hợp tác và phát triển bền
              vững.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* 🚀 SỨ MỆNH */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sứ mệnh của chúng tôi
              </h2>

              <p className="text-lg text-gray-600 mb-4">
                Xây dựng hệ sinh thái giao thương minh bạch, hiệu quả và bền vững cho doanh nghiệp
                Việt Nam.
              </p>

              <p className="text-lg text-gray-600 mb-8">
                Mỗi sự kết nối là một cơ hội tạo ra giá trị cho xã hội và cộng đồng doanh nghiệp.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-blue-50 shadow-sm text-center">
                  <p className="text-3xl font-bold text-blue-600">5+</p>
                  <p className="text-gray-600 text-sm mt-1">Năm kinh nghiệm</p>
                </div>
                <div className="p-5 rounded-xl bg-green-50 shadow-sm text-center">
                  <p className="text-3xl font-bold text-green-600">10K+</p>
                  <p className="text-gray-600 text-sm mt-1">Doanh nghiệp tin dùng</p>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* TẦM NHÌN */}
          <FadeIn delay={0.2}>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-10 rounded-2xl shadow-xl backdrop-blur-md">
              <h3 className="text-2xl font-bold mb-4">Tầm nhìn 2030</h3>
              <p className="text-blue-100 mb-6">
                Trở thành nền tảng giao thương số 1 Đông Nam Á, kết nối 100.000+ doanh nghiệp.
              </p>

              <ul className="space-y-3">
                {["Công nghệ AI tiên tiến", "Mạng lưới toàn cầu", "Phát triển bền vững"].map(
                  (item, i) => (
                    <li key={i} className="flex items-center text-blue-50">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⭐ GIÁ TRỊ CỐT LÕI */}
      <section className="py-20 bg-gray-50">
        <FadeIn delay={0.1}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Giá trị cốt lõi</h2>
              <p className="text-lg text-gray-600 mt-3">Nền tảng hình thành văn hóa doanh nghiệp</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Tận tâm",
                  desc: "Luôn lắng nghe doanh nghiệp.",
                  color: "bg-blue-100 text-blue-600",
                },
                {
                  title: "Chính trực",
                  desc: "Minh bạch & rõ ràng.",
                  color: "bg-green-100 text-green-600",
                },
                {
                  title: "Đổi mới",
                  desc: "Ứng dụng công nghệ tiên tiến.",
                  color: "bg-purple-100 text-purple-600",
                },
                {
                  title: "Hợp tác",
                  desc: "Cùng nhau tạo giá trị lớn.",
                  color: "bg-orange-100 text-orange-600",
                },
              ].map((v, i) => (
                <div
                  key={i}
                  className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer"
                >
                  <div
                    className={`w-16 h-16 ${v.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <span className="text-2xl font-bold">★</span>
                  </div>
                  <h3 className="text-lg font-bold text-center">{v.title}</h3>
                  <p className="text-sm mt-2 text-gray-600 text-center">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 📌 TIMELINE */}
      <section className="py-24 bg-gray-50">
        <FadeIn delay={0.1}>
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Hành trình phát triển
            </h2>

            <div className="relative border-l-4 border-blue-600 pl-6 space-y-14">
              {[
                { year: "2019", text: "Thành lập và xây dựng nền tảng kết nối." },
                { year: "2021", text: "5,000+ doanh nghiệp đăng ký." },
                { year: "2023", text: "Tích hợp AI Matching thông minh." },
                { year: "2025", text: "Mở rộng ra thị trường Đông Nam Á." },
              ].map((item, i) => (
                <div key={i}>
                  <h3 className="text-xl font-semibold">{item.year}</h3>
                  <p className="text-gray-600 mt-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 👥 TEAM */}
      <section className="py-20 bg-white">
        <FadeIn delay={0.1}>
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Đội ngũ lãnh đạo</h2>
              <p className="text-lg text-gray-600">
                Những con người đứng sau thành công của nền tảng
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { name: "Nguyễn Văn A", position: "CEO & Founder" },
                { name: "Trần Thị B", position: "CTO" },
                { name: "Lê Văn C", position: "Head of Business" },
              ].map((p, i) => (
                <div key={i} className="text-center group">
                  <div className="relative w-36 h-36 mx-auto mb-4">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                      className="w-full h-full rounded-full ring-4 ring-blue-200 shadow-lg object-cover group-hover:ring-blue-400 transition"
                    />
                  </div>

                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <p className="text-blue-600 font-medium">{p.position}</p>
                  <p className="text-gray-600 text-sm mt-2">
                    10+ năm kinh nghiệm trong lĩnh vực chuyên môn
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default AboutPage;
