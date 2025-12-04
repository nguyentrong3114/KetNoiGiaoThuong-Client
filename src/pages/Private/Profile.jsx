/* ============================================================
   📌 PROFILE PAGE – NO API VERSION (DEMO MODE)
============================================================ */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiSettings, FiLogOut, FiLock, FiStar } from "react-icons/fi";

const Profile = () => {
  const navigate = useNavigate();

  /* ============================================================
      📌 DEMO PROFILE (KHÔNG GỌI API)
  ============================================================= */
  const [profile, setProfile] = useState({
    id: "",
    name: "",
    role: "personal",
    phone: "",
    address: "",
    birthDate: "",
    companyName: "",
    taxCode: "",
    joinedAt: "",
    verifyStatus: "unverified",
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  /* ============================================================
      📌 LOGOUT
  ============================================================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
      {/* ====================== SIDEBAR ====================== */}
      <aside className="w-full lg:w-1/4 bg-white rounded-2xl shadow p-6">
        <div className="flex items-center space-x-3 mb-8 border-b pb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            className="w-12 h-12 rounded-full"
            alt="avatar"
          />
          <div>
            <h2 className="font-semibold text-gray-800">{profile?.name || "—"}</h2>
            <p className="text-sm text-gray-500">{profile?.phone || "—"}</p>
          </div>
        </div>

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

      {/* ====================== MAIN CONTENT ====================== */}
      <main className="flex-1 bg-white rounded-2xl shadow p-8">
        {loading && <p className="text-gray-500 italic">Đang tải dữ liệu hồ sơ...</p>}

        {/* OVERVIEW */}
        {activeTab === "overview" &&
          (profile.role === "business" ? (
            <CompanyProfile profile={profile} />
          ) : (
            <PersonalProfile profile={profile} />
          ))}

        {/* REVIEWS */}
        {activeTab === "reviews" && <ReviewsTab />}

        {/* SETTINGS */}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
};

export default Profile;

/* ============================================================
   ⭐ COMPONENT BÊN DƯỚI
============================================================ */
const ReviewsTab = () => (
  <div>
    <h2 className="text-xl font-bold mb-6">Đánh giá & Nhận xét</h2>
    <p className="text-gray-500 italic text-sm">Chưa có đánh giá nào.</p>
  </div>
);

const CompanyProfile = ({ profile }) => (
  <div>
    <ProfileHeader
      name={profile.name || "—"}
      position="Doanh nghiệp"
      date={profile.joinedAt || "—"}
    />

    <InfoCard title="Thông tin doanh nghiệp">
      <Info label="Tên công ty" value={profile.companyName || "—"} />
      <Info label="Mã số thuế / Giấy phép" value={profile.taxCode || "—"} />
      <Info label="Địa chỉ" value={profile.address || "—"} full />
    </InfoCard>

    <InfoCard title="Trạng thái xác minh">
      <Info label="Trạng thái" value="Chưa xác minh" />
    </InfoCard>
  </div>
);

const PersonalProfile = ({ profile }) => (
  <div>
    <ProfileHeader
      name={profile.name || "—"}
      position="Thành viên"
      date={profile.joinedAt || "—"}
    />

    <InfoCard title="Thông tin cá nhân">
      <Info label="Họ và tên" value={profile.name || "—"} />
      <Info label="Ngày sinh" value={profile.birthDate || "—"} />
      <Info label="SĐT" value={profile.phone || "—"} />
      <Info label="Địa chỉ" value={profile.address || "—"} full />
    </InfoCard>

    <InfoCard title="Trạng thái xác minh">
      <Info label="Trạng thái" value="Chưa xác minh" />
    </InfoCard>
  </div>
);

const ProfileHeader = ({ name, position, date }) => (
  <div className="flex items-center justify-between mb-8 border-b pb-4">
    <div className="flex items-center space-x-4">
      <img
        src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
        className="w-16 h-16 rounded-full"
      />
      <div>
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-gray-600">{position}</p>
        <p className="text-sm text-gray-500">Thành viên từ: {date}</p>
      </div>
    </div>
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

const SettingsTab = () => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Cài đặt</h2>
    <p className="text-gray-500 text-sm">Chưa có chức năng cài đặt.</p>
  </div>
);
