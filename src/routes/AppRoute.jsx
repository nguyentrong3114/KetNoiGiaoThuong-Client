import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "../pages/Layout/MainLayout";
import HomePage from "../pages/Public/HomePage";
import AboutPage from "../pages/Public/AboutPage";
import Profile from "../pages/Private/Profile";
import LoginPage from "../pages/Public/LoginPage";
import RegisterPage from "../pages/Public/RegisterPage";
import ResetPasswordPage from "../pages/Public/ResetPasswordPage";
import ForgotPasswordPage from "../pages/Public/ForgotPasswordPage";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";

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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
};

export default AppRoute;
