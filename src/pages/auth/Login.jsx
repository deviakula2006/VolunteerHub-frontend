import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png"
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });

    login(res.data);   // ✅ Correct

    if (res.data.user.role === "organization") {
      navigate("/organization/dashboard");
    } else {
      navigate("/volunteer/dashboard");
    }
  } catch (err) {
  const message =
    err.response?.data?.message ||
    "Something went wrong";

  alert(message);
}};

  return (
  <div className="min-h-screen flex items-center justify-center px-4">

  {/* Outer Glow Layer */}
  <div className="relative">

    {/* Glow Background */}
    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/30 via-cyan-400/20 to-emerald-400/30 rounded-3xl blur-xl opacity-60"></div>

    {/* Card */}
    <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/5 backdrop-blur-2xl px-8 pt-10 pb-12 shadow-2xl">

      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-emerald-400/40 blur-lg"></div>
          <img
            src={logo}
            alt="VolunteerHub"
            className="relative h-12 w-12 rounded-full object-cover border border-white/20"
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold text-center text-white">
        Welcome Back
      </h2>

      <p className="text-center text-white/60 text-sm mt-2 mb-6">
        Continue making impact and managing opportunities
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 transition p-3 rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/30"
        >
          Login
        </button>
      </form>

    </div>
  </div>
</div>
);
}