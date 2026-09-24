import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "@/lib/api";

export default function ProtectedRoute({
  children,
  adminOnly = false,
  userOnly = false,
  allowGuest = false,
}) {
  const user = getUser();
  const location = useLocation();

  if (!user) {
    if (allowGuest) return children; // e.g. the shop can be browsed without logging in
    // remember the page they wanted, so login can send them back to it
    const from = location.pathname + location.search;
    return <Navigate to="/login" replace state={{ from }} />;
  }
  if (adminOnly && user.role !== "admin") return <Navigate to="/shop" replace />;
  if (userOnly && user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
}