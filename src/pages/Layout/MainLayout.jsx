import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar chung */}
      <Navbar />

      {/* Nội dung chính */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer chung */}
      <Footer />
    </div>
  );
};

export default MainLayout;
