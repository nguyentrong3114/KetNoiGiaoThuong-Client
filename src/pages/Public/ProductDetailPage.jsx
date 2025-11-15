import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Company/Breadcrumb";
import ProductShowcase from "../../components/Company/ProductShowcase";
import ProductDetails from "../../components/Company/ProductDetails";
import ReviewSection from "../../components/Company/ReviewSection";
import Newsletter from "../../components/Company/Newsletter";

const ProductDetailPage = () => {
  const { slug, id } = useParams();

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: `/company/${slug}/product` },
    { label: "Chi tiết sản phẩm" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 mt-8">
          {/* Cột trái – Ảnh sản phẩm */}
          <div className="lg:col-span-1">
            <ProductShowcase productId={id} />
          </div>

          {/* Cột phải – Thông tin + Đánh giá */}
          <div className="lg:col-span-2 space-y-8">
            <ProductDetails productId={id} slug={slug} />
            <ReviewSection />
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default ProductDetailPage;
