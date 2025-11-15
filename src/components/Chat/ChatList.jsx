import React, { useState } from "react";
import Avatar from "../Common/Avatar";

const ChatList = ({ items, activeId, onSelect }) => {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Search */}
      <div className="p-3 border-b bg-white">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {filteredItems.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelect(chat.id)}
            className={`flex items-center justify-between p-4 cursor-pointer border-b 
            transition hover:bg-gray-100 ${activeId === chat.id ? "bg-blue-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <Avatar src={chat.avatar} alt={chat.name} size={48} />

              <div className="max-w-[150px]">
                <div className="font-semibold text-gray-800">{chat.name}</div>
                <div className="text-sm text-gray-500 truncate max-w-[140px]">
                  {chat.lastMessage}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400">{chat.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
