import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const CheckoutDrawer = ({ restaurantId, restaurantGroup, onClose }) => {
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch delivery charge based on the restaurantId and current user location
    const fetchDeliveryCharge = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from storage or your auth context
        const response = await axios.get(
          `http://localhost:8082/api/delivery/fee/${restaurantId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Delivery fee fetched:", response.data); 
        console.log("res id:", restaurantId); 
        setDeliveryCharge(response.data);
      } catch (error) {
        console.error("Error fetching delivery charge:", error);
      }
    };

    fetchDeliveryCharge();
  }, [restaurantId]);

  const subtotal = restaurantGroup.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + deliveryCharge;

  const handleCheckout = () => {
    navigate("/checkout", {
        state: {
          restaurantId,
          items: JSON.parse(JSON.stringify(restaurantGroup.items)), // deep clone
          restaurantCoordinates: restaurantGroup.restaurantCoordinates,
          deliveryCharge,
        },
      });
      console.log("Navigating to checkout with:", {
        restaurantId,
        items: restaurantGroup.items,
      });
      
  };

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {restaurantGroup.restaurantName || `Restaurant #${restaurantId}`}
        </h2>
        <button onClick={onClose} className="text-gray-500 text-lg">
          &times;
        </button>
      </div>

      <div className="p-4 overflow-y-auto max-h-[calc(100%-150px)]">
        {restaurantGroup.items.map((item) => (
          <div key={item.id} className="mb-4 border-b pb-2">
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">
                  {item.quantity} × ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="text-sm text-gray-700">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>${typeof deliveryCharge === 'number' ? deliveryCharge.toFixed(2) : '0.00'}</span>
          </div>
          <hr />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${typeof total === 'number' ? total.toFixed(2) : '0.00'}</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full p-4 border-t bg-white">
        <button onClick={handleCheckout} className="w-full bg-black text-white py-3 rounded text-lg font-semibold hover:bg-gray-900">
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CheckoutDrawer;
