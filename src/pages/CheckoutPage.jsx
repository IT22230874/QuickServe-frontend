import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantId, items, deliveryCharge } = location.state;

  const token = localStorage.getItem("token");

  console.log("res id:", restaurantId);
  console.log(items);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalPrice = subtotal + deliveryCharge;

  const handlePlaceOrder = async () => {
    const requestBody = {
      restaurantId,
      deliveryCharges: deliveryCharge,
      totalPrice,
      status: "PLACED",
      items: items.map((item) => ({
        foodItemId: item.foodItemId,
        quantity: item.quantity,
      })),
    };

    console.log(requestBody);

    try {
      const response = await axios.post("http://localhost:8082/orders/new", requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Order placed!", response.data);
      navigate("/orders");
    } catch (error) {
      console.error("Error placing order", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Order Summary</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between border-b pb-2">
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-600">
                {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Delivery</span>
          <span>${deliveryCharge.toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-black text-white py-3 rounded text-lg font-semibold hover:bg-gray-900"
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
