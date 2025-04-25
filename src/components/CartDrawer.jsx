import { useState } from "react";
import { useCart } from "../context/CartContext";
import CheckoutDrawer from "./CheckoutDrawer";

const CartDrawer = () => {
  const { groupedCart, isCartOpen, setIsCartOpen } = useCart();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

  const hasItems = Object.keys(groupedCart).length > 0;

  const handleRestaurantClick = (restaurantId) => {
    setSelectedRestaurantId(restaurantId);
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-500 text-lg">
            &times;
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100%-60px)]">
          {!hasItems ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            Object.entries(groupedCart).map(([restaurantId, group]) => (
              <div
                key={restaurantId}
                className="mb-4 cursor-pointer hover:bg-gray-100 p-3 rounded"
                onClick={() => handleRestaurantClick(restaurantId)}
              >
                <h3 className="text-md font-semibold">
                  🍽️ {group.restaurantName || `Restaurant #${restaurantId}`}
                </h3>
                <p className="text-sm text-gray-600">
                  {group.items.length} item{group.items.length > 1 ? "s" : ""}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Conditionally render the detailed checkout drawer */}
      {selectedRestaurantId && (
        <CheckoutDrawer
          restaurantId={selectedRestaurantId}
          restaurantGroup={groupedCart[selectedRestaurantId]}
          onClose={() => setSelectedRestaurantId(null)}
        />
      )}
    </>
  );
};

export default CartDrawer;
