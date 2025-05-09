import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Loading animation component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#e55103]"></div>
  </div>
);

const OAuth2Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      console.log("OAuth Token:", tokenFromUrl); // Log token instead of showing it
    }

    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 1000); // Wait 1 second before redirecting

    return () => clearTimeout(timer); // Clear timeout if unmounted early
  }, [navigate]);

  return <LoadingSpinner />;
};

export default OAuth2Success;
