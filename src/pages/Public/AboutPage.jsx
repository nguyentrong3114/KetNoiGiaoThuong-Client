import React from "react";
import FadeIn from "../../components/FadeIn";
import {
  Target,
  Globe,
  ShieldCheck,
  Users,
  Lightbulb,
  Briefcase,
  TrendingUp,
  Award,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
      {/* 🌟 HERO SECTION - Thu gọn chiều cao (py-32 -> py-24) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>

        <FadeIn delay={0.1}>
          <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-sm font-semibold mb-6">
              Về Chúng Tôi
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-6 drop-shadow-2xl">
              Kiến tạo tương lai <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Giao thương số
              </span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto font-light leading-relaxed">
              Nền tảng kết nối doanh nghiệp toàn diện, nơi cơ hội được chia sẻ và giá trị bền vững
              được thiết lập.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* 🚀 MISSION & VISION - Asymmetric Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-10 items-center">
          {/* Sứ mệnh (Chiếm 7 phần) */}
          <div className="lg:col-span-7 space-y-6">
            <FadeIn delay={0.1}>
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-slate-900">Sứ mệnh của chúng tôi</h2>
              </div>

              <p className="text-lg text-slate-600 leading-relaxed">
                Chúng tôi cam kết xây dựng một hệ sinh thái giao thương{" "}
                <strong>minh bạch, hiệu quả và không biên giới</strong>. Giúp các doanh nghiệp Việt
                Nam không chỉ kết nối trong nước mà còn vươn tầm ra thị trường quốc tế.
              </p>

              {/* STATS CARDS - Đã thu nhỏ kích thước (padding, icon, text) */}
              <div className="grid sm:grid-cols-2 gap-5 mt-6">
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow shadow-slate-200/50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                    <Award className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900">5+</p>
                  <p className="text-slate-500 font-medium text-sm">Năm kinh nghiệm</p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow shadow-slate-200/50 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900">10K+</p>
                  <p className="text-slate-500 font-medium text-sm">Đối tác tin cậy</p>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Tầm nhìn (Chiếm 5 phần) */}
          <div className="lg:col-span-5">
            <FadeIn delay={0.2}>
              {/* VISION CARD - Đã thu nhỏ padding (p-10 -> p-8) */}
              <div className="relative bg-slate-900 text-white p-8 rounded-2xl shadow-2xl overflow-hidden">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-bold">Tầm nhìn 2030</h3>
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed text-sm md:text-base">
                    Trở thành nền tảng B2B số 1 Đông Nam Á, là cầu nối cho hơn{" "}
                    <strong>100.000+</strong> doanh nghiệp giao thương tự do.
                  </p>

                  <ul className="space-y-3">
                    {[
                      { text: "Tiên phong công nghệ AI Matching", color: "text-blue-300" },
                      { text: "Mạng lưới Logistics toàn cầu", color: "text-purple-300" },
                      { text: "Phát triển kinh tế xanh bền vững", color: "text-green-300" },
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center bg-white/5 p-2.5 rounded-lg border border-white/10 backdrop-blur-sm"
                      >
                        <TrendingUp className={`w-4 h-4 mr-3 ${item.color}`} />
                        <span className="font-medium text-sm">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ⭐ CORE VALUES */}
      <section className="py-20 bg-white">
        <FadeIn delay={0.1}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12 max-w-2xl mx-auto">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-xs md:text-sm">
                Văn hóa doanh nghiệp
              </span>
              <h2 className="text-3xl font-bold mt-2 text-slate-900">Giá trị cốt lõi</h2>
              <p className="text-base text-slate-500 mt-3">
                Những nguyên tắc định hình cách chúng tôi làm việc và phục vụ khách hàng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Tận tâm",
                  desc: "Đặt khách hàng làm trọng tâm trong mọi hành động.",
                  icon: Users,
                  color: "bg-blue-50 text-blue-600",
                  border: "border-blue-100",
                },
                {
                  title: "Chính trực",
                  desc: "Minh bạch về thông tin, rõ ràng trong cam kết.",
                  icon: ShieldCheck,
                  color: "bg-emerald-50 text-emerald-600",
                  border: "border-emerald-100",
                },
                {
                  title: "Đổi mới",
                  desc: "Không ngừng cải tiến công nghệ và quy trình.",
                  icon: Lightbulb,
                  color: "bg-amber-50 text-amber-600",
                  border: "border-amber-100",
                },
                {
                  title: "Hợp tác",
                  desc: "Cùng nhau phát triển, chia sẻ lợi ích bền vững.",
                  icon: Briefcase,
                  color: "bg-indigo-50 text-indigo-600",
                  border: "border-indigo-100",
                },
              ].map((v, i) => (
                <div
                  key={i}
                  className={`group p-6 bg-white rounded-2xl border ${v.border} hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2`}
                >
                  <div
                    className={`w-12 h-12 ${v.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <v.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 📌 TIMELINE */}
      <section className="py-20 bg-slate-50">
        <FadeIn delay={0.1}>
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
              Hành trình phát triển
            </h2>

            <div className="relative border-l-2 border-slate-200 ml-4 md:ml-1/2 space-y-10">
              {[
                {
                  year: "2019",
                  title: "Khởi tạo",
                  text: "Thành lập công ty và ra mắt phiên bản Beta.",
                },
                {
                  year: "2021",
                  title: "Tăng trưởng",
                  text: "Đạt mốc 5,000+ doanh nghiệp thành viên.",
                },
                {
                  year: "2023",
                  title: "Đột phá công nghệ",
                  text: "Tích hợp AI Matching thông minh vào nền tảng.",
                },
                {
                  year: "2025",
                  title: "Vươn ra biển lớn",
                  text: "Mở rộng văn phòng tại Singapore & Thái Lan.",
                },
              ].map((item, i) => (
                <div key={i} className="relative pl-8 md:pl-0">
                  {/* Dot on line */}
                  <div className="absolute top-1 left-[-5px] md:left-1/2 md:-ml-[5px] w-3 h-3 bg-blue-600 rounded-full ring-4 ring-blue-100"></div>

                  <div
                    className={`md:flex items-center justify-between w-full ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    <div className="hidden md:block w-5/12"></div> {/* Spacer */}
                    <div className="w-full md:w-5/12 bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition">
                      <span className="text-blue-600 font-bold text-lg block mb-1">
                        {item.year}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-sm">{item.text}</p>
                    </div>
                  </div>
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
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Ban Lãnh Đạo</h2>
              <p className="text-base text-slate-500 mt-3 max-w-2xl mx-auto">
                Những thuyền trưởng tài năng và tâm huyết dẫn dắt con tàu doanh nghiệp.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Trần Kiến Quốc", position: "CEO & Founder", imgSeed: "Felix" },
                { name: "Nguyễn Thảo Vy", position: "Chief Technology Officer", imgSeed: "Aidan" },
                { name: "Phạm Đức Minh", position: "Head of Growth", imgSeed: "Aneka" },
              ].map((p, i) => (
                <div key={i} className="group relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-2xl rotate-1 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="relative bg-white border border-slate-100 p-6 rounded-2xl shadow-lg shadow-slate-200/50 text-center transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="w-28 h-28 mx-auto mb-5 relative">
                      <div className="absolute inset-0 bg-blue-100 rounded-full scale-90 group-hover:scale-100 transition-transform duration-500"></div>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.imgSeed}`}
                        alt={p.name}
                        className="relative w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                    <p className="text-blue-600 font-semibold text-xs uppercase tracking-wide mt-1 mb-3">
                      {p.position}
                    </p>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Hơn 15 năm kinh nghiệm quản lý cấp cao tại các tập đoàn công nghệ đa quốc gia.
                    </p>
                  </div>
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
