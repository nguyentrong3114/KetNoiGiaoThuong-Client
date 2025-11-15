import React from "react";
import ContactForm from "../../components/Checkout/ContactForm";
import ShippingForm from "../../components/Checkout/ShippingForm";
import ShippingMethod from "../../components/Checkout/ShippingMethod";
import PaymentMethod from "../../components/Checkout/PaymentMethod";
import BillingAddress from "../../components/Checkout/BillingAddress";
import OrderReview from "../../components/Checkout/OrderReview";

const CheckoutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Thanh Toán</h1>
        <p className="text-gray-600 mt-1">Điền đầy đủ thông tin để hoàn tất đơn hàng của bạn.</p>
      </div>

      {/* LAYOUT 3 CỘT GIỐNG HÌNH */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">1. Thông tin liên hệ</h2>
            <ContactForm />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">2. Địa chỉ giao hàng</h2>
            <ShippingForm />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">3. Phương thức giao hàng</h2>
            <ShippingMethod />
          </div>
        </div>

        {/* MIDDLE COLUMN */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">4. Thanh toán</h2>
            <p className="text-sm text-gray-500 mb-4">Tất cả giao dịch đều được bảo mật.</p>
            <PaymentMethod />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">5. Địa chỉ thanh toán</h2>
            <BillingAddress />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold mb-3">Ghi nhớ thông tin</h2>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="w-4 h-4 rounded" />
              Lưu thông tin cho lần sau
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN — Order Review (chỉ nơi này có nút Pay) */}
        <div>
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-lg font-semibold mb-4">6. Tổng kết đơn hàng</h2>

            <OrderReview />

            {/* ❗ KHÔNG THÊM NÚT Ở ĐÂY — NÚT NẰM BÊN TRONG OrderReview  */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
