import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  MoreHorizontal,
  DollarSign,
  ArrowRight,
  Filter,
  Search,
} from "lucide-react";
import { walletApi } from "../../services/apiClient";

const WalletPage = () => {
  /* ============================
     GIỮ NGUYÊN LOGIC CỦA BẠN
  ============================ */
  const location = useLocation();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [auctionPayments, setAuctionPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [txFilter, setTxFilter] = useState("");

  const loadWalletData = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        console.log("📦 Loading wallet data...");

        const walletRes = await walletApi.getWallet();
        const walletData =
          walletRes?.data?.wallet || walletRes?.wallet || walletRes?.data || walletRes;
        setWallet(walletData);

        const transParams = { per_page: 50 };
        if (txFilter) transParams.type = txFilter;

        const transRes = await walletApi.getTransactions(transParams);
        const transData = transRes?.data || [];
        setTransactions(Array.isArray(transData) ? transData : []);

        const paymentsRes = await walletApi.getAuctionPayments({
          status: "pending",
          role: "buyer",
        });
        const paymentsData = paymentsRes?.data || [];
        setAuctionPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } catch (err) {
        console.error("❌ Error loading wallet:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [txFilter]
  );

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  useEffect(() => {
    if (location.state?.refresh) {
      loadWalletData();
      window.history.replaceState({}, document.title);
    }
  }, [location.state, loadWalletData]);

  useEffect(() => {
    const handleWalletUpdate = () => {
      loadWalletData(true);
    };
    window.addEventListener("wallet-updated", handleWalletUpdate);
    return () => window.removeEventListener("wallet-updated", handleWalletUpdate);
  }, [loadWalletData]);

  const handleRefresh = () => {
    loadWalletData(true);
  };

  const formatMoney = (amount) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("vi-VN").format(num || 0);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowDownCircle size={20} />;
      case "withdraw":
        return <ArrowUpCircle size={20} />;
      case "auction_win":
      case "payment":
        return <CreditCard size={20} />;
      case "auction_receive":
      case "receive":
        return <TrendingUp size={20} />;
      default:
        return <Wallet size={20} />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      deposit: "Nạp tiền vào ví",
      withdraw: "Rút tiền về ngân hàng",
      auction_win: "Thanh toán đấu giá",
      auction_receive: "Nhận tiền đấu giá",
      payment: "Thanh toán dịch vụ",
      receive: "Nhận tiền",
      freeze: "Đóng băng tạm thời",
      unfreeze: "Hoàn trả tiền cọc",
    };
    return labels[type] || type;
  };

  const isCredit = (type) => {
    return ["deposit", "receive", "refund", "auction_receive", "unfreeze"].includes(type);
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: {
        bg: "bg-emerald-100 text-emerald-700",
        icon: <CheckCircle size={14} />,
        text: "Thành công",
      },
      pending: { bg: "bg-amber-100 text-amber-700", icon: <Clock size={14} />, text: "Đang xử lý" },
      failed: { bg: "bg-red-100 text-red-700", icon: <XCircle size={14} />, text: "Thất bại" },
      expired: { bg: "bg-slate-100 text-slate-700", icon: <XCircle size={14} />, text: "Hết hạn" },
    };
    return styles[status] || styles.pending;
  };

  /* ============================
        UI NÂNG CẤP
  ============================ */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Đang đồng bộ dữ liệu ví...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER SECTION */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              <Wallet className="text-blue-600" />
              Ví điện tử
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Quản lý số dư và lịch sử giao dịch của bạn.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-xl transition-all shadow-sm text-slate-600 font-medium text-sm"
          >
            <RefreshCw
              size={16}
              className={`text-slate-400 group-hover:text-blue-500 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Đang làm mới..." : "Làm mới"}
          </button>
        </div>

        {/* ALERT: PENDING PAYMENTS */}
        {auctionPayments.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-orange-50 border border-orange-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-pulse">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-full mt-1 md:mt-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="font-bold text-orange-800">Thanh toán đang chờ xử lý</h4>
                <p className="text-sm text-orange-600 mt-1">
                  Bạn có <span className="font-bold">{auctionPayments.length}</span> đơn hàng đấu
                  giá cần thanh toán. Vui lòng hoàn tất để tránh bị hủy đơn.
                </p>
              </div>
            </div>
            <Link
              to="/wallet/auction-payments"
              className="whitespace-nowrap px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all text-sm"
            >
              Thanh toán ngay
            </Link>
          </div>
        )}

        {/* BALANCE CARDS (Cards Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Main Balance (ATM Style) */}
          <div className="md:col-span-1 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

            <div className="relative z-10 flex flex-col justify-between h-full min-h-[140px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold border border-white/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Khả dụng
                </div>
                <Wallet size={24} className="opacity-80" />
              </div>

              <div>
                <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">
                  Tổng số dư
                </p>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  ₫{formatMoney(wallet?.available_balance || wallet?.balance)}
                </h2>
              </div>
            </div>
          </div>

          {/* Card 2: Frozen Balance */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Đang tạm giữ
                </p>
                <p className="text-xs text-slate-400 mt-1">Tiền cọc & Đấu giá</p>
              </div>
              <div className="p-2.5 bg-amber-50 text-amber-500 rounded-xl">
                <Clock size={24} />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-slate-800">
                ₫{formatMoney(wallet?.frozen_balance || 0)}
              </h2>
            </div>
          </div>

          {/* Card 3: Total Assets */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Tổng tài sản
                </p>
                <p className="text-xs text-slate-400 mt-1">Bao gồm cả tạm giữ</p>
              </div>
              <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl">
                <DollarSign size={24} />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-slate-800">₫{formatMoney(wallet?.balance)}</h2>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <Link
            to="/wallet/deposit"
            className="flex items-center justify-center gap-2 py-4 px-6 bg-white border border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-700 hover:text-green-700 rounded-2xl transition-all group shadow-sm hover:shadow-md"
          >
            <div className="p-1.5 bg-green-100 text-green-600 rounded-full group-hover:scale-110 transition-transform">
              <ArrowDownCircle size={20} />
            </div>
            <span className="font-bold">Nạp tiền vào ví</span>
          </Link>
          <Link
            to="/wallet/withdraw"
            className="flex items-center justify-center gap-2 py-4 px-6 bg-white border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-700 rounded-2xl transition-all group shadow-sm hover:shadow-md"
          >
            <div className="p-1.5 bg-red-100 text-red-600 rounded-full group-hover:scale-110 transition-transform">
              <ArrowUpCircle size={20} />
            </div>
            <span className="font-bold">Rút tiền về NH</span>
          </Link>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden min-h-[500px]">
          {/* Tabs Header */}
          <div className="flex border-b border-slate-100 px-6 pt-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-4 text-sm font-bold transition-all relative ${
                activeTab === "overview" ? "text-blue-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tổng quan
              {activeTab === "overview" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`pb-4 px-4 text-sm font-bold transition-all relative ${
                activeTab === "transactions"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Lịch sử giao dịch
              <span className="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                {transactions.length}
              </span>
              {activeTab === "transactions" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
              )}
            </button>
          </div>

          {/* TAB CONTENT */}
          <div className="p-6">
            {/* --- VIEW: OVERVIEW --- */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quick Access */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Truy cập nhanh
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      to="/wallet/auction-payments"
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 group"
                    >
                      <div className="p-3 bg-white text-blue-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
                        <CreditCard size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">Thanh toán đấu giá</h4>
                        <p className="text-xs text-slate-500">Xem các khoản cần thanh toán</p>
                      </div>
                      <ArrowRight size={18} className="text-slate-300 group-hover:text-blue-500" />
                    </Link>

                    {/* Thêm các link dummy để lấp đầy UI nếu cần */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent opacity-50 cursor-not-allowed">
                      <div className="p-3 bg-white text-slate-400 rounded-xl shadow-sm">
                        <MoreHorizontal size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">Dịch vụ khác</h4>
                        <p className="text-xs text-slate-500">Sắp ra mắt</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Preview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Gần đây nhất
                    </h3>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Xem tất cả
                    </button>
                  </div>

                  {transactions.length > 0 ? (
                    <div className="space-y-3">
                      {transactions.slice(0, 4).map((tx) => {
                        const credit = isCredit(tx.type);
                        return (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2.5 rounded-full ${credit ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}
                              >
                                {getTransactionIcon(tx.type)}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-700">
                                  {getTypeLabel(tx.type)}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {new Date(tx.created_at).toLocaleDateString("vi-VN")}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-sm font-bold ${credit ? "text-emerald-600" : "text-slate-800"}`}
                            >
                              {credit ? "+" : "-"}₫{formatMoney(Math.abs(parseFloat(tx.amount)))}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-sm">
                      Chưa có giao dịch nào
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- VIEW: TRANSACTIONS LIST --- */}
            {activeTab === "transactions" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl w-full md:w-auto self-start border border-slate-100">
                  <Filter size={18} className="text-slate-400 ml-2" />
                  <select
                    value={txFilter}
                    onChange={(e) => setTxFilter(e.target.value)}
                    className="bg-transparent text-sm font-medium text-slate-700 outline-none w-full md:w-48 py-1"
                  >
                    <option value="">Tất cả loại giao dịch</option>
                    <option value="deposit">Nạp tiền</option>
                    <option value="withdraw">Rút tiền</option>
                    <option value="auction_win">Thanh toán đấu giá</option>
                    <option value="auction_receive">Nhận tiền đấu giá</option>
                  </select>
                </div>

                {/* List */}
                {transactions.length > 0 ? (
                  <div className="space-y-2">
                    {transactions.map((tx) => {
                      const status = getStatusBadge(tx.status);
                      const credit = isCredit(tx.type);
                      const amount = parseFloat(tx.amount);

                      return (
                        <div
                          key={tx.id}
                          className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-2xl ${credit ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"} group-hover:scale-110 transition-transform`}
                            >
                              {getTransactionIcon(tx.type)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-800">
                                {tx.description || getTypeLabel(tx.type)}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                  {tx.transaction_code}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(tx.created_at).toLocaleString("vi-VN")}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 mt-3 md:mt-0 pl-14 md:pl-0">
                            <div
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${status.bg}`}
                            >
                              {status.icon} {status.text}
                            </div>
                            <div
                              className={`text-base font-bold text-right min-w-[120px] ${credit ? "text-emerald-600" : "text-slate-900"}`}
                            >
                              {credit ? "+" : "-"}₫{formatMoney(Math.abs(amount))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search size={24} />
                    </div>
                    <p>Không tìm thấy giao dịch nào.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
