import { Link } from "react-router-dom";
import { FaHome, FaListAlt, FaHeart, FaTag, FaQuestionCircle, FaSignOutAlt } from "react-icons/fa";

const MenuDrawer = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b font-bold text-xl text-gray-800">
          Menu
        </div>

        <div className="flex-1 px-6 py-4 space-y-4">
          <Link to="/" className="flex items-center gap-3 text-gray-700 hover:text-[#f23f07]">
            <FaHome /> Home
          </Link>
          <Link to="/orders" className="flex items-center gap-3 text-gray-700 hover:text-[#f23f07]">
            <FaListAlt /> Orders
          </Link>
          <Link to="/favorites" className="flex items-center gap-3 text-gray-700 hover:text-[#f23f07]">
            <FaHeart /> Favorites
          </Link>
          <Link to="/offers" className="flex items-center gap-3 text-gray-700 hover:text-[#f23f07]">
            <FaTag /> Offers
          </Link>
          <Link to="/help" className="flex items-center gap-3 text-gray-700 hover:text-[#f23f07]">
            <FaQuestionCircle /> Help
          </Link>
        </div>

        <div className="px-6 py-4 border-t">
          <button
            onClick={() => {
              // handle logout logic here
              alert("Logged out!");
              onClose();
            }}
            className="flex items-center gap-3 text-red-600 hover:text-red-800"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black opacity-30 z-[-1]"
        onClick={onClose}
      />
    </div>
  );
};

export default MenuDrawer;
