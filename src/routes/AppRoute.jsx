import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../pages/Layout/MainLayout";
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

const AppRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="reset" element={<ResetPasswordPage />} />
          <Route path="forgot" element={<ForgotPasswordPage />} />
        </Route>
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
