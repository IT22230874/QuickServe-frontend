import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { saveUserLocation, getUserLocation } from "../services/locationService";
import { XMarkIcon } from "@heroicons/react/24/solid";

mapboxgl.accessToken = "pk.eyJ1Ijoic2F2aW5kdWMiLCJhIjoiY205czRqb3ZzMDNhYzJyb2x6YjNzc2t1MiJ9.Vn_IEvJ5q9yH5n2OLT_7Zg";

const LocationPickerModal = ({ onClose, onSave }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  // Initialize the map and geocoder
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [77.5946, 12.9716], // default to Bangalore
      zoom: 12,
    });
    mapRef.current = map;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: "Search for delivery address",
    });

    map.addControl(geocoder, "top-left");

    geocoder.on("result", (e) => {
      const lngLat = e.result.center;
      setAddress(e.result.place_name);
      placeMarker(lngLat[0], lngLat[1]);
    });

    // Handle map clicks
    map.on("click", (e) => {
      placeMarker(e.lngLat.lng, e.lngLat.lat);
      // Reverse geocode to get address
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`)
        .then(res => res.json())
        .then(data => {
          setAddress(data.features[0]?.place_name || "Selected location");
        });
    });

    // Try fetching saved user location
    getUserLocation()
      .then((location) => {
        if (location?.longitude && location?.latitude) {
          placeMarker(location.longitude, location.latitude);
          map.setCenter([location.longitude, location.latitude]);
        }
      })
      .catch((err) => console.log("No saved location", err));

    return () => map.remove();
  }, []);

  const placeMarker = (lng, lat) => {
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    } else {
      markerRef.current = new mapboxgl.Marker({ 
        draggable: true,
        color: "#e55103" // Set marker color to accent color
      })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      markerRef.current.on("dragend", () => {
        const { lng, lat } = markerRef.current.getLngLat();
        setCoordinates({ longitude: lng, latitude: lat });
        // Reverse geocode when marker is dragged
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
          .then(res => res.json())
          .then(data => {
            setAddress(data.features[0]?.place_name || "Selected location");
          });
      });
    }
    setCoordinates({ longitude: lng, latitude: lat });
  };

  const handleSave = async () => {
    if (!coordinates) return;
    setLoading(true);
    try {
      await saveUserLocation(coordinates.latitude, coordinates.longitude);
      onSave({ ...coordinates, address });
      onClose();
    } catch (err) {
      console.error("Failed to save location", err);
      alert("Failed to save location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Choose Delivery Location</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-[#e55103] transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {address && (
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#e55103]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium text-gray-800 truncate">{address}</p>
            </div>
          </div>
        )}

        <div className="flex-1 relative" ref={mapContainerRef} />

        <div className="p-4 border-t">
          <button
            onClick={handleSave}
            disabled={!coordinates || loading}
            className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
              coordinates ? "bg-[#e55103] hover:bg-[#c44903]" : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Location...
              </span>
            ) : (
              "Confirm Delivery Location"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerModal;