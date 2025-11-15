import React from 'react';
import DashboardChart from '../../components/DashboardChart';

const Dashboard = () => {
  // sample data - replace with real API data in integration
  const posts = [
    { id: 1, title: 'Đồng hồ cổ', views: 120, bids: 8 },
    { id: 2, title: 'Túi xách da', views: 80, bids: 5 },
    { id: 3, title: 'Giày thể thao', views: 200, bids: 15 },
  ];

  const chartData = posts.map((p) => ({ label: p.id, value: p.views }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-3xl font-extrabold mb-4">Dashboard người dùng</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-2">Thống kê lượt xem tin đăng (views)</h3>
          <DashboardChart data={chartData} />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold mb-2">Tổng quan</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-gray-50 rounded">Tin đăng: <div className="text-lg font-bold">{posts.length}</div></div>
            <div className="p-3 bg-gray-50 rounded">Tổng lượt xem: <div className="text-lg font-bold">{posts.reduce((s,p)=>s+p.views,0)}</div></div>
            <div className="p-3 bg-gray-50 rounded">Tổng lượt đấu: <div className="text-lg font-bold">{posts.reduce((s,p)=>s+p.bids,0)}</div></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold mb-3">Hiệu quả tin đăng</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="pb-2">Tiêu đề</th>
                <th className="pb-2">Lượt xem</th>
                <th className="pb-2">Số lần đấu</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2">{p.title}</td>
                  <td className="py-2">{p.views}</td>
                  <td className="py-2">{p.bids}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
