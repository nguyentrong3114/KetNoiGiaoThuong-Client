"use client";

import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedStore = ({ maxProducts = 8, showViewAll = true }) => {
  const { slug } = useParams();

  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);

  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = maxProducts;

  // ❗ DỮ LIỆU DEMO ĐÃ XÓA – CHUẨN BỊ NHẬN TỪ API SAU NÀY
  const products = [];

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedGender.length) {
      list = list.filter((p) => selectedGender.includes(p.gender));
    }

    if (selectedAgeGroup.length) {
      list = list.filter((p) => selectedAgeGroup.includes(p.ageGroup));
    }

    if (selectedSize.length) {
      list = list.filter((p) => selectedSize.includes(p.size));
    }

    if (sortOption === "low") list.sort((a, b) => a.priceValue - b.priceValue);
    if (sortOption === "high") list.sort((a, b) => b.priceValue - a.priceValue);
    if (sortOption === "newest") list.sort((a, b) => b.id - a.id);

    return list;
  }, [selectedGender, selectedAgeGroup, selectedSize, sortOption]);

  const totalPages = Math.ceil(filtered.length / productsPerPage) || 1;
  const displayedProducts = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Sản phẩm nổi bật</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* SIDEBAR FILTER (GIỮ NGUYÊN) */}
          <div className="md:col-span-1">
            <div className="bg-white p-4 shadow rounded-lg border">
              <h4 className="font-bold mb-2">Bộ lọc</h4>

              {/* Gender */}
              <div className="mt-4">
                <h5 className="font-semibold mb-1">Giới tính</h5>
                {["Nam", "Nữ"].map((g) => (
                  <label key={g} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedGender.includes(g)}
                      onChange={() =>
                        setSelectedGender((prev) =>
                          prev.includes(g) ? prev.filter((v) => v !== g) : [...prev, g]
                        )
                      }
                    />
                    {g}
                  </label>
                ))}
              </div>

              {/* Age */}
              <div className="mt-4">
                <h5 className="font-semibold mb-1">Nhóm tuổi</h5>
                {["Người lớn", "Trẻ em"].map((age) => (
                  <label key={age} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAgeGroup.includes(age)}
                      onChange={() =>
                        setSelectedAgeGroup((prev) =>
                          prev.includes(age) ? prev.filter((v) => v !== age) : [...prev, age]
                        )
                      }
                    />
                    {age}
                  </label>
                ))}
              </div>

              {/* Size */}
              <div className="mt-4">
                <h5 className="font-semibold mb-1">Kích cỡ</h5>
                {["S", "M", "L"].map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedSize.includes(s)}
                      onChange={() =>
                        setSelectedSize((prev) =>
                          prev.includes(s) ? prev.filter((v) => v !== s) : [...prev, s]
                        )
                      }
                    />
                    {s}
                  </label>
                ))}
              </div>

              {/* Sort (nếu sau này muốn thêm) */}
              <div className="mt-4">
                <h5 className="font-semibold mb-1">Sắp xếp</h5>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="default">Mặc định</option>
                  <option value="low">Giá thấp đến cao</option>
                  <option value="high">Giá cao đến thấp</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          <div className="md:col-span-3">
            {/* Khi chưa có dữ liệu sản phẩm */}
            {displayedProducts.length === 0 ? (
              <div className="text-center text-gray-500 py-10">Chưa có sản phẩm.</div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                  {displayedProducts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/company/${slug}/product/${p.id}`}
                      className="block bg-white shadow rounded-lg overflow-hidden"
                    >
                      <div className="h-48 bg-gray-200" />
                      <div className="p-3">
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-blue-600 font-bold">{p.priceLabel}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`px-3 py-1 rounded ${
                        num === currentPage ? "bg-blue-600 text-white" : "bg-gray-100"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Xem tất cả */}
            {showViewAll && (
              <div className="text-right mt-6">
                <Link
                  to={`/company/${slug}/product`}
                  className="text-blue-600 font-semibold flex items-center gap-2 justify-end"
                >
                  Xem tất cả <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStore;
