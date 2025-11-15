import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import SearchBar from "../../components/Search/SearchBar";
import CountdownTimer from "../../components/Auction/CountdownTimer";

const SearchPage = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q")?.toLowerCase() || "";

  const [results, setResults] = useState({
    products: [],
    auctions: [],
    businesses: [],
  });

  useEffect(() => {
    if (!query) return;

    // 🔹 Lấy dữ liệu thật từ localStorage
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const auctions = JSON.parse(localStorage.getItem("auctions") || "[]");
    const businesses = JSON.parse(localStorage.getItem("businesses") || "[]");

    const filter = (list, fields) =>
      list.filter((item) => fields.some((f) => item[f]?.toLowerCase().includes(query)));

    setResults({
      products: filter(products, ["title", "description"]),
      auctions: filter(auctions, ["title", "description"]),
      businesses: filter(businesses, ["name", "industry"]),
    });
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <SearchBar defaultValue={query} />

      {!query && <div className="text-gray-500 mt-8">Hãy nhập từ khóa để tìm kiếm</div>}

      {query && (
        <div className="mt-10 space-y-12">
          {/* PRODUCTS */}
          {results.products.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Sản phẩm</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {results.products.map((p) => (
                  <Link
                    key={p.id}
                    to={`/products/${p.id}`}
                    className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <img src={p.image} className="w-full h-40 object-cover rounded-md" />
                    <div className="mt-2 font-semibold">{p.title}</div>
                    <div className="text-blue-600 font-bold">
                      ₫{p.price.toLocaleString("vi-VN")}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* AUCTIONS */}
          {results.auctions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Sản phẩm đấu giá</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {results.auctions.map((a) => (
                  <Link
                    key={a.id}
                    to={`/auction/${a.id}`}
                    className="bg-white p-3 rounded-lg shadow hover:shadow-lg transition"
                  >
                    <img src={a.image} className="w-full h-40 object-cover rounded-md" />
                    <div className="mt-2 font-semibold">{a.title}</div>

                    <div className="text-indigo-600 font-bold">
                      Giá hiện tại: ₫{a.currentBid.toLocaleString("vi-VN")}
                    </div>

                    <div className="text-sm text-gray-500 mt-1">
                      <CountdownTimer targetDate={a.endsAt} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* BUSINESSES */}
          {results.businesses.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">Doanh nghiệp</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.businesses.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition flex gap-4 items-center"
                  >
                    <img src={b.logo} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-lg">{b.name}</div>
                      <div className="text-gray-600">{b.industry}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NO RESULT */}
          {results.products.length === 0 &&
            results.auctions.length === 0 &&
            results.businesses.length === 0 && (
              <div className="text-gray-500 text-center mt-10">
                Không tìm thấy kết quả phù hợp với: <strong>{query}</strong>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
