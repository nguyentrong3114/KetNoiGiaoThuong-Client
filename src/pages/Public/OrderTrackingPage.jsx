import React from "react";
import OrderStatus from "../../components/Tracking/OrderStatus";
import OrderDetails from "../../components/Tracking/OrderDetails";
import DeliveryInfo from "../../components/Tracking/DeliveryInfo";
import OrderSummary from "../../components/Tracking/OrderSummary";
import AutoBreadcrumb from "../../components/AutoBreadcrumb";

const OrderTrackingPage = () => {
  const order = {
    id: "3354654654526",
    date: "16/02/2022",
    estimate: "16/05/2022",
    status: "Đã xác nhận đơn hàng",
    items: [
      {
        name: "MacBook Pro 14”",
        price: 2599.0,
        quantity: 1,
        image:
          "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202110",
        detail: "Màu Xám | 32GB | 1TB",
      },
      {
        name: "iPad Pro 12.9”",
        price: 2599.0,
        quantity: 1,
        image:
          "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/ipad-pro-12-select-202104",
        detail: "Màu Xám | 32GB | 1TB",
      },
      {
        name: "AirPods Max",
        price: 2599.0,
        quantity: 1,
        image:
          "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-select-202011",
        detail: "Màu Xám | 32GB | 1TB",
      },
    ],
    payment: "Thẻ Visa ****56",
    address: "847 Jewess Bridge Apt. 174\nLondon, UK\n474-769-3919",
    summary: {
      discount: 5554,
      extraDiscount: 1109.4,
      delivery: 0,
      tax: 221.88,
      total: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* BREADCRUMB */}
      <div className="max-w-6xl mx-auto mb-6">
        <AutoBreadcrumb />
      </div>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto space-y-2 mb-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mã Đơn Hàng: {order.id}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Ngày đặt: {order.date} •{" "}
              <span className="text-green-600 font-medium">Dự kiến giao: {order.estimate}</span>
            </p>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <OrderStatus status={order.status} />
        </div>
      </div>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl border shadow-sm p-6 mb-8">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 border-b last:border-none py-4">
            <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
              <p className="text-gray-500 text-sm">{item.detail}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${item.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500">SL: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* THANH TOÁN + GIAO HÀNG */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold text-gray-900 text-lg mb-4">Phương thức thanh toán</h2>
          <p className="text-gray-700">{order.payment}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold text-gray-900 text-lg mb-4">Địa chỉ giao hàng</h2>
          <pre className="whitespace-pre-line text-gray-700 text-sm">{order.address}</pre>
        </div>
      </div>

      {/* HỖ TRỢ + TÓM TẮT ĐƠN */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* HỖ TRỢ */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="font-semibold text-gray-900 text-lg mb-4">Hỗ trợ khách hàng</h2>
          <ul className="space-y-2 text-blue-600 font-medium">
            <li className="cursor-pointer hover:underline">Vấn đề về đơn hàng ↗</li>
            <li className="cursor-pointer hover:underline">Thông tin giao hàng ↗</li>
            <li className="cursor-pointer hover:underline">Trả hàng / Đổi hàng ↗</li>
          </ul>
        </div>

        {/* TÓM TẮT ĐƠN */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <OrderSummary summary={order.summary} />
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
