import React from "react";
import { FiEye, FiActivity, FiTrendingUp } from "react-icons/fi";
import DashboardChart from "../../components/Auction/DashboardChart";

const DashboardCompany = () => {
  // ❗ Không còn dùng DEMO — sẽ nhận API sau
  const posts = [];

  // Số liệu tổng
  const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);
  const totalBids = posts.reduce((s, p) => s + (p.bids || 0), 0);

  // Dữ liệu cho biểu đồ
  const chartData = posts.map((p) => ({
    label: p.title,
    value: p.views,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* PAGE TITLE */}
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard Doanh Nghiệp</h2>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-5 bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Tổng số tin đã đăng</span>
            <FiActivity className="text-indigo-600 text-xl" />
          </div>
          <div className="mt-2 text-3xl font-bold">{posts.length}</div>
        </div>

        <div className="p-5 bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Tổng lượt xem</span>
            <FiEye className="text-blue-600 text-xl" />
          </div>
          <div className="mt-2 text-3xl font-bold">{totalViews}</div>
        </div>

        <div className="p-5 bg-white shadow-sm rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Tổng tương tác</span>
            <FiTrendingUp className="text-green-600 text-xl" />
          </div>
          <div className="mt-2 text-3xl font-bold">{totalBids}</div>
        </div>
      </div>

      {/* CHART + SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Biểu đồ lượt xem theo từng bài đăng
          </h3>

          {/* Nếu không có data → DashboardChart tự hiển thị placeholder */}
          <DashboardChart data={chartData} />
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Tổng quan hiệu suất doanh nghiệp
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            Thống kê tổng quan về mức độ quan tâm và tương tác của khách hàng đối với sản phẩm. Khi
            có API, dữ liệu sẽ hiển thị đầy đủ giúp doanh nghiệp đánh giá hiệu quả bán hàng.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-xs text-gray-500">Tin đăng</div>
              <div className="text-xl font-bold">{posts.length}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-xs text-gray-500">Lượt xem</div>
              <div className="text-xl font-bold">{totalViews}</div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-xs text-gray-500">Tương tác</div>
              <div className="text-xl font-bold">{totalBids}</div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hiệu quả từng tin đăng</h3>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">Chưa có dữ liệu.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  <th className="pb-2">Tiêu đề</th>
                  <th className="pb-2">Lượt xem</th>
                  <th className="pb-2">Tương tác</th>
                  <th className="pb-2">Tỉ lệ (%)</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => {
                  const ratio = p.views > 0 ? ((p.bids / p.views) * 100).toFixed(1) : "0.0";

                  return (
                    <tr key={p.id} className="border-b">
                      <td className="py-2">{p.title}</td>
                      <td className="py-2">{p.views}</td>
                      <td className="py-2">{p.bids}</td>
                      <td className="py-2 text-indigo-600 font-semibold">{ratio}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCompany;
