/* ============================================================
   📌 PROFILE PAGE – FULL VERSION (NO ERRORS)
============================================================ */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiSettings, FiLogOut, FiLock, FiStar } from "react-icons/fi";

const Profile = () => {
  const saved = localStorage.getItem("user");
  const user = saved ? JSON.parse(saved) : null;

  const role = user?.role || "company"; // default

  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const menuItems = [
    { key: "overview", icon: <FiUser />, label: "My Profile" },
    { key: "reviews", icon: <FiStar />, label: "Đánh giá & Nhận xét" },
    { key: "settings", icon: <FiSettings />, label: "Cài đặt" },
    { key: "reset", icon: <FiLock />, label: "Reset Password", link: "/reset" },
    { key: "logout", icon: <FiLogOut />, label: "Log Out", action: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row p-6 lg:p-10 gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 bg-white rounded-2xl shadow p-6">
        {/* Avatar */}
        <div className="flex items-center space-x-3 mb-8 border-b pb-4">
          <img
            src={
              role === "company"
                ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                : "https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
            }
            className="w-12 h-12 rounded-full"
            alt="avatar"
          />
          <div>
            <h2 className="font-semibold text-gray-800">
              {user?.name || (role === "company" ? "Nguyễn Văn Nam" : "Trần Minh An")}
            </h2>
            <p className="text-sm text-gray-500">{user?.email || "example@gmail.com"}</p>
          </div>
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              {item.action ? (
                <button
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-50 text-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-700 text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-blue-700 text-sm">›</span>
                </button>
              ) : item.link ? (
                <Link
                  to={item.link}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition ${
                    activeTab === item.key
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-blue-50 text-gray-700"
                  }`}
                  onClick={() => setActiveTab(item.key)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-blue-700 text-lg">{item.icon}</span>
                    <span>{item.label}</span>
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
                    <span>{item.label}</span>
                  </div>
                  <span className="text-blue-700 text-sm">›</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-white rounded-2xl shadow p-8">
        {activeTab === "overview" &&
          (role === "company" ? <CompanyProfile /> : <PersonalProfile />)}

        {activeTab === "reviews" && <ReviewsTab />}

        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
};

export default Profile;

/* ============================================================
   ⭐ TAB: ĐÁNH GIÁ GIAO DỊCH
============================================================ */
const ReviewsTab = () => {
  const ratings = {
    uyTin: 4.8,
    chatLuong: 4.7,
    thaiDo: 4.9,
    giaoHang: 4.5,
  };

  const comments = [
    {
      user: "Công ty XYZ",
      comment: "Doanh nghiệp uy tín, thanh toán nhanh.",
      score: 5,
      time: "3 ngày trước",
    },
    {
      user: "Nguyễn Văn A",
      comment: "Đóng gói đẹp, sản phẩm tốt.",
      score: 4,
      time: "1 tuần trước",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Đánh giá & Nhận xét</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <RatingBox label="Uy tín" value={ratings.uyTin} />
        <RatingBox label="Chất lượng" value={ratings.chatLuong} />
        <RatingBox label="Thái độ phục vụ" value={ratings.thaiDo} />
        <RatingBox label="Thời gian giao hàng" value={ratings.giaoHang} />
      </div>

      {comments.map((c, i) => (
        <div key={i} className="p-4 border rounded-xl bg-gray-50 shadow-sm mb-3">
          <div className="flex justify-between">
            <p className="font-semibold">{c.user}</p>
            <span className="text-yellow-500 font-bold">★ {c.score}</span>
          </div>
          <p className="text-gray-700">{c.comment}</p>
          <p className="text-xs text-gray-500">{c.time}</p>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   ⭐ HỒ SƠ DOANH NGHIỆP
============================================================ */
const CompanyProfile = () => (
  <div>
    <ProfileHeader
      name="Nguyễn Văn Nam"
      position="CEO, Công ty TNHH ABC"
      date="Tháng 1, 2023"
      avatar="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
    />

    <InfoCard title="Thông tin doanh nghiệp">
      <Info label="Tên công ty" value="Công ty TNHH ABC" />
      <Info label="Mã số thuế" value="0123456789" />
      <Info label="Lĩnh vực" value="Công nghệ thông tin" />
      <Info label="Quy mô" value="50-100 nhân viên" />
      <Info label="Địa chỉ" value="123 Đường ABC, Quận 1, TP.HCM" full />
    </InfoCard>

    <Stats />
    <Verification />
  </div>
);

/* ============================================================
   ⭐ HỒ SƠ CÁ NHÂN
============================================================ */
const PersonalProfile = () => (
  <div>
    <ProfileHeader
      name="Trần Minh An"
      position="Nhân viên Marketing"
      date="Tháng 3, 2024"
      avatar="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
    />

    <InfoCard title="Thông tin cá nhân">
      <Info label="Họ và tên" value="Trần Minh An" />
      <Info label="Giới tính" value="Nam" />
      <Info label="Ngày sinh" value="12/05/1998" />
      <Info label="SĐT" value="0909 999 999" />
      <Info label="Email" value="minhan@gmail.com" />
      <Info label="Địa chỉ" value="Quận 1, TP.HCM" full />
    </InfoCard>

    <StatsPersonal />
  </div>
);

/* ============================================================
   ⭐ COMPONENT DÙNG CHUNG
============================================================ */
const RatingBox = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-sm text-gray-600">{label}</p>
    <p className="text-2xl font-bold text-yellow-600 mt-1">★ {value.toFixed(1)}</p>
  </div>
);

const ProfileHeader = ({ name, position, date, avatar }) => (
  <div className="flex items-center justify-between mb-8 border-b pb-4">
    <div className="flex items-center space-x-4">
      <img src={avatar} className="w-16 h-16 rounded-full" alt="" />
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-gray-600">{position}</p>
        <p className="text-sm text-gray-500">Thành viên từ: {date}</p>
      </div>
    </div>

    <button className="px-4 py-2 border border-blue-700 text-blue-700 rounded-lg hover:bg-blue-700 hover:text-white">
      ✏️ Chỉnh sửa hồ sơ
    </button>
  </div>
);

const InfoCard = ({ title, children }) => (
  <div className="bg-gray-50 rounded-xl p-6 mb-6">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

const Info = ({ label, value, full }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="text-sm text-gray-600">{label}</label>
    <input className="w-full px-3 py-2 border rounded-lg mt-1 bg-white" value={value} readOnly />
  </div>
);

const Stats = () => (
  <div className="bg-gray-50 rounded-xl p-6 mb-6">
    <h3 className="text-lg font-semibold mb-4">Thống kê</h3>
    <ul className="space-y-2 text-sm">
      <li className="flex justify-between">
        <span>Kết nối</span>
        <span className="font-semibold text-blue-600">127</span>
      </li>
      <li className="flex justify-between">
        <span>Giao dịch</span>
        <span className="font-semibold text-green-600">15</span>
      </li>
      <li className="flex justify-between">
        <span>Đánh giá</span>
        <span className="font-semibold text-orange-600">4.8/5</span>
      </li>
    </ul>
  </div>
);

const StatsPersonal = () => (
  <div className="bg-gray-50 rounded-xl p-6 mb-6">
    <h3 className="text-lg font-semibold mb-4">Thống kê</h3>
    <ul className="space-y-2 text-sm">
      <li className="flex justify-between">
        <span>Bài đăng</span>
        <span className="font-semibold text-blue-600">12</span>
      </li>
      <li className="flex justify-between">
        <span>Kết nối</span>
        <span className="font-semibold text-green-600">58</span>
      </li>
      <li className="flex justify-between">
        <span>Đánh giá</span>
        <span className="font-semibold text-orange-600">4.9/5</span>
      </li>
    </ul>
  </div>
);

const Verification = () => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-4">Xác minh</h3>
    <ul className="space-y-2 text-sm">
      <li className="flex justify-between">
        <span>Email</span>
        <span className="text-green-600">Đã xác minh</span>
      </li>
      <li className="flex justify-between">
        <span>Giấy phép kinh doanh</span>
        <span className="text-green-600">Đã xác minh</span>
      </li>
    </ul>
  </div>
);

const SettingsTab = () => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Cài đặt</h2>
    <div className="space-y-4">
      <div className="flex justify-between border-b py-3">
        <span>Chủ đề</span>
        <select className="border rounded-md px-3 py-1">
          <option>Light</option>
          <option>Dark</option>
        </select>
      </div>
    </div>
  </div>
);
