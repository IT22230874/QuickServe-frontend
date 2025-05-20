import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RestaurantPage from "./pages/RestaurantPage";
import MainLayout from "./layouts/MainLayout";
import CheckoutPage from "./pages/CheckoutPage";
import OAuth2Success from "./components/OAuth2Success";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Pages without navbar */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Pages with navbar */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/restaurant/:id"
          element={
            <MainLayout>
              <RestaurantPage />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <MainLayout>
              <OrdersPage />
            </MainLayout>
          }
        />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/oauth2/success" element={<OAuth2Success />} />
      </Routes>
    </Router>
  );
}

export default App;
