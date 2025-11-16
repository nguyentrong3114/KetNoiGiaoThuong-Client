import { useParams } from "react-router-dom";
import Breadcrumb from "../../components/Company/Breadcrumb";
import FeaturedStore from "../../components/Company/FeaturedStore";

const CompanyProductPage = () => {
  const { slug } = useParams();

  const breadcrumbItems = [{ label: "Trang chủ", href: `/company/${slug}` }, { label: "Sản phẩm" }];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pt-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="container mx-auto px-4">
        <FeaturedStore maxProducts={999} showViewAll={false} />
      </div>
    </div>
  );
};

export default CompanyProductPage;
