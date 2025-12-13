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
import DashboardCompany from "../pages/Private/DashboardCompany";
import HomeDashboardPage from "../pages/Private/HomeDashboardPage";

import OrderPage from "../pages/Public/OrderPage";
import CheckoutPage from "../pages/Public/CheckoutPage";
import OrderTrackingPage from "../pages/Public/OrderTrackingPage";

// ⭐ Đấu giá
import AuctionList from "../pages/Public/AuctionList";
import AuctionDetailPage from "../pages/Public/AuctionDetailPage";
import CreateAuctionPage from "../pages/Private/CreateAuctionPage";

// ⭐ Ví điện tử
import WalletPage from "../pages/Private/WalletPage";
import WalletDepositPage from "../pages/Private/WalletDepositPage";
import WalletWithdrawPage from "../pages/Private/WalletWithdrawPage";
import WalletAuctionPaymentsPage from "../pages/Private/WalletAuctionPaymentsPage";

// ⭐ Thông báo
import NotificationsPage from "../pages/Private/NotificationsPage";

// ⭐ Đơn hàng
import MyOrdersPage from "../pages/Private/MyOrdersPage";
import MySalesPage from "../pages/Private/MySalesPage";
import OrderDetailPage from "../pages/Private/OrderDetailPage";

// ⭐ Promotion
import PromotionDetailPage from "../pages/Private/PromotionDetailPage";
import PromotionManagePage from "../pages/Private/PromotionManagePage";

// ⭐ Listing Detail (cho notification click)
import ListingDetailPage from "../pages/Public/ListingDetailPage";

// ⭐ Gói đăng ký
import PricingPage from "../pages/Public/PricingPage";
import SubscriptionPage from "../pages/Private/SubscriptionPage";
import SubscriptionCheckoutPage from "../pages/Private/SubscriptionCheckoutPage";

// ⭐ Tìm kiếm toàn trang
import SearchPage from "../pages/Search/SearchPage";

// ⭐ Admin
import AdminLayout from "../pages/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import ReportsPage from "../pages/Admin/ReportsPage";
import TransactionsPage from "../pages/Admin/TransactionsPage";
import PostsAds from "../pages/Admin/PostsAds";
import AdminWalletDeposits from "../pages/Admin/AdminWalletDeposits";
import AdminWalletWithdraws from "../pages/Admin/AdminWalletWithdraws";
import AdminAuctionPayments from "../pages/Admin/AdminAuctionPayments";
import AdminOrders from "../pages/Admin/AdminOrders";
import AdminSubscriptions from "../pages/Admin/AdminSubscriptions";

// ⭐ Company pages
import CompanyPage from "../pages/Public/CompanyPage";
import CompanyProductPage from "../pages/Public/CompanyProductPage";
import ProductDetailPage from "../pages/Public/ProductDetailPage";
import CompanyPostPage from "../pages/Private/CompanyPostPage";
import CompanyEditPage from "../pages/Private/CompanyEditPage";
import ShopDetailPage from "../pages/Public/ShopDetailPage";

// ⭐ Trang sản phẩm chung
import AllProductsPage from "../pages/Public/AllProductsPage";
import CompanyIntroPage from "../pages/Public/CompanyIntroPage";

import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ResetPasswordVerifyPage from "../pages/Public/ResetPasswordVerifyPage";

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
          
          {/* SHOP DETAIL */}
          <Route path="shops/:shopId" element={<ShopDetailPage />} />

          {/* ĐẤU GIÁ */}
          <Route path="auctions" element={<AuctionList />} />
          <Route path="auction/create" element={<CreateAuctionPage />} />
          <Route path="auction/:id" element={<AuctionDetailPage />} />

          {/* USER ACCOUNT */}
          <Route path="dashboard" element={<HomeDashboardPage />} />
          <Route path="dashboard/company" element={<DashboardCompany />} />
          <Route path="dashboard/company/post" element={<CompanyPostPage />} />
          <Route path="dashboard/company/edit/:id" element={<CompanyEditPage />} />
          <Route path="profile" element={<Profile />} />

          {/* VÍ ĐIỆN TỬ */}
          <Route path="wallet" element={<WalletPage />} />
          <Route path="wallet/deposit" element={<WalletDepositPage />} />
          <Route path="wallet/withdraw" element={<WalletWithdrawPage />} />
          <Route path="wallet/auction-payments" element={<WalletAuctionPaymentsPage />} />

          {/* THÔNG BÁO */}
          <Route path="notifications" element={<NotificationsPage />} />

          {/* ⭐ CHI TIẾT ĐƠN HÀNG (từ notification click) */}
          <Route path="orders/:id" element={<OrderDetailPage />} />

          {/* ⭐ CHI TIẾT LISTING (từ notification click) */}
          <Route path="listings/:id" element={<ListingDetailPage />} />

          {/* ⭐ CHI TIẾT PROMOTION (từ notification click) */}
          <Route path="promotion/:id" element={<PromotionDetailPage />} />
          
          {/* ⭐ QUẢN LÝ QUẢNG CÁO (Seller) */}
          <Route path="promotions" element={<PromotionManagePage />} />

          {/* AUTH */}
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot" element={<ForgotPasswordPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="reset/verify" element={<ResetPasswordVerifyPage />} />

          {/* OTHER FEATURES */}
          <Route path="chat" element={<ChatPage />} />
          <Route path="cart" element={<OrderPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="my-sales" element={<MySalesPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="track-order" element={<OrderTrackingPage />} />

          {/* ⭐ GÓI ĐĂNG KÝ */}
          <Route path="pricing" element={<PricingPage />} />
          <Route path="subscription" element={<SubscriptionPage />} />
          <Route path="subscription/checkout" element={<SubscriptionCheckoutPage />} />

          {/* ⭐ TẤT CẢ SẢN PHẨM */}
          <Route path="products" element={<AllProductsPage />} />
          
          {/* ⭐ CHI TIẾT SẢN PHẨM (từ trang tất cả sản phẩm) */}
          <Route path="product/:id" element={<ProductDetailPage />} />

          {/* ⭐ COMPANY ROUTES */}
          <Route path="company/:slug" element={<CompanyPage />} />
          <Route path="company/:slug/product" element={<CompanyProductPage />} />
          <Route path="company/:slug/product/:id" element={<ProductDetailPage />} />
          <Route path="company/:slug/post" element={<CompanyPostPage />} />
          {/* ⭐ NEW: GIỚI THIỆU DOANH NGHIỆP */}
          <Route path="company/:slug/intro" element={<CompanyIntroPage />} />
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
          <Route path="wallet-deposits" element={<AdminWalletDeposits />} />
          <Route path="wallet-withdraws" element={<AdminWalletWithdraws />} />
          <Route path="auction-payments" element={<AdminAuctionPayments />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoute;
