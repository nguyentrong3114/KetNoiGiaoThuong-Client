import { useState, useEffect, useRef, useCallback } from "react";
import { FiX, FiSend, FiMessageCircle, FiChevronLeft } from "react-icons/fi";
import { chatApi } from "../../services/apiClient";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const response = await chatApi.getConversations();
      if (response?.data) {
        setChats(response.data);
        const total = response.data.reduce((sum, c) => sum + (c.unread_count || 0), 0);
        setUnreadTotal(total);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async (userId) => {
    try {
      const response = await chatApi.getMessages(userId);
      if (response?.data) {
        setMessages(response.data);
        chatApi.markRead(userId).catch(() => {});
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, []);

  // Auto fetch conversations when open
  useEffect(() => {
    if (isOpen) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, fetchConversations]);

  // Fetch messages when select chat
  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat);
      const interval = setInterval(() => fetchMessages(activeChat), 3000);
      return () => clearInterval(interval);
    }
  }, [activeChat, fetchMessages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChat || sendingMessage) return;
    setSendingMessage(true);
    try {
      await chatApi.sendMessage({
        to_user_id: activeChat,
        body: newMessage.trim(),
      });
      setNewMessage("");
      fetchMessages(activeChat);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  // Tìm contact - API trả về user.id trong conversation
  const activeContact = chats.find((c) => {
    const chatUserId = c.user_id || c.user?.id;
    return Number(chatUserId) === Number(activeChat);
  });

  // Don't render if not logged in
  if (!user?.id) return null;

  return (
    <>
      {/* CHAT BUTTON - Fixed bottom right, above footer */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all z-50 hover:scale-105"
      >
        {isOpen ? (
          <FiX className="w-7 h-7" />
        ) : (
          <>
            <FiMessageCircle className="w-7 h-7" />
            {unreadTotal > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[22px] h-[22px] flex items-center justify-center px-1 font-medium">
                {unreadTotal > 99 ? "99+" : unreadTotal}
              </span>
            )}
          </>
        )}
      </button>

      {/* CHAT POPUP */}
      {isOpen && (
        <div className="fixed bottom-44 right-6 w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
          {!activeChat ? (
            /* CONVERSATION LIST */
            <>
              <div className="p-3 bg-blue-600 text-white flex items-center justify-between">
                <h3 className="font-semibold">💬 Tin nhắn</h3>
                <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {chats.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <FiMessageCircle className="w-12 h-12 mb-2" />
                    <p className="text-sm">Chưa có cuộc trò chuyện</p>
                  </div>
                ) : (
                  chats.map((chat) => {
                    const userId = chat.user_id || chat.user?.id;
                    const userName = chat.user?.full_name || chat.user?.name || "Người dùng";
                    const userAvatar = chat.user?.avatar_url || chat.user?.avatar;
                    const lastMsg = chat.last_message?.body || "";
                    const unreadCount = chat.unread_count || 0;
                    const lastTime = chat.last_message?.created_at;

                    return (
                      <div
                        key={userId}
                        onClick={() => setActiveChat(userId)}
                        className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition border-b border-gray-100 ${unreadCount > 0 ? "bg-blue-50" : ""}`}
                      >
                        <div className="relative">
                          <img
                            src={userAvatar || "/default-avatar.jpg"}
                            alt={userName}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => { e.target.src = "/default-avatar.jpg"; }}
                          />
                          {chat.user?.is_online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm truncate ${unreadCount > 0 ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
                              {userName}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {lastTime ? formatTime(lastTime) : ""}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className={`text-xs truncate ${unreadCount > 0 ? "text-gray-800 font-medium" : "text-gray-500"}`}>
                              {lastMsg || "Chưa có tin nhắn"}
                            </p>
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 ml-1">
                                {unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            /* CHAT MESSAGES */
            <>
              {/* Header */}
              <div className="p-2 bg-blue-600 text-white flex items-center gap-2">
                <button onClick={() => setActiveChat(null)} className="hover:bg-blue-700 p-1 rounded">
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <img
                  src={activeContact?.user?.avatar_url || activeContact?.user?.avatar || "/default-avatar.jpg"}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                  onError={(e) => { e.target.src = "/default-avatar.jpg"; }}
                />
                <span className="font-medium text-sm truncate flex-1">
                  {activeContact?.user?.full_name || activeContact?.user?.name || "Người dùng"}
                </span>
                <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-2">
                {messages.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center mt-8">Bắt đầu cuộc trò chuyện</p>
                ) : (
                  messages.map((m, idx) => {
                    const isMe = m.from_user_id === user.id;
                    return (
                      <div key={m.id || idx} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${isMe ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-gray-800 border rounded-bl-md"}`}>
                          <p>{m.body || m.message}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                            {m.created_at ? new Date(m.created_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-2 bg-white border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    placeholder="Aa"
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sendingMessage || !newMessage.trim()}
                    className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

// Format time helper
const formatTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60 * 1000) return "Vừa xong";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} phút`;
  if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  }
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[date.getDay()];
  }
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};

export default ChatPopup;
