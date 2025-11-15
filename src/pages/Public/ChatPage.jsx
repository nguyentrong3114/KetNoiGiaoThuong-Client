import React, { useState, useMemo, useEffect, useRef } from "react";
import ChatList from "../../components/Chat/ChatList";
import ChatWindow from "../../components/Chat/ChatWindow";
import ChatInput from "../../components/Chat/ChatInput";

const ChatPage = () => {
  const [activeId, setActiveId] = useState("kim-anh");
  const [draft, setDraft] = useState("");
  const [messagesData, setMessagesData] = useState({});
  const scrollRef = useRef(null);

  // ============================
  // DANH SÁCH CHAT
  // ============================
  const chats = useMemo(
    () => [
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
    ],
    []
  );

  // ============================
  // TIN NHẮN MẪU
  // ============================
  const defaultMessages = useMemo(
    () => ({
      "kim-anh": [
        {
          sender: "Kim Anh",
          text: "Xin chào, bên mình đang cần nhập 500 chiếc áo sơ mi nam, bạn có thể gửi báo giá không?",
          time: "18:12",
          isMe: false,
        },
        {
          sender: "Ngọc",
          text: "Giá hiện tại là 120.000đ/chiếc, giao trong 3 ngày. Bạn cần mẫu trước không?",
          time: "18:16",
          isMe: true,
        },
      ],
      "minh-khang": [
        {
          sender: "Minh Khang",
          text: "Mẫu vận đơn đã gửi qua email.",
          time: "10:40",
          isMe: false,
        },
      ],
      "thanh-ha": [
        {
          sender: "Thanh Hà",
          text: "Bên mình cần báo giá pallet nhựa.",
          time: "09:12",
          isMe: false,
        },
      ],
      "quang-huy": [
        {
          sender: "Quang Huy",
          text: "Đã nhận được hợp đồng, cảm ơn.",
          time: "14:20",
          isMe: false,
        },
      ],
    }),
    []
  );

  // Init messages
  useEffect(() => {
    setMessagesData(defaultMessages);
  }, [defaultMessages]);

  const messages = messagesData[activeId] || [];
  const contact = chats.find((c) => c.id === activeId);

  // ============================
  // GỬI TIN NHẮN
  // ============================
  const handleSend = () => {
    if (!draft.trim()) return;

    setMessagesData((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        {
          sender: "Ngọc",
          text: draft.trim(),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: true,
        },
      ],
    }));

    setDraft("");
  };

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ============================
  // UI / LAYOUT
  // ============================
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div
        className="
          border-r bg-white h-full shadow-sm 
          md:flex flex-col hidden
        "
      >
        <div className="p-4 border-b text-lg font-semibold text-gray-800">Tin nhắn</div>

        <div className="flex-1 overflow-y-auto">
          <ChatList items={chats} activeId={activeId} onSelect={setActiveId} />
        </div>
      </div>

      {/* RIGHT CHAT WINDOW */}
      <div className="md:col-span-2 flex flex-col h-full">
        <ChatWindow contact={contact} messages={messages} scrollRef={scrollRef} />

        <div className="border-t bg-white shadow-inner">
          <ChatInput value={draft} onChange={(e) => setDraft(e.target.value)} onSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
