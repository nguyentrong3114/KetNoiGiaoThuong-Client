import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const NavigationHistoryContext = createContext([]);

export const NavigationHistoryProvider = ({ children }) => {
  const location = useLocation();

  // ⭐ Khởi tạo history bằng sessionStorage (nếu có)
  const [history, setHistory] = useState(() => {
    const saved = sessionStorage.getItem("nav_history");
    return saved ? JSON.parse(saved) : ["/"];
  });

  useEffect(() => {
    const newPath = location.pathname;

    setHistory((prev) => {
      // Không lưu nếu trùng path cuối cùng
      if (prev[prev.length - 1] === newPath) return prev;

      // Reset khi quay về Trang chủ
      if (newPath === "/") return ["/"];

      // Không lưu route admin hoặc route không hợp lệ
      if (newPath.startsWith("/admin")) return prev;

      // Không lưu duplicate ở bất cứ vị trí nào
      if (prev.includes(newPath)) return prev;

      const updated = [...prev, newPath];

      // Lưu vào sessionStorage chống lặp khi refresh
      sessionStorage.setItem("nav_history", JSON.stringify(updated));

      return updated;
    });
  }, [location.pathname]);

  return (
    <NavigationHistoryContext.Provider value={history}>
      {children}
    </NavigationHistoryContext.Provider>
  );
};

export const useNavigationHistory = () => useContext(NavigationHistoryContext);
