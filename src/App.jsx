import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login/Login"; 
import Register from "./pages/Regis/Register";
import OtpRegis from "./pages/Regis/OtpRegis";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <Routes>
          {/* Trang không cần Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otpRegister" element={<OtpRegis />} />

          {/* Các trang cần Layout */}
          <Route path="/*" element={<Layout><AppRoutes /></Layout>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
