import React, { useState } from "react";

import logo from "../assets/logoEasyRommie.png"; 
import profilePic from "../assets/avatar.jpg"; 

const HeaderLandlord = () => {
  const [userName] = useState("Nguyen Vi Lord");
  const [userRole] = useState("Landlord");

  return (
    <header className="flex justify-between items-center bg-white shadow-md">
      <div className="flex items-center">
        <img src={logo} alt="EasyRoomie Logo" className="h-13 w-auto" />      
      </div>
      <span className="text-2xl font-montserrat ml-3">EASYROOMIE</span>
      <div className="flex items-center">
        <img src={profilePic} alt="User Avatar" className="h-12 w-12 rounded-full mr-3" />
        <div className="flex flex-col p-2 text-right">
          <span className="font-semibold">{userName}</span>
          <span className="text-sm text-gray-500">{userRole}</span>
        </div>
      </div>
    </header>
  );
};

export default HeaderLandlord;
