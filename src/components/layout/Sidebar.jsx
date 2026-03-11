import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { X, Menu, LayoutDashboard, Globe, FileText, Clock, Star, Users, MessageSquare, Calendar, BookOpen, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = {
    volunteer: [
      { path: "/volunteer/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/volunteer/explore", label: "Explore", icon: Globe },
      { path: "/volunteer/applications", label: "My Applications", icon: FileText },
      { path: "/volunteer/hours", label: "Hours Tracker", icon: Clock },
      { path: "/volunteer/reviews", label: "Reviews", icon: Star },
      { path: "/volunteer/groups", label: "Group Volunteering", icon: Users },
      { path: "/volunteer/announcements", label: "Announcements", icon: MessageSquare },
    ],
    organization: [
      { path: "/organization/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/organization/manage", label: "Manage Applications", icon: FileText },
      { path: "/organization/create", label: "Create Opportunity", icon: Globe },
    ]
  };

  const sharedItems = [
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/resources", label: "Resources", icon: BookOpen },
  ];

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === path
      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
      : "text-white/60 hover:bg-white/10 hover:text-white"
    }`;

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#0f172a]/95 backdrop-blur-2xl border-r border-white/10 p-6">
      <div className="flex items-center justify-between mb-8 lg:mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Globe className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">VolunteerHub</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-white/60 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        {user?.role && menuItems[user.role]?.map((item) => (
          <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={linkClass(item.path)}>
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        <div className="my-6 border-t border-white/10 pt-6 space-y-2">
          {sharedItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className={linkClass(item.path)}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-xl transition-all duration-300 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 z-50">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 z-[70] lg:hidden"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom-Left Hamburger Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-[80] w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all"
      >
        <Menu className="w-7 h-7" />
      </button>
    </>
  );
}