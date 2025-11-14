import React from "react";
import MessageBubble from "./MessageBubble";
import Avatar from "../Common/Avatar";

const ChatWindow = ({ contact, messages }) => {
    return (
        <div className="flex flex-col h-full">
            {/* HEADER */}
            <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
                <Avatar src={contact?.avatar} alt={contact?.name} size={44} />
                <div>
                    <div className="font-semibold">{contact?.name}</div>
                    <div className="text-xs text-gray-500">Đang hoạt động</div>
                </div>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 p-6 bg-gray-100">
                {messages.map((m, idx) => (
                    <MessageBubble
                        key={idx}
                        senderName={m.sender}
                        text={m.text}
                        time={m.time}
                        isMe={m.isMe}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChatWindow;
