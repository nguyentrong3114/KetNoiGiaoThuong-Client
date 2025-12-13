import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  CreditCard,
  XCircle,
  Wallet,
  Building2,
  MapPin,
  Phone,
  User,
  FileText,
  Copy,
  Package,
} from "lucide-react";
import { walletApi } from "../../services/apiClient";

const WalletAuctionPaymentsPage = () => {
  const [searchParams] = useSearchParams();
  const [payments, setPayments] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [role, setRole] = useState("buyer");

  // Payment modal state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentStep, setPaymentStep] = useState("shipping"); // shipping | method | qr | success
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [processing, setProcessing] = useState(false);
  const [bankInfo, setBankInfo] = useState(null);

  // Shipping form
  const [shippingForm, setShippingForm] = useState({
    shipping_name: "",
    shipping_phone: "",
    shipping_address: "",
    shipping_note: "",
  });

  useEffect(() => {
    // Check if redirected from notification with payment_id
    const paymentId = searchParams.get("payment_id");
    if (paymentId) {
      loadPaymentDetail(paymentId);
    }
    loadData();
  }, [filter, role]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, walletRes] = await Promise.all([
        walletApi.getAuctionPayments({ status: filter !== "all" ? filter : undefined, role }),
        walletApi.getWallet(),
      ]);
      setPayments(paymentsRes?.data || []);
      setWallet(walletRes?.data?.wallet || walletRes?.wallet || walletRes);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPaymentDetail = async (paymentId) => {
    try {
      const res = await walletApi.getAuctionPaymentDetail(paymentId);
      if (res?.payment) {
        setSelectedPayment(res);
        // If already paid, show success/info
        if (res.payment.status !== "pending") {
          setPaymentStep("success");
        }
      }
    } catch (err) {
      console.error("Error loading payment detail:", err);
    }
  };

  const openPaymentModal = async (payment) => {
    try {
      const res = await walletApi.getAuctionPaymentDetail(payment.id);
      setSelectedPayment(res);
      setPaymentStep("shipping");
      setPaymentMethod("wallet");
      setBankInfo(null);
      setShippingForm({
        shipping_name: "",
        shipping_phone: "",
        shipping_address: "",
        shipping_note: "",
      });
    } catch (err) {
      alert(err.message || "Không thể tải thông tin thanh toán");
    }
  };

  const closeModal = () => {
    setSelectedPayment(null);
    setPaymentStep("shipping");
    setBankInfo(null);
  };

  const validateShipping = () => {
    if (!shippingForm.shipping_name.trim()) {
      alert("Vui lòng nhập họ tên người nhận");
      return false;
    }
    if (!shippingForm.shipping_phone.trim()) {
      alert("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(shippingForm.shipping_phone.replace(/\s/g, ""))) {
      alert("Số điện thoại không hợp lệ");
      return false;
    }
    if (!shippingForm.shipping_address.trim()) {
      alert("Vui lòng nhập địa chỉ giao hàng");
      return false;
    }
    return true;
  };

  const handleProceedToMethod = () => {
    if (!validateShipping()) return;
    setPaymentStep("method");
  };

  const handlePayByWallet = async () => {
    if (!validateShipping()) return;

    const walletBalance = parseFloat(wallet?.available_balance || 0);
    const amount = selectedPayment?.payment?.amount || 0;

    if (walletBalance < amount) {
      alert(`Số dư ví không đủ. Cần ${formatMoney(amount)}đ, hiện có ${formatMoney(walletBalance)}đ`);
      return;
    }

    if (!confirm(`Xác nhận thanh toán ${formatMoney(amount)}đ từ ví?`)) return;

    setProcessing(true);
    try {
      await walletApi.payAuctionByWallet(selectedPayment.payment.id, shippingForm);
      setPaymentStep("success");
      loadData();
    } catch (err) {
      alert(err.message || "Thanh toán thất bại");
    } finally {
      setProcessing(false);
    }
  };

  const handlePayByBank = async () => {
    if (!validateShipping()) return;

    setProcessing(true);
    try {
      const res = await walletApi.payAuctionByBankTransfer(selectedPayment.payment.id, shippingForm);
      setBankInfo(res.bank_info || res.payment_info);
      setPaymentStep("qr");
    } catch (err) {
      alert(err.message || "Không thể tạo yêu cầu chuyển khoản");
    } finally {
      setProcessing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép!");
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0);
  };

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end - now;

    if (diff <= 0) return { text: "Hết hạn", urgent: true };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours < 2) return { text: `${hours}h ${minutes}m`, urgent: true };
    if (hours < 6) return { text: `${hours}h ${minutes}m`, urgent: false };
    return { text: `${hours} giờ`, urgent: false };
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} />, text: "Chờ thanh toán" },
      waiting_confirmation: { bg: "bg-orange-100 text-orange-700", icon: <Clock size={14} />, text: "Chờ xác nhận" },
      paid: { bg: "bg-blue-100 text-blue-700", icon: <CheckCircle size={14} />, text: "Đã thanh toán" },
      transferred: { bg: "bg-green-100 text-green-700", icon: <CheckCircle size={14} />, text: "Đã chuyển tiền" },
      expired: { bg: "bg-red-100 text-red-700", icon: <XCircle size={14} />, text: "Hết hạn" },
      cancelled: { bg: "bg-gray-100 text-gray-700", icon: <XCircle size={14} />, text: "Đã hủy" },
    };
    return styles[status] || styles.pending;
  };

  // Render Payment Modal
  const renderPaymentModal = () => {
    if (!selectedPayment) return null;

    const payment = selectedPayment.payment;
    const auction = selectedPayment.auction;
    const listing = selectedPayment.listing || auction?.listing;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {paymentStep === "success" ? "Thông tin thanh toán" : "Thanh toán đấu giá"}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl">
                ×
              </button>
            </div>
            {/* Product Info */}
            <div className="flex gap-3 mt-4">
              <img
                src={listing?.images?.[0] || "/default-avatar.jpg"}
                alt={listing?.title}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => (e.target.src = "/default-avatar.jpg")}
              />
              <div>
                <h3 className="font-medium text-gray-800">{listing?.title || "Sản phẩm đấu giá"}</h3>
                <p className="text-xl font-bold text-indigo-600">₫{formatMoney(payment?.amount)}</p>
              </div>
            </div>
          </div>

          {/* Step: Shipping Info */}
          {paymentStep === "shipping" && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin size={18} /> Thông tin giao hàng
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={shippingForm.shipping_name}
                    onChange={(e) => setShippingForm({ ...shippingForm, shipping_name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={shippingForm.shipping_phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, shipping_phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0901234567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ giao hàng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={shippingForm.shipping_address}
                    onChange={(e) => setShippingForm({ ...shippingForm, shipping_address: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={2}
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <input
                    type="text"
                    value={shippingForm.shipping_note}
                    onChange={(e) => setShippingForm({ ...shippingForm, shipping_note: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ghi chú cho người bán (tùy chọn)"
                  />
                </div>
              </div>
              <button
                onClick={handleProceedToMethod}
                className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
              >
                Tiếp tục
              </button>
            </div>
          )}

          {/* Step: Payment Method */}
          {paymentStep === "method" && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Chọn phương thức thanh toán</h3>

              <div className="space-y-3">
                {/* Wallet Option */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                    paymentMethod === "wallet" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={() => setPaymentMethod("wallet")}
                    className="sr-only"
                  />
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Wallet className="text-indigo-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Thanh toán bằng ví</p>
                    <p className="text-sm text-gray-500">
                      Số dư: ₫{formatMoney(wallet?.available_balance)}
                    </p>
                  </div>
                  {paymentMethod === "wallet" && <CheckCircle className="text-indigo-600" size={24} />}
                </label>

                {/* Bank Transfer Option */}
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                    paymentMethod === "bank" ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    className="sr-only"
                  />
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="text-green-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Chuyển khoản ngân hàng</p>
                    <p className="text-sm text-gray-500">Quét mã QR VietQR</p>
                  </div>
                  {paymentMethod === "bank" && <CheckCircle className="text-green-600" size={24} />}
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setPaymentStep("shipping")}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Quay lại
                </button>
                <button
                  onClick={paymentMethod === "wallet" ? handlePayByWallet : handlePayByBank}
                  disabled={processing}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition"
                >
                  {processing ? "Đang xử lý..." : "Thanh toán"}
                </button>
              </div>
            </div>
          )}

          {/* Step: QR Code */}
          {paymentStep === "qr" && bankInfo && (
            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Quét mã QR để thanh toán</h3>
                <p className="text-sm text-gray-500">Sử dụng app ngân hàng để quét mã</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <img
                  src={bankInfo.qr_url || bankInfo.qr_code_url}
                  alt="QR Code"
                  className="w-64 h-64 border rounded-lg"
                />
              </div>

              {/* Bank Info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ngân hàng</span>
                  <span className="font-medium">{bankInfo.bank_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tài khoản</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bankInfo.account_number}</span>
                    <button onClick={() => copyToClipboard(bankInfo.account_number)} className="text-indigo-600">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chủ tài khoản</span>
                  <span className="font-medium">{bankInfo.account_holder || bankInfo.account_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Số tiền</span>
                  <span className="font-bold text-indigo-600">₫{formatMoney(bankInfo.amount || payment?.amount)}</span>
                </div>
                <div className="pt-2 border-t">
                  <span className="text-gray-600 text-sm">Nội dung chuyển khoản</span>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-yellow-100 text-yellow-800 px-3 py-2 rounded font-mono text-sm">
                      {bankInfo.transfer_content}
                    </code>
                    <button onClick={() => copyToClipboard(bankInfo.transfer_content)} className="text-indigo-600">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-700">
                <AlertCircle size={16} className="inline mr-2" />
                Sau khi chuyển khoản, admin sẽ xác nhận trong vòng 24h. Vui lòng nhập đúng nội dung chuyển khoản.
              </div>

              <button
                onClick={() => {
                  closeModal();
                  loadData();
                }}
                className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
              >
                Đã chuyển khoản
              </button>
            </div>
          )}

          {/* Step: Success / Info */}
          {paymentStep === "success" && (
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600" size={32} />
                </div>
                <h3 className="font-semibold text-gray-800">
                  {payment?.status === "paid" || payment?.status === "transferred"
                    ? "Thanh toán thành công!"
                    : "Đang chờ xác nhận"}
                </h3>
              </div>

              {/* Show seller contact for buyer after payment */}
              {role === "buyer" && selectedPayment?.seller && (payment?.status === "paid" || payment?.status === "transferred") && (
                <div className="bg-blue-50 rounded-xl p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                    <User size={18} /> Thông tin người bán
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Tên:</span> {selectedPayment.seller.full_name}</p>
                    {selectedPayment.seller.phone && (
                      <p><span className="text-gray-600">SĐT:</span> {selectedPayment.seller.phone}</p>
                    )}
                    {selectedPayment.seller.email && (
                      <p><span className="text-gray-600">Email:</span> {selectedPayment.seller.email}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Show shipping info for seller after payment */}
              {role === "seller" && selectedPayment?.shipping_info && (payment?.status === "paid" || payment?.status === "transferred") && (
                <div className="bg-green-50 rounded-xl p-4 mb-4">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center gap-2">
                    <Package size={18} /> Thông tin giao hàng
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-600">Người nhận:</span> {selectedPayment.shipping_info.shipping_name}</p>
                    <p><span className="text-gray-600">SĐT:</span> {selectedPayment.shipping_info.shipping_phone}</p>
                    <p><span className="text-gray-600">Địa chỉ:</span> {selectedPayment.shipping_info.shipping_address}</p>
                    {selectedPayment.shipping_info.shipping_note && (
                      <p><span className="text-gray-600">Ghi chú:</span> {selectedPayment.shipping_info.shipping_note}</p>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={closeModal}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/wallet" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6">
        <ArrowLeft size={20} />
        Quay lại ví
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thanh toán đấu giá</h1>

        {/* Wallet Balance */}
        {wallet && (
          <div className="bg-indigo-50 px-4 py-2 rounded-lg">
            <span className="text-sm text-indigo-600">Số dư: </span>
            <span className="font-bold text-indigo-700">₫{formatMoney(wallet.available_balance)}</span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {[
            { id: "buyer", label: "Tôi mua" },
            { id: "seller", label: "Tôi bán" },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                role === r.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 border rounded-lg">
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ thanh toán</option>
          <option value="waiting_confirmation">Chờ xác nhận</option>
          <option value="paid">Đã thanh toán</option>
          <option value="transferred">Đã chuyển tiền</option>
          <option value="expired">Hết hạn</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Không có thanh toán nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment) => {
            const status = getStatusBadge(payment.status);
            const timeLeft = payment.status === "pending" ? getTimeRemaining(payment.payment_deadline) : null;
            const canPay = payment.status === "pending" && role === "buyer";
            const canViewInfo = (payment.status === "paid" || payment.status === "transferred");

            return (
              <div key={payment.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between gap-4">
                  {/* Left - Product Info */}
                  <div className="flex gap-4 flex-1">
                    <img
                      src={payment.auction?.listing?.images?.[0] || "/default-avatar.jpg"}
                      alt={payment.auction?.listing?.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => (e.target.src = "/default-avatar.jpg")}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {payment.auction?.listing?.title || "Sản phẩm đấu giá"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">Mã: {payment.payment_code}</p>
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.bg}`}>
                        {status.icon} {status.text}
                      </span>
                    </div>
                  </div>

                  {/* Right - Price & Action */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">₫{formatMoney(payment.amount)}</p>

                    {role === "seller" && payment.status === "transferred" && (
                      <p className="text-sm text-green-600 mt-1">Nhận: ₫{formatMoney(payment.seller_receive)}</p>
                    )}

                    {timeLeft && (
                      <p className={`text-sm mt-2 ${timeLeft.urgent ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                        <Clock size={14} className="inline mr-1" />
                        Còn {timeLeft.text}
                      </p>
                    )}

                    {canPay && (
                      <button
                        onClick={() => openPaymentModal(payment)}
                        className="mt-3 px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                      >
                        Thanh toán
                      </button>
                    )}

                    {canViewInfo && (
                      <button
                        onClick={() => {
                          loadPaymentDetail(payment.id);
                          setPaymentStep("success");
                        }}
                        className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition"
                      >
                        Xem thông tin
                      </button>
                    )}
                  </div>
                </div>

                {/* Fee Info for Seller */}
                {role === "seller" && (
                  <div className="mt-4 pt-4 border-t text-sm text-gray-500 flex gap-6">
                    <span>Giá bán: ₫{formatMoney(payment.amount)}</span>
                    <span>Phí sàn (5%): -₫{formatMoney(payment.platform_fee)}</span>
                    <span className="text-green-600 font-medium">Thực nhận: ₫{formatMoney(payment.seller_receive)}</span>
                  </div>
                )}

                {/* Participants */}
                <div className="mt-4 pt-4 border-t flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Người thắng: </span>
                    <span className="font-medium">{payment.winner?.full_name || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Người bán: </span>
                    <span className="font-medium">{payment.seller?.full_name || "N/A"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <AlertCircle className="text-blue-500 flex-shrink-0" size={20} />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Lưu ý:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Thời hạn thanh toán: 24 giờ sau khi đấu giá kết thúc</li>
            <li>Phí sàn: 5% giá trị giao dịch (trừ vào tiền seller nhận)</li>
            <li>Nếu không thanh toán đúng hạn, giao dịch sẽ bị hủy</li>
            <li>Sau khi thanh toán, bạn sẽ nhận được thông tin liên hệ của người bán</li>
          </ul>
        </div>
      </div>

      {/* Payment Modal */}
      {renderPaymentModal()}
    </div>
  );
};

export default WalletAuctionPaymentsPage;
