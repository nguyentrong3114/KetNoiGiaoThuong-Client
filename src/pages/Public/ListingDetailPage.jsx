// Wrapper component để redirect từ /listings/:id sang ProductDetailPage
// Notification từ BE dùng action_url: /listings/{id}
import ProductDetailPage from "./ProductDetailPage";

const ListingDetailPage = () => {
  return <ProductDetailPage />;
};

export default ListingDetailPage;
