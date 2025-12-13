import React from "react";

// Horizontal bar chart - better for long labels
const DashboardChart = ({ data = [] }) => {
  if (!data.length) return <div className="text-sm text-gray-500">Không có dữ liệu</div>;

  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((d, i) => {
        const percentage = max > 0 ? (d.value / max) * 100 : 0;
        
        // Truncate label nếu quá dài
        const truncatedLabel = d.label.length > 40 
          ? d.label.substring(0, 40) + "..." 
          : d.label;

        return (
          <div key={i} className="space-y-1">
            {/* Label */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700 font-medium truncate" title={d.label}>
                {truncatedLabel}
              </span>
              <span className="text-blue-600 font-bold ml-2">{d.value}</span>
            </div>
            
            {/* Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardChart;
