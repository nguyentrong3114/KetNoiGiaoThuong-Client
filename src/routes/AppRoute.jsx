import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavigationHistoryProvider } from "../context/NavigationHistoryContext";

import MainLayout from "../pages/Layout/MainLayout";
import ChatPage from "../pages/Public/ChatPage";
import OrderPage from "../pages/Public/OrderPage";
import CheckoutPage from "../pages/Public/CheckoutPage";
import OrderTrackingPage from "../pages/Public/OrderTrackingPage";
import HomePage from "../pages/Public/HomePage";
import AboutPage from "../pages/Public/AboutPage";
import Profile from "../pages/Private/Profile";
import LoginPage from "../pages/Public/LoginPage";
import RegisterPage from "../pages/Public/RegisterPage";
import ResetPasswordPage from "../pages/Public/ResetPasswordPage";
import ForgotPasswordPage from "../pages/Public/ForgotPasswordPage";

import AdminLayout from "../pages/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import ReportsPage from "../pages/Admin/ReportsPage";
import TransactionsPage from "../pages/Admin/TransactionsPage";
import PostsAds from "../pages/Admin/PostsAds";

import CompanyPage from "../pages/Public/CompanyPage";
import CompanyProductPage from "../pages/Public/CompanyProductPage";
import ProductDetailPage from "../pages/Public/ProductDetailPage";
import CompanyPostPage from "../pages/Private/CompanyPostPage";

import AllProductsPage from "../pages/Public/AllProductsPage"; // ⭐ Thêm import mới

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        {/* LAYOUT CHÍNH */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="forgot" element={<ForgotPasswordPage />} />

          {/* ⭐ Trang sản phẩm chung cho user cá nhân */}
          <Route path="products" element={<AllProductsPage />} />

          {/* ⭐ Các trang của doanh nghiệp */}
          <Route path="company/:slug" element={<CompanyPage />} />
          <Route path="company/:slug/product" element={<CompanyProductPage />} />
          <Route path="company/:slug/product/:id" element={<ProductDetailPage />} />
          <Route path="company/:slug/post" element={<CompanyPostPage />} />
        </Route>

        {/* ADMIN */}
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
