import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RestaurantPage from "./pages/RestaurantPage";
import MainLayout from "./layouts/MainLayout";
import CheckoutPage from "./pages/CheckoutPage";


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
        <Route path="/checkout" element={<CheckoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
