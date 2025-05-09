import { useState } from "react";
import { useCart } from "../context/CartContext";
import CheckoutDrawer from "./CheckoutDrawer";
import { XMarkIcon, ChevronRightIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";

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
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="text-gray-500 hover:text-[#e55103] transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100%-60px)]">
          {!hasItems ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBagIcon className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-2">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedCart).map(([restaurantId, group]) => (
                <div
                  key={restaurantId}
                  className="flex gap-3 p-3 rounded-lg border hover:border-[#e55103] transition-colors cursor-pointer"
                  onClick={() => handleRestaurantClick(restaurantId)}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={group.restaurantImage || "https://tb-static.uber.com/prod/image-proc/processed_images/6fa7e9f5be1dc85f7858a71cc1b15083/c9252e6c6cd289c588c3381bc77b1dfc.jpeg"}
                      alt={group.restaurantName}
                      className="w-16 h-16 rounded-full object-cover border"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">
                      {group.restaurantName || `Restaurant #${restaurantId}`}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500">
                        {group.items.length} item{group.items.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              ))}
            </div>
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