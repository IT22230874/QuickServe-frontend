import { useState } from "react";
import { useCart } from "../context/CartContext";
import { XMarkIcon } from "@heroicons/react/24/solid"; // Optional: Heroicons for close icon

const FoodItemModal = ({ foodItem, restaurantId, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = async () => {
    try {
      await addToCart(restaurantId, foodItem.id, quantity);
      onClose();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div className="fixed top-24 right-8 z-50 bg-white w-96 rounded-xl shadow-lg border">
      {/* Header with Close Button */}
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-lg font-semibold">{foodItem.name}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-red-500 transition"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <p className="text-gray-700 text-sm">
          Price: <span className="font-medium">${foodItem.price.toFixed(2)}</span>
        </p>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="border rounded px-2 py-1 w-16 text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-black px-3 py-1"
          >
            Cancel
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItemModal;
