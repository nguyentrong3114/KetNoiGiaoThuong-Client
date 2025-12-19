import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Auction/Card";
import Modal from "../../components/Modal";
import FadeIn from "../../components/FadeIn";
import { discoveryApi } from "../../services/apiClient";

const HomePage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const featureRef = useRef(null);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  
  // Kiểm tra đã đăng nhập chưa
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // Fetch featured listings (quảng cáo)
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await discoveryApi.getFeatured({ type: 'all', limit: 6 });
        setFeaturedListings(response.data || []);
      } catch (error) {
        console.error("Error fetching featured listings:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeatured();
  }, []);

  // Track click cho quảng cáo
  const handleFeaturedClick = async (listing) => {
    if (listing.promotion_id) {
      try {
        await discoveryApi.trackPromotionClick(listing.promotion_id);
        console.log(`📊 Tracked click for promotion ${listing.promotion_id}`);
      } catch (error) {
        console.error("Error tracking promotion click:", error);
      }
    }
    navigate(`/product/${listing.id}`);
  };

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
            strokeWidth="2"
            d="M12 4.5C7.305 4.5 3.5 8.305 3.5 13S7.305 21.5 12 21.5 20.5 17.695 20.5 13 16.695 4.5 12 4.5z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v6l4 2" />
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
            strokeWidth="2"
            d="M12 22c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4" />
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ⭐ HERO SECTION */}
      <FadeIn delay={0.1}>
        <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-noise.png')] opacity-10"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              Kết nối doanh nghiệp
              <br />
              <span className="text-blue-100 font-semibold">Phát triển bền vững</span>
            </h1>

            <p className="text-lg md:text-xl mb-10 text-blue-50 max-w-3xl mx-auto leading-relaxed">
              Nền tảng giao thương hàng đầu Việt Nam, tạo cầu nối giữa các doanh nghiệp để cùng phát
              triển.
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

      {/* ⭐ FEATURES SECTION */}
      <FadeIn delay={0.15}>
        <section ref={featureRef} className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-lg text-gray-700 mb-16">
              Giải pháp toàn diện để kết nối và phát triển kinh doanh hiện đại
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

                  <p className="text-gray-700 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ⭐ FEATURED LISTINGS SECTION (Quảng cáo) */}
      {featuredListings.length > 0 && (
        <FadeIn delay={0.18}>
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    ✨ Sản phẩm nổi bật
                  </h2>
                  <p className="text-gray-600 mt-1">Được đề xuất bởi các doanh nghiệp uy tín</p>
                </div>
                <Link 
                  to="/products" 
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  Xem tất cả
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {loadingFeatured ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredListings.map((listing) => (
                    <div
                      key={listing.id}
                      onClick={() => handleFeaturedClick(listing)}
                      className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:border-amber-300 transition-all duration-300 cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={listing.images?.[0] || "https://via.placeholder.com/300?text=No+Image"}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {listing.promotion_type === 'featured' ? 'Nổi bật' : 'Tài trợ'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {listing.title}
                        </h3>
                        <p className="text-xl font-bold text-blue-600 mt-2">
                          {listing.price_cents
                            ? `₫${Number(listing.price_cents / 100).toLocaleString("vi-VN")}`
                            : "Liên hệ"}
                        </p>
                        {listing.shop?.name && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {listing.shop.name}
                            {listing.shop.is_verified && (
                              <span className="text-blue-500" title="Đã xác minh">✓</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </FadeIn>
      )}

      {/* ⭐ STATS SECTION */}
      <FadeIn delay={0.2}>
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
              Thành tựu của chúng tôi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { num: "10,000+", text: "Doanh nghiệp tham gia", color: "text-blue-600" },
                { num: "50,000+", text: "Giao dịch thành công", color: "text-green-600" },
                { num: "5 năm", text: "Kinh nghiệm hoạt động", color: "text-purple-600" },
                { num: "24/7", text: "Hỗ trợ khách hàng", color: "text-orange-600" },
              ].map((item, index) => (
                <div key={index} className="p-4 rounded-lg hover:bg-gray-50 transition">
                  <div className={`text-4xl font-extrabold ${item.color} mb-2 drop-shadow`}>
                    {item.num}
                  </div>
                  <p className="text-gray-800 font-semibold">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ⭐ CTA SECTION */}
      <FadeIn delay={0.25}>
        <section className="py-20 bg-blue-700 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {isLoggedIn ? "Khám phá ngay!" : "Sẵn sàng bắt đầu?"}
          </h2>

          <p className="text-lg md:text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            {isLoggedIn 
              ? "Truy cập Dashboard để quản lý và kết nối với đối tác" 
              : "Tham gia cộng đồng doanh nghiệp lớn nhất Việt Nam ngay hôm nay"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <Button variant="outline" size="lg">
                    Vào Dashboard
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="primary" size="lg">
                    Xem sản phẩm
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="outline" size="lg">
                    Đăng ký miễn phí
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="primary" size="lg">
                    Liên hệ tư vấn
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>
      </FadeIn>

      {/* ⭐ MODAL */}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Thông tin thêm">
        <p className="text-gray-700 leading-relaxed">
          Nền tảng <strong>Kết Nối Giao Thương</strong> giúp doanh nghiệp mở rộng mạng lưới, tiếp
          cận đối tác, nâng cao hiệu quả kinh doanh và phát triển bền vững.
        </p>
      </Modal>
    </div>
  );
};

export default HomePage;
