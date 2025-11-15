import { CheckCircle } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="bg-blue-300 py-12 md:py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tags */}
        <div className="flex flex-wrap items-center gap-3 mb-12 text-sm">
          {["Đăng ký miễn phí", "Dịch vụ tuyệt vời", "Thanh toán dễ dàng"].map((text, i) => (
            <div
              key={i}
              className="bg-white rounded-full px-4 py-2 flex items-center gap-2 text-gray-700"
            >
              <CheckCircle size={16} className="text-blue-600" />
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Những phong cách thời trang mới nhất chưa bao giờ{" "}
              <span className="text-orange-500">dễ dàng đến vậy!</span>
            </h1>

            <p className="text-gray-700 mb-8">
              <span className="font-semibold">FashionForAll</span> giúp thời trang tiếp cận mọi
              người — mang phong cách đến ngay trước cửa nhà bạn!
            </p>

            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition">
                Xem bộ sưu tập
              </button>

              <button className="border-2 border-red-500 text-red-500 hover:bg-red-50 font-medium py-3 px-6 rounded-lg flex items-center gap-2 transition">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Xem đánh giá
              </button>
            </div>
          </div>

          {/* Right images */}
          <div className="relative flex justify-center items-center h-80">
            <div className="relative w-full h-full">
              {/* Main */}
              <div className="absolute left-0 top-0 w-48 h-48 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <img
                  src="/woman-in-colorful-dress.jpg"
                  alt="Model 1"
                  className="w-40 h-40 rounded-full object-cover"
                />
              </div>

              {/* Secondary */}
              <div className="absolute right-0 top-12 w-40 h-40 bg-orange-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <img
                  src="/placeholder.svg"
                  alt="Model 2"
                  className="w-32 h-32 rounded-full object-cover"
                />
              </div>

              {/* Small items */}
              <div className="absolute bottom-0 left-8 flex gap-2">
                {[1, 2, 3].map((box) => (
                  <div
                    key={box}
                    className="w-16 h-16 bg-gray-300 rounded-lg border-2 border-white shadow-md"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
