import { createContext, useContext, useEffect, useState } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // Add or update item in cart
  const handleAdd = async (restaurantId, foodItemId, quantity = 1) => {
    try {
      const updatedCart = await addToCart(restaurantId, foodItemId, quantity);
      setCart(updatedCart);
      setIsCartOpen(true);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId);
      fetchCart();
    } catch (err) {
      console.error("Remove from cart error:", err);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setCart({ items: [] });
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  // Group cart items by restaurantId
  const groupedCart = cart.items.reduce((groups, item) => {
    if (!groups[item.restaurantId]) {
      groups[item.restaurantId] = {
        restaurantId: item.restaurantId,
        restaurantName: item.restaurantName || "Unknown Restaurant", // fallback
        items: [],
      };
    }
    groups[item.restaurantId].items.push(item);
    return groups;
  }, {});

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        groupedCart,
        isCartOpen,
        setIsCartOpen,
        addToCart: handleAdd,
        removeFromCart: handleRemove,
        clearCart: handleClear,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
