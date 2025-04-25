// src/services/cartService.js
const CART_BASE_URL = "http://localhost:8082/cart";

export const getCart = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(CART_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const addToCart = async (restaurantId, foodItemId, quantity = 1) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${CART_BASE_URL}/add?restaurantId=${restaurantId}&foodItemId=${foodItemId}&quantity=${quantity}`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
};

export const removeFromCart = async (itemId) => {
  const token = localStorage.getItem("token");
  await fetch(`${CART_BASE_URL}/remove/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const clearCart = async () => {
  const token = localStorage.getItem("token");
  await fetch(`${CART_BASE_URL}/clear`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

const cartService = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};

export default cartService;
