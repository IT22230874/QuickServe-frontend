// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar";
import CartDrawer from "../components/CartDrawer";

const MainLayout = ({ children }) => {
  return (
    <div className="relative">
      <Navbar />
      <main>{children}</main>
      <CartDrawer /> {/* Add this line */}
    </div>
  );
};

export default MainLayout;
