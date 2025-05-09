// RestaurantPage.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMenu } from "../services/api";
import FoodItemModal from "../components/FoodItemModal";

// Loading animation component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
  </div>
);

const RestaurantPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetchMenu(id)
      .then(data => {
        setRestaurant(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (!restaurant) return <p className="p-4">Failed to load restaurant data</p>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm mb-4 text-[#e55103] hover:underline"
      >
        ← Back to restaurants
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
              <p className="text-gray-500 text-sm mb-2 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-[#e55103] font-bold">LKR {item.price.toFixed(2)}</p>
                {item.popular && (
                  <span className="text-xs bg-orange-100 text-[#e55103] px-2 py-1 rounded">
                    #1 most liked
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Food Item Modal */}
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