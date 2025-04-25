import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchNearbyRestaurants } from "../services/api";
import { getUserLocation } from "../services/locationService";

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    getUserLocation()
      .then((location) => {
        setDeliveryLocation(location);
      })
      .catch((err) => {
        console.error("Failed to fetch user location:", err);
      });
  }, []);

  useEffect(() => {
    if (deliveryLocation) {
      fetchNearbyRestaurants(deliveryLocation.latitude, deliveryLocation.longitude)
        .then((data) => {
          setRestaurants(data);
          setFilteredRestaurants(data);

          // Get unique categories
          const categories = new Set();
          data.forEach((r) => r.categories?.forEach((c) => categories.add(c)));
          setAllCategories(["All", ...Array.from(categories)]);
        })
        .catch((err) => console.error("Error fetching nearby restaurants:", err));
    }
  }, [deliveryLocation]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredRestaurants(
        restaurants.filter((r) => r.categories?.includes(selectedCategory))
      );
    }
  }, [selectedCategory, restaurants]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Restaurants Near You</h1>

      {!deliveryLocation && <p>Loading your delivery location...</p>}

      {/* Category filter */}
      <div className="mb-6 overflow-x-auto whitespace-nowrap flex gap-2">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedCategory === category
                ? "bg-black text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Restaurants grid */}
      {deliveryLocation && filteredRestaurants.length === 0 && (
        <p>No restaurants found in this category.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <Link
            to={`/restaurant/${restaurant.id}`}
            key={restaurant.id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
          >
            <img
              src={restaurant.imageUrl || "https://source.unsplash.com/400x300/?restaurant,food"}
              alt={restaurant.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold">{restaurant.name}</h3>
              <p className="text-sm text-gray-500">{restaurant.address}</p>
              <div className="mt-2 text-sm text-gray-600">
                {restaurant.categories?.join(", ") || "Various cuisines"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
