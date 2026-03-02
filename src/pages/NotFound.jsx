import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen text-center">
      <div>
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-white/70 mb-6">
          Page not found
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;