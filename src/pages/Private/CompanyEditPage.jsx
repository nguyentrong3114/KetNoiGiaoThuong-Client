import { useParams } from "react-router-dom";
import ListingForm from "../../components/Company/ListingForm";

const CompanyEditPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <ListingForm editId={id} />
    </div>
  );
};

export default CompanyEditPage;
