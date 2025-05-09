// import React, { useEffect, useRef } from "react";
// import mapboxgl from "mapbox-gl";

// mapboxgl.accessToken = "pk.eyJ1Ijoic2F2aW5kdWMiLCJhIjoiY205czRqb3ZzMDNhYzJyb2x6YjNzc2t1MiJ9.Vn_IEvJ5q9yH5n2OLT_7Zg";

// const TrackOrderModal = ({ isOpen, onClose, order }) => {
//   const mapContainer = useRef(null);
//   const mapRef = useRef(null);

//   const restaurantCoords = [79.8612, 6.9271]; // Colombo
//   const deliveryCoords = [79.8886, 6.9344];   // Nearby for demo

//   useEffect(() => {
//     if (!isOpen || mapRef.current) return;

//     mapRef.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: "mapbox://styles/mapbox/streets-v11",
//       center: restaurantCoords,
//       zoom: 13,
//     });

//     // Add markers
//     new mapboxgl.Marker({ color: "#e55103" })
//       .setLngLat(restaurantCoords)
//       .setPopup(new mapboxgl.Popup().setText("Restaurant"))
//       .addTo(mapRef.current);

//     new mapboxgl.Marker({ color: "#00b894" })
//       .setLngLat(deliveryCoords)
//       .setPopup(new mapboxgl.Popup().setText("Delivery Location"))
//       .addTo(mapRef.current);

//     // Add line between them
//     mapRef.current.on("load", () => {
//       mapRef.current.addSource("route", {
//         type: "geojson",
//         data: {
//           type: "Feature",
//           geometry: {
//             type: "LineString",
//             coordinates: [restaurantCoords, deliveryCoords],
//           },
//         },
//       });

//       mapRef.current.addLayer({
//         id: "route",
//         type: "line",
//         source: "route",
//         layout: {
//           "line-join": "round",
//           "line-cap": "round",
//         },
//         paint: {
//           "line-color": "#e55103",
//           "line-width": 4,
//         },
//       });
//     });

//     return () => {
//       mapRef.current.remove();
//       mapRef.current = null;
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative shadow-xl">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
//         >
//           &times;
//         </button>

//         <h2 className="text-2xl font-semibold mb-4 text-[#e55103]">Track Order</h2>

//         {/* Map Section */}
//         <div className="rounded-lg overflow-hidden h-56 mb-6">
//           <div ref={mapContainer} className="w-full h-full rounded" />
//         </div>

//         {/* Order Status */}
//         <div className="mb-6">
//           <h3 className="font-semibold mb-2">Order Status:</h3>
//           <p className="text-[#e55103] font-bold">{order.status}</p>
//         </div>

//         {/* Addresses */}
//         <div className="grid grid-cols-2 gap-4 mb-6">
//           <div>
//             <h4 className="font-semibold mb-1">Restaurant Address</h4>
//             <p className="text-gray-600">{order.restaurantAddress}</p>
//           </div>
//           <div>
//             <h4 className="font-semibold mb-1">Delivery Address</h4>
//             <p className="text-gray-600">{order.deliveryAddress}</p>
//           </div>
//         </div>

//         {/* Items Summary */}
//         <div>
//           <h3 className="font-semibold mb-2">Order Items</h3>
//           <ul className="list-disc list-inside text-gray-700">
//             {order.items.map((item, index) => (
//               <li key={index}>
//                 {item.name} × {item.quantity}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrackOrderModal;


import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1Ijoic2F2aW5kdWMiLCJhIjoiY205czRqb3ZzMDNhYzJyb2x6YjNzc2t1MiJ9.Vn_IEvJ5q9yH5n2OLT_7Zg"; // Replace with your Mapbox access token

const TrackOrderModal = ({ isOpen, onClose, order }) => {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  // Replace these with actual coordinates from your order data
  const restaurantCoords = [80.0021, 6.8433]; // Example: Colombo
  const deliveryCoords = [80.0175, 6.8731];   // Example: Nearby location

  useEffect(() => {
    if (!isOpen) return;

    // Initialize the map
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: restaurantCoords,
      zoom: 13,
    });

    // Add markers for restaurant and delivery locations
    new mapboxgl.Marker({ color: "#e55103" })
      .setLngLat(restaurantCoords)
      .setPopup(new mapboxgl.Popup().setText("Restaurant"))
      .addTo(mapRef.current);

    new mapboxgl.Marker({ color: "#00b894" })
      .setLngLat(deliveryCoords)
      .setPopup(new mapboxgl.Popup().setText("Delivery Location"))
      .addTo(mapRef.current);

    // Fetch route from Directions API
    const getRoute = async () => {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${restaurantCoords[0]},${restaurantCoords[1]};${deliveryCoords[0]},${deliveryCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      );
      const data = await query.json();
      const route = data.routes[0].geometry;

      // Add route to the map
      mapRef.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: route,
        },
      });

      mapRef.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#e55103",
          "line-width": 4,
        },
      });

      // Adjust the map to fit the route
      const bounds = new mapboxgl.LngLatBounds();
      route.coordinates.forEach(coord => bounds.extend(coord));
      mapRef.current.fitBounds(bounds, { padding: 50 });
    };

    mapRef.current.on("load", getRoute);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-[#e55103]">Track Order</h2>

        {/* Map Section */}
        <div className="rounded-lg overflow-hidden h-56 mb-6">
          <div ref={mapContainer} className="w-full h-full rounded" />
        </div>

        {/* Order Status */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Order Status:</h3>
          <p className="text-[#e55103] font-bold">{order.status}</p>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-semibold mb-1">Restaurant Address</h4>
            <p className="text-gray-600">{order.restaurantAddress}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Delivery Address</h4>
            <p className="text-gray-600">{order.deliveryAddress}</p>
          </div>
        </div>

        {/* Items Summary */}
        <div>
          <h3 className="font-semibold mb-2">Order Items</h3>
          <ul className="list-disc list-inside text-gray-700">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrackOrderModal;

