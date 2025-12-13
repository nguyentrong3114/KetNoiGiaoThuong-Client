import React from "react";

const MessageBubble = ({ text, time, isMe }) => {
    return (
        <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2`}>
            <div className={`max-w-[75%] ${isMe ? "text-right" : "text-left"}`}>
                <div
                    className={`inline-block px-3 py-2 rounded-xl text-sm ${
                        isMe ? "bg-blue-600 text-white" : "bg-white text-gray-800 shadow-sm"
                    }`}
                >
                    {text}
                </div>
                <div className="mt-0.5 text-[10px] text-gray-400 px-1">{time}</div>
            </div>
        </div>
    );
};

export default MessageBubble;
