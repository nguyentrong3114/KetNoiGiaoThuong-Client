import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import AdminHeader from "./components/AdminHeader";
import "./PostsAds.css";

const PostsAds = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [filter, setFilter] = useState("month");

  // Fake dữ liệu theo từng bộ lọc
  const dataByFilter = {
    today: [120, 200, 150, 220, 260, 180, 300],
    week: [700, 850, 900, 880, 920, 780, 650],
    month: Array.from({ length: 30 }, () => Math.floor(Math.random() * 1500 + 1500)),
    year: Array.from({ length: 12 }, () => Math.floor(Math.random() * 15000 + 10000)),
  };

  const labelsByFilter = {
    today: ["8h", "9h", "10h", "11h", "12h", "13h", "14h"],
    week: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    month: Array.from({ length: 30 }, (_, i) => `Ngày ${i + 1}`),
    year: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12"],
  };

  // Render chart
  const renderChart = () => {
    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labelsByFilter[filter],
        datasets: [
          {
            label: "Lượt truy cập mới",
            data: dataByFilter[filter],
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
            labels: { color: "#fff" },
          },
          tooltip: {
            backgroundColor: "#000",
            titleColor: "#fff",
            bodyColor: "#fff",
          },
        },
        scales: {
          x: {
            ticks: { color: "#ddd" },
            grid: { display: false },
          },
          y: {
            ticks: { color: "#ddd" },
            grid: { color: "rgba(255,255,255,0.1)" },
          },
        },
      },
    });
  };

  // Rerender chart khi đổi filter
  useEffect(() => {
    renderChart();
  }, [filter]);

  return (
    <>
      <AdminHeader title="Bài đăng / Quảng cáo" subtitle="Thống kê tổng quan lượt truy cập" />

      {/* Tổng quan */}
      <div className="overview-box">
        <div>
          <h2 className="overview-label">Tổng quan hiệu suất quảng cáo</h2>
          <div className="overview-value">$45,000</div>
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
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </>
  );
};

export default PostsAds;
