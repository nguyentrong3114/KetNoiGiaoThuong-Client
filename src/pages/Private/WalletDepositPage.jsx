import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Copy, CheckCircle, QrCode, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { walletApi } from "../../services/apiClient";

const WalletDepositPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: nhập tiền, 2: hiện QR, 3: chờ duyệt
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [depositData, setDepositData] = useState(null);
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState("");
  const [amount, setAmount] = useState("");
  const pollingRef = useRef(null);

  // Cleanup polling khi unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const quickAmounts = [100000, 200000, 500000, 1000000, 2000000, 5000000];

  const formatMoney = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value || 0);
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  // Step 1: Tạo yêu cầu nạp tiền
  const handleCreateDeposit = async () => {
    const amountNum = parseInt(amount.replace(/[.,\s]/g, ""), 10);
    
    if (isNaN(amountNum) || amountNum < 10000) {
      setError("Số tiền tối thiểu là 10,000 VND");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await walletApi.deposit({
        amount: amountNum,
        payment_method: "bank_transfer",
      });

      console.log("📦 Deposit response:", response);
      setDepositData(response?.data || response);
      setStep(2);
    } catch (err) {
      console.error("❌ Deposit error:", err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Xác nhận đã chuyển tiền
  const handleConfirmTransfer = async () => {
    setLoading(true);
    setError(null);

    try {
      const depositId = depositData?.deposit_request?.id;
      await walletApi.confirmDeposit(depositId);
      setStep(3);
      startPolling(depositId);
    } catch (err) {
      console.error("❌ Confirm error:", err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Polling kiểm tra trạng thái
  const startPolling = (depositId) => {
    pollingRef.current = setInterval(async () => {
      try {
        const response = await walletApi.checkDepositStatus(depositId);
        const data = response?.data || response;
        const newStatus = data?.deposit_request?.status;
        
        setStatus(data?.deposit_request);

        if (newStatus === "completed") {
          clearInterval(pollingRef.current);
          // Dispatch event để WalletPage refresh data
          window.dispatchEvent(new Event("wallet-updated"));
          alert("🎉 Nạp tiền thành công! Tiền đã vào ví của bạn.");
        } else if (newStatus === "failed") {
          clearInterval(pollingRef.current);
          alert("❌ Yêu cầu bị từ chối: " + (data?.deposit_request?.admin_note || "Không tìm thấy giao dịch"));
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000); // Poll mỗi 5 giây
  };

  const checkStatusManually = async () => {
    if (!depositData?.deposit_request?.id) return;
    
    setLoading(true);
    try {
      const response = await walletApi.checkDepositStatus(depositData.deposit_request.id);
      const data = response?.data || response;
      setStatus(data?.deposit_request);
      
      if (data?.deposit_request?.status === "completed") {
        // Dispatch event để WalletPage refresh data
        window.dispatchEvent(new Event("wallet-updated"));
        alert("🎉 Nạp tiền thành công!");
        clearInterval(pollingRef.current);
      }
    } catch (err) {
      console.error("Check status error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Nhập số tiền
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/wallet" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6">
          <ArrowLeft size={20} />
          Quay lại ví
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <QrCode className="text-green-600" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nạp tiền vào ví</h1>
              <p className="text-gray-500">Quét mã QR để chuyển khoản nhanh chóng</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền nạp (VND)</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setAmount(value ? formatMoney(parseInt(value)) : "");
                }}
                placeholder="Tối thiểu 10,000 VND"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl text-xl font-bold text-center focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Quick Amounts */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Chọn nhanh:</p>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(formatMoney(amt))}
                    className={`py-3 rounded-xl font-medium transition ${
                      amount === formatMoney(amt)
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 hover:bg-green-100 text-gray-700"
                    }`}
                  >
                    {formatMoney(amt)}đ
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateDeposit}
              disabled={loading || !amount}
              className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold rounded-xl transition text-lg"
            >
              {loading ? "Đang xử lý..." : "Tiếp tục →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Hiển thị QR Code
  if (step === 2 && depositData) {
    const { payment_info, instructions, deposit_request } = depositData;

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => setStep(1)} className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6">
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quét mã QR để chuyển khoản</h2>
            <p className="text-gray-500 mt-1">Mã yêu cầu: <span className="font-mono font-semibold">{deposit_request?.request_code}</span></p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white border-2 border-gray-200 rounded-2xl shadow-sm">
              <img
                src={payment_info?.qr_url}
                alt="QR Code VietQR"
                className="w-64 h-64 object-contain"
                onError={(e) => {
                  e.target.src = "/default-avatar.jpg";
                  e.target.alt = "QR không tải được";
                }}
              />
            </div>
          </div>

          {/* Bank Info */}
          <div className="bg-blue-50 rounded-xl p-5 space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ngân hàng</span>
              <span className="font-semibold">{payment_info?.bank_name}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{payment_info?.account_number}</span>
                <button
                  onClick={() => copyToClipboard(payment_info?.account_number, "account")}
                  className="p-1.5 hover:bg-blue-100 rounded-lg transition"
                >
                  {copied === "account" ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-500" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chủ tài khoản</span>
              <span className="font-semibold">{payment_info?.account_holder}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tiền</span>
              <span className="font-bold text-xl text-green-600">₫{formatMoney(payment_info?.amount)}</span>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <p className="text-gray-600 text-sm mb-2">Nội dung chuyển khoản (bắt buộc):</p>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-blue-200">
                <span className="font-mono font-bold text-red-600 flex-1">{payment_info?.transfer_content}</span>
                <button
                  onClick={() => copyToClipboard(payment_info?.transfer_content, "content")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  {copied === "content" ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} className="text-gray-500" />}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {instructions && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Hướng dẫn:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                <li>{instructions.step_1}</li>
                <li>{instructions.step_2}</li>
                <li>{instructions.step_3}</li>
                <li>{instructions.step_4}</li>
              </ol>
            </div>
          )}

          <button
            onClick={handleConfirmTransfer}
            disabled={loading}
            className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold rounded-xl transition text-lg"
          >
            {loading ? "Đang xử lý..." : "✅ Tôi đã chuyển tiền"}
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Chờ duyệt
  if (step === 3) {
    const statusLabel = status?.status_label || "Đang chờ duyệt";
    const isCompleted = status?.status === "completed";
    const isFailed = status?.status === "failed";

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {isCompleted ? (
            <>
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Nạp tiền thành công!</h2>
              <p className="text-gray-500 mb-6">Tiền đã được cộng vào ví của bạn</p>
            </>
          ) : isFailed ? (
            <>
              <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-700 mb-2">Yêu cầu bị từ chối</h2>
              <p className="text-gray-500 mb-2">{status?.admin_note || "Không tìm thấy giao dịch chuyển khoản"}</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <Clock className="absolute inset-0 m-auto text-indigo-600" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang chờ xác nhận</h2>
              <p className="text-gray-500 mb-6">Admin đang kiểm tra giao dịch của bạn</p>
            </>
          )}

          <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Mã yêu cầu</span>
              <span className="font-mono font-semibold">{depositData?.deposit_request?.request_code}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Số tiền</span>
              <span className="font-bold text-green-600">₫{formatMoney(depositData?.deposit_request?.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái</span>
              <span className={`font-semibold ${isCompleted ? "text-green-600" : isFailed ? "text-red-600" : "text-yellow-600"}`}>
                {statusLabel}
              </span>
            </div>
          </div>

          {!isCompleted && !isFailed && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-yellow-800 text-sm">
                <strong>Lưu ý:</strong> Thời gian xử lý thường từ 5-15 phút. Vui lòng đợi admin kiểm tra giao dịch.
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/wallet", { state: { refresh: true } })}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Về ví
            </button>
            {!isCompleted && !isFailed && (
              <button
                onClick={checkStatusManually}
                disabled={loading}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                Kiểm tra lại
              </button>
            )}
            {(isCompleted || isFailed) && (
              <button
                onClick={() => {
                  setStep(1);
                  setDepositData(null);
                  setStatus(null);
                  setAmount("");
                }}
                className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition"
              >
                Nạp thêm
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WalletDepositPage;
