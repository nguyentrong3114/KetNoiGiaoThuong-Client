import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  User,
  AtSign,
  AlignLeft,
} from "lucide-react";
import FadeIn from "../../components/FadeIn";

const ContactPage = () => {
  /* ============================
     HELPER: Contact Info Item
  ============================ */
  const ContactItem = ({ icon: Icon, title, content, colorClass }) => (
    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100 group">
      <div
        className={`p-3 rounded-full shrink-0 ${colorClass} text-white shadow-sm group-hover:scale-110 transition-transform`}
      >
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-1">{title}</h4>
        <p className="text-slate-600 font-medium leading-relaxed">{content}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* 🌟 HERO SECTION */}
      <section className="relative bg-slate-900 py-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[100px]"></div>
        </div>

        <FadeIn delay={0.1}>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/30">
              Hỗ trợ khách hàng
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn. Đừng ngần ngại kết
              nối ngay hôm nay.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* 📞 MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 mb-20 relative z-10">
        <FadeIn delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT COLUMN: INFO (5/12) */}
            <div className="lg:col-span-5 bg-slate-50/50 backdrop-blur-sm space-y-8 pt-10">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-900">Thông tin liên lạc</h2>
                <p className="text-slate-500">Tìm chúng tôi qua các kênh chính thức dưới đây.</p>
              </div>

              <div className="space-y-2">
                <ContactItem
                  icon={MapPin}
                  title="Địa chỉ"
                  content="12 Nguyễn Văn Bảo, Gò Vấp, TP. Hồ Chí Minh"
                  colorClass="bg-red-500"
                />
                <ContactItem
                  icon={Phone}
                  title="Hotline"
                  content="1900 1234"
                  colorClass="bg-green-500"
                />
                <ContactItem
                  icon={Mail}
                  title="Email"
                  content="support@ketnoigiaothuong.vn"
                  colorClass="bg-blue-500"
                />
                <ContactItem
                  icon={Clock}
                  title="Giờ làm việc"
                  content="08:00 – 21:00 (Thứ 2 – Chủ nhật)"
                  colorClass="bg-amber-500"
                />
              </div>

              {/* Chat CTA Box */}
              <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <MessageCircle className="animate-bounce" />
                    Cần hỗ trợ gấp?
                  </h3>
                  <p className="text-indigo-100 mb-6 text-sm">
                    Chat trực tiếp với đội ngũ tư vấn viên để được giải quyết vấn đề nhanh nhất.
                  </p>
                  <Link
                    to="/chat"
                    className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition shadow-sm"
                  >
                    💬 Chat ngay bây giờ
                  </Link>
                </div>
                {/* Decoration */}
                <div className="absolute -right-6 -bottom-6 text-indigo-500 opacity-30 group-hover:scale-110 transition-transform duration-500">
                  <MessageCircle size={120} />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: FORM (7/12) */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100 h-full">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Gửi tin nhắn</h3>
                  <p className="text-slate-500">
                    Điền thông tin vào biểu mẫu, chúng tôi sẽ phản hồi trong vòng 24h.
                  </p>
                </div>

                <form className="space-y-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Họ và tên</label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="Nhập tên của bạn"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Email liên hệ</label>
                    <div className="relative">
                      <AtSign
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type="email"
                        placeholder="example@email.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nội dung</label>
                    <div className="relative">
                      <AlignLeft className="absolute left-4 top-5 text-slate-400" size={20} />
                      <textarea
                        rows="5"
                        placeholder="Bạn cần hỗ trợ vấn đề gì?"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group"
                  >
                    <span>Gửi yêu cầu</span>
                    <Send
                      size={18}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 🗺️ MAP SECTION */}
      <section className="pb-10 px-4">
        <FadeIn delay={0.2}>
          <div className="max-w-7xl mx-auto bg-white p-2 rounded-3xl shadow-lg border border-slate-200">
            <div className="rounded-2xl overflow-hidden h-96 relative bg-slate-100">
              <iframe
                title="map"
                src="https://maps.google.com/maps?q=Nguyen%20Van%20Bao%20Go%20Vap&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter grayscale hover:grayscale-0 transition-all duration-700"
                allowFullScreen=""
                loading="lazy"
              ></iframe>

              {/* Map Overlay (Optional - vì link map của bạn là demo) */}
              <div className="absolute inset-0 pointer-events-none border-4 border-white/50 rounded-2xl"></div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default ContactPage;
