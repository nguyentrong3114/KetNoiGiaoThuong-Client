import React from "react";

// Small, dependency-free SVG bar chart for the dashboard
const DashboardChart = ({ data = [], width = 600, height = 220 }) => {
  if (!data.length) return <div className="text-sm text-gray-500">Không có dữ liệu</div>;

  const max = Math.max(...data.map((d) => d.value));
  const barWidth = width / data.length - 20; // tăng spacing để label thoáng

  const paddingTop = 10;
  const paddingBottom = 35; // ⭐ tăng từ 20 → 35 cho label không bị che
  const chartHeight = height - paddingTop - paddingBottom;

  return (
    <svg width={width} height={height} className="w-full">
      {data.map((d, i) => {
        const h = (d.value / (max || 1)) * chartHeight;
        const x = i * (barWidth + 20) + 25;
        const y = height - paddingBottom - h;

        return (
          <g key={i}>
            {/* BAR */}
            <rect x={x} y={y} width={barWidth} height={h} fill="#3b82f6" rx="6" />

            {/* LABEL */}
            <text
              x={x + barWidth / 2}
              y={height - 12} // ⭐ không chạm đáy nữa
              fontSize="11"
              textAnchor="middle"
              fill="#374151"
              style={{ pointerEvents: "none" }}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default DashboardChart;
