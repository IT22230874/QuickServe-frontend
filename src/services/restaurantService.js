const API_URL = "http://localhost/orders/restaurants/";

export const getRestaurantById = async (restaurantId) => {
    const response = await fetch(`${API_URL}/{restaurantId}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch restaurant data");
    }
  
    return await response.json();
  };