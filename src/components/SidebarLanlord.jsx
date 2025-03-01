import { HomeIcon, ClipboardListIcon, UserGroupIcon, ChatIcon, DocumentTextIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";

const SidebarLandlord = () => {
  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col">

      {/* Menu điều hướng */}
      <nav className="flex flex-col">
        <ul>
          {/* Dashboard */}
          <li>
            <Link
              to="landlord/dashboard"
              className="flex items-center p-3 text-gray-700 hover:bg-indigo-100 rounded-md mb-2"
            >
              <HomeIcon className="w-6 h-6 mr-3" />
              Dashboard
            </Link>
          </li>
          {/* Manage */}
          <li>
            <Link
              to="landlord/manage"
              className="flex items-center p-3 text-gray-700 hover:bg-indigo-100 rounded-md mb-2"
            >
              <UserGroupIcon className="w-6 h-6 mr-3" />
              Manage
            </Link>
          </li>
          {/* Room */}
          <li>
            <Link
              to="landlord/room"
              className="flex items-center p-3 text-gray-700 hover:bg-indigo-100 rounded-md mb-2"
            >
              <ClipboardListIcon className="w-6 h-6 mr-3" />
              Room
            </Link>
          </li>
          {/* Feedback */}
          <li>
            <Link
              to="landlord/feedback"
              className="flex items-center p-3 text-gray-700 hover:bg-indigo-100 rounded-md mb-2"
            >
              <ChatIcon className="w-6 h-6 mr-3" />
              Feedback
            </Link>
          </li>
          {/* Service */}
          <li>
            <Link
              to="landlord/service"
              className="flex items-center p-3 text-gray-700 hover:bg-indigo-100 rounded-md mb-2"
            >
              <DocumentTextIcon className="w-6 h-6 mr-3" />
              Service
            </Link>
          </li>
          {/* Request */}
          <li>
            <Link
              to="landlord/request"
              className="flex items-center p-3 text-gray-700 hover:bg-indigo-100 rounded-md mb-2"
            >
              <DocumentTextIcon className="w-6 h-6 mr-3" />
              Request
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SidebarLandlord;
