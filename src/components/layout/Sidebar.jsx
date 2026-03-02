import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const linkClass = (path) =>
    `block px-4 py-2 rounded-xl transition ${
      location.pathname === path
        ? "bg-emerald-500 text-white"
        : "text-white/70 hover:bg-white/10"
    }`;

  return (
    <div className="w-64 flex flex-col justify-between border-r border-white/10 bg-white/5 backdrop-blur-2xl p-6 text-white">

      {/* Navigation */}
      <div>

        <nav className="space-y-3">

          {user?.role === "volunteer" && (
            <>
              <Link to="/volunteer/dashboard" className={linkClass("/volunteer/dashboard")}>
                Dashboard
              </Link>

              <Link to="/volunteer/explore" className={linkClass("/volunteer/explore")}>
                Explore
              </Link>

              <Link to="/volunteer/applications" className={linkClass("/volunteer/applications")}>
                My Applications
              </Link>
            </>
          )}

          {user?.role === "organization" && (
            <>
              <Link to="/organization/dashboard" className={linkClass("/organization/dashboard")}>
                Dashboard
              </Link>

              <Link to="/organization/manage" className={linkClass("/organization/manage")}>
                Manage Applications
              </Link>
            </>
          )}

        </nav>

      </div>

      {/* Logout Section */}
      <div className="pt-6 border-t border-white/10">

        <button
          onClick={logout}
          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-xl transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}