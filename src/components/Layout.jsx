import { useLocation } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import Sidebar from "./Sidebar";
import SidebarLandlord from "./SidebarLanlord";
import Header from "./Header";
import HeaderLandlord from "./HeaderLandlord";

const Layout = ({ children }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const isAuthPage = ["/login", "/register", "/otpRegister"].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        {role === "Admin" ? <Header /> : <HeaderLandlord />}
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white shadow-lg z-40 pt-[100px]">
          {role === "Admin" ? <Sidebar /> : <SidebarLandlord />}
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 ml-64 mt-16 pt-20">
          {children}
        </div>
      </div>
    </div>
  );
};

// ✅ Thêm PropTypes để fix lỗi eslint
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
