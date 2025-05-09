// contexts/LocationContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { getUserLocation, saveUserLocation } from '../services/locationService';

const LocationContext = createContext();

const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await response.json();
    return data.display_name || "Unknown location";
  } catch (err) {
    console.error("Error in reverse geocoding:", err);
    return "Unknown location";
  }
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching location...');
  const [loading, setLoading] = useState(true);

  const updateLocation = async (coords) => {
    try {
      await saveUserLocation(coords.latitude, coords.longitude);
      setLocation(coords);
      const readableAddress = await reverseGeocode(coords.latitude, coords.longitude);
      setAddress(readableAddress);
    } catch (err) {
      console.error("Failed to save location", err);
      setAddress("Location unavailable");
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const coords = await getUserLocation();
        setLocation(coords);
        const readableAddress = await reverseGeocode(coords.latitude, coords.longitude);
        setAddress(readableAddress);
        localStorage.setItem('address', readableAddress)
      } catch (err) {
        console.error("Error fetching location:", err);
        setAddress("Location unavailable");
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ location, address, updateLocation, loading }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
