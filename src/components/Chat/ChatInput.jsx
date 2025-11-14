import React from "react";

const ChatInput = ({ value, onChange, onSend }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSend();
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-t bg-white">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Nhập tin nhắn..."
                className="flex-1 rounded-full border px-4 py-2 focus:outline-none"
            />
            <button
                type="submit"
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
                Gửi
            </button>
        </form>
    );
};

export default ChatInput;
