import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Player } from "@lottiefiles/react-lottie-player";
import { IoArrowBack } from "react-icons/io5"; // Back icon
import successAnimation from "../assets/Animation - 1745745459331.json";
import loadingAnimation from "../assets/Animation - 1745857987634.json"; // You should add a loading animation file

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { restaurantId, items, deliveryCharge } = location.state;

  const token = localStorage.getItem("token");
  const address = localStorage.getItem("address");

  const [deliveryAddress, setDeliveryAddress] = useState(
    "123 Main Street, City"
  );
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
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
      deliveryInstructions,
      paymentMethod,
      deliveryAddress,
    };

    // Prepare payment body for Stripe
    const paymentBody = {
      restaurantId: restaurantId,
      totalAmount: totalPrice,
      deliveryCharge: deliveryCharge,
      numberOfMeals: items.reduce((acc, item) => acc + item.quantity, 0),
      mealNames: items.map((item) => item.name),
    };

    try {
      setIsLoading(true);
      // Place the order first
      await axios.post(import.meta.env.VITE_APP_API_NEW_ORDER, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Then initiate Stripe checkout
      const paymentRes = await axios.post(
        "http://localhost:8099/api/payments/v1/checkout",
        paymentBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { sessionUrl } = paymentRes.data;
      if (sessionUrl) {
        window.location.href = sessionUrl;
      } else {
        alert("Failed to initiate payment session.");
      }
    } catch (error) {
      console.error("Error placing order or initiating payment", error);
      alert("Failed to place order or initiate payment.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-center">
        <Player
          autoplay
          loop
          src={loadingAnimation}
          style={{ height: "200px", width: "200px" }}
        />
        <h2 className="text-xl font-semibold mt-4 text-[#e55103]">
          Redirecting to Payment gateway...
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-[#e55103] text-2xl mr-4"
        >
          <IoArrowBack />
        </button>
        <h1 className="text-3xl font-bold text-[#e55103]">Quick Serve</h1>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left column */}
        <div className="space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">
                Delivery Address
              </h2>
              <button
                onClick={() => alert("Edit address feature coming soon!")}
                className="text-[#e55103] text-sm hover:underline"
              >
                Edit
              </button>
            </div>
            <p className="text-gray-700">{address}</p>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Payment Method
            </h2>
            <select
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#e55103]"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>Credit/Debit Card</option>
              <option>PayPal</option>
            </select>
          </div>

          {/* Delivery Instructions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delivery Instructions
            </h2>
            <textarea
              className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#e55103]"
              rows="4"
              placeholder="Add any special instructions for the delivery..."
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Cart Summary */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-gray-700 border-b pb-2"
              >
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.quantity} × LKR {item.price.toFixed(2)}
                  </p>
                </div>
                <div className="font-medium">
                  LKR {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex justify-between text-gray-600 text-base">
              <span>Subtotal</span>
              <span>LKR {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 text-base">
              <span>Delivery Fee</span>
              <span>LKR {deliveryCharge.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-xl font-bold text-gray-800">
              <span>Total</span>
              <span>LKR {totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-[#e55103] hover:bg-orange-600 text-white font-semibold py-4 rounded-xl text-lg transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
