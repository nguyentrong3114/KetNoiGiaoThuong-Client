import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FileText,
  Store,
  ShoppingCart,
  Wallet,
  AlertTriangle,
  Gavel,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  DollarSign,
  PieChart,
} from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import { adminApi } from "../../services/apiClient";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await adminApi.getDashboard();
      setStats(response?.data || response);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Người dùng",
      value: stats?.users?.total || 0,
      sub: `Mới hôm nay: ${stats?.users?.new_today || 0}`,
      icon: Users,
      color: "bg-blue-500",
      link: "/admin/users",
    },
    {
      title: "Bài đăng",
      value: stats?.listings?.total || 0,
      sub: `Chờ duyệt: ${stats?.listings?.pending || 0}`,
      icon: FileText,
      color: "bg-green-500",
      link: "/admin/posts",
    },
    {
      title: "Shop",
      value: stats?.shops?.total || 0,
      sub: `Đã xác minh: ${stats?.shops?.verified || 0}`,
      icon: Store,
      color: "bg-purple-500",
      link: "/admin/users",
    },
    {
      title: "Đơn hàng",
      value: stats?.orders?.total || 0,
      sub: `Chờ xử lý: ${stats?.orders?.pending || 0}`,
      icon: ShoppingCart,
      color: "bg-orange-500",
      link: "/admin/orders",
    },
    {
      title: "Báo cáo",
      value: stats?.reports?.total || 0,
      sub: `Chờ xử lý: ${stats?.reports?.pending || 0}`,
      icon: AlertTriangle,
      color: "bg-red-500",
      link: "/admin/reports",
    },
    {
      title: "Đấu giá",
      value: stats?.auctions?.total || 0,
      sub: `Đang diễn ra: ${stats?.auctions?.active || 0}`,
      icon: Gavel,
      color: "bg-indigo-500",
      link: "/admin/auction-payments",
    },
  ];

  const revenue = stats?.platform_revenue;
  const walletStats = stats?.wallet_stats;

  return (
    <div className="p-6">
      <AdminHeader title="Bảng điều khiển" subtitle="Tổng quan hệ thống" />

      {/* Platform Revenue Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign size={28} />
          <h2 className="text-xl font-bold">Doanh thu Platform</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-emerald-100 text-sm">Doanh thu tháng này</p>
            <p className="text-2xl font-bold">₫{formatMoney(revenue?.month_total)}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-emerald-100 text-sm">VAT phải nộp</p>
            <p className="text-2xl font-bold">₫{formatMoney(revenue?.month_vat)}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-emerald-100 text-sm">Doanh thu sau thuế</p>
            <p className="text-2xl font-bold">₫{formatMoney(revenue?.month_net)}</p>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <p className="text-emerald-100 text-sm">Tổng doanh thu</p>
            <p className="text-2xl font-bold">₫{formatMoney(revenue?.all_time)}</p>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white/10 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <PieChart size={18} />
            <span className="font-medium">Chi tiết nguồn thu</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-emerald-100">Phí rút tiền</span>
              <span className="font-semibold">₫{formatMoney(revenue?.breakdown?.withdraw_fees)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Phí đấu giá</span>
              <span className="font-semibold">₫{formatMoney(revenue?.breakdown?.auction_fees)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Phí quảng cáo</span>
              <span className="font-semibold">₫{formatMoney(revenue?.breakdown?.promotion_fees)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <Icon className="text-white" size={24} />
                </div>
                <ArrowUpRight
                  className="text-gray-300 group-hover:text-gray-500 transition"
                  size={20}
                />
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="text-yellow-500" size={20} />
            Cần xử lý
          </h3>
          <div className="space-y-3">
            {walletStats?.pending_deposits > 0 && (
              <Link
                to="/admin/wallet-deposits"
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="text-yellow-600" size={20} />
                  <span className="text-gray-700">Yêu cầu nạp tiền chờ duyệt</span>
                </div>
                <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full">
                  {walletStats.pending_deposits}
                </span>
              </Link>
            )}
            {walletStats?.pending_withdraws > 0 && (
              <Link
                to="/admin/wallet-withdraws"
                className="flex items-center justify-between p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="text-orange-600" size={20} />
                  <span className="text-gray-700">Yêu cầu rút tiền chờ duyệt</span>
                </div>
                <span className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
                  {walletStats.pending_withdraws}
                </span>
              </Link>
            )}
            {stats?.listings?.pending > 0 && (
              <Link
                to="/admin/posts"
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-600" size={20} />
                  <span className="text-gray-700">Bài đăng chờ duyệt</span>
                </div>
                <span className="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                  {stats.listings.pending}
                </span>
              </Link>
            )}
            {stats?.reports?.pending > 0 && (
              <Link
                to="/admin/reports"
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-600" size={20} />
                  <span className="text-gray-700">Báo cáo chờ xử lý</span>
                </div>
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full">
                  {stats.reports.pending}
                </span>
              </Link>
            )}
            {!walletStats?.pending_deposits && !walletStats?.pending_withdraws &&
              !stats?.listings?.pending && !stats?.reports?.pending && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-green-700">Không có công việc chờ xử lý</span>
                </div>
              )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-500" size={20} />
            Thống kê nhanh
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Người dùng mới tháng này</span>
              <span className="font-bold text-gray-800">{stats?.users?.new_this_month || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Bài đăng đang hoạt động</span>
              <span className="font-bold text-gray-800">{stats?.listings?.active || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Đấu giá đang diễn ra</span>
              <span className="font-bold text-gray-800">{stats?.auctions?.active || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Shop đã xác minh</span>
              <span className="font-bold text-gray-800">{stats?.shops?.verified || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
