import React from "react";

const ContactForm = () => {
    return (
        <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Thông tin liên hệ</h2>
            <input
                type="email"
                placeholder="Email"
                className="w-full border px-4 py-2 rounded"
            />
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Nhận thông tin khuyến mãi qua email
            </label>
        </div>
    );
};

export default ContactForm;
