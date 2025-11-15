import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";

const AllProductsPage = () => {
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState([]);
  const [sortOption, setSortOption] = useState("default");

  // --- PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6; // 📌 số sản phẩm mỗi trang

  // --- DEMO DATA ---
  const products = [
    {
      id: 1,
      slug: "cong-ty-abc",
      name: "Váy công sở",
      priceLabel: "400.000đ",
      priceValue: 400000,
      gender: "female",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      slug: "cong-ty-x",
      name: "Áo thun cao cấp",
      priceLabel: "250.000đ",
      priceValue: 250000,
      gender: "male",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      slug: "shop-vn",
      name: "Đầm dự tiệc",
      priceLabel: "600.000đ",
      priceValue: 600000,
      gender: "female",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      slug: "shop-vn",
      name: "Áo khoác len",
      priceLabel: "320.000đ",
      priceValue: 320000,
      gender: "female",
      image: "/placeholder.svg",
    },
    {
      id: 5,
      slug: "cong-ty-hk",
      name: "Áo sơ mi nam",
      priceLabel: "280.000đ",
      priceValue: 280000,
      gender: "male",
      image: "/placeholder.svg",
    },
    {
      id: 6,
      slug: "cong-ty-hk",
      name: "Quần âu cao cấp",
      priceLabel: "550.000đ",
      priceValue: 550000,
      gender: "male",
      image: "/placeholder.svg",
    },
  ];

  // --- FILTER + SORT ---
  const filtered = useMemo(() => {
    let list = [...products];

    // Search
    list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

    // Gender
    if (filterGender.length) {
      list = list.filter((p) => filterGender.includes(p.gender));
    }

    // Sorting
    if (sortOption === "low") list.sort((a, b) => a.priceValue - b.priceValue);
    if (sortOption === "high") list.sort((a, b) => b.priceValue - a.priceValue);

    return list;
  }, [search, filterGender, sortOption]);

  // --- RESET PAGE WHEN FILTER CHANGES ---
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterGender, sortOption]);

  // --- PAGINATION ---
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const displayedProducts = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Generate pagination structure
  const generatePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "...", totalPages);
    }
    return pages;
  };

  const pageList = generatePages();

  return (
    <div className="min-h-screen bg-white pt-6 px-4 md:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link to="/" className="hover:text-blue-600">
          Trang chủ
        </Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-semibold text-gray-900">Tất cả sản phẩm</span>
      </nav>

      <h1 className="text-3xl font-bold mb-6 text-gray-900">Tất cả sản phẩm ({filtered.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* --- FILTER SIDEBAR --- */}
        <aside className="col-span-1">
          <div className="bg-white shadow-lg rounded-2xl p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Bộ lọc</h3>
              <button
                onClick={() => {
                  setFilterGender([]);
                  setSortOption("default");
                  setSearch("");
                }}
                className="text-blue-600 text-sm hover:underline"
              >
                Xóa lọc
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">Tìm kiếm</label>
              <input
                type="text"
                placeholder="Nhập tên sản phẩm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">Giới tính</label>
              {[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
              ].map((g) => (
                <label key={g.value} className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={filterGender.includes(g.value)}
                    onChange={() =>
                      setFilterGender((prev) =>
                        prev.includes(g.value)
                          ? prev.filter((i) => i !== g.value)
                          : [...prev, g.value]
                      )
                    }
                    className="w-4 h-4"
                  />
                  {g.label}
                </label>
              ))}
            </div>

            {/* Sort */}
            <div>
              <label className="font-semibold block mb-2">Sắp xếp</label>
              <select
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Mặc định</option>
                <option value="low">Giá thấp → cao</option>
                <option value="high">Giá cao → thấp</option>
              </select>
            </div>
          </div>
        </aside>

        {/* --- PRODUCT GRID --- */}
        <div className="col-span-1 md:col-span-3">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/company/${p.slug}/product/${p.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition"
              >
                <div className="h-48 bg-gray-100">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-blue-600 font-bold">{p.priceLabel}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* --- PAGINATION --- */}
          <div className="flex items-center justify-center mt-10 gap-3">
            {/* Previous */}
            <button
              onClick={() => setCurrentPage((p) => (p > 1 ? p - 1 : p))}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Page numbers */}
            {pageList.map((page, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-lg font-medium transition 
                  ${page === currentPage ? "bg-blue-600 text-white" : "hover:bg-gray-100"}
                `}
                disabled={page === "..."}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => (p < totalPages ? p + 1 : p))}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
