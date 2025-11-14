import React from "react";
import ContactForm from "../../components/Checkout/ContactForm";
import ShippingForm from "../../components/Checkout/ShippingForm";
import ShippingMethod from "../../components/Checkout/ShippingMethod";
import PaymentMethod from "../../components/Checkout/PaymentMethod";
import BillingAddress from "../../components/Checkout/BillingAddress";
import OrderReview from "../../components/Checkout/OrderReview";

const CheckoutPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6 space-y-6">
            <h1 className="text-2xl font-bold">Trang Thanh Toán</h1>
            <ContactForm />
            <ShippingForm />
            <ShippingMethod />
            <PaymentMethod />
            <BillingAddress />
            <OrderReview />
        </div>
    );
};

export default CheckoutPage;
