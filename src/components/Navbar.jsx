import { useEffect, useState } from "react";
import { getUserLocation } from "../services/locationService"; 
import { Link } from "react-router-dom";
import { FaBars, FaShoppingCart, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import LocationPickerModal from "./LocationPickerModal";
import MenuDrawer from "./MenuDrawer"; 
import { useLocation } from "../context/LocationContext";

const Navbar = () => {
  const { address, updateLocation } = useLocation();
  const [location, setLocation] = useState("Fetching location...");
  const [showModal, setShowModal] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const cartItemCount = cart?.items?.length || 0;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSaveLocation = (coords) => {
    updateLocation(coords);
    setShowModal(false);
  };

  useEffect(() => {
    getUserLocation()
      .then((coords) => {
        const { latitude, longitude } = coords;
        setLocation(`Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`);
      })
      .catch((err) => {
        console.error("Error fetching user location:", err);
        setLocation("Location unavailable");
      });
  }, []);

  return (
    <>
      <nav className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-[#e55103] shadow-md gap-4 md:gap-0">
        {/* Left Section - Logo and Menu */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <FaBars
            onClick={() => setMenuOpen(true)}
            className="text-2xl text-white cursor-pointer"
          />
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-white">
            {/* Logo */}
            <img
              src="/logo.png" 
              alt="Quick Serve Logo"
              className="h-12 w-12 object-contain"
            />
            Quick Serve
          </Link>
        </div>

        {/* Middle Section - Location and Search */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 md:mx-10 w-full">
          <div
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 cursor-pointer text-sm text-white"
          >
            <FaMapMarkerAlt className="text-white" />
            <span>{address}</span>
          </div>

          <div className="flex items-center bg-white rounded-full px-4 py-2 w-full md:max-w-lg">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search restaurants or dishes"
              className="bg-transparent outline-none w-full text-sm text-gray-700"
            />
          </div>
        </div>

        {/* Right Section - Cart */}
        <div
          className="relative cursor-pointer text-white"
          onClick={() => setIsCartOpen(true)}
        >
          <FaShoppingCart className="text-2xl" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-[#e55103] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartItemCount}
            </span>
          )}
        </div>
      </nav>

      {/* Location Modal */}
      {showModal && (
        <LocationPickerModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveLocation}
        />
      )}
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Navbar;
