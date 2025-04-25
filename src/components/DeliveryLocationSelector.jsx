import { useState } from "react";
import LocationSearch from "./LocationSearch";
import MapPicker from "./MapPicker";
import BuildingTypeSelector from "./BuildingTypeSelector";

const DeliveryLocationSelector = ({ onConfirm }) => {
  const [location, setLocation] = useState(null);
  const [buildingType, setBuildingType] = useState("");

  const handleLocationSelect = (place) => {
    const [lng, lat] = place.center;
    setLocation({ lng, lat, address: place.place_name });
  };

  const handleConfirm = () => {
    if (!buildingType || !location) {
      alert("Please select a building type and location.");
      return;
    }
  
    const finalDeliveryLocation = {
      ...location,
      buildingType,
    };
  
    console.log("Final delivery location:", finalDeliveryLocation);
    onConfirm(finalDeliveryLocation); // pass up to Dashboard
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Choose Delivery Location</h2>
      <LocationSearch onSelect={handleLocationSelect} />

      {location && (
        <>
          <p className="text-sm text-gray-600 mb-2">Selected: {location.address}</p>
          <MapPicker
  initialLocation={location}
  onLocationSelect={(coords) =>
    setLocation((prev) => ({ ...prev, ...coords }))
  }
/>
          <BuildingTypeSelector selectedType={buildingType} onSelect={setBuildingType} />
          <button
            onClick={handleConfirm}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Confirm Delivery Location
          </button>
        </>
      )}
    </div>
  );
};

export default DeliveryLocationSelector;
