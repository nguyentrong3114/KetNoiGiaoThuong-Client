"use client";

import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const FeaturedStore = ({ maxProducts = 8, showViewAll = true }) => {
  const { slug } = useParams();

  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);

  const [sortOption, setSortOption] = useState("default");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = maxProducts;

  const products = [
    {
      id: 1,
      name: "Áo blouse + chân váy",
      image: "",
      priceLabel: "₫300.000",
      priceValue: 300000,
      gender: "Nữ",
      ageGroup: "Người lớn",
      size: "M",
    },
    {
      id: 2,
      name: "Đầm phối màu hồng",
      image: "",
      priceLabel: "₫300.000",
      priceValue: 300000,
      gender: "Nữ",
      ageGroup: "Người lớn",
      size: "S",
    },
    {
      id: 3,
      name: "Đầm dáng chữ A",
      image: "",
      priceLabel: "₫300.000",
      priceValue: 300000,
      gender: "Nữ",
      ageGroup: "Người lớn",
      size: "L",
    },
    {
      id: 4,
      name: "Đầm xoè nhẹ",
      image: "",
      priceLabel: "₫300.000",
      priceValue: 300000,
      gender: "Nữ",
      ageGroup: "Người lớn",
      size: "M",
    },
    {
      id: 5,
      name: "Suit nam Ankara",
      image: "",
      priceLabel: "₫300.000",
      priceValue: 300000,
      gender: "Nam",
      ageGroup: "Người lớn",
      size: "L",
    },
    {
      id: 6,
      name: "Áo thun nam cao cấp",
      image: "",
      priceLabel: "₫250.000",
      priceValue: 250000,
      gender: "Nam",
      ageGroup: "Người lớn",
      size: "M",
    },
  ];

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedGender.length) list = list.filter((p) => selectedGender.includes(p.gender));
    if (selectedAgeGroup.length) list = list.filter((p) => selectedAgeGroup.includes(p.ageGroup));
    if (selectedSize.length) list = list.filter((p) => selectedSize.includes(p.size));

    if (sortOption === "low") list.sort((a, b) => a.priceValue - b.priceValue);
    if (sortOption === "high") list.sort((a, b) => b.priceValue - a.priceValue);
    if (sortOption === "newest") list.sort((a, b) => b.id - a.id);

    return list;
  }, [selectedGender, selectedAgeGroup, selectedSize, sortOption]);

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const displayedProducts = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Sản phẩm nổi bật</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar (bản gốc) */}
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
            </div>
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {displayedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/company/${slug}/product/${p.id}`}
                  className="block bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="h-48 bg-gray-200"></div>
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
