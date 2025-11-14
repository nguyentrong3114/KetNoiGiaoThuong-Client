import React, { useState, useMemo } from "react";
import ChatList from "../../components/Chat/ChatList";
import ChatWindow from "../../components/Chat/ChatWindow";
import ChatInput from "../../components/Chat/ChatInput";

const ChatPage = () => {
    const [activeId, setActiveId] = useState("kim-anh");
    const [draft, setDraft] = useState("");

    // Danh sách nhiều người trong ChatList
    const chats = useMemo(() => [
        {
            id: "kim-anh",
            name: "Kim Anh",
            avatar: "https://i.pravatar.cc/100?img=12",
            lastMessage: "Dưới đây là hình ảnh sản phẩm và thông số...",
            time: "18:16",
        },
        {
            id: "minh-khang",
            name: "Minh Khang",
            avatar: "https://i.pravatar.cc/100?img=5",
            lastMessage: "Mẫu vận đơn đã gửi qua email.",
            time: "10:40",
        },
        {
            id: "thanh-ha",
            name: "Thanh Hà",
            avatar: "https://i.pravatar.cc/100?img=8",
            lastMessage: "Bên mình cần báo giá pallet nhựa.",
            time: "09:12",
        },
        {
            id: "quang-huy",
            name: "Quang Huy",
            avatar: "https://i.pravatar.cc/100?img=15",
            lastMessage: "Đã nhận được hợp đồng, cảm ơn.",
            time: "14:20",
        },
    ], []);

    // Tin nhắn mẫu cho từng người
    const messagesByChat = useMemo(() => ({
        "kim-anh": [
            {
                sender: "Kim Anh",
                text: "Xin chào, bên mình đang cần nhập 500 chiếc áo sơ mi nam, bạn có thể gửi báo giá và thời gian giao hàng không?",
                time: "18:12",
                isMe: false,
            },
            {
                sender: "Ngọc",
                text: "Chào bạn, bên mình có sẵn hàng. Giá hiện tại là 120.000đ/chiếc, giao trong 3 ngày. Bạn cần mẫu trước không?",
                time: "18:16",
                isMe: true,
            },
            {
                sender: "Ngọc",
                text: "Dưới đây là hình ảnh sản phẩm và thông số. Nếu bạn đồng ý, mình sẽ gửi hợp đồng mẫu.",
                time: "18:16",
                isMe: true,
            },
        ],
        "minh-khang": [
            { sender: "Minh Khang", text: "Mẫu vận đơn đã gửi qua email.", time: "10:40", isMe: false },
        ],
        "thanh-ha": [
            { sender: "Thanh Hà", text: "Bên mình cần báo giá pallet nhựa.", time: "09:12", isMe: false },
        ],
        "quang-huy": [
            { sender: "Quang Huy", text: "Đã nhận được hợp đồng, cảm ơn.", time: "14:20", isMe: false },
        ],
    }), []);

    const contact = chats.find((c) => c.id === activeId);
    const messages = messagesByChat[activeId] || [];

    const handleSend = () => {
        if (!draft.trim()) return;
        messages.push({
            sender: "Ngọc",
            text: draft.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isMe: true,
        });
        setDraft("");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
            {/* LEFT - DANH SÁCH CHAT */}
            <div className="border-r bg-white h-screen">
                <ChatList items={chats} activeId={activeId} onSelect={setActiveId} />
            </div>

            {/* RIGHT - KHUNG CHAT */}
            <div className="md:col-span-2 flex flex-col h-screen">
                <ChatWindow contact={contact} messages={messages} />
                <ChatInput
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onSend={handleSend}
                />
            </div>
        </div>
    );
};

export default ChatPage;
