import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    toast.error("Bạn cần đăng nhập trước!");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    toast.error("Bạn không có quyền truy cập!");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
