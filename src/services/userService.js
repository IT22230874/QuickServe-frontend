import axios from "axios";

const API_BASE = "http://localhost/auth";

export const getUserProfile = async (token) => {
  const res = await axios.get(`${API_BASE}/userprofile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updatePhoneNumber = async (token, phoneNumber) => {
  const res = await axios.post(
    `${API_BASE}/update-phone`,
    { phoneNumber },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const verifyPhoneNumber = async (token, phoneNumber, verificationCode) => {
  const res = await axios.post(
    `${API_BASE}/verify-phone`,
    { phoneNumber, verificationCode },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
