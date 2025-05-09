// src/pages/OrdersPage.jsx
import React, { useState } from "react";
import TrackOrderModal from "../components/TrackOrderModal";



const dummyOrders = [
  {
    id: "123",
    restaurantName: "Savoury Homagama",
    restaurantAddress: "Homagama, Sri Lanka",
    deliveryAddress: "Habarakada-Ranala Road, Habarakada 10654, Sri Lanka",
    status: "Preparing",
    items: [
      { name: "Margherita Pizza", quantity: 1 }
    ],
    totalPrice: 2772,
    ongoing: true,
  },
  {
    id: "124",
    restaurantName: "Kottu Kafe",
    restaurantAddress: "25 Galle Road, Colombo 03",
    deliveryAddress: "456 Mounlavinia",
    status: "Delivered",
    items: [{ name: "Salmon Roll", quantity: 3 }],
    totalPrice: 30.5,
    ongoing: false,
  },
];

const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
  };

  const closeTrackOrder = () => {
    setSelectedOrder(null);
  };

  const filteredOrders = dummyOrders.filter(
    (order) => (activeTab === "ongoing" ? order.ongoing : true)
  );

  const address = localStorage.getItem("address");

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-[#e55103] font-semibold mr-4"
        >
          &larr; Back
        </button>
        <h1 className="text-3xl font-bold text-[#e55103]">Quick Serve Orders</h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 mb-8 border-b pb-2">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`${
            activeTab === "ongoing" ? "text-[#e55103] border-b-2 border-[#e55103]" : "text-gray-500"
          } font-semibold pb-2`}
        >
          Ongoing Orders
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`${
            activeTab === "all" ? "text-[#e55103] border-b-2 border-[#e55103]" : "text-gray-500"
          } font-semibold pb-2`}
        >
          All Orders
        </button>
      </div>

      {/* Order Cards */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <div key={order.id} className="border p-6 rounded-2xl shadow-sm bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{order.restaurantName}</h2>
              {order.ongoing && (
                <button
                  onClick={() => handleTrackOrder(order)}
                  className="bg-[#e55103] text-white py-2 px-4 rounded-lg hover:bg-orange-700"
                >
                  Track Order
                </button>
              )}
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p><strong>Restaurant:</strong> {order.restaurantAddress}</p>
              <p><strong>Delivery:</strong> {address}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>

            <div className="text-gray-700">
              <p className="font-semibold mb-2">Items:</p>
              <ul className="list-disc list-inside">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
              <div className="mt-4 font-bold text-lg">
                Total: LKR {order.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Track Order Modal */}
      <TrackOrderModal isOpen={!!selectedOrder} onClose={closeTrackOrder} order={selectedOrder} />
    </div>
  );
};

export default OrdersPage;
