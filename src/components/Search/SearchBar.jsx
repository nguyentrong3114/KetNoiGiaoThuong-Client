import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ defaultValue = "" }) => {
  const [text, setText] = useState(defaultValue);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    navigate(`/search?q=${text}`);
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-3 border rounded-full px-4 py-2 bg-white shadow-sm"
    >
      <FiSearch className="text-gray-500 text-xl" />
      <input
        type="text"
        className="flex-1 outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tìm sản phẩm, đấu giá, doanh nghiệp…"
      />
    </form>
  );
};

export default SearchBar;
