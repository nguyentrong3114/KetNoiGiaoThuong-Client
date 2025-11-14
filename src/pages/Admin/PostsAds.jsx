import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import AdminHeader from "./components/AdminHeader";
import "./PostsAds.css";

const PostsAds = () => {
  const barChartRef = useRef(null);

  useEffect(() => {
    const ctx = barChartRef.current.getContext("2d");
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Sun 12", "Mon 13", "Tue 14", "Wed 15", "Thu 16", "Fri 17", "Sat 18"],
        datasets: [
          {
            label: "Lượt truy cập mới",
            data: [1650, 2550, 2150, 2450, 2700, 2850, 2600],
            backgroundColor: "#00D9C0",
            borderRadius: 8,
            barThickness: 60,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              usePointStyle: true,
              pointStyle: "circle",
              color: "#fff",
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: "#fff",
            titleColor: "#000",
            bodyColor: "#000",
            borderColor: "#ddd",
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              label: function (context) {
                return context.parsed.y;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 3000,
            ticks: {
              stepSize: 500,
              color: "#999",
            },
            grid: {
              color: "#444",
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#999",
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <>
      <AdminHeader title="Bài đăng / Quảng cáo" subtitle="" />

      {/* Tổng quan quảng cáo */}
      <div className="overview-section">
        <div className="overview-header">
          <div>
            <h2 className="overview-title">Tổng quan hiệu suất quảng cáo</h2>
            <div className="overview-amount">$45,000</div>
          </div>

          <div className="overview-controls">
            <div className="time-filters">
              <button className="time-btn">Hôm nay</button>
              <button className="time-btn active">Tuần</button>
              <button className="time-btn">Tháng</button>
              <button className="time-btn">Quý</button>
              <button className="time-btn">Năm</button>
              <button className="time-btn">Tùy chọn</button>
            </div>

            <label className="compare-toggle">
              <input type="checkbox" />
              <span>Không so sánh</span>
            </label>

            <button className="btn-export">
              <i className="bi bi-download"></i>
              Xuất dữ liệu
            </button>
          </div>
        </div>

        {/* Thống kê */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-label">Tổng bài đăng</div>
            <div className="stat-value">$14,509</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up"></i>
              <span>21%</span>
              <span className="stat-period">So với tuần trước</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Lượt nhấp</div>
            <div className="stat-value">$204</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up"></i>
              <span>$53</span>
              <span className="stat-period">So với tuần trước</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">CTR</div>
            <div className="stat-value">12%</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up"></i>
              <span>4%</span>
              <span className="stat-period">So với tuần trước</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Chi tiêu</div>
            <div className="stat-value">$306</div>
            <div className="stat-change positive">
              <i className="bi bi-arrow-up"></i>
              <span>11%</span>
              <span className="stat-period">So với tuần trước</span>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="chart-section">
        <div className="chart-header">
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-dot new-visit"></span>
              Lượt truy cập mới
            </span>
            <span className="legend-item">
              <span className="legend-dot unique-visit"></span>
              Lượt truy cập duy nhất
            </span>
            <span className="legend-item">
              <span className="legend-dot old-visit"></span>
              Lượt truy cập cũ
            </span>
          </div>

          <select className="chart-filter">
            <option>Tuần</option>
            <option>Tháng</option>
            <option>Năm</option>
          </select>
        </div>

        <div className="chart-container">
          <canvas ref={barChartRef}></canvas>
        </div>
      </div>
    </>
  );
};

export default PostsAds;
