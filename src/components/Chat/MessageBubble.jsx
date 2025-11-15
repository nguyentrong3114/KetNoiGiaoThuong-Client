import React from "react";

const MessageBubble = ({ text, time, isMe }) => {
    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3`}>
            <div className={`max-w-[70%] ${isMe ? "text-right" : "text-left"}`}>
                <div
                    className={`inline-block px-4 py-3 rounded-2xl ${isMe ? "bg-blue-600 text-white" : "bg-white text-gray-900"
                        }`}
                >
                    <p className="text-sm">{text}</p>
                </div>
                <div className="mt-1 text-xs text-gray-500">{time}</div>
            </div>
        </div>
    );
};

export default MessageBubble;
