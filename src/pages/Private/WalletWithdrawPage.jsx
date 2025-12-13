import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle, Info } from "lucide-react";
import { walletApi } from "../../services/apiClient";

const WalletWithdrawPage = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingWallet, setFetchingWallet] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [calculatingFee, setCalculatingFee] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    bank_name: "",
    bank_account: "",
    account_holder: "",
    note: "",
  });

  const banks = [
    "Vietcombank", "Techcombank", "BIDV", "Agribank", "VPBank",
    "MB Bank", "ACB", "Sacombank", "VIB", "TPBank", "OCB", "SHB",
  ];

  useEffect(() => {
    loadWallet();
  }, []);

  // Debounce calculate fee
  useEffect(() => {
    const amount = parseInt((formData.amount || "0").replace(/[.,\s]/g, ""), 10) || 0;
    if (amount >= 50000) {
      const timer = setTimeout(() => calculateFee(amount), 500);
      return () => clearTimeout(timer);
    } else {
      setFeeData(null);
    }
  }, [formData.amount]);

  const loadWallet = async () => {
    try {
      const response = await walletApi.getWallet();
      setWallet(response?.data?.wallet || response?.wallet || response);
    } catch (err) {
      console.error("Error loading wallet:", err);
    } finally {
      setFetchingWallet(false);
    }
  };

  const calculateFee = async (amount) => {
    setCalculatingFee(true);
    try {
      const response = await walletApi.calculateWithdrawFee(amount);
      setFeeData(response?.data || response);
    } catch (err) {
      console.error("Error calculating fee:", err);
    } finally {
      setCalculatingFee(false);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const amount = parseInt(formData.amount.replace(/[.,\s]/g, ""), 10);
      
      if (isNaN(amount) || amount < 50000) {
        setError("Số tiền rút tối thiểu là 50,000 VND");
        setLoading(false);
        return;
      }

      if (amount > (wallet?.available_balance || 0)) {
        setError("Số dư không đủ để rút");
        setLoading(false);
        return;
      }

      const response = await walletApi.withdraw({
        amount,
        bank_name: formData.bank_name,
        bank_account: formData.bank_account,
        account_holder: formData.account_holder.toUpperCase(),
        note: formData.note || undefined,
      });

      console.log("Withdraw response:", response);
      setSuccess(response?.data?.withdraw_request || response?.withdraw_request);
    } catch (err) {
      console.error("Withdraw error:", err);
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Yêu cầu rút tiền đã được tạo!</h2>
          <p className="text-gray-500 mb-6">Chúng tôi sẽ xử lý trong vòng 24 giờ làm việc</p>

          <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã yêu cầu</span>
              <span className="font-mono font-semibold">{success.request_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền rút</span>
              <span className="font-semibold">₫{formatMoney(success.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng phí</span>
              <span className="text-red-600">-₫{formatMoney(success.fee)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t">
              <span className="text-gray-600">Thực nhận</span>
              <span className="font-bold text-green-600 text-lg">₫{formatMoney(success.actual_amount)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate("/wallet")}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700"
          >
            Về ví
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/wallet" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6">
        <ArrowLeft size={20} />
        Quay lại ví
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rút tiền</h1>
        
        {/* Available Balance */}
        {!fetchingWallet && (
          <div className="bg-indigo-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-indigo-600">Số dư khả dụng</p>
            <p className="text-2xl font-bold text-indigo-700">₫{formatMoney(wallet?.available_balance)}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Số tiền rút (VND)</label>
            <input
              type="text"
              value={formData.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setFormData({ ...formData, amount: value ? formatMoney(parseInt(value)) : "" });
              }}
              placeholder="Tối thiểu 50,000 VND"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            
            {/* Fee calculation from API */}
            {calculatingFee && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-500">
                Đang tính phí...
              </div>
            )}
            
            {feeData && !calculatingFee && (
              <div className="mt-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-sm border">
                <p className="font-semibold text-gray-700 mb-3">Chi tiết phí rút tiền</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Phí dịch vụ ({feeData.fee_breakdown?.service_fee?.rate})</span>
                    <span>-₫{formatMoney(feeData.fees?.service_fee)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>VAT ({feeData.fee_breakdown?.vat?.rate})</span>
                    <span>-₫{formatMoney(feeData.fees?.vat_fee)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t">
                    <span>Tổng phí</span>
                    <span className="text-red-600">-₫{formatMoney(feeData.fees?.total_fee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-dashed">
                    <span>Thực nhận</span>
                    <span className="text-green-600">₫{formatMoney(feeData.actual_receive)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ngân hàng</label>
            <select
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">-- Chọn ngân hàng --</option>
              {banks.map((bank) => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          {/* Bank Account */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Số tài khoản</label>
            <input
              type="text"
              value={formData.bank_account}
              onChange={(e) => setFormData({ ...formData, bank_account: e.target.value.replace(/\D/g, "") })}
              placeholder="Nhập số tài khoản"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Account Holder */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tên chủ tài khoản</label>
            <input
              type="text"
              value={formData.account_holder}
              onChange={(e) => setFormData({ ...formData, account_holder: e.target.value.toUpperCase() })}
              placeholder="VD: NGUYEN VAN A"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="VD: Rút tiền bán hàng"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <Info className="text-blue-500 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Lưu ý:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Số tiền rút tối thiểu: 50,000 VND</li>
                <li>Phí rút tiền: 11% (1% phí dịch vụ + 10% VAT)</li>
                <li>Thời gian xử lý: 1-24 giờ làm việc</li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || fetchingWallet || !feeData}
            className="w-full py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-bold rounded-xl transition text-lg"
          >
            {loading ? "Đang xử lý..." : "TẠO YÊU CẦU RÚT TIỀN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WalletWithdrawPage;
