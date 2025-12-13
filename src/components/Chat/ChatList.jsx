import { useState } from "react";
import Avatar from "../Common/Avatar";

const ChatList = ({ items, activeId, onSelect }) => {
  const [search, setSearch] = useState("");

  // Filter theo tên user
  const filteredItems = items.filter((chat) => {
    // API trả về: { user_id, user: { id, full_name, avatar_url }, last_message, unread_count }
    const userName = chat.user?.full_name || chat.user?.name || chat.name || "";
    return userName.toLowerCase().includes(search.toLowerCase());
  });

  // Format thời gian
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Nếu trong ngày hôm nay
    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Nếu trong tuần
    if (diff < 7 * 24 * 60 * 60 * 1000) {
      const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      return days[date.getDay()];
    }
    
    // Ngày khác
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-2 border-b bg-white">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 text-sm p-4 text-center">
            {search ? "Không tìm thấy kết quả" : "Chưa có cuộc trò chuyện"}
          </p>
        ) : (
          filteredItems.map((chat) => {
            // Map API response
            // API trả về: { user_id, user: { id, full_name, avatar_url }, last_message: { body, created_at }, unread_count }
            const userId = chat.user_id || chat.user?.id || chat.id;
            const userName = chat.user?.full_name || chat.user?.name || chat.name || "Người dùng";
            // BE trả về cả avatar và avatar_url để tương thích
            const userAvatar = chat.user?.avatar_url || chat.user?.avatar || chat.avatar_url || chat.avatar;
            const lastMsg = chat.last_message?.body || chat.last_message?.message || chat.lastMessage || "";
            const lastTime = chat.last_message?.created_at || chat.updated_at;
            const unreadCount = chat.unread_count || 0;
            const isOnline = chat.user?.is_online || false;

            return (
              <div
                key={userId}
                onClick={() => onSelect(userId)}
                className={`flex items-center gap-2 p-2.5 cursor-pointer border-b border-gray-100
                transition hover:bg-gray-100 ${Number(activeId) === Number(userId) ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar src={userAvatar} alt={userName} size={40} />
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium text-gray-800 truncate ${unreadCount > 0 ? 'font-semibold' : ''}`}>
                      {userName}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">
                      {formatTime(lastTime)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-xs truncate max-w-[140px] ${unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                      {lastMsg || "Chưa có tin nhắn"}
                    </p>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 flex-shrink-0">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
