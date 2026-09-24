import { Navigate, useSearchParams } from "react-router-dom";
import OverviewTab from "@/pages/admin/OverviewTab";

const TABS = ["orders", "products", "users"];

// old links like /admin?tab=users become /admin/users
export default function AdminHome() {
  const [params] = useSearchParams();
  const tab = params.get("tab");
  if (TABS.includes(tab)) return <Navigate to={`/admin/${tab}`} replace />;
  return <OverviewTab />;
}