import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, PlayCircle } from "lucide-react";

const HeroSection = ({ onScrollToProducts }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16 px-6 md:px-10 text-white">
      <div className="max-w-7xl mx-auto">
        {/* TAGS */}
        <div className="flex flex-wrap items-center gap-3 mb-10 text-sm">
          {["Uy tín – Nhanh chóng", "Hỗ trợ 24/7", "Thanh toán an toàn"].map((text, i) => (
            <div
              key={i}
              className="bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-blue-100 border border-white/20"
            >
              <CheckCircle size={16} className="text-green-300" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight drop-shadow-sm">
              Khám phá những sản phẩm nổi bật của <span className="text-yellow-300">{slug}</span>
            </h1>

            <p className="text-blue-100 mb-8 text-lg leading-relaxed max-w-xl">
              <span className="font-semibold">{slug}</span> mang đến những sản phẩm chất lượng, xu
              hướng thời trang hiện đại và trải nghiệm dịch vụ tuyệt vời dành riêng cho bạn.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* CUỘN ĐẾN SẢN PHẨM */}
              <button
                onClick={onScrollToProducts}
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition flex items-center gap-2 shadow-md"
              >
                Xem bộ sưu tập <ArrowRight size={18} />
              </button>

              {/* CHUYỂN TRANG GIỚI THIỆU CÔNG TY */}
              <button
                onClick={() => navigate(`/company/${slug}/intro`)}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <PlayCircle size={20} />
                Giới thiệu công ty
              </button>
            </div>
          </div>

          {/* RIGHT IMAGES */}
          <div className="relative h-96 flex justify-center items-center">
            <div className="absolute w-72 h-72 bg-white/20 rounded-full backdrop-blur-md shadow-2xl"></div>

            <img
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
              alt="Main Model"
              className="relative w-64 h-64 rounded-full object-cover shadow-xl border-4 border-white"
            />

            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
              alt="Model 2"
              className="absolute right-0 top-8 w-40 h-40 rounded-xl object-cover shadow-xl border-4 border-white"
            />

            <div className="absolute bottom-4 left-6 flex gap-3">
              {[1, 2, 3].map((box) => (
                <div
                  key={box}
                  className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-lg border border-white/40 shadow"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
