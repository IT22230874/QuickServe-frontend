import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [form, setForm] = useState({
    email: "johndoe123@xyz.com",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.token) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#e55103] via-orange-400 to-orange-200">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white relative">
        {/* Logo */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-to-r from-[#e55103] to-orange-500">
            <img
              src="/logo.png"
              alt="Quick Serve Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <span className="text-2xl font-bold text-[#e55103]">Quick Serve</span>
        </div>

        {/* Form Section */}
        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="max-w-md w-full mt-20 md:mt-0">
            <h2 className="text-3xl font-bold text-center mb-2 text-[#e55103]">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Sign in with your email address and password.
            </p>

            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e55103]"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e55103]"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 text-[#e55103] focus:ring-[#e55103] border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-gray-700"
                  >
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-[#e55103] hover:text-orange-700 text-sm"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-[#e55103] hover:bg-orange-700 text-white p-3 rounded-lg font-medium transition duration-200"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 p-3 rounded-lg font-medium transition duration-200"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>
            </div>

            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-[#e55103] font-semibold hover:text-orange-700"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block md:w-1/2 bg-gray-100">
        <img
          src="https://img.freepik.com/free-photo/top-view-table-full-delicious-food-composition_23-2149141352.jpg?semt=ais_hybrid&w=740"
          alt="Login visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
