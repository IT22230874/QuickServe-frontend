const API_URL = "http://localhost/api/location";

export const saveUserLocation = async (latitude, longitude) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/set`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ latitude, longitude })
  });

  if (!response.ok) {
    throw new Error("Failed to save location");
  }

  return response.json();
};

export const getUserLocation = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/get`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch location");
  }

  return response.json();
};
