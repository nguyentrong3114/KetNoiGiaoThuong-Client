import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiUsers,
  FiBriefcase,
  FiTrendingUp,
  FiArrowRight,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

const HomeDashboardPage = () => {
  const [user, setUser] = useState(null);

  // MOCK DEMO (sau này thay bằng API)
  const companies = [
    { id: 1, name: "Công ty ABC", industry: "Nông sản", address: "Hà Nội", created: "3 năm" },
    { id: 2, name: "Công ty XYZ", industry: "Phân phối", address: "TP.HCM", created: "5 năm" },
    {
      id: 3,
      name: "Doanh nghiệp Demo",
      industry: "Logistics",
      address: "Đà Nẵng",
      created: "1 năm",
    },
  ];

  const opportunities = [
    {
      id: 1,
      title: "Tìm đối tác phân phối tại miền Nam",
      company: "Công ty ABC",
      time: "2 ngày trước",
    },
    {
      id: 2,
      title: "Cần nhà cung cấp bao bì số lượng lớn",
      company: "Công ty XYZ",
      time: "5 ngày trước",
    },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold leading-tight drop-shadow">
            Xin chào, {user?.full_name || "bạn"} 👋
          </h1>
          <p className="text-blue-100 mt-4 text-lg opacity-90">
            Khám phá hệ sinh thái doanh nghiệp và kết nối đối tác phù hợp – giúp doanh nghiệp bạn
            phát triển nhanh hơn.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-4xl mx-auto -mt-8 px-4">
        <div className="bg-white shadow-xl rounded-3xl p-5 flex items-center gap-4 border border-gray-200">
          <FiSearch className="text-2xl text-blue-700" />
          <input
            type="text"
            placeholder="Tìm doanh nghiệp, ngành nghề hoặc cơ hội hợp tác…"
            className="flex-1 outline-none text-gray-700 text-lg"
          />
          <button className="bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold">
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* FEATURED SHORTCUT CARDS */}
      <div className="max-w-6xl mx-auto mt-14 px-4 grid grid-cols-1 md:grid-cols-3 gap-7">
        <FeaturedCard
          icon={<FiUsers className="text-blue-700 text-4xl" />}
          title="Đối tác phù hợp"
          desc="Doanh nghiệp được hệ thống đề xuất cho bạn."
        />
        <FeaturedCard
          icon={<FiBriefcase className="text-blue-700 text-4xl" />}
          title="Ngành hàng nổi bật"
          desc="Xu hướng ngành nghề đang được quan tâm."
        />
        <FeaturedCard
          icon={<FiTrendingUp className="text-blue-700 text-4xl" />}
          title="Cơ hội hợp tác"
          desc="Các nhu cầu kết nối mới nhất."
        />
      </div>

      {/* DOANH NGHIỆP NỔI BẬT + CƠ HỘI */}
      <div className="max-w-6xl mx-auto mt-14 px-4 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <SectionCard title="Doanh nghiệp nổi bật">
          {companies.map((c) => (
            <div key={c.id} className="border rounded-xl p-4 hover:bg-gray-50 transition">
              <p className="font-bold text-gray-900">{c.name}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FiMapPin className="text-blue-600" /> {c.address}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Ngành: {c.industry} • Hoạt động: {c.created}
              </p>
            </div>
          ))}
        </SectionCard>

        <SectionCard title="Cơ hội hợp tác mới">
          {opportunities.map((o) => (
            <div key={o.id} className="border rounded-xl p-4 hover:bg-gray-50 transition">
              <p className="font-bold">{o.title}</p>
              <p className="text-sm text-gray-600">Doanh nghiệp: {o.company}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <FiClock /> {o.time}
              </p>
            </div>
          ))}
        </SectionCard>
      </div>
    </div>
  );
};

/* COMPONENTS PHỤ */
const FeaturedCard = ({ icon, title, desc }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-6 bg-white rounded-2xl shadow hover:shadow-lg border border-gray-100 transition cursor-pointer"
  >
    {icon}
    <h3 className="text-xl font-bold mt-4">{title}</h3>
    <p className="text-gray-600 text-sm mt-2">{desc}</p>
    <div className="mt-4 text-blue-700 flex items-center gap-1 font-semibold text-sm">
      Tìm hiểu thêm <FiArrowRight />
    </div>
  </motion.div>
);

const SectionCard = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="bg-white shadow rounded-2xl border border-gray-100 p-6"
  >
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </motion.div>
);

export default HomeDashboardPage;
