import React from "react";
import { Link } from "react-router-dom";
import { useNavigationHistory } from "../context/NavigationHistoryContext";

const labelMap = {
  "": "Trang chủ",
  cart: "Giỏ hàng",
  checkout: "Thanh toán",
  "order-tracking": "Theo dõi đơn hàng",
  products: "Sản phẩm",
  about: "Giới thiệu",
  chat: "Liên hệ",
};

const AutoBreadcrumb = () => {
  const history = useNavigationHistory();

  const convert = (path) => {
    const segment = path.replace("/", "");
    return labelMap[segment] || segment || "Trang chủ";
  };

  return (
    <nav className="text-sm text-gray-500 flex items-center gap-2">
      {history.map((path, idx) => {
        const isLast = idx === history.length - 1;

        return (
          <div key={idx} className="flex items-center gap-2">
            {!isLast ? (
              <Link to={path} className="text-blue-600 hover:underline font-medium">
                {convert(path)}
              </Link>
            ) : (
              <span className="text-gray-800 font-medium">{convert(path)}</span>
            )}
            {!isLast && <span className="text-gray-400">›</span>}
          </div>
        );
      })}
    </nav>
  );
};

export default AutoBreadcrumb;
