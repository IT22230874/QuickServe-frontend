const BASE_URL = "http://localhost:8081"; // user-service

export const register = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const login = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (res.ok) {
    localStorage.setItem("token", result.token);
    console.log(result.token);
  }
  return result;
};

export const getToken = () => localStorage.getItem("token");
