import React, { useState, useEffect } from "react";
import { Search, ArrowDownCircle, ArrowUpCircle, CreditCard, TrendingUp, Calendar } from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import { adminApi } from "../../services/apiClient";
import "./TransactionsPage.css";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "",
    from_date: "",
    to_date: "",
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = { per_page: 50 };
      if (filters.type) params.type = filters.type;
      if (filters.from_date) params.from_date = filters.from_date;
      if (filters.to_date) params.to_date = filters.to_date;

      const [txRes, statsRes] = await Promise.all([
        adminApi.getTransactions(params),
        adminApi.getTransactionStats(),
      ]);

      setTransactions(txRes?.data || []);
      setStats(statsRes?.data || null);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const getTypeInfo = (type) => {
    const types = {
      deposit: { icon: ArrowDownCircle, color: "text-green-500", bg: "bg-green-100", label: "Nạp tiền" },
      withdraw: { icon: ArrowUpCircle, color: "text-red-500", bg: "bg-red-100", label: "Rút tiền" },
      auction_win: { icon: CreditCard, color: "text-blue-500", bg: "bg-blue-100", label: "Thanh toán đấu giá" },
      auction_receive: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-100", label: "Nhận tiền đấu giá" },
      payment: { icon: CreditCard, color: "text-orange-500", bg: "bg-orange-100", label: "Thanh toán" },
      receive: { icon: TrendingUp, color: "text-green-500", bg: "bg-green-100", label: "Nhận tiền" },
    };
    return types[type] || types.payment;
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: { bg: "bg-green-100 text-green-700", label: "Hoàn thành" },
      pending: { bg: "bg-yellow-100 text-yellow-700", label: "Đang xử lý" },
      failed: { bg: "bg-red-100 text-red-700", label: "Thất bại" },
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="p-6">
      <AdminHeader title="Lịch sử giao dịch" subtitle="Quản lý tất cả giao dịch trong hệ thống" />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Tổng giao dịch</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total_transactions || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Giao dịch tháng này</p>
            <p className="text-2xl font-bold text-gray-900">{stats.month_transactions || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Tổng nạp tiền</p>
            <p className="text-2xl font-bold text-green-600">₫{formatMoney(stats.total_deposit)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Tổng rút tiền</p>
            <p className="text-2xl font-bold text-red-600">₫{formatMoney(stats.total_withdraw)}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả loại</option>
            <option value="deposit">Nạp tiền</option>
            <option value="withdraw">Rút tiền</option>
            <option value="auction_win">Thanh toán đấu giá</option>
            <option value="auction_receive">Nhận tiền đấu giá</option>
          </select>

          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-gray-400" />
            <input
              type="date"
              value={filters.from_date}
              onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-gray-400">→</span>
            <input
              type="date"
              value={filters.to_date}
              onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Không có giao dịch nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã GD</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Loại</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người dùng</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số tiền</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số dư sau</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => {
                  const typeInfo = getTypeInfo(tx.type);
                  const Icon = typeInfo.icon;
                  const status = getStatusBadge(tx.status);
                  const isPositive = tx.amount > 0;

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm text-indigo-600">{tx.transaction_code}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                            <Icon className={typeInfo.color} size={18} />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{typeInfo.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{tx.user?.full_name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{tx.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                          {isPositive ? "+" : ""}₫{formatMoney(Math.abs(tx.amount))}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-gray-600">₫{formatMoney(tx.balance_after)}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {new Date(tx.created_at).toLocaleString("vi-VN")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
