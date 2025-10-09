import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "doanhnghiep",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", formData);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* LEFT IMAGE */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1200&q=80"
          alt="Register Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-700/60"></div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-20 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl md:text-4xl font-extrabold text-blue-800 mb-10">
            Register your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Please enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Role
              </label>
              <div className="flex items-center gap-6 text-gray-700">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="doanhnghiep"
                    checked={formData.role === "doanhnghiep"}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  Doanh Nghiệp
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="canhan"
                    checked={formData.role === "canhan"}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  Cá Nhân
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Please enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg py-3 rounded-full transition-all"
            >
              Submit
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Login */}
          <button className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>

          {/* Link to Login */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-blue-700 hover:underline font-semibold"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
