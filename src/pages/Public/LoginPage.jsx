import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", formData);
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-20 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-10">
            Sign in
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" /> Remember Me
              </label>
              <Link
                to="/forgot"
                className="text-blue-600 hover:underline font-medium"
              >
                Forgot Password
              </Link>
            </div>

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

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-700 hover:underline font-semibold"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - BACKGROUND IMAGE */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1100&q=80"
          alt="Trade Connection Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-700/60"></div>

        {/* Optional Text */}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <h2 className="text-white text-3xl font-semibold leading-snug">
            Kết Nối Giao Thương <br />
            <span className="text-blue-200">Phát triển bền vững</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
