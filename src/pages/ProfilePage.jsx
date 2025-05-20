import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updatePhoneNumber,
  verifyPhoneNumber,
} from "../services/userService";
import { FaCheckCircle, FaExclamationCircle, FaPhoneAlt } from "react-icons/fa";

const ProfilePage = () => {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(token);
        setProfile(data);
        setPhoneInput(data.phoneNumber || "");
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const handleSendCode = async () => {
    setError("");
    setMessage("");
    try {
      await updatePhoneNumber(token, phoneInput);
      setMessage("Verification code sent to your phone.");
      setVerifying(true);
    } catch (err) {
      setError(err?.response?.data || "Failed to send verification code.");
    }
  };

  const handleVerify = async () => {
    setError("");
    setMessage("");
    try {
      await verifyPhoneNumber(token, phoneInput, codeInput);
      setMessage("Phone number verified successfully!");
      setVerifying(false);
      // Refresh profile
      const data = await getUserProfile(token);
      setProfile(data);
    } catch (err) {
      setError(err?.response?.data || "Verification failed.");
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-[#e55103] text-lg font-semibold">
        Loading profile...
      </div>
    );
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e55103] via-orange-200 to-orange-50 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-[#e55103] text-center">
          My Profile
        </h2>
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">First Name:</span>
            <span>{profile.firstName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Last Name:</span>
            <span>{profile.lastName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Username:</span>
            <span>{profile.username}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Email:</span>
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">Address:</span>
            <span>{profile.addressLine1}</span>
          </div>
        </div>
        <div className="mb-6">
          <div className="font-semibold mb-2 flex items-center gap-2 text-[#e55103]">
            <FaPhoneAlt /> Phone Number
          </div>
          {profile.phoneNumber ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-800 font-medium">
                {profile.phoneNumber}
              </span>
              {profile.isPhoneVerified ? (
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <FaCheckCircle /> Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                  <FaExclamationCircle /> Not Verified
                </span>
              )}
            </div>
          ) : null}
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter phone number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#e55103]"
              disabled={profile.phoneVerified}
            />
            {!profile.phoneVerified && (
              <button
                onClick={handleSendCode}
                className="bg-[#e55103] text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold"
                disabled={!phoneInput}
              >
                {verifying
                  ? "Resend Code"
                  : profile.phoneNumber
                  ? "Verify"
                  : "Add & Verify"}
              </button>
            )}
          </div>
          {verifying && !profile.isPhoneVerified && (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Enter verification code"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#e55103]"
              />
              <button
                onClick={handleVerify}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold"
                disabled={!codeInput}
              >
                Verify
              </button>
            </div>
          )}
          {message && (
            <div className="text-green-600 mt-2 font-medium">{message}</div>
          )}
          {error && (
            <div className="text-red-600 mt-2 font-medium">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
