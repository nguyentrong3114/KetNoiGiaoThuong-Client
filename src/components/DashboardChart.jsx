import React from 'react';

// Small, dependency-free SVG bar chart for the dashboard
const DashboardChart = ({ data = [], width = 600, height = 200 }) => {
  if (!data.length) return <div className="text-sm text-gray-500">Không có dữ liệu</div>;
  const max = Math.max(...data.map((d) => d.value));
  const barWidth = width / data.length - 10;

  return (
    <svg width={width} height={height} className="w-full h-48">
      {data.map((d, i) => {
        const h = (d.value / (max || 1)) * (height - 40);
        const x = i * (barWidth + 10) + 20;
        const y = height - h - 20;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} fill="#3b82f6" rx="4" />
            <text x={x + barWidth / 2} y={height - 4} fontSize="10" textAnchor="middle" fill="#374151">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default DashboardChart;
