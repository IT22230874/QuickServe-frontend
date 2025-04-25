import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { saveUserLocation, getUserLocation } from "../services/locationService";

mapboxgl.accessToken = "pk.eyJ1Ijoic2F2aW5kdWMiLCJhIjoiY205czRqb3ZzMDNhYzJyb2x6YjNzc2t1MiJ9.Vn_IEvJ5q9yH5n2OLT_7Zg";

const LocationPickerModal = ({ onClose, onSave }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

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
    });

    map.addControl(geocoder);

    geocoder.on("result", (e) => {
      const lngLat = e.result.center;
      placeMarker(lngLat[0], lngLat[1]);
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
      markerRef.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);

      markerRef.current.on("dragend", () => {
        const { lng, lat } = markerRef.current.getLngLat();
        setCoordinates({ longitude: lng, latitude: lat });
      });
    }
    setCoordinates({ longitude: lng, latitude: lat });
  };

  const handleSave = async () => {
    if (!coordinates) return;
    setLoading(true);
    try {
      await saveUserLocation(coordinates.latitude, coordinates.longitude);
      onSave(coordinates);
      onClose();
    } catch (err) {
      console.error("Failed to save location", err);
      alert("Failed to save location.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">Choose Delivery Location</h2>
          <button onClick={onClose} className="text-lg text-gray-600">&times;</button>
        </div>

        <div className="flex-1" ref={mapContainerRef} />

        <button
          onClick={handleSave}
          disabled={!coordinates || loading}
          className="mt-4 bg-green-600 text-white py-2 rounded-md disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Delivery Location"}
        </button>
      </div>
    </div>
  );
};

export default LocationPickerModal;
