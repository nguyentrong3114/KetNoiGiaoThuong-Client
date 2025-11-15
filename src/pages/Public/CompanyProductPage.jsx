import { useParams } from "react-router-dom";
import PromoBanner from "../../components/Company/PromoBanner";
import FeaturedStore from "../../components/Company/FeaturedStore";
import Newsletter from "../../components/Company/Newsletter";
import Breadcrumb from "../../components/Company/Breadcrumb";

const CompanyProductPage = () => {
  const { slug } = useParams();

  const breadcrumbItems = [
    { label: "Trang chủ", href: `/company/${slug}` },
    { label: "Sản phẩm" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <PromoBanner />
      <FeaturedStore maxProducts={20} showViewAll={false} />
      <Newsletter />
    </div>
  );
};

export default CompanyProductPage;
