import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex justify-between items-center px-8 py-4 border-b border-white/10 bg-white/5 backdrop-blur-2xl text-white">

      {/* Left: Logo + Name */}
      <div className="flex items-center gap-3">

        <div className="relative">
          <div className="absolute inset-0 bg-emerald-400/40 blur-lg rounded-full"></div>
          <img
            src={logo}
            alt="VolunteerHub"
            className="relative h-10 w-10 rounded-full border border-white/20"
          />
        </div>

        <h1 className="text-xl font-bold tracking-wide">
          VolunteerHub
        </h1>

      </div>

      {/* Right: User Info */}
      <div className="text-sm text-white/60">
        {user?.email}
      </div>

    </header>
  );
}