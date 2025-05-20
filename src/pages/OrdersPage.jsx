// src/pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import TrackOrderModal from "../components/TrackOrderModal";
import { getOrders } from "../services/api";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        console.log('Fetched orders:', data);
        setOrders(data);
      } catch (err) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleTrackOrder = (order) => {
    // Pass coordinates explicitly to modal
    setSelectedOrder({
      ...order,
      restaurantCoords: order.restaurantCoordinates
        ? [
            order.restaurantCoordinates.longitude,
            order.restaurantCoordinates.latitude,
          ]
        : undefined,
      customerCoords: order.customerCoordinates
        ? [
            order.customerCoordinates.longitude,
            order.customerCoordinates.latitude,
          ]
        : undefined,
    });
  };

  const closeTrackOrder = () => {
    setSelectedOrder(null);
  };

  // Filter orders based on status
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ongoing") {
      return order.status === "ONGOING";
    }
    if (activeTab === "all") {
      return order.status === "PLACED" || order.status === "ONGOING";
    }
    return true;
  });

  const address = localStorage.getItem("address");

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>{error}</div>;

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
        <h1 className="text-3xl font-bold text-[#e55103]">
          Quick Serve Orders
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 mb-8 border-b pb-2">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`${
            activeTab === "ongoing"
              ? "text-[#e55103] border-b-2 border-[#e55103]"
              : "text-gray-500"
          } font-semibold pb-2`}
        >
          Ongoing Orders
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`${
            activeTab === "all"
              ? "text-[#e55103] border-b-2 border-[#e55103]"
              : "text-gray-500"
          } font-semibold pb-2`}
        >
          All Orders
        </button>
      </div>

      {/* Order Cards */}
      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border p-6 rounded-2xl shadow-sm bg-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">{order.restaurantName}</h2>
                {order.status === "ONGOING" && (
                  <button
                    onClick={() => handleTrackOrder(order)}
                    className="bg-[#e55103] text-white py-2 px-4 rounded-lg hover:bg-orange-700"
                  >
                    Track Order
                  </button>
                )}
              </div>

              <div className="text-sm text-gray-600 mb-4">
                <p>
                  <strong>Restaurant:</strong> {order.restaurantAddress}
                </p>
                <p>
                  <strong>Delivery:</strong> {address}
                </p>
                <p>
                  <strong>Status:</strong> {order.status}
                </p>
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
          ))
        )}
      </div>

      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={!!selectedOrder}
        onClose={closeTrackOrder}
        order={selectedOrder}
        restaurantCoords={selectedOrder?.restaurantCoords}
        customerCoords={selectedOrder?.customerCoords}
      />
    </div>
  );
};

export default OrdersPage;
