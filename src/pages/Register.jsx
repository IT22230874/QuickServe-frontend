import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register(form);
      setSuccess("Registration successful! Please log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err?.response?.data || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-[#e55103] mb-6 text-center">
          Create Account
        </h2>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {success && (
          <div className="text-green-600 mb-4 text-center">{success}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#e55103]"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#e55103]"
              required
            />
          </div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#e55103]"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#e55103]"
            required
          />
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={form.addressLine1}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#e55103]"
            required
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2"
            value={form.addressLine2}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#e55103]"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#e55103]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#e55103] hover:bg-orange-600 text-white font-semibold py-3 rounded-xl text-lg transition"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#e55103] hover:underline font-semibold"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
