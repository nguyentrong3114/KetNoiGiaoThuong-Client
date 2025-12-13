import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle, FiStar, FiPackage, FiUsers, FiMapPin, FiPhone, FiMail, FiGlobe } from "react-icons/fi";
import { shopApi, discoveryApi } from "../../services/apiClient";

const ShopDetailPage = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShopData();
  }, [shopId]);

  const loadShopData = async () => {
    try {
      const shopRes = await shopApi.getById(shopId);
      const shopData = shopRes?.data || shopRes;
      setShop(shopData);

      // Load listings của shop
      const listingsRes = await discoveryApi.searchListings({ shop_id: shopData.id, per_page: 50 });
      setListings(listingsRes?.data?.data || listingsRes?.data || []);
    } catch (err) {
      console.error("Error loading shop:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents) => new Intl.NumberFormat("vi-VN").format(cents) + " ₫";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🏢</div>
        <p className="text-gray-500 text-lg">Không tìm thấy công ty</p>
        <Link to="/search" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Quay lại tìm kiếm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Shop Header */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
        {/* Banner */}
        <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600">
          {shop.banner && <img src={shop.banner} alt="Banner" className="w-full h-full object-cover" />}
        </div>
        
        {/* Profile */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-12">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-white border-4 border-white shadow-lg flex-shrink-0">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-600 bg-blue-50">
                  {shop.name?.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Info */}
            <div className="flex-1 pt-4 md:pt-8">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
                {shop.is_verified ? (
                  <span className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <FiCheckCircle /> Đã xác thực doanh nghiệp
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                    ⚠ Chưa xác thực doanh nghiệp
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 mt-2">{shop.description || "Chưa có mô tả"}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiStar className="text-yellow-500" />
                  <span className="font-semibold">{shop.rating || "0.0"}</span>
                  <span>({shop.total_reviews || 0} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiPackage className="text-blue-500" />
                  <span>{shop.total_products || listings.length} sản phẩm</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FiUsers className="text-green-500" />
                  <span>{shop.followers_count || 0} theo dõi</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t text-sm text-gray-600">
            {shop.address && (
              <span className="flex items-center gap-1"><FiMapPin /> {shop.address}</span>
            )}
            {shop.phone && (
              <span className="flex items-center gap-1"><FiPhone /> {shop.phone}</span>
            )}
            {shop.email && (
              <span className="flex items-center gap-1"><FiMail /> {shop.email}</span>
            )}
            {shop.website && (
              <a href={shop.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                <FiGlobe /> Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div>
        <h2 className="text-xl font-bold mb-4">Sản phẩm của {shop.name}</h2>
        
        {listings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <FiPackage className="mx-auto text-4xl text-gray-300 mb-2" />
            <p className="text-gray-500">Chưa có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                to={`/product/${listing.slug || listing.id}`}
                className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition"
              >
                <div className="aspect-square bg-gray-100">
                  <img
                    src={listing.images?.[0] || "/placeholder.jpg"}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">{listing.title}</h3>
                  <p className="text-blue-600 font-bold mt-1">{formatPrice(listing.price_cents)}</p>
                  <p className="text-xs text-gray-400 mt-1">{listing.category || "Chưa phân loại"}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopDetailPage;
