import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// LAYOUT
import MainLayout from "../pages/Layout/MainLayout";

// PUBLIC PAGES
import HomePage from "../pages/Public/HomePage";
import AboutPage from "../pages/Public/AboutPage";
import ContactPage from "../pages/Public/ContactPage";
import ChatPage from "../pages/Public/ChatPage";

import LoginPage from "../pages/Public/LoginPage";
import RegisterPage from "../pages/Public/RegisterPage";
import ForgotPasswordPage from "../pages/Public/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Public/ResetPasswordPage";

import Profile from "../pages/Private/Profile";
import Dashboard from "../pages/Private/Dashboard";

import OrderPage from "../pages/Public/OrderPage";
import CheckoutPage from "../pages/Public/CheckoutPage";
import OrderTrackingPage from "../pages/Public/OrderTrackingPage";

// ⭐ Đấu giá
import AuctionList from "../pages/Public/AuctionList";
import AuctionPage from "../pages/Public/AuctionPage";
import AuctionCreatePage from "../pages/Public/AuctionCreatePage";

// ⭐ Tìm kiếm toàn trang
import SearchPage from "../pages/Search/SearchPage";

// ⭐ Admin
import AdminLayout from "../pages/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import ReportsPage from "../pages/Admin/ReportsPage";
import TransactionsPage from "../pages/Admin/TransactionsPage";
import PostsAds from "../pages/Admin/PostsAds";

// ⭐ Company pages
import CompanyPage from "../pages/Public/CompanyPage";
import CompanyProductPage from "../pages/Public/CompanyProductPage";
import ProductDetailPage from "../pages/Public/ProductDetailPage";
import CompanyPostPage from "../pages/Private/CompanyPostPage";

// ⭐ Trang sản phẩm chung
import AllProductsPage from "../pages/Public/AllProductsPage";

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        {/* ============================= */}
        {/*           MAIN LAYOUT         */}
        {/* ============================= */}
        <Route path="/" element={<MainLayout />}>
          {/* HOME + INFO */}
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* SEARCH */}
          <Route path="search" element={<SearchPage />} />

          {/* ĐẤU GIÁ */}
          <Route path="auctions" element={<AuctionList />} />
          <Route path="auction/:id" element={<AuctionPage />} />
          <Route path="auction/create" element={<AuctionCreatePage />} />

          {/* USER ACCOUNT */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />

          {/* AUTH */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot" element={<ForgotPasswordPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />

          {/* OTHER FEATURES */}
          <Route path="chat" element={<ChatPage />} />
          <Route path="cart" element={<OrderPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track-order" element={<OrderTrackingPage />} />

          {/* ⭐ TẤT CẢ SẢN PHẨM */}
          <Route path="products" element={<AllProductsPage />} />

          {/* ⭐ COMPANY ROUTES */}
          <Route path="company/:slug" element={<CompanyPage />} />
          <Route path="company/:slug/product" element={<CompanyProductPage />} />
          <Route path="company/:slug/product/:id" element={<ProductDetailPage />} />
          <Route path="company/:slug/post" element={<CompanyPostPage />} />
        </Route>

        {/* ============================= */}
        {/*           ADMIN LAYOUT        */}
        {/* ============================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="posts" element={<PostsAds />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoute;
