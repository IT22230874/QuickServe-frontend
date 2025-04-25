import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

mapboxgl.accessToken = "pk.eyJ1Ijoic2F2aW5kdWMiLCJhIjoiY205czRqb3ZzMDNhYzJyb2x6YjNzc2t1MiJ9.Vn_IEvJ5q9yH5n2OLT_7Zg";

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: initialLocation ? [initialLocation.lng, initialLocation.lat] : [80.7718, 7.8731],
      zoom: 12,
    });

    markerRef.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat(initialLocation ? [initialLocation.lng, initialLocation.lat] : [80.7718, 7.8731])
      .addTo(mapRef.current);

    markerRef.current.on("dragend", () => {
      const newLngLat = markerRef.current.getLngLat();
      onLocationSelect(newLngLat);
    });

    return () => mapRef.current.remove();
  }, []);

  // 👇 This effect handles updates when user selects a new location
  useEffect(() => {
    if (initialLocation && mapRef.current && markerRef.current) {
      const newLngLat = [initialLocation.lng, initialLocation.lat];
      mapRef.current.flyTo({ center: newLngLat });
      markerRef.current.setLngLat(newLngLat);
    }
  }, [initialLocation]);

  return <div ref={mapContainer} className="w-full h-96 rounded-lg shadow" />;
};


export default MapPicker;
