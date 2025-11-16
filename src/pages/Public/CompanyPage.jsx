import { useParams } from "react-router-dom";
import { useRef } from "react";

import HeroSection from "../../components/Company/HeroSection";
import StatsSection from "../../components/Company/StatsSection";
import FeaturedStore from "../../components/Company/FeaturedStore";
import WhatWeDo from "../../components/Company/WhatWeDo";
import FAQ from "../../components/Company/FAQ";
import ContactCompany from "../../components/Company/ContactCompany";

const CompanyPage = () => {
  const { slug } = useParams();

  // ⭐ Tạo ref trỏ đến phần Sản phẩm
  const productRef = useRef(null);

  // ⭐ Hàm scroll mượt xuống sản phẩm nổi bật
  const scrollToProducts = () => {
    if (productRef.current) {
      productRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Banner – truyền hàm scroll xuống sản phẩm */}
      <HeroSection onScrollToProducts={scrollToProducts} />

      {/* Số liệu – tạo độ tin tưởng */}
      <StatsSection />

      {/* Dịch vụ / Chúng tôi làm gì */}
      <WhatWeDo />

      {/* ⭐ Sản phẩm – gắn ref vào đây */}
      <div ref={productRef}>
        <FeaturedStore maxProducts={8} showViewAll={true} />
      </div>

      {/* FAQ */}
      <FAQ />

      {/* Liên hệ */}
      <ContactCompany slug={slug} />
    </div>
  );
};

export default CompanyPage;
