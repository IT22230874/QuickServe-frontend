import { useState } from "react";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding";

const mapboxToken = "pk.eyJ1Ijoic2F2aW5kdWMiLCJhIjoiY205czRqb3ZzMDNhYzJyb2x6YjNzc2t1MiJ9.Vn_IEvJ5q9yH5n2OLT_7Zg";
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

const LocationSearch = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 3) return setResults([]);

    try {
      const response = await geocodingClient
        .forwardGeocode({
          query: value,
          autocomplete: true,
          limit: 5,
          countries: ['LK'],
        })
        .send();

      setResults(response.body.features);
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.place_name);
    setResults([]);
    onSelect(place);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search delivery location..."
        className="w-full px-4 py-2 border rounded"
      />
      {results.length > 0 && (
        <ul className="bg-white border mt-1 rounded shadow">
          {results.map((place) => (
            <li
              key={place.id}
              onClick={() => handleSelect(place)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
