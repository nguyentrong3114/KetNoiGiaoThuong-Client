import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const MainLayout = () => {
  const location = useLocation();

  // 🟦 Tự động scroll lên đầu trang khi đổi route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="flex-grow"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MainLayout;
