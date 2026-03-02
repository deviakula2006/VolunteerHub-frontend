import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "volunteer",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-white/5 backdrop-blur-2xl p-10 shadow-2xl">

        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="VolunteerHub"
            className="h-14 w-14 rounded-full object-cover border border-white/20"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-white">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:border-emerald-400 outline-none"
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 focus:border-emerald-400 outline-none"
          />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "volunteer" })}
              className={`flex-1 p-3 rounded-xl border ${
                form.role === "volunteer"
                  ? "bg-emerald-500 border-emerald-400"
                  : "bg-white/10 border-white/20"
              }`}
            >
              Volunteer
            </button>

            <button
              type="button"
              onClick={() => setForm({ ...form, role: "organization" })}
              className={`flex-1 p-3 rounded-xl border ${
                form.role === "organization"
                  ? "bg-emerald-500 border-emerald-400"
                  : "bg-white/10 border-white/20"
              }`}
            >
              Organization
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 p-3 rounded-xl font-semibold shadow-lg"
          >
            Register
          </button>
        </form>

        <p className="text-center text-white/60 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}