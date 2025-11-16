import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Company/Breadcrumb";
import FeaturedStore from "../../components/Company/FeaturedStore";
import Newsletter from "../../components/Company/Newsletter";

const CompanyProductPage = () => {
  const { slug } = useParams();

  const breadcrumbItems = [{ label: "Trang chủ", href: `/company/${slug}` }, { label: "Sản phẩm" }];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* ⭐ Chỉ hiển thị danh sách sản phẩm + bộ lọc */}
      <div className="container mx-auto px-4">
        <FeaturedStore maxProducts={999} showViewAll={false} />
      </div>

      {/* Newsletter */}
      <Newsletter />
    </div>
  );
};

export default CompanyProductPage;
