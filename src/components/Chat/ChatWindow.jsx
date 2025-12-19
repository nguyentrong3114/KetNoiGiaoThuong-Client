import MessageBubble from "./MessageBubble";
import Avatar from "../Common/Avatar";

const ChatWindow = ({ contact, messages, scrollRef, currentUserId }) => {
  // Lấy thông tin contact - hỗ trợ nhiều format từ API
  const contactUser = contact?.user || contact;
  const contactName = contactUser?.full_name || contactUser?.name || "Người dùng";
  // BE trả về cả avatar và avatar_url để tương thích
  const contactAvatar = contactUser?.avatar_url || contactUser?.avatar;
  const isOnline = contactUser?.is_online || false;

  return (
    <div className="flex flex-col h-full">
      {/* HEADER - Compact */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-white">
        <div className="relative">
          <Avatar src={contactAvatar} alt={contactName} size={36} />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{contactName}</div>
          <div className="text-xs text-gray-400">
            {isOnline ? "Đang hoạt động" : "Offline"}
          </div>
        </div>
      </div>

      {/* MESSAGES AREA - Compact */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8 text-sm">
            <p>Chưa có tin nhắn</p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isMe = m.from_user_id === currentUserId;
            // API trả về from_user và to_user
            const senderName = isMe 
              ? "Bạn" 
              : (m.from_user?.full_name || m.from_user?.name || m.sender?.full_name || m.sender?.name || contactName);
            const text = m.body || m.message || m.text || "";
            const time = m.created_at 
              ? new Date(m.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
              : m.time || "";
            
            return (
              <MessageBubble
                key={m.id || idx}
                senderName={senderName}
                text={text}
                time={time}
                isMe={isMe}
                isRead={m.is_read}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
