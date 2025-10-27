import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Forgot password request:", email);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Current Password</h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter the email you used to create your account so we can send you instructions on how to
          reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg py-3 rounded-full transition-all"
          >
            Send
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/login"
            className="block w-full text-center border border-gray-300 py-3 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
