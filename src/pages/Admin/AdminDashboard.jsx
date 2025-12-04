import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import AdminHeader from "./components/AdminHeader";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const barChartRef = useRef(null);
  const pieChart1Ref = useRef(null);
  const pieChart2Ref = useRef(null);
  const pieChart3Ref = useRef(null);

  const [showCharts, setShowCharts] = useState(true);
  const [showValues, setShowValues] = useState(true);

  useEffect(() => {
    // ===== BAR CHART =====
    const barCtx = barChartRef.current.getContext("2d");
    const barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: [], // ← bỏ label demo
        datasets: [
          {
            data: [], // ← bỏ số liệu demo
            backgroundColor: [],
            borderRadius: 5,
            barThickness: 60,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 10, ticks: { stepSize: 2 }, grid: { color: "#f0f0f0" } },
          x: { grid: { display: false } },
        },
      },
    });

    // ===== PIE 1 =====
    const pie1Ctx = pieChart1Ref.current.getContext("2d");
    const pieChart1 = new Chart(pie1Ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [], // ← XÓA DEMO 81 – 19
            backgroundColor: [],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });

    // ===== PIE 2 =====
    const pie2Ctx = pieChart2Ref.current.getContext("2d");
    const pieChart2 = new Chart(pie2Ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [], // ← XÓA DEMO 22 – 78
            backgroundColor: [],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });

    // ===== PIE 3 =====
    const pie3Ctx = pieChart3Ref.current.getContext("2d");
    const pieChart3 = new Chart(pie3Ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [], // ← XÓA DEMO 62 – 38
            backgroundColor: [],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      },
    });

    return () => {
      barChart.destroy();
      pieChart1.destroy();
      pieChart2.destroy();
      pieChart3.destroy();
    };
  }, []);

  return (
    <>
      <AdminHeader
        title="Bảng điều khiển"
        subtitle="Dữ liệu thống kê sẽ hiển thị khi kết nối API."
      />

      {/* ==== THỐNG KÊ NHANH ==== */}
      <div className="stats-grid">
        {/* Tổng đơn hàng */}
        <div className="stat-card">
          <div className="stat-icon bg-green">
            <i className="bi bi-clipboard-check"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">0</div> {/* ← demo removed */}
            <div className="stat-label">Tổng đơn hàng</div>
            <div className="stat-change positive">— {/* không có % demo */}</div>
          </div>
        </div>

        {/* Đơn bị hủy */}
        <div className="stat-card">
          <div className="stat-icon bg-red">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">0</div>
            <div className="stat-label">Đơn bị hủy</div>
            <div className="stat-change negative">—</div>
          </div>
        </div>

        {/* Tổng doanh thu */}
        <div className="stat-card">
          <div className="stat-icon bg-yellow">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">₫0</div>
            <div className="stat-label">Tổng doanh thu</div>
            <div className="stat-change negative">—</div>
          </div>
        </div>

        {/* Đã giao thành công */}
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">0</div>
            <div className="stat-label">Đã giao thành công</div>
            <div className="stat-change positive">—</div>
          </div>
        </div>
      </div>

      {/* ==== CHARTS ==== */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Biểu đồ cột</h3>
          <div className="chart-container">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>

        {/* Pie Charts */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Biểu đồ tròn</h3>

            <div className="chart-controls">
              <label className="control-checkbox">
                <input
                  type="checkbox"
                  checked={showCharts}
                  onChange={() => setShowCharts(!showCharts)}
                />
                Biểu đồ
              </label>

              <label className="control-checkbox">
                <input
                  type="checkbox"
                  checked={showValues}
                  onChange={() => setShowValues(!showValues)}
                />
                Hiển thị giá trị
              </label>

              <button className="control-menu">
                <i className="bi bi-three-dots-vertical"></i>
              </button>
            </div>
          </div>

          {/* Pie chart block */}
          <div
            className="pie-charts-container"
            style={{
              opacity: showCharts ? 1 : 0.2,
              pointerEvents: showCharts ? "auto" : "none",
              transition: "0.3s",
            }}
          >
            {/* Pie 1 */}
            <div className="pie-chart-item">
              <div className="pie-chart-wrapper">
                <canvas ref={pieChart1Ref}></canvas>

                <div className="pie-chart-label" style={{ display: showValues ? "flex" : "none" }}>
                  —<span className="pie-percent">%</span>
                </div>
              </div>
              <div className="pie-chart-title">
                Tổng
                <br />
                Đơn hàng
              </div>
            </div>

            {/* Pie 2 */}
            <div className="pie-chart-item">
              <div className="pie-chart-wrapper">
                <canvas ref={pieChart2Ref}></canvas>

                <div className="pie-chart-label" style={{ display: showValues ? "flex" : "none" }}>
                  —<span className="pie-percent">%</span>
                </div>
              </div>
              <div className="pie-chart-title">
                Tăng trưởng
                <br />
                Khách hàng
              </div>
            </div>

            {/* Pie 3 */}
            <div className="pie-chart-item">
              <div className="pie-chart-wrapper">
                <canvas ref={pieChart3Ref}></canvas>

                <div className="pie-chart-label" style={{ display: showValues ? "flex" : "none" }}>
                  —<span className="pie-percent">%</span>
                </div>
              </div>
              <div className="pie-chart-title">
                Tổng
                <br />
                Doanh thu
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
