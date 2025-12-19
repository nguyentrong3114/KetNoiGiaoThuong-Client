import React from "react";
import { FiSend, FiSmile, FiPaperclip } from "react-icons/fi";

const ChatInput = ({ value, onChange, onSend, disabled = false, placeholder = "Nhập tin nhắn..." }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && value.trim()) {
      onSend();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-2 bg-white"
    >
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-full border px-3 py-1.5 text-sm bg-gray-50 focus:bg-white focus:border-blue-400 transition focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      {/* Send */}
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <FiSend size={16} />
      </button>
    </form>
  );
};

export default ChatInput;
