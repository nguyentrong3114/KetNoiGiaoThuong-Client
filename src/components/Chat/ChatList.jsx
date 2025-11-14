import React, { useState } from "react";
import Avatar from "../Common/Avatar";

const ChatList = ({ items, activeId, onSelect }) => {
    const [search, setSearch] = useState("");

    // Lọc danh sách theo tên
    const filteredItems = items.filter((chat) =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col">
            {/* Ô tìm kiếm */}
            <div className="p-3 border-b">
                <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                />
            </div>

            {/* Danh sách chat */}
            <div className="flex-1 overflow-y-auto">
                {filteredItems.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={() => onSelect(chat.id)}
                        className={`flex items-center gap-3 p-4 cursor-pointer border-b hover:bg-gray-50 ${activeId === chat.id ? "bg-blue-50" : ""
                            }`}
                    >
                        <Avatar src={chat.avatar} alt={chat.name} size={40} />
                        <div>
                            <div className="font-semibold">{chat.name}</div>
                            <div className="text-sm text-gray-500">{chat.lastMessage}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatList;
