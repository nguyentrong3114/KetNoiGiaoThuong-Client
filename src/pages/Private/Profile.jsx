import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiSettings, FiLogOut, FiLock } from "react-icons/fi";

const Profile = ({ role = "company" }) => {
  // hoặc "personal"
  const [activeTab, setActiveTab] = useState("overview");

  const menuItems = [
    { key: "overview", icon: <FiUser />, label: "My Profile" },
    { key: "settings", icon: <FiSettings />, label: "Settings" },
    { key: "reset", icon: <FiLock />, label: "Reset Password", link: "/reset" },
    { key: "logout", icon: <FiLogOut />, label: "Log Out", link: "/login" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row p-6 lg:p-10 gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 bg-white rounded-2xl shadow p-6">
        <div className="flex items-center space-x-3 mb-8 border-b pb-4">
          <img
            src={
              role === "company"
                ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                : "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
            }
            alt="User avatar"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="font-semibold text-gray-800">
              {role === "company" ? "Nguyễn Văn Nam" : "Trần Minh An"}
            </h2>
            <p className="text-sm text-gray-500">
              {role === "company" ? "nam.nguyen@company.vn" : "minhan@gmail.com"}
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              {item.link ? (
                <Link
                  to={item.link}
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition ${
                    activeTab === item.key
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-blue-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-700 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-blue-700 text-sm">›</span>
                </Link>
              ) : (
                <button
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                    activeTab === item.key
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-blue-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-700 text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <span className="text-blue-700 text-sm">›</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-white rounded-2xl shadow p-8">
        {activeTab === "overview" && (
          <>{role === "company" ? <CompanyProfile /> : <PersonalProfile />}</>
        )}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
};

export default Profile;

/* ====================================================================
   🏢 Hồ sơ Doanh nghiệp
==================================================================== */
const CompanyProfile = () => (
  <div>
    {/* Header */}
    <div className="flex items-center justify-between mb-8 border-b pb-4">
      <div className="flex items-center space-x-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nguyễn Văn Nam</h1>
          <p className="text-gray-600">CEO, Công ty TNHH ABC</p>
          <p className="text-sm text-gray-500">Thành viên từ: Tháng 1, 2023</p>
        </div>
      </div>
      <button className="flex items-center gap-2 border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg transition">
        ✏️ Chỉnh sửa hồ sơ
      </button>
    </div>

    {/* Info */}
    <div className="bg-gray-50 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin doanh nghiệp</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Tên công ty" value="Công ty TNHH ABC" />
        <Info label="Mã số thuế" value="0123456789" />
        <Info label="Lĩnh vực" value="Công nghệ thông tin" />
        <Info label="Quy mô" value="50-100 nhân viên" />
        <Info label="Địa chỉ" value="123 Đường ABC, Quận 1, TP.HCM" full />
      </div>
    </div>

    {/* Activities + Stats */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RecentActivities />
      <div className="space-y-6">
        <Stats />
        <Verification />
      </div>
    </div>
  </div>
);

/* ====================================================================
   👤 Hồ sơ Cá nhân
==================================================================== */
const PersonalProfile = () => (
  <div>
    {/* Header */}
    <div className="flex items-center justify-between mb-8 border-b pb-4">
      <div className="flex items-center space-x-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
          alt="Avatar"
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trần Minh An</h1>
          <p className="text-gray-600">Nhân viên Marketing</p>
          <p className="text-sm text-gray-500">Thành viên từ: Tháng 3, 2024</p>
        </div>
      </div>
      <button className="flex items-center gap-2 border border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white px-4 py-2 rounded-lg transition">
        ✏️ Chỉnh sửa hồ sơ
      </button>
    </div>

    {/* Info */}
    <div className="bg-gray-50 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cá nhân</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Info label="Họ và tên" value="Trần Minh An" />
        <Info label="Giới tính" value="Nam" />
        <Info label="Ngày sinh" value="12/05/1998" />
        <Info label="Số điện thoại" value="0909 999 999" />
        <Info label="Email" value="minhan@gmail.com" />
        <Info label="Địa chỉ" value="Quận 1, TP.HCM" full />
      </div>
    </div>

    {/* Activities */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <RecentActivities short />
      <div className="space-y-6">
        <StatsPersonal />
      </div>
    </div>
  </div>
);

/* ====================================================================
   🔧 Các component dùng chung
==================================================================== */
const Info = ({ label, value, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      value={value}
      readOnly
      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700"
    />
  </div>
);

const RecentActivities = ({ short }) => (
  <div className={`bg-gray-50 rounded-xl p-6 ${short ? "lg:col-span-2" : "lg:col-span-2"}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
    <ul className="space-y-3 text-sm">
      <li className="flex items-start space-x-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
        <div>
          <p className="text-gray-800">
            {short ? "Đã bình luận bài viết" : "Đã kết nối với Công ty XYZ"}
          </p>
          <p className="text-xs text-gray-500">2 giờ trước</p>
        </div>
      </li>
      <li className="flex items-start space-x-3">
        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
        <div>
          <p className="text-gray-800">
            {short ? "Cập nhật hồ sơ cá nhân" : "Cập nhật sản phẩm mới"}
          </p>
          <p className="text-xs text-gray-500">1 ngày trước</p>
        </div>
      </li>
    </ul>
  </div>
);

const Stats = () => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê</h3>
    <ul className="space-y-2 text-sm">
      <Stat label="Kết nối" value="127" color="blue" />
      <Stat label="Giao dịch" value="15" color="green" />
      <Stat label="Đánh giá" value="4.8/5" color="orange" />
    </ul>
  </div>
);

const StatsPersonal = () => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê</h3>
    <ul className="space-y-2 text-sm">
      <Stat label="Bài đăng" value="12" color="blue" />
      <Stat label="Kết nối" value="58" color="green" />
      <Stat label="Đánh giá" value="4.9/5" color="orange" />
    </ul>
  </div>
);

const Stat = ({ label, value, color }) => (
  <li className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className={`font-semibold text-${color}-600`}>{value}</span>
  </li>
);

const Verification = () => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Trạng thái xác minh</h3>
    <ul className="space-y-2 text-sm">
      <li className="flex justify-between items-center">
        <span className="text-gray-700">Email</span>
        <span className="text-green-600 font-medium">Đã xác minh</span>
      </li>
      <li className="flex justify-between items-center">
        <span className="text-gray-700">Giấy phép kinh doanh</span>
        <span className="text-green-600 font-medium">Đã xác minh</span>
      </li>
    </ul>
  </div>
);

const SettingsTab = () => (
  <div>
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Cài đặt</h2>
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b py-3">
        <span className="text-gray-700">Chủ đề</span>
        <select className="border rounded-md px-3 py-1 text-gray-700">
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>
    </div>
  </div>
);
