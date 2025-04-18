import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login/Login"; 
import Register from "./pages/Regis/Register";
import RegisterLandlord from "./pages/Regis/RegisterLandlord";
import OtpRegis from "./pages/Regis/OtpRegis";
import AppRoutes, { LandlordRoutes, PublicRoutes } from "./routes/routes";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Authentication pages that don't need Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otpRegister" element={<OtpRegis />} />
        <Route path="/register-landlord" element={<RegisterLandlord />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Application routes with Layout */}
        <Route path="/admin/*" element={<Layout><AppRoutes /></Layout>} />
        <Route path="/landlord/*" element={<Layout><LandlordRoutes /></Layout>} />
        
        {/* NotFoundPage - for any other routes */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;