import { useState, useEffect } from "react";
import { useLocation, Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiCheckCircle, FiStar, FiPackage } from "react-icons/fi";
import { discoveryApi, auctionApi } from "../../services/apiClient";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [searchInput, setSearchInput] = useState(query);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ shops: [], listings: [], auctions: [] });

  useEffect(() => {
    if (query) {
      setSearchInput(query);
      handleSearch(query);
    }
  }, [query]);

  const handleSearch = async (keyword) => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const [searchRes, auctionRes] = await Promise.all([
        discoveryApi.searchAll({ query: keyword, per_page: 20 }),
        auctionApi.getAll({ search: keyword, status: "active", per_page: 10 }),
      ]);
      setResults({
        shops: searchRes?.data?.shops || [],
        listings: searchRes?.data?.listings || [],
        auctions: auctionRes?.data?.data || auctionRes?.data || [],
      });
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const formatPrice = (cents) => {
    return new Intl.NumberFormat("vi-VN").format(cents) + " ₫";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm công ty, sản phẩm..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Tìm kiếm
          </button>
        </div>
      </form>

      {!query && (
        <div className="text-center text-gray-500 py-20">
          <FiSearch className="mx-auto text-6xl mb-4 text-gray-300" />
          <p className="text-lg">Nhập từ khóa để tìm kiếm công ty và sản phẩm</p>
        </div>
      )}

      {query && (
        <>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            {[
              { key: "all", label: "Tất cả" },
              { key: "shops", label: `Công ty (${results.shops.length})` },
              { key: "listings", label: `Sản phẩm (${results.listings.length})` },
              { key: "auctions", label: `Đấu giá (${results.auctions.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 font-medium border-b-2 -mb-px transition ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-500">Đang tìm kiếm...</p>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Shops Section */}
              {(activeTab === "all" || activeTab === "shops") && results.shops.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>🏢</span> Công ty / Doanh nghiệp
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.shops.map((shop) => (
                      <Link
                        key={shop.id}
                        to={`/shops/${shop.slug || shop.id}`}
                        className="flex gap-4 p-4 bg-white rounded-xl border hover:shadow-md transition"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {shop.logo ? (
                            <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600 bg-blue-50">
                              {shop.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 truncate">{shop.name}</h3>
                            {shop.is_verified && (
                              <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                <FiCheckCircle /> Đã xác thực
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{shop.description || "Chưa có mô tả"}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <FiStar className="text-yellow-500" /> {shop.rating || "0.0"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiPackage /> {shop.listings_count || 0} sản phẩm
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Listings Section */}
              {(activeTab === "all" || activeTab === "listings") && results.listings.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>📦</span> Sản phẩm
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.listings.map((listing) => (
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
                          {listing.shop && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate">
                              {listing.shop.name}
                              {listing.shop.is_verified && <FiCheckCircle className="text-green-500" />}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Auctions Section */}
              {(activeTab === "all" || activeTab === "auctions") && results.auctions.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>🔨</span> Đấu giá
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {results.auctions.map((auction) => (
                      <Link
                        key={auction.id}
                        to={`/auction/${auction.id}`}
                        className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition"
                      >
                        <div className="aspect-square bg-gray-100 relative">
                          <img
                            src={auction.listing?.images?.[0] || "/placeholder.jpg"}
                            alt={auction.listing?.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            Đấu giá
                          </span>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
                            {auction.listing?.title || auction.title}
                          </h3>
                          <p className="text-indigo-600 font-bold mt-1">
                            {formatPrice(auction.current_price || auction.starting_price)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {auction.bids_count || 0} lượt đặt giá
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* No Results */}
              {results.shops.length === 0 && results.listings.length === 0 && results.auctions.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 text-lg">
                    Không tìm thấy kết quả cho: <strong className="text-gray-700">{query}</strong>
                  </p>
                  <p className="text-gray-400 mt-2">Thử tìm kiếm với từ khóa khác</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;
