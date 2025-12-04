import React, { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import AdminHeader from "./components/AdminHeader";
import "./PostsAds.css";

const PostsAds = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [filter, setFilter] = useState("month");

  // ❗ Không còn dữ liệu demo
  const labels = [];
  const values = [];

  // Vẽ chart nếu có data
  const renderChart = () => {
    if (!labels.length || !values.length) return; // ❗ Không có data → không vẽ chart

    if (chartInstance.current) chartInstance.current.destroy();

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Lượt truy cập mới",
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
      },
    });
  };

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
          <div className="overview-value">-</div>
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
          {!labels.length ? (
            <p className="text-center text-gray-400 py-10">Chưa có dữ liệu thống kê.</p>
          ) : (
            <canvas ref={chartRef}></canvas>
          )}
        </div>
      </div>
    </>
  );
};

export default PostsAds;
