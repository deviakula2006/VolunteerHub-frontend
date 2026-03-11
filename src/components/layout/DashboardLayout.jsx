import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { supabase } from "../../config/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-black to-[#0a0f1f]">

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:pl-72">

        <Header />

        <main className="flex-1 overflow-y-auto relative p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}
