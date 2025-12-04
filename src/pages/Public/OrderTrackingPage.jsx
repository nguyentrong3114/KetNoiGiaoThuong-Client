import React from "react";
import OrderStatus from "../../components/Tracking/OrderStatus";
import OrderDetails from "../../components/Tracking/OrderDetails";
import DeliveryInfo from "../../components/Tracking/DeliveryInfo";
import OrderSummary from "../../components/Tracking/OrderSummary";

const OrderTrackingPage = () => {
  // ⭐ KHÔNG CÓ DỮ LIỆU DEMO — chờ API trả về
  const order = null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* KHÔNG CÓ DỮ LIỆU */}
        {!order && (
          <div className="text-center text-gray-500 text-sm py-20">Chưa có thông tin đơn hàng.</div>
        )}

        {/* CHỈ RENDER NẾU API TRẢ DỮ LIỆU */}
        {order && (
          <>
            {/* HEADER */}
            <div className="space-y-2 mb-10">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Mã Đơn Hàng: {order.id}</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Ngày đặt: {order.date} •{" "}
                    <span className="text-green-600 font-medium">
                      Dự kiến giao: {order.estimate}
                    </span>
                  </p>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="bg-white border rounded-xl p-6 shadow-sm">
                <OrderStatus status={order.status} />
              </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
              {order.items?.length === 0 && (
                <p className="text-gray-500 text-sm">Không có sản phẩm.</p>
              )}

              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 border-b last:border-none py-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.detail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {item.price?.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* THANH TOÁN + GIAO HÀNG */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* PAYMENT */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="font-semibold text-gray-900 text-lg mb-4">Phương thức thanh toán</h2>
                <p className="text-gray-700">{order.payment}</p>
              </div>

              {/* SHIPPING ADDRESS */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="font-semibold text-gray-900 text-lg mb-4">Địa chỉ giao hàng</h2>
                <pre className="whitespace-pre-line text-gray-700 text-sm">{order.address}</pre>
              </div>
            </div>

            {/* HỖ TRỢ + TÓM TẮT ĐƠN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* HỖ TRỢ */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h2 className="font-semibold text-gray-900 text-lg mb-4">Hỗ trợ khách hàng</h2>
                <ul className="space-y-2 text-blue-600 font-medium">
                  <li className="cursor-pointer hover:underline">Vấn đề về đơn hàng ↗</li>
                  <li className="cursor-pointer hover:underline">Thông tin giao hàng ↗</li>
                  <li className="cursor-pointer hover:underline">Trả hàng / Đổi hàng ↗</li>
                </ul>
              </div>

              {/* SUMMARY */}
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <OrderSummary summary={order.summary} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
