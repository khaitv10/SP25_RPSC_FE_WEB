import { useLocation } from "react-router-dom";
import { 
  HomeIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  ChatBubbleLeftIcon, 
  ArchiveBoxIcon 
} from '@heroicons/react/24/solid';
import { Link } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon },
    { name: "Manage", path: "/admin/account", icon: UserGroupIcon },
    { name: "Package", path: "/admin/service", icon: ArchiveBoxIcon },
    { name: "Contract", path: "/admin/contract", icon: ClipboardDocumentListIcon },
    { name: "Register", path: "/admin/regis", icon: ChatBubbleLeftIcon },
    //{ name: "Request", path: "/admin/request", icon: DocumentTextIcon },
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col">
      <nav className="flex flex-col">
        <ul>
          {menuItems.map(({ name, path, icon: Icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`flex items-center p-3 rounded-md mb-2 transition duration-200 ease-in-out 
                  ${location.pathname === path
                    ? "bg-green-500 text-white font-semibold shadow-md scale-105"  
                    : "text-gray-700 hover:bg-green-100 hover:scale-105"
                  }`}
              >
                <Icon 
                  className={`w-5 h-5 mr-3 ${location.pathname === path ? "text-white" : "text-gray-600"}`} 
                />
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
