import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchNearbyRestaurants } from "../services/api";
import { getUserLocation } from "../services/locationService";
import { useLocation } from '../context/LocationContext';

// Loading animation component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const Dashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  //const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [allCategories, setAllCategories] = useState(["All"]);

  const { location: deliveryLocation } = useLocation();
  
  // Default categories to show even if no restaurants have them yet
  const defaultCategories = [
    "All",
    "Pizza",
    "Sri Lankan",
    "Chinese",
    "Indian",
    "Burgers",
    "Sushi",
    "Desserts"
  ];

  // useEffect(() => {
  //   setIsLoading(true);
  //   getUserLocation()
  //     .then((location) => {
  //       setDeliveryLocation(location);
  //     })
  //     .catch((err) => {
  //       console.error("Failed to fetch user location:", err);
  //       setIsLoading(false);
  //     });
  // }, []);

//   useEffect(() => {
//     if (deliveryLocation) {
//       setIsLoading(true);
//       fetchNearbyRestaurants(deliveryLocation.latitude, deliveryLocation.longitude)
//         .then((data) => {
//           setRestaurants(data);
//           setFilteredRestaurants(data);
          
//           // Extract categories from restaurants and combine with defaults
//           const restaurantCategories = new Set();
//           data.forEach((restaurant) => {
//             if (restaurant.categories) {
//               restaurant.categories.forEach(category => 
//                 restaurantCategories.add(category.toLowerCase())
//               );
//             }
//           });
          
// // Combine default categories with actual ones from API
// const combinedCategories = [
//   ...new Set([
//     ...defaultCategories,
//     ...Array.from(restaurantCategories).map(c => 
//       c.charAt(0).toUpperCase() + c.slice(1)
//     )
//   ])
// ].sort();
          
//           setAllCategories(combinedCategories);
//           setIsLoading(false);
//         })
//         .catch((err) => {
//           console.error("Error fetching nearby restaurants:", err);
//           setIsLoading(false);
//         });
//     }
//   }, [deliveryLocation]);

useEffect(() => {
  if (deliveryLocation) {
    setIsLoading(true);
    fetchNearbyRestaurants(deliveryLocation.latitude, deliveryLocation.longitude)
      .then((data) => {
        setRestaurants(data);
        setFilteredRestaurants(data);
        
        // Extract categories
        const restaurantCategories = new Set();
        data.forEach((restaurant) => {
          if (restaurant.categories) {
            restaurant.categories.forEach(category => 
              restaurantCategories.add(category.toLowerCase())
            );
          }
        });
        
        // Combine categories
        const combinedCategories = [
          ...new Set([
            ...defaultCategories,
            ...Array.from(restaurantCategories).map(c => 
              c.charAt(0).toUpperCase() + c.slice(1)
            )
          ])
        ].sort();
        
        setAllCategories(combinedCategories);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching nearby restaurants:", err);
        setIsLoading(false);
      });
  }
}, [deliveryLocation]);

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredRestaurants(restaurants);
    } else {
      setFilteredRestaurants(
        restaurants.filter((r) => 
          r.categories?.some(c => 
            c.toLowerCase() === selectedCategory.toLowerCase()
          )
        )
      );
    }
  }, [selectedCategory, restaurants]);

  // Calculate delivery fee and time based on distance
  const getDeliveryDetails = (distance) => {
    const deliveryFee = distance < 1 ? "Free" : `${(distance * 150.5).toFixed(2)}`;
    const deliveryTime = Math.min(60, Math.max(15, Math.round(distance * 15)));
    return { deliveryFee, deliveryTime };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Restaurants Near You</h1>

      {/* Category filter */}
      <div className="mb-6 overflow-x-auto whitespace-nowrap flex gap-2 pb-2">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full border transition flex-shrink-0 ${
              selectedCategory === category
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && <LoadingSpinner />}

      {/* Empty state */}
      {!isLoading && deliveryLocation && filteredRestaurants.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No restaurants found in this category.</p>
        </div>
      )}

      {/* Location loading */}
      {!deliveryLocation && !isLoading && (
        <div className="text-center py-10">
          <p className="text-gray-500">Unable to determine your location. Please check your location settings.</p>
        </div>
      )}

      {/* Restaurants grid */}
      {!isLoading && deliveryLocation && filteredRestaurants.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => {
            const { deliveryFee, deliveryTime } = getDeliveryDetails(restaurant.distance);
            
            return (
              <Link
                to={`/restaurant/${restaurant.id}`}
                key={restaurant.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={restaurant.imageUrl || "https://source.unsplash.com/400x300/?restaurant,food"}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  {restaurant.open === false && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Closed
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{restaurant.name}</h3>
                    <span className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center">
                      ⭐ 4.5 (100+)
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{restaurant.address}</p>
                  
                  <div className="mt-3 flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {deliveryFee === "Free" ? "Free delivery" : `LKR ${deliveryFee} delivery`}
                    </span>
                    <span className="text-gray-600">
                      {deliveryTime} min
                    </span>
                  </div>
                  
                  {restaurant.items && restaurant.items.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {restaurant.items.length} items available
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;