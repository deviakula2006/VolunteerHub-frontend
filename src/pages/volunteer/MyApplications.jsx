import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/my");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-500/20 text-blue-400";
      case "shortlisted":
        return "bg-yellow-500/20 text-yellow-400";
      case "selected":
        return "bg-emerald-500/20 text-emerald-400";
      case "completed":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-white/10 text-white/60";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold text-white">
          My Applications
        </h1>

        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-white/60">No applications yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 text-white shadow-xl space-y-3"
              >
                <h2 className="text-xl font-semibold">
                  {app.opportunities?.title}
                </h2>

                <p className="text-white/60 text-sm">
                  📍 {app.opportunities?.location}
                </p>

                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${statusColor(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}