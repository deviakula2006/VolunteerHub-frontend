import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get("/applications/organization");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold text-white">
          Manage Applications
        </h1>

        {loading ? (
          <div className="text-white/60">Loading...</div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 text-white shadow-xl space-y-4"
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {app.opportunity?.title}
                  </h2>
                  <p className="text-white/60 text-sm">
                    Volunteer: {app.volunteer?.email}
                  </p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => updateStatus(app.id, "shortlisted")}
                    className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-400"
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => updateStatus(app.id, "selected")}
                    className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400"
                  >
                    Select
                  </button>

                  <button
                    onClick={() => updateStatus(app.id, "completed")}
                    className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-400"
                  >
                    Complete
                  </button>
                </div>

                <div className="text-sm text-white/60">
                  Current Status: {app.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}