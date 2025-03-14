import { useLocation } from "react-router-dom";
import { 
  HomeIcon,  
  UserGroupIcon, 
  ChatIcon, 
  DocumentTextIcon ,
  ChartBarIcon,
  ClipboardIcon,
  NewspaperIcon
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";

const SidebarLandlord = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/landlord/dashboard", icon: ChartBarIcon },
    { name: "Manage", path: "/landlord/manage", icon: UserGroupIcon },
    { name: "Room", path: "/landlord/room", icon: HomeIcon },
    { name: "Feedback", path: "/landlord/feedback", icon: ChatIcon },
    { name: "Service", path: "/landlord/service", icon: ClipboardIcon },
    { name: "Post", path: "/landlord/post", icon: NewspaperIcon },
    { name: "Request", path: "/landlord/request", icon: DocumentTextIcon },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col">
      {/* Menu điều hướng */}
      <nav className="flex flex-col">
        <ul>
          {menuItems.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center p-3 text-gray-700 rounded-md mb-2 transition duration-200 ease-in-out 
                  ${
                    location.pathname === path
                      ? "bg-green-400 text-green-900 font-semibold shadow-md scale-105"  
                      : "hover:bg-green-100 hover:scale-105"
                  }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SidebarLandlord;
