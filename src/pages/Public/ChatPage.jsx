import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  MessageSquare,
  Loader2,
  ChevronLeft,
  Send,
  Search,
  MoreVertical,
  LogIn,
} from "lucide-react";
import ChatList from "../../components/Chat/ChatList";
import ChatWindow from "../../components/Chat/ChatWindow";
import ChatInput from "../../components/Chat/ChatInput";
import { chatApi } from "../../services/apiClient";

const ChatPage = () => {
  /* ============================
     GIỮ NGUYÊN LOGIC CỦA BẠN
  ============================ */
  const [searchParams] = useSearchParams();
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState("");
  const [messagesData, setMessagesData] = useState({});
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchConversations = useCallback(async () => {
    try {
      console.log("📥 Fetching conversations...");
      const response = await chatApi.getConversations();
      console.log("📦 Conversations response:", response);

      if (response?.data) {
        setChats(response.data);
        const userIdFromUrl = searchParams.get("user_id");
        if (userIdFromUrl && !activeId) {
          setActiveId(parseInt(userIdFromUrl));
        }
      }
    } catch (error) {
      console.error("❌ Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, activeId]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!activeId) return;

    try {
      console.log("📥 Fetching messages for user:", activeId);
      const response = await chatApi.getMessages(activeId);
      console.log("📦 Messages response:", response);

      if (response?.data) {
        setMessagesData((prev) => ({
          ...prev,
          [activeId]: response.data,
        }));

        try {
          await chatApi.markRead(activeId);
          setChats((prev) =>
            prev.map((chat) => (chat.user_id === activeId ? { ...chat, unread_count: 0 } : chat))
          );
        } catch (err) {
          console.log("Mark read error (ignored):", err);
        }
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  }, [activeId]);

  useEffect(() => {
    fetchMessages();
  }, [activeId, fetchMessages]);

  useEffect(() => {
    if (!activeId) return;
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeId, fetchMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const messages = activeId ? messagesData[activeId] || [] : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeId || sending) return;

    const messageText = draft.trim();
    const receiverId = Number(activeId);

    // Validate receiver ID
    if (!receiverId || isNaN(receiverId)) {
      console.error("❌ Invalid receiver ID:", activeId);
      alert("Lỗi: Không xác định được người nhận.");
      return;
    }

    const tempMessage = {
      id: Date.now(),
      from_user_id: currentUser.id,
      to_user_id: receiverId,
      body: messageText,
      created_at: new Date().toISOString(),
      is_read: false,
    };

    setMessagesData((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), tempMessage],
    }));

    setDraft("");
    setSending(true);

    try {
      console.log("📤 Sending message:", {
        to_user_id: receiverId,
        body: messageText,
        currentUser: currentUser.id,
      });

      // Gửi đúng format theo BE: to_user_id, body
      const response = await chatApi.sendMessage({
        to_user_id: receiverId,
        body: messageText,
      });

      console.log("✅ Message sent successfully:", response);

      // Refresh messages và conversations
      fetchMessages();
      fetchConversations();
    } catch (error) {
      console.error("❌ Error sending message:", error);
      console.error("❌ Error details:", error.message);

      // Hiển thị lỗi chi tiết hơn
      const errorMsg = error.message || "Không thể gửi tin nhắn";
      alert(`Lỗi: ${errorMsg}. Vui lòng thử lại.`);

      // Rollback optimistic update
      setMessagesData((prev) => ({
        ...prev,
        [activeId]: (prev[activeId] || []).filter((m) => m.id !== tempMessage.id),
      }));
      setDraft(messageText);
    } finally {
      setSending(false);
    }
  };

  const contact =
    chats.find((c) => {
      const chatUserId = c.user_id || c.user?.id;
      return Number(chatUserId) === Number(activeId);
    }) || null;

  /* ============================
        UI NÂNG CẤP
  ============================ */

  // 1. Unauthenticated UI
  if (!currentUser?.id) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-slate-50 px-4">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
            <LogIn size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Đăng nhập để chat</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Kết nối trực tiếp với người bán và người mua để trao đổi thông tin nhanh chóng hơn.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            <LogIn size={20} />
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // 2. Main Chat UI
  return (
    <div className="h-[calc(100vh-64px)] bg-slate-50 py-4 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 grid grid-cols-1 md:grid-cols-12">
        {/* ================= LEFT SIDEBAR (Chiếm 4/12) ================= */}
        <div
          className={`md:col-span-4 lg:col-span-3 border-r border-slate-100 bg-white flex-col h-full ${activeId ? "hidden md:flex" : "flex"}`}
        >
          {/* Header Sidebar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <MessageSquare size={20} />
              </div>
              <span className="text-lg font-bold text-slate-800">Tin nhắn</span>
            </div>
            {loading && <Loader2 size={18} className="text-indigo-600 animate-spin" />}
          </div>

          {/* Search Placeholder (Visual Only) */}
          <div className="px-4 pb-2 pt-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Tìm kiếm cuộc trò chuyện..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                disabled // Disabled vì logic chưa có
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading && chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-2">
                <Loader2 size={24} className="animate-spin text-indigo-500" />
                <span className="text-sm">Đang tải danh sách...</span>
              </div>
            ) : chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-60 text-slate-400 px-6 text-center">
                <MessageSquare size={40} className="mb-3 opacity-20" />
                <p className="text-sm font-medium text-slate-500">Chưa có tin nhắn nào</p>
                <p className="text-xs mt-1">Hãy bắt đầu trò chuyện với người bán!</p>
              </div>
            ) : (
              <ChatList items={chats} activeId={activeId} onSelect={setActiveId} />
            )}
          </div>
        </div>

        {/* ================= RIGHT CHAT WINDOW (Chiếm 8/12) ================= */}
        <div
          className={`md:col-span-8 lg:col-span-9 flex flex-col h-full bg-slate-50/50 ${!activeId ? "hidden md:flex" : "flex"}`}
        >
          {!activeId ? (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                <MessageSquare size={48} className="text-indigo-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Chào mừng đến với Chat!</h3>
              <p className="text-slate-500 max-w-xs">
                Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu nhắn tin.
              </p>
            </div>
          ) : (
            /* Active Chat State */
            <>
              {/* Header Chat Window */}
              <div className="h-16 px-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setActiveId(null)}
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  {/* User Info Wrapper (Giả lập hiển thị để header đẹp hơn, thực tế ChatWindow có thể render lại) */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                      {contact?.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm md:text-base">
                        {contact?.user?.name || "Người dùng"}
                      </h3>
                      <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Trực tuyến
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-hidden relative bg-slate-50">
                <ChatWindow
                  contact={contact}
                  messages={messages}
                  scrollRef={scrollRef}
                  currentUserId={currentUser.id}
                />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-200 shrink-0">
                <div className="relative">
                  <ChatInput
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onSend={handleSend}
                    disabled={sending}
                    placeholder={sending ? "Đang gửi tin nhắn..." : "Nhập tin nhắn..."}
                  />
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Nhấn <strong>Enter</strong> để gửi. Tin nhắn tuân thủ quy tắc cộng đồng.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CSS Scrollbar tùy chỉnh */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ChatPage;
