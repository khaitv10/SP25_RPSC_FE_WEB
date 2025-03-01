import { useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  ClipboardListIcon, 
  UserGroupIcon, 
  ChatIcon, 
  DocumentTextIcon, 
  ArchiveIcon 
} from "@heroicons/react/solid";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon },
    { name: "Package", path: "/admin/package", icon: ArchiveIcon },
    { name: "Manage", path: "/admin/account", icon: UserGroupIcon },
    { name: "Contract", path: "/admin/contract", icon: ClipboardListIcon },
    { name: "Feedback", path: "/admin/feedback", icon: ChatIcon },
    { name: "Request", path: "/admin/request", icon: DocumentTextIcon },
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

export default Sidebar;
