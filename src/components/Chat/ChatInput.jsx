import React from "react";
import { FiSend, FiSmile, FiPaperclip } from "react-icons/fi";

const ChatInput = ({ value, onChange, onSend }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSend();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 p-4 border-t bg-white shadow-inner"
    >
      {/* Emoji */}
      <button type="button" className="text-gray-500 hover:text-gray-700 transition">
        <FiSmile size={20} />
      </button>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Nhập tin nhắn..."
        className="flex-1 rounded-full border px-4 py-2 bg-gray-50 focus:bg-white focus:border-blue-400 transition focus:outline-none"
      />

      {/* Attach file */}
      <button type="button" className="text-gray-500 hover:text-gray-700 transition">
        <FiPaperclip size={20} />
      </button>

      {/* Send */}
      <button
        type="submit"
        className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
      >
        <FiSend size={18} />
      </button>
    </form>
  );
};

export default ChatInput;
