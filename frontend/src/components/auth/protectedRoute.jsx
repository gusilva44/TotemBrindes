import { Navigate, Outlet, useLocation } from "react-router-dom";
import { sessaoValida } from "../../auth/session";

export default function ProtectedRoute() {
  const location = useLocation();
  if (!sessaoValida()) {
    return <Navigate to="/cadastramento" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
