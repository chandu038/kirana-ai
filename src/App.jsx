import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import CartDialogs from "@/components/CartDialogs";
import ProtectedRoute from "@/components/ProtectedRoute";
import UserLayout from "@/components/UserLayout";
import { useTheme } from "@/components/theme-provider";
import { CartProvider } from "./context/Cart-Context";
import { ChatProvider } from "./context/Chat-Context";
import Landing from "@/pages/Landing";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import Shop from "./pages/Shop";
import Orders from "./pages/Orders";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "@/pages/admin/AdminHome";
import OrdersTab from "@/pages/admin/OrdersTab";
import ProductsTab from "./pages/admin/ProductsTab";
import UsersTab from "./pages/admin/UsersTab";
import MessagesTab from "./pages/admin/MessageTab";

export default function App() {
  const { theme } = useTheme();
  return (
    <CartProvider>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />

          <Route element={<UserLayout />}>
            {/* the shop is open to guests; orders send them to login */}
            <Route
              path="/shop"
              element={
                <ProtectedRoute userOnly allowGuest>
                  <Shop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute userOnly>
                  <Orders />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="orders" element={<OrdersTab />} />
            <Route path="products" element={<ProductsTab />} />
            <Route path="users" element={<UsersTab />} />
            <Route path="messages" element={<MessagesTab />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <CartDialogs />
        <Toaster richColors theme={theme} />
      </ChatProvider>
    </CartProvider>
  );
}
