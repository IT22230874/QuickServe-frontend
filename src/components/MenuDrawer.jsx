import { Link } from "react-router-dom";
import {
  FaHome,
  FaListAlt,
  FaUser,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";

const MenuDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-[#e55103] text-white">
          <span className="font-bold text-xl">Menu</span>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-200 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex-1 px-6 py-6 space-y-5 bg-white">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 text-gray-700 hover:text-[#e55103] text-lg font-medium transition"
          >
            <FaHome /> Home
          </Link>
          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center gap-3 text-gray-700 hover:text-[#e55103] text-lg font-medium transition"
          >
            <FaListAlt /> Orders
          </Link>
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 text-gray-700 hover:text-[#e55103] text-lg font-medium transition"
          >
            <FaUser /> Profile
          </Link>
        </div>

        {/* Logout */}
        <div className="px-6 py-4 border-t bg-white">
          <button
            onClick={() => {
              // handle logout logic here
              alert("Logged out!");
              onClose();
            }}
            className="flex items-center gap-3 text-red-600 hover:text-red-800 text-lg font-medium"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      {/* Backdrop as sibling, not child */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default MenuDrawer;
