import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import AdminHeader from "./components/AdminHeader";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const barChartRef = useRef(null);
  const pieChart1Ref = useRef(null);
  const pieChart2Ref = useRef(null);
  const pieChart3Ref = useRef(null);

  useEffect(() => {
    // Bar Chart
    const barCtx = barChartRef.current.getContext("2d");
    const barChart = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Quý 1", "Quý 2", "Quý 3", "Quý 4"],
        datasets: [
          {
            data: [65, 59, 80, 81],
            backgroundColor: ["#5DADE2", "#EC7C94", "#F7DC6F", "#76D7C4"],
            borderRadius: 5,
            barThickness: 60,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 90,
            ticks: { stepSize: 10 },
            grid: { color: "#f0f0f0" },
          },
          x: {
            grid: { display: false },
          },
        },
      },
    });

    // Pie 1 – Tổng đơn hàng
    const pie1Ctx = pieChart1Ref.current.getContext("2d");
    const pieChart1 = new Chart(pie1Ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [81, 19],
            backgroundColor: ["#EC7063", "#F5B7B1"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });

    // Pie 2 – Tăng trưởng khách hàng
    const pie2Ctx = pieChart2Ref.current.getContext("2d");
    const pieChart2 = new Chart(pie2Ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [22, 78],
            backgroundColor: ["#48C9B0", "#D5F4E6"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
      },
    });

    // Pie 3 – Tổng doanh thu
    const pie3Ctx = pieChart3Ref.current.getContext("2d");
    const pieChart3 = new Chart(pie3Ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: [62, 38],
            backgroundColor: ["#3498DB", "#AED6F1"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "75%",
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
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
        subtitle="Chào mừng bạn quay trở lại! Đây là tổng quan hôm nay."
      />

      <div className="stats-grid">
        {/* Tổng đơn hàng */}
        <div className="stat-card">
          <div className="stat-icon bg-green">
            <i className="bi bi-clipboard-check"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">75</div>
            <div className="stat-label">Tổng đơn hàng</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up"></i> 4% (30 ngày)
            </div>
          </div>
        </div>

        {/* Đơn hủy */}
        <div className="stat-card">
          <div className="stat-icon bg-red">
            <i className="bi bi-x-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">65</div>
            <div className="stat-label">Đơn bị hủy</div>
            <div className="stat-change negative">
              <i className="bi bi-arrow-up"></i> 25% (30 ngày)
            </div>
          </div>
        </div>

        {/* Doanh thu */}
        <div className="stat-card">
          <div className="stat-icon bg-yellow">
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">$128</div>
            <div className="stat-label">Tổng doanh thu</div>
            <div className="stat-change negative">
              <i className="bi bi-arrow-down"></i> 12% (30 ngày)
            </div>
          </div>
        </div>

        {/* Đơn giao thành công */}
        <div className="stat-card">
          <div className="stat-icon bg-blue">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="stat-info">
            <div className="stat-number">357</div>
            <div className="stat-label">Đã giao thành công</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up"></i> 4% (30 ngày)
            </div>
          </div>
        </div>
      </div>

      {/* Khu vực biểu đồ */}
      <div className="charts-grid">
        {/* Bar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Biểu đồ cột</h3>
          <div className="chart-container">
            <canvas ref={barChartRef}></canvas>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Biểu đồ tròn</h3>
            <div className="chart-controls">
              <label className="control-checkbox">
                <input type="checkbox" /> Biểu đồ
              </label>
              <label className="control-checkbox">
                <input type="checkbox" defaultChecked /> Hiển thị giá trị
              </label>
              <button className="control-menu">
                <i className="bi bi-three-dots-vertical"></i>
              </button>
            </div>
          </div>

          <div className="pie-charts-container">
            <div className="pie-chart-item">
              <div className="pie-chart-wrapper">
                <canvas ref={pieChart1Ref}></canvas>
                <div className="pie-chart-label">
                  81<span className="pie-percent">%</span>
                </div>
              </div>
              <div className="pie-chart-title">
                Tổng
                <br />
                Đơn hàng
              </div>
            </div>

            <div className="pie-chart-item">
              <div className="pie-chart-wrapper">
                <canvas ref={pieChart2Ref}></canvas>
                <div className="pie-chart-label">
                  22<span className="pie-percent">%</span>
                </div>
              </div>
              <div className="pie-chart-title">
                Tăng trưởng
                <br />
                Khách hàng
              </div>
            </div>

            <div className="pie-chart-item">
              <div className="pie-chart-wrapper">
                <canvas ref={pieChart3Ref}></canvas>
                <div className="pie-chart-label">
                  62<span className="pie-percent">%</span>
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
