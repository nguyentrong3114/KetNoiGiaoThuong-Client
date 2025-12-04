import React, { useState, useEffect, useRef } from "react";
import ChatList from "../../components/Chat/ChatList";
import ChatWindow from "../../components/Chat/ChatWindow";
import ChatInput from "../../components/Chat/ChatInput";

const ChatPage = () => {
  const [activeId, setActiveId] = useState(null); // không chọn sẵn user ảo
  const [draft, setDraft] = useState("");
  const [messagesData, setMessagesData] = useState({});
  const scrollRef = useRef(null);

  // ============================
  // DANH SÁCH CHAT – XOÁ DEMO
  // ============================
  const chats = []; // ← BE sẽ trả danh sách threads

  // ============================
  // TIN NHẮN – XOÁ DEMO
  // ============================
  const messages = activeId ? messagesData[activeId] || [] : [];

  // Auto scroll xuống cuối
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ============================
  // GỬI TIN NHẮN — GIỮ LOGIC
  // ============================
  const handleSend = () => {
    if (!draft.trim() || !activeId) return;

    setMessagesData((prev) => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] || []),
        {
          sender: "Me",
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

    // 🔥 Sau này thêm API:
    // fetch("/chat/send", { method: "POST", body: { thread_id: activeId, text: draft } })
  };

  // Lấy contact hiện tại
  const contact = chats.find((c) => c.id === activeId) || null;

  // ============================
  // UI / LAYOUT
  // ============================
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <div className="border-r bg-white h-full shadow-sm md:flex flex-col hidden">
        <div className="p-4 border-b text-lg font-semibold text-gray-800">Tin nhắn</div>

        <div className="flex-1 overflow-y-auto">
          {/* Nếu chưa có chat → hiển thị placeholder */}
          {chats.length === 0 ? (
            <p className="text-gray-500 text-sm p-4">Chưa có hội thoại.</p>
          ) : (
            <ChatList items={chats} activeId={activeId} onSelect={setActiveId} />
          )}
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
