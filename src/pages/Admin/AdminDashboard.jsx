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
        labels: ["Q1", "Q2", "Q3", "Q4"],
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

    // Pie Chart 1 - Total Order
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

    // Pie Chart 2 - Customer Growth
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

    // Pie Chart 3 - Total Revenue
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
      <AdminHeader title="Dashboard" subtitle="Welcome back! Here's what's happening today." />

        <div className="stats-grid">
          {/* Total Orders */}
          <div className="stat-card">
            <div className="stat-icon bg-green">
              <i className="bi bi-clipboard-check"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">75</div>
              <div className="stat-label">Total Orders</div>
              <div className="stat-change positive">
                <i className="bi bi-arrow-up"></i> 4% (30 days)
              </div>
            </div>
          </div>

          {/* Total Canceled */}
          <div className="stat-card">
            <div className="stat-icon bg-red">
              <i className="bi bi-x-circle"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">65</div>
              <div className="stat-label">Total Canceled</div>
              <div className="stat-change negative">
                <i className="bi bi-arrow-up"></i> 25% (30 days)
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="stat-card">
            <div className="stat-icon bg-yellow">
              <i className="bi bi-currency-dollar"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">$128</div>
              <div className="stat-label">Total Revenue</div>
              <div className="stat-change negative">
                <i className="bi bi-arrow-down"></i> 12% (30 days)
              </div>
            </div>
          </div>

          {/* Total Delivered */}
          <div className="stat-card">
            <div className="stat-icon bg-blue">
              <i className="bi bi-box-seam"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">357</div>
              <div className="stat-label">Total Delivered</div>
              <div className="stat-change positive">
                <i className="bi bi-arrow-up"></i> 4% (30 days)
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Bar Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Bar Chart</h3>
            <div className="chart-container">
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>

          {/* Pie Charts */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Pie Chart</h3>
              <div className="chart-controls">
                <label className="control-checkbox">
                  <input type="checkbox" /> Chart
                </label>
                <label className="control-checkbox">
                  <input type="checkbox" defaultChecked /> Show Value
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
                  Total
                  <br />
                  Order
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
                  Customer
                  <br />
                  Growth
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
                  Total
                  <br />
                  Revenue
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default AdminDashboard;
