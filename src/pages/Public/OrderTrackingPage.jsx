import React from "react";
import OrderStatus from "../../components/Tracking/OrderStatus";
import OrderDetails from "../../components/Tracking/OrderDetails";
import DeliveryInfo from "../../components/Tracking/DeliveryInfo";
import OrderSummary from "../../components/Tracking/OrderSummary";

const OrderTrackingPage = () => {
    const order = {
        id: "3354654654526",
        date: "16/02/2022",
        deliveryDate: "16/05/2022",
        status: "Order Confirmed",
        items: [
            { name: "MacBook Pro 14\"", price: 2599.0, quantity: 1 },
            { name: "iPad Pro 12.9\"", price: 2599.0, quantity: 1 },
            { name: "AirPods Max", price: 2599.0, quantity: 1 },
        ],
        payment: "Visa ****56",
        address: "847 Jewess Bridge Apt. 174 London, UK\n474-769-3919",
        summary: {
            discount: 5554,
            extraDiscount: 1109.4,
            delivery: 0,
            tax: 221.88,
            total: 0,
        },
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Theo Dõi Đơn Hàng</h1>
                <div className="space-x-2">
                    <button className="px-4 py-2 bg-gray-200 rounded">Hoá đơn</button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded">Theo dõi đơn</button>
                </div>
            </div>

            <OrderStatus status={order.status} />
            <OrderDetails items={order.items} orderId={order.id} date={order.date} deliveryDate={order.deliveryDate} />
            <DeliveryInfo address={order.address} payment={order.payment} />
            <OrderSummary summary={order.summary} />
        </div>
    );
};

export default OrderTrackingPage;
