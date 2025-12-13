import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, MapPin, Lock, ArrowLeft, Wallet, AlertTriangle } from "lucide-react";
import { orderApi, walletApi } from "../../services/apiClient";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy listing từ state (truyền từ trang sản phẩm)
  const listingFromState = location.state?.listing;
  const quantityFromState = location.state?.quantity || 1;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("checkout"); // checkout, payment, success

  // Data từ API preview
  const [previewData, setPreviewData] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);

  // Form state
  const [quantity, setQuantity] = useState(quantityFromState);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    district: "",
    city: "",
  });
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);

  // Order sau khi tạo
  const [order, setOrder] = useState(null);
  const [sellerContact, setSellerContact] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Load preview data khi vào trang
  useEffect(() => {
    console.log("🛒 CheckoutPage - listingFromState:", listingFromState);
    console.log("🛒 CheckoutPage - listingFromState price fields:", {
      price: listingFromState?.price,
      price_cents: listingFromState?.price_cents,
    });
    
    if (!listingFromState?.id) {
      setError("Không tìm thấy thông tin sản phẩm. Vui lòng quay lại trang sản phẩm.");
      setLoading(false);
      return;
    }
    loadPreviewData();
    loadWalletBalance();
    
    // Pre-fill shipping address từ user
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        name: user.full_name || "",
        phone: user.phone || "",
      }));
    }
  }, [listingFromState?.id]);

  const loadPreviewData = async () => {
    try {
      console.log("🔍 Loading preview for listing:", listingFromState);
      const response = await orderApi.preview(listingFromState.id, quantity);
      console.log("📦 Preview API response:", response);
      
      // Backend có thể trả về { data: {...} } hoặc trực tiếp object
      const data = response?.data || response;
      console.log("📦 Preview data extracted:", data);
      
      // Log tất cả các field có thể chứa giá
      const previewListing = data?.listing;
      console.log("💰 Preview listing price fields:", {
        price: previewListing?.price,
        price_cents: previewListing?.price_cents,
        unit_price: previewListing?.unit_price,
      });
      console.log("💰 Pricing object:", data?.pricing);
      
      setPreviewData(data);
    } catch (err) {
      console.error("Error loading preview:", err);
      // Nếu preview fail, vẫn cho phép checkout với data từ state
      console.log("⚠️ Preview failed, using listing from state:", listingFromState);
      setPreviewData({ listing: listingFromState });
    } finally {
      setLoading(false);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const response = await walletApi.getWallet();
      setWalletBalance(response?.data?.balance || 0);
    } catch (err) {
      console.log("Wallet not found, balance = 0");
      setWalletBalance(0);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0) + " đ";
  };

  // Xác định loại sản phẩm
  const isDigital = previewData?.product_type === "digital";
  const listing = previewData?.listing || listingFromState;
  const shop = previewData?.shop || listing?.shop;
  const pricing = previewData?.pricing || {};
  
  // Lấy wallet balance từ preview API (ưu tiên) hoặc từ state
  const walletFromPreview = previewData?.wallet?.balance || 0;
  const effectiveWalletBalance = walletFromPreview || walletBalance;
  
  // Debug log
  console.log("🏪 Shop data:", shop);
  console.log("💰 Wallet from preview:", walletFromPreview);
  console.log("💰 Wallet from state:", walletBalance);
  console.log("💰 Effective wallet balance:", effectiveWalletBalance);


  // Tạo đơn hàng
  const handleCreateOrder = async () => {
    if (!agree) {
      setError("Vui lòng đồng ý với điều khoản trước khi đặt hàng");
      return;
    }

    // Validate địa chỉ cho sản phẩm vật lý
    if (!isDigital) {
      if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
        setError("Vui lòng nhập đầy đủ thông tin giao hàng");
        return;
      }
    }

    // Tính tổng tiền cần thanh toán
    const unitPrice = pricing?.unit_price || listing?.price || (listing?.price_cents ? listing.price_cents / 100 : 0);
    const totalAmount = pricing?.total_amount || (unitPrice * quantity);
    const shippingFee = pricing?.shipping_fee ?? (isDigital ? 0 : 22000);
    const finalAmount = pricing?.final_amount || (totalAmount + shippingFee);

    // Kiểm tra số dư ví trước khi tạo đơn hàng
    if (effectiveWalletBalance < finalAmount) {
      const needMore = finalAmount - effectiveWalletBalance;
      const confirmDeposit = window.confirm(
        `💰 SỐ DƯ KHÔNG ĐỦ\n\n` +
        `Số dư hiện tại: ${formatPrice(effectiveWalletBalance)}\n` +
        `Số tiền cần thanh toán: ${formatPrice(finalAmount)}\n` +
        `Cần nạp thêm: ${formatPrice(needMore)}\n\n` +
        `Bạn có muốn đi đến trang nạp tiền không?`
      );
      
      if (confirmDeposit) {
        navigate("/wallet/deposit");
      }
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        listing_id: listing.id,
        quantity: quantity,
        note: note,
      };

      // Chỉ thêm địa chỉ cho sản phẩm vật lý
      if (!isDigital) {
        payload.shipping_address = shippingAddress;
      }

      console.log("📤 Creating order:", payload);
      const response = await orderApi.create(payload);
      console.log("✅ Order created:", response);

      if (response?.status === "success") {
        setOrder(response.data);
        setStep("payment");
      } else {
        throw new Error(response?.message || "Tạo đơn hàng thất bại");
      }
    } catch (err) {
      console.error("❌ Create order error:", err);
      console.error("❌ Error response:", err.response?.data);
      
      // Xử lý lỗi 422 - Không đủ tiền hoặc validation error
      if (err.response?.status === 422) {
        const errorData = err.response.data;
        
        if (errorData.requires_deposit || errorData.need_more) {
          const walletBal = errorData.wallet_balance || 0;
          const orderAmt = errorData.order_amount || 0;
          const needMore = errorData.need_more || (orderAmt - walletBal);
          
          const confirmDeposit = window.confirm(
            `💰 SỐ DƯ KHÔNG ĐỦ\n\n` +
            `Số dư hiện tại: ${formatPrice(walletBal)}\n` +
            `Số tiền cần thanh toán: ${formatPrice(orderAmt)}\n` +
            `Cần nạp thêm: ${formatPrice(needMore)}\n\n` +
            `Bạn có muốn đi đến trang nạp tiền không?`
          );
          
          if (confirmDeposit) {
            navigate("/wallet/deposit");
          }
          return;
        }
        
        setError(errorData.message || "Dữ liệu không hợp lệ");
      }
      // Xử lý lỗi sản phẩm số cần chat trước
      else if (err.message?.includes("trao đổi") || err.message?.includes("nhắn tin")) {
        setError(`Sản phẩm số cần trao đổi trước khi mua. Vui lòng nhắn tin với người bán.`);
      } 
      // Xử lý lỗi không đủ tiền (từ message)
      else if (err.message?.includes("không đủ") || err.message?.includes("nạp thêm")) {
        const confirmDeposit = window.confirm(
          `Số dư ví không đủ để thanh toán.\n\nBạn có muốn đi đến trang nạp tiền không?`
        );
        
        if (confirmDeposit) {
          navigate("/wallet/deposit");
        }
      }
      // Lỗi khác
      else {
        setError(err.message || "Có lỗi xảy ra khi tạo đơn hàng");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Thanh toán đơn hàng
  const handlePayOrder = async () => {
    if (!order) return;

    setSubmitting(true);
    setError(null);

    try {
      console.log("💳 Paying order:", order.id);
      const response = await orderApi.pay(order.id);
      console.log("✅ Payment response:", response);

      if (response?.status === "success") {
        setOrder(response.data?.order || order);
        setSellerContact(response.data?.seller_contact);
        setStep("success");
      } else {
        throw new Error(response?.message || "Thanh toán thất bại");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      console.error("❌ Error response:", err.response?.data);
      
      // Xử lý lỗi 422 - Không đủ tiền (BE trả về thông tin chi tiết)
      if (err.response?.status === 422) {
        const errorData = err.response.data;
        
        if (errorData.requires_deposit) {
          // Hiển thị modal yêu cầu nạp tiền với thông tin chi tiết
          const walletBalance = errorData.wallet_balance || 0;
          const orderAmount = errorData.order_amount || order.final_amount;
          const needMore = errorData.need_more || (orderAmount - walletBalance);
          
          const confirmDeposit = window.confirm(
            `💰 SỐ DƯ KHÔNG ĐỦ\n\n` +
            `Số dư hiện tại: ${formatPrice(walletBalance)}\n` +
            `Số tiền cần thanh toán: ${formatPrice(orderAmount)}\n` +
            `Cần nạp thêm: ${formatPrice(needMore)}\n\n` +
            `Bạn có muốn đi đến trang nạp tiền không?`
          );
          
          if (confirmDeposit) {
            navigate("/wallet/deposit");
          }
          return;
        }
        
        // Lỗi validation khác
        setError(errorData.message || "Thanh toán thất bại");
      } 
      // Xử lý lỗi ví không đủ tiền (fallback cho message string)
      else if (err.message?.includes("không đủ") || err.message?.includes("nạp thêm")) {
        const confirmDeposit = window.confirm(
          `Số dư ví không đủ để thanh toán.\n\nBạn có muốn đi đến trang nạp tiền không?`
        );
        
        if (confirmDeposit) {
          navigate("/wallet/deposit");
        }
      } 
      // Xử lý lỗi shop chưa xác minh
      else if (err.message?.includes("xác minh") || err.message?.includes("verify")) {
        setError("Shop chưa được xác minh. Vui lòng liên hệ hỗ trợ.");
      } 
      // Lỗi khác
      else {
        setError(err.message || "Thanh toán thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin checkout...</p>
        </div>
      </div>
    );
  }

  // Error state - không có listing
  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-600 mb-4">{error || "Vui lòng quay lại trang sản phẩm và thử lại."}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }


  // Step 1: Checkout Form
  if (step === "checkout") {
    // Tính giá từ nhiều nguồn (ưu tiên pricing từ API preview)
    // BE trả về: price (đã chia 100), price_cents (giá gốc trong DB)
    // Fallback: listingFromState có thể có price hoặc price_cents
    
    // Lấy giá từ listing (preview hoặc state)
    const getPrice = (obj) => {
      if (!obj) return 0;
      if (obj.price) return obj.price;
      if (obj.price_cents) return obj.price_cents / 100;
      return 0;
    };
    
    const priceFromPreviewListing = getPrice(previewData?.listing);
    const priceFromStateListing = getPrice(listingFromState);
    const priceFromListing = priceFromPreviewListing || priceFromStateListing;
    
    const unitPrice = pricing?.unit_price || priceFromListing;
    const totalAmount = pricing?.total_amount || (unitPrice * quantity);
    const shippingFee = pricing?.shipping_fee ?? (isDigital ? 0 : 22000);
    const finalAmount = pricing?.final_amount || (totalAmount + shippingFee);
    
    console.log("💵 Checkout prices:", { 
      priceFromPreviewListing, 
      priceFromStateListing, 
      unitPrice, 
      totalAmount, 
      shippingFee, 
      finalAmount 
    });
    
    // Cảnh báo nếu giá = 0
    if (unitPrice === 0) {
      console.warn("⚠️ Unit price is 0! Check listing data:", {
        previewListing: previewData?.listing,
        stateListing: listingFromState,
      });
    }

    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="text-indigo-600" size={24} />
                Thanh toán
              </h1>
              <p className="text-gray-500 text-sm">Xác nhận thông tin đơn hàng</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Thông tin sản phẩm */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm</h2>
                <div className="flex gap-4">
                  <img
                    src={listing.images?.[0] || "/default-avatar.jpg"}
                    alt={listing.title}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => (e.target.src = "/default-avatar.jpg")}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{listing.title}</h3>
                    <p className="text-red-600 font-bold text-lg mt-1">{formatPrice(unitPrice)}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                      isDigital ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    }`}>
                      {isDigital ? "📱 Sản phẩm số" : "📦 Sản phẩm vật lý"}
                    </span>
                  </div>
                </div>

                {/* Shop info */}
                {shop && (
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-gray-600">Shop: <strong>{shop.name}</strong></span>
                    {shop.is_verified ? (
                      <span className="text-green-600 text-sm">✓ Đã xác minh</span>
                    ) : (
                      <span className="text-yellow-600 text-sm">⚠ Chưa xác minh</span>
                    )}
                  </div>
                )}

                {/* Số lượng */}
                <div className="mt-4 pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Địa chỉ giao hàng (chỉ cho sản phẩm vật lý) */}
              {!isDigital && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} /> Địa chỉ giao hàng
                  </h2>
                  <div className="grid gap-4">
                    <input
                      type="text"
                      placeholder="Tên người nhận *"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Số điện thoại *"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Địa chỉ chi tiết *"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Quận/Huyện"
                        value={shippingAddress.district}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        placeholder="Tỉnh/Thành phố"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Ghi chú</h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú cho người bán (tùy chọn)"
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-sm sticky top-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Tổng đơn hàng</h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính ({quantity} sản phẩm)</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  {!isDigital && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển</span>
                      <span>{formatPrice(shippingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-3 border-t">
                    <span>Tổng cộng</span>
                    <span className="text-red-600">{formatPrice(finalAmount)}</span>
                  </div>
                </div>

                {/* Số dư ví */}
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Wallet size={18} />
                    <span className="text-sm">Số dư ví: <strong>{formatPrice(effectiveWalletBalance)}</strong></span>
                  </div>
                  {effectiveWalletBalance < finalAmount && (
                    <p className="text-xs text-red-600 mt-1">
                      Cần nạp thêm: {formatPrice(finalAmount - effectiveWalletBalance)}
                    </p>
                  )}
                </div>

                {/* Điều khoản */}
                <label className="flex items-start gap-2 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={() => setAgree(!agree)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600"
                  />
                  <span className="text-xs text-gray-600">
                    Tôi đồng ý với <a href="#" className="text-indigo-600 hover:underline">điều khoản dịch vụ</a> và{" "}
                    <a href="#" className="text-indigo-600 hover:underline">chính sách bảo mật</a>
                  </span>
                </label>

                <button
                  onClick={handleCreateOrder}
                  disabled={submitting || !agree}
                  className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                  {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {submitting ? "Đang xử lý..." : "ĐẶT HÀNG"}
                </button>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck size={14} className="text-green-500" />
                  <span>Giao dịch được bảo mật 256-bit SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // Step 2: Payment
  if (step === "payment" && order) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Xác nhận thanh toán</h2>

            <div className="bg-indigo-50 p-6 rounded-xl mb-6 text-center">
              <p className="text-gray-600 mb-2">Mã đơn hàng</p>
              <p className="text-xl font-bold text-indigo-700">{order.order_number}</p>
              <p className="text-3xl font-bold text-indigo-900 mt-4">{formatPrice(order.final_amount)}</p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p>{error}</p>
                {error.includes("nạp thêm") && (
                  <button
                    onClick={() => navigate("/wallet/deposit")}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                  >
                    Nạp tiền ngay
                  </button>
                )}
              </div>
            )}

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="text-indigo-600" size={24} />
                <div>
                  <p className="font-medium">Thanh toán bằng ví điện tử</p>
                  <p className="text-sm text-gray-500">Số dư: {formatPrice(effectiveWalletBalance)}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Số tiền sẽ được trừ từ ví của bạn và chuyển cho người bán (trừ 5% phí sàn).
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("checkout")}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Quay lại
              </button>
              <button
                onClick={handlePayOrder}
                disabled={submitting}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
              >
                {submitting && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                {submitting ? "Đang thanh toán..." : "XÁC NHẬN THANH TOÁN"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Success
  if (step === "success") {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-6">Mã đơn hàng: <strong>{order?.order_number}</strong></p>

            {/* Thông tin liên hệ seller */}
            {sellerContact && (
              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-bold text-blue-800 mb-2">Thông tin người bán</h3>
                <p className="text-sm text-blue-700">Tên: {sellerContact.name}</p>
                <p className="text-sm text-blue-700">SĐT: {sellerContact.phone}</p>
                <p className="text-sm text-blue-700">Email: {sellerContact.email}</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
              <h3 className="font-bold text-gray-800 mb-2">Bước tiếp theo</h3>
              {isDigital ? (
                <p className="text-sm text-gray-600">📱 Liên hệ người bán để nhận sản phẩm số</p>
              ) : (
                <p className="text-sm text-gray-600">📦 Chờ người bán xác nhận và giao hàng</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/my-orders")}
                className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
              >
                Xem đơn hàng
              </button>
              <button
                onClick={() => navigate("/products")}
                className="flex-1 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CheckoutPage;
