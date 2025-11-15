"use client";

import { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const FeaturedStore = ({ maxProducts = 8, showViewAll = true }) => {
  const { slug } = useParams();

  // --- FILTER STATE ---
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);

  // --- SORT ---
  const [sortOption, setSortOption] = useState("default");

  // --- PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = maxProducts;

  // --- DEMO PRODUCTS ---
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

  // --- FILTER + SORT ---
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

  // --- CALCULATE PAGINATION ---
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const displayedProducts = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // --- GENERATE PAGINATION NUMBERS ("1 2 3 4 ... 28") ---
  const generatePages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, 4, "...", totalPages);
    }

    return pages;
  };

  const pageList = generatePages();

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Sản phẩm nổi bật</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* --- SIDEBAR FILTER (NÂNG CẤP UI) --- */}
          <div className="md:col-span-1">
            <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">Bộ lọc</h3>
                <button
                  onClick={() => {
                    setSelectedGender([]);
                    setSelectedAgeGroup([]);
                    setSelectedSize([]);
                    setSortOption("default");
                  }}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Xóa lọc
                </button>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-4" />

              {/* GENDER */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <h4 className="font-semibold text-gray-900">Giới tính</h4>
                </div>

                <div className="space-y-2 pl-1">
                  {["Nam", "Nữ"].map((gender) => (
                    <label key={gender} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedGender.includes(gender)}
                        onChange={() =>
                          setSelectedGender((prev) =>
                            prev.includes(gender)
                              ? prev.filter((g) => g !== gender)
                              : [...prev, gender]
                          )
                        }
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 group-hover:text-blue-600">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                  <h4 className="font-semibold text-gray-900">Nhóm tuổi</h4>
                </div>

                <div className="space-y-2 pl-1">
                  {["Người lớn", "Trẻ em"].map((age) => (
                    <label key={age} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedAgeGroup.includes(age)}
                        onChange={() =>
                          setSelectedAgeGroup((prev) =>
                            prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
                          )
                        }
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700 group-hover:text-purple-600">{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  <h4 className="font-semibold text-gray-900">Kích cỡ</h4>
                </div>

                <div className="space-y-2 pl-1">
                  {["S", "M", "L"].map((size) => (
                    <label key={size} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedSize.includes(size)}
                        onChange={() =>
                          setSelectedSize((prev) =>
                            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                          )
                        }
                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-gray-700 group-hover:text-green-600">{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <h4 className="font-semibold text-gray-900">Sắp xếp</h4>
                </div>

                <select
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="default">Mặc định</option>
                  <option value="low">Giá thấp → cao</option>
                  <option value="high">Giá cao → thấp</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- PRODUCT GRID --- */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-semibold text-gray-900">Danh sách sản phẩm</h3>
                <p className="text-sm text-gray-600">{filtered.length} sản phẩm phù hợp</p>
              </div>

              {/* Sort UI */}
              <select
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border rounded-lg text-sm bg-white"
              >
                <option value="default">Sắp xếp: Phổ biến</option>
                <option value="low">Giá thấp → cao</option>
                <option value="high">Giá cao → thấp</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {displayedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/company/${slug}/product/${product.id}`}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>

                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 text-sm mb-2">{product.name}</h4>
                    <p className="text-xs text-gray-600">
                      {product.gender} • {product.ageGroup}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">{product.priceLabel}</span>

                      <button
                        onClick={(e) => e.preventDefault()}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* --- PAGINATION UI GIỐNG BẢN GỐC --- */}
            <div className="flex items-center justify-between">
              {/* LEFT ARROW */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))}
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>

              {/* PAGE NUMBERS */}
              <div className="flex items-center gap-2">
                {pageList.map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === "number" && setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-medium transition ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : page === "..."
                          ? "text-gray-600 cursor-default"
                          : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* RIGHT ARROW */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              >
                <ChevronRight size={20} className="text-gray-600" />
              </button>
            </div>

            {/* VIEW ALL */}
            {showViewAll && (
              <div className="mt-8 flex justify-end">
                <Link
                  to={`/company/${slug}/product`}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center gap-2 transition"
                >
                  Xem tất cả
                  <ArrowRight size={18} />
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
