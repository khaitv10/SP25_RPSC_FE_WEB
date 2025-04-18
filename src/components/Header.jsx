import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logoEasyRommie.png";
import defaultAvatar from "../assets/avatar.jpg";

const Header = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    fullName: "",
    role: "",
    avatar: ""
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Get user data from localStorage
    const fullName = localStorage.getItem("fullName") || "User";
    const role = localStorage.getItem("role") || "User";
    const avatar = localStorage.getItem("avatar");
    
    setUserData({
      fullName,
      role,
      avatar
    });
  }, []);

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("avatar");
    localStorage.removeItem("role");
    localStorage.removeItem("fullName");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("email");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("roleUserId");
    localStorage.removeItem("loggedIn");

    // Navigate to login page
    navigate("/login");
  };

  return (
    <header className="flex justify-between items-center bg-white shadow-md relative">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="EasyRoomie Logo" className="h-13 w-auto" />
      </div>
      <span className="text-2xl font-montserrat ml-3">EASYROOMIE</span>

      {/* Avatar & Dropdown */}
      <div className="relative">
        {/* Avatar Button */}
        <button
          className="flex items-center focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <img 
            src={userData.avatar || defaultAvatar} 
            alt="User Avatar" 
            className="h-12 w-12 rounded-full mr-3 cursor-pointer" 
          />
          <div className="flex flex-col p-2 text-right">
            <span className="font-semibold">{userData.fullName}</span>
            <span className="text-sm text-gray-500">{userData.role}</span>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
            <button
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;