import { useParams } from "react-router-dom";
import HeroSection from "../../components/Company/HeroSection";
import StatsSection from "../../components/Company/StatsSection";
import PromoBanner from "../../components/Company/PromoBanner";
import FeaturedStore from "../../components/Company/FeaturedStore";
import WhatWeDo from "../../components/Company/WhatWeDo";
import FAQ from '../../components/Company/FAQ'
import Newsletter from "../../components/Company/Newsletter";

const CompanyPage = () => {
  // eslint-disable-next-line no-unused-vars
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <StatsSection />
      <FeaturedStore maxProducts={8} showViewAll={true} />
      <PromoBanner />
      <WhatWeDo />
      <FAQ />
      <Newsletter />
    </div>
  );
};

export default CompanyPage;
