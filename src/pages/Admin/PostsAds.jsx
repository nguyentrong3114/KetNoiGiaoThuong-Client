import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import AdminHeader from "./components/AdminHeader";
import { adminApi } from "../../services/apiClient";
import "./PostsAds.css";

const PostsAds = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [filter, setFilter] = useState("month");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [promotions, setPromotions] = useState([]);

  // Fetch data từ API
  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi API stats và danh sách promotions
      const [statsRes, promoRes] = await Promise.all([
        adminApi.getPromotionStats(),
        adminApi.getPromotions({ per_page: 100 }),
      ]);
      
      console.log("📊 Promotion stats:", statsRes);
      console.log("📢 Promotions list:", promoRes);
      
      setStats(statsRes.data || statsRes);
      setPromotions(promoRes.data || []);
    } catch (error) {
      console.error("Error fetching promotion data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán dữ liệu cho chart
  const getChartData = () => {
    if (!promotions.length) return { labels: [], values: [] };
    
    // Group by date
    const grouped = {};
    promotions.forEach(promo => {
      const date = promo.created_at?.split('T')[0] || promo.created_at?.split(' ')[0];
      if (date) {
        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += promo.impressions || 0;
      }
    });
    
    const sortedDates = Object.keys(grouped).sort();
    return {
      labels: sortedDates.slice(-10), // Lấy 10 ngày gần nhất
      values: sortedDates.slice(-10).map(d => grouped[d]),
    };
  };

  // Vẽ chart
  useEffect(() => {
    if (loading) return;
    
    const { labels, values } = getChartData();
    
    if (!labels.length || !chartRef.current) return;

    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Lượt hiển thị (Impressions)",
            data: values,
            backgroundColor: "#00D9C0",
            borderRadius: 6,
            barThickness: "flex",
            maxBarThickness: 40,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: "#fff" }
          }
        },
        scales: {
          x: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
          y: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
        }
      },
    });
  }, [loading, promotions]);

  // Tính tổng
  const totalImpressions = promotions.reduce((sum, p) => sum + (p.impressions || 0), 0);
  const totalClicks = promotions.reduce((sum, p) => sum + (p.clicks || 0), 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;
  const activeCount = promotions.filter(p => p.status === 'active').length;
  const pendingCount = promotions.filter(p => p.status === 'pending').length;

  const { labels } = getChartData();

  // Duyệt quảng cáo
  const handleApprove = async (id) => {
    if (!window.confirm("Bạn có chắc muốn duyệt quảng cáo này?")) return;
    
    try {
      await adminApi.approvePromotion(id);
      alert("✅ Đã duyệt quảng cáo thành công! Quảng cáo sẽ được hiển thị trên trang tìm kiếm.");
      fetchData(); // Reload data
    } catch (error) {
      alert("❌ Lỗi: " + (error.message || "Không thể duyệt quảng cáo"));
    }
  };

  // Từ chối quảng cáo
  const handleReject = async (id) => {
    const reason = window.prompt("Nhập lý do từ chối:");
    if (reason === null) return; // User cancelled
    
    try {
      await adminApi.rejectPromotion(id, reason);
      alert("✅ Đã từ chối quảng cáo");
      fetchData(); // Reload data
    } catch (error) {
      alert("❌ Lỗi: " + (error.message || "Không thể từ chối quảng cáo"));
    }
  };

  return (
    <>
      <AdminHeader title="Bài đăng / Quảng cáo" subtitle="Thống kê tổng quan hiệu suất quảng cáo" />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Tổng quảng cáo</p>
          <p className="text-2xl font-bold text-blue-600">{promotions.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Đang chạy</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">Chờ duyệt</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border">
          <p className="text-sm text-gray-500">CTR trung bình</p>
          <p className="text-2xl font-bold text-purple-600">{avgCTR}%</p>
        </div>
      </div>

      {/* Tổng quan */}
      <div className="overview-box">
        <div>
          <h2 className="overview-label">Tổng quan hiệu suất quảng cáo</h2>
          <div className="overview-value">
            {loading ? "Đang tải..." : `${totalImpressions.toLocaleString()} lượt hiển thị • ${totalClicks.toLocaleString()} clicks`}
          </div>
        </div>

        <div className="filter-row">
          {[
            { key: "today", label: "Hôm nay" },
            { key: "week", label: "Tuần" },
            { key: "month", label: "Tháng" },
            { key: "year", label: "Năm" },
          ].map((f) => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? "active" : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}

          <button className="export-btn">
            <i className="bi bi-download"></i> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-wrapper">
        <div className="chart-container dark-chart-bg">
          {loading ? (
            <div className="text-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-400 mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : !labels.length ? (
            <p className="text-center text-gray-400 py-10">Chưa có dữ liệu thống kê.</p>
          ) : (
            <canvas ref={chartRef}></canvas>
          )}
        </div>
      </div>

      {/* Danh sách quảng cáo chờ duyệt */}
      {pendingCount > 0 && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-yellow-50">
            <h3 className="font-semibold text-yellow-800">⏳ Quảng cáo chờ duyệt ({pendingCount})</h3>
          </div>
          <div className="divide-y">
            {promotions.filter(p => p.status === 'pending').slice(0, 5).map(promo => (
              <div key={promo.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <img 
                    src={promo.listing?.images?.[0] || "https://via.placeholder.com/50"} 
                    alt="" 
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{promo.listing?.title || `Listing #${promo.listing_id}`}</p>
                    <p className="text-sm text-gray-500">
                      {promo.type === 'top_search' ? '🔝 Top tìm kiếm' : 
                       promo.type === 'featured' ? '⭐ Nổi bật' : 
                       promo.type === 'homepage_banner' ? '🏠 Banner trang chủ' : '📂 Banner danh mục'}
                      {' • '}
                      {new Date(promo.created_at).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove(promo.id)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                  >
                    ✓ Duyệt
                  </button>
                  <button 
                    onClick={() => handleReject(promo.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
                  >
                    ✗ Từ chối
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PostsAds;
