import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function DashboardRedirect() {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    // Not logged in, go to generic dashboard or login
    return <Navigate to="/dashboard" replace />;
  }
  if (user.is_merchant) {
    return <Navigate to="/merchant-dashboard" replace />;
  }
  if (user.is_tutor) {
    return <Navigate to="/tutor-dashboard" replace />;
  }
  // Default: student or other roles
  return <Navigate to="/student-dashboard" replace />;
}
