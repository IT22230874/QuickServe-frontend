// FoodItemModal.js
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { XMarkIcon } from "@heroicons/react/24/solid";

const FoodItemModal = ({ foodItem, restaurantId, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const handleAddToCart = async () => {
    try {
      await addToCart(restaurantId, foodItem.id, quantity, specialInstructions);
      onClose();
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        {/* Header with Close Button */}
        <div className="relative">
          <img
            src={foodItem.imageUrl}
            alt={foodItem.name}
            className="w-full h-48 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
          >
            <XMarkIcon className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold">{foodItem.name}</h2>
            {foodItem.popular && (
              <span className="text-xs bg-orange-100 text-[#e55103] px-2 py-1 rounded">
                #1 most liked
              </span>
            )}
          </div>

          <p className="text-gray-700">{foodItem.description}</p>

          <div className="flex items-center justify-between">
            <div>
              {foodItem.originalPrice && (
                <p className="text-gray-500 line-through text-sm">
                  LKR {foodItem.originalPrice.toFixed(2)}
                </p>
              )}
              <p className="text-[#e55103] font-bold text-lg">
                LKR {foodItem.price.toFixed(2)}
              </p>
              {foodItem.discount && (
                <p className="text-green-600 text-sm">{foodItem.discount}% off</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Special Instructions</h3>
            <textarea
              placeholder="Add a note (You may be charged for extras)"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full border rounded p-2 text-sm"
              rows={3}
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-[#e55103] text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition"
          >
            Add to Cart • LKR {(foodItem.price * quantity).toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItemModal;