import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // import cart context

const CheckoutDrawer = ({ restaurantId, restaurantGroup, onClose }) => {
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const { removeFromCart, addToCart } = useCart(); // 🆕 use addToCart too
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8082/api/delivery/fee/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDeliveryCharge(response.data);
      } catch (error) {
        console.error("Error fetching delivery charge:", error);
      }
    };

    fetchDeliveryCharge();
  }, [restaurantId]);

    // 👉 **Close the drawer if restaurantGroup is empty or undefined**
    useEffect(() => {
        if (!restaurantGroup || restaurantGroup.items.length === 0) {
          onClose();
          //fetchCart(); // refresh cart
        }
      }, [restaurantGroup, onClose]);
    
      if (!restaurantGroup) {
        return null; // don't try to render if data missing
      }
    
      const subtotal = restaurantGroup.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

//   const subtotal = restaurantGroup.items.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
  const total = subtotal + deliveryCharge;

  const handleDecrease = async (itemId) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const handleIncrease = async (item) => {
    try {
      await addToCart(item.restaurantId, item.foodItemId, 1); // 🔥 increment by 1
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        restaurantId,
        items: JSON.parse(JSON.stringify(restaurantGroup.items)),
        restaurantCoordinates: restaurantGroup.restaurantCoordinates,
        deliveryCharge,
      },
    });
  };


  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 rounded-l-2xl overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {restaurantGroup.restaurantName || `Restaurant #${restaurantId}`}
        </h2>
        <button onClick={onClose} className="text-gray-500 text-2xl">
          &times;
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100%-200px)] space-y-4">
        {restaurantGroup.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            {/* Food Image */}
            <img
              src={item.imageUrl || "https://via.placeholder.com/60"}
              alt={item.name}
              className="w-16 h-16 rounded-full object-cover border"
            />

            {/* Food Info */}
            <div className="flex-1 ml-4">
              <h4 className="font-semibold text-md">{item.name}</h4>
              <p className="text-gray-500 text-sm">
                LKR {item.price.toFixed(2)} each
              </p>
              <div className="flex items-center mt-1 space-x-2">
                {/* Decrease Button */}
                <button
                  onClick={() => handleDecrease(item.id)}
                  className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-lg font-bold"
                >
                  -
                </button>

                {/* Quantity */}
                <span className="text-md font-medium">{item.quantity}</span>

                {/* Increase Button */}
                <button
                  onClick={() => handleIncrease(item)}
                  className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total price per item */}
            <div className="text-right font-semibold text-md text-gray-700 ml-4">
              LKR {(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>LKR {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>LKR {typeof deliveryCharge === "number" ? deliveryCharge.toFixed(2) : "0.00"}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>LKR {typeof total === "number" ? total.toFixed(2) : "0.00"}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="absolute bottom-0 w-full p-4 border-t bg-white">
        <button
          onClick={handleCheckout}
          className="w-full bg-black text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-900 transition"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CheckoutDrawer;
