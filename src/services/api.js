const ORDER_BASE_URL = 'http://localhost:8082';
const RESTAURANT_BASE_URL = 'http://localhost:8083';

export const fetchRestaurants = async () => {
  const res = await fetch(`${RESTAURANT_BASE_URL}/restaurants`);
  return res.json();
};

export const fetchMenu = async (restaurantId) => {
  const res = await fetch(`${RESTAURANT_BASE_URL}/restaurants/${restaurantId}`);
  return res.json();
};

export const placeOrder = async (orderData) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${ORDER_BASE_URL}/orders/new`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  return res.json();
};

export const getOrders = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${ORDER_BASE_URL}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const fetchNearbyRestaurants = async (lat, lng) => {
  const res = await fetch(`${ORDER_BASE_URL}/api/location/nearby?latitude=${lat}&longitude=${lng}`);
  if (!res.ok) throw new Error("Failed to fetch nearby restaurants");
  return res.json();
};