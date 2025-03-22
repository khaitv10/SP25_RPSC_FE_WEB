import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logoEasyRommie.png";
import profilePic from "../assets/avatar.jpg";

const HeaderLandlord = () => {
  const navigate = useNavigate();
  const [userName] = useState("Nguyen Vi Lord");
  const [userRole] = useState("Landlord");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Xóa dữ liệu đăng nhập khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("loggedIn");

    // Điều hướng về trang đăng nhập
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
          <img src={profilePic} alt="User Avatar" className="h-12 w-12 rounded-full mr-3 cursor-pointer" />
          <div className="flex flex-col p-2 text-right">
            <span className="font-semibold">{userName}</span>
            <span className="text-sm text-gray-500">{userRole}</span>
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

export default HeaderLandlord;
