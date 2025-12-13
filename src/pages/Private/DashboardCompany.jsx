import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiActivity, FiTrendingUp } from "react-icons/fi";
import DashboardChart from "../../components/Auction/DashboardChart";
import { listingApi } from "../../services/apiClient";

const DashboardCompany = () => {
  const [posts, setPosts] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, title: "" });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const response = await listingApi.getMyListings();
        if (response?.data) {
          setPosts(response.data);
          setSummary(response.summary || {});
        }
      } catch (error) {
        console.error("❌ Error fetching my listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, []);

  const handleDeleteListing = (id, title) => {
    setDeleteModal({ show: true, id, title });
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setDeleting(true);
    try {
      await listingApi.delete(deleteModal.id);
      setPosts(posts.filter((p) => p.id !== deleteModal.id));
      setDeleteModal({ show: false, id: null, title: "" });
    } catch (error) {
      alert("Không thể xóa sản phẩm: " + (error.message || "Lỗi"));
    } finally {
      setDeleting(false);
    }
  };

  const totalViews = summary.total_views || posts.reduce((s, p) => s + (p.views_count || 0), 0);
  const totalLikes = summary.total_likes || posts.reduce((s, p) => s + (p.likes_count || 0), 0);
  const totalComments =
    summary.total_comments || posts.reduce((s, p) => s + (p.comments_count || 0), 0);
  const totalOrders = posts.reduce((s, p) => s + (p.orders_count || 0), 0);
  const chartData = posts.map((p) => ({ label: p.title, value: p.views_count || 0 }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* PAGE TITLE + ACTION BUTTONS */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Doanh Nghiệp</h2>
        <div className="flex items-center gap-3">
          <Link
            to="/promotions"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Quảng cáo
          </Link>
          <Link
            to="/dashboard/company/post"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">Tin đăng</span>
            <FiActivity className="text-indigo-600 text-xl" />
          </div>
          <div className="mt-1 text-2xl font-bold text-indigo-600">{posts.length}</div>
        </div>
        <div className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">Lượt xem</span>
            <FiEye className="text-blue-600 text-xl" />
          </div>
          <div className="mt-1 text-2xl font-bold text-blue-600">{totalViews}</div>
        </div>
        <div className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">Tương tác</span>
            <FiTrendingUp className="text-green-600 text-xl" />
          </div>
          <div className="mt-1 text-2xl font-bold text-green-600">{totalLikes + totalComments}</div>
        </div>
        <div className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm font-medium">Đơn hàng</span>
            <svg
              className="w-5 h-5 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div className="mt-1 text-2xl font-bold text-orange-600">{totalOrders}</div>
        </div>
      </div>

      {/* CHART + SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Biểu đồ lượt xem theo từng bài đăng
          </h3>
          <DashboardChart data={chartData} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            Tổng quan hiệu suất doanh nghiệp
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Thống kê tổng quan về mức độ quan tâm và tương tác của khách hàng đối với sản phẩm.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-xs text-blue-600 font-medium">Lượt xem</div>
              <div className="text-xl font-bold text-blue-700">{totalViews}</div>
              <div className="text-xs text-blue-500">
                TB: {posts.length > 0 ? Math.round(totalViews / posts.length) : 0}/tin
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-xs text-green-600 font-medium">Likes</div>
              <div className="text-xl font-bold text-green-700">{totalLikes}</div>
              <div className="text-xs text-green-500">
                TB: {posts.length > 0 ? Math.round(totalLikes / posts.length) : 0}/tin
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-xs text-purple-600 font-medium">Comments</div>
              <div className="text-xl font-bold text-purple-700">{totalComments}</div>
              <div className="text-xs text-purple-500">
                TB: {posts.length > 0 ? Math.round(totalComments / posts.length) : 0}/tin
              </div>
            </div>
            <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="text-xs text-orange-600 font-medium">Đơn hàng</div>
              <div className="text-xl font-bold text-orange-700">{totalOrders}</div>
              <div className="text-xs text-orange-500">
                TB: {posts.length > 0 ? Math.round(totalOrders / posts.length) : 0}/tin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div
        className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col"
        style={{ height: "500px" }}
      >
        <div className="p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-800">
              Sản phẩm của bạn ({posts.length})
            </h3>
            <Link
              to="/dashboard/company/post"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Thêm mới
            </Link>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading && <p className="text-gray-500 text-sm">Đang tải...</p>}
          {!loading && posts.length === 0 && (
            <p className="text-gray-500 text-sm">Chưa có sản phẩm nào.</p>
          )}
          {!loading && posts.length > 0 && (
            <div className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="border border-gray-200 rounded-lg hover:shadow-md transition overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    <img
                      src={p.images?.[0] || "/default-avatar.jpg"}
                      alt={p.title}
                      className="w-24 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "/default-avatar.jpg";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{p.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span>👁️ {p.views_count || 0}</span>
                        <span className="text-red-500">❤️ {p.likes_count || 0}</span>
                        <span className="text-purple-500">💬 {p.comments_count || 0}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base font-bold text-orange-600">
                          {p.price_cents
                            ? `₫${(p.price_cents / 100).toLocaleString("vi-VN")}`
                            : "Liên hệ"}
                        </span>
                        <div className="flex gap-1">
                          <Link
                            to={`/dashboard/company/edit/${p.id}`}
                            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
                          >
                            Sửa
                          </Link>
                          <Link
                            to={`/product/${p.id}`}
                            className="px-2 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded"
                          >
                            Xem
                          </Link>
                          <button
                            onClick={() => handleDeleteListing(p.id, p.title)}
                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-4">
              Bạn có chắc muốn xóa sản phẩm{" "}
              <span className="font-medium">"{deleteModal.title}"</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, id: null, title: "" })}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg transition"
              >
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCompany;
