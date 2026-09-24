import { Outlet } from "react-router-dom";
import ChatWidget from "@/components/ChatWidget";
import Navbar from "@/components/Navbar";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  );
}