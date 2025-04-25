import { useEffect, useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { fetchMenu } from "../services/api";
import FoodItemModal from "../components/FoodItemModal";

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu(id).then(setRestaurant);
  }, [id]);

  if (!restaurant) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
            <button
        onClick={() => navigate(-1)}
        className="text-sm mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>
      {/* Restaurant Header */}
      <div className="mb-6">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-64 object-cover rounded-lg shadow"
        />
        <div className="mt-4">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>
          <p className="text-gray-600">{restaurant.address}</p>
        </div>
      </div>

      {/* Menu Grid */}
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurant.items.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-500 text-sm mb-2">{item.description}</p>
              <p className="text-green-600 font-bold">${item.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Existing Popup Modal */}
      {selectedItem && (
        <FoodItemModal
          foodItem={selectedItem}
          restaurantId={id}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default RestaurantPage;
