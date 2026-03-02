import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import picture from "../../assets/picture1.png";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="flex justify-between items-center px-10 py-6">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="VolunteerHub"
            className="h-10 w-10 rounded-full object-cover border border-white/20"
          />
          <h1 className="text-2xl font-bold text-white">
            VolunteerHub
          </h1>
        </div>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 grid md:grid-cols-2 items-center px-10 gap-10">

        {/* Left Side */}
        <div>
          <h2 className="text-5xl font-bold text-white leading-tight">
            Connect. Serve. <br /> Impact.
          </h2>

          <p className="mt-6 text-white/70 text-lg">
            Join thousands of volunteers making a difference in their
            communities. Discover opportunities, track your impact,
            and collaborate with organizations.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 px-8 py-3 bg-emerald-500 text-white rounded-xl text-lg font-semibold hover:bg-emerald-600 transition shadow-lg"
          >
            Start Volunteering Today
          </Link>
        </div>

        {/* Right Image */}
        <div>
          <div className="relative">
            <div className="absolute -inset-1 bg-emerald-400/30 blur-xl rounded-3xl"></div>
            <img
              src={picture}
              alt="Volunteers"
              className="relative rounded-3xl shadow-2xl"
            />
          </div>
        </div>

      </section>
    </div>
  );
}