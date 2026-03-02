import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import Loader from "../../components/ui/Loader";
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
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending": return "text-amber-400 bg-amber-500/20";
      case "shortlisted": return "text-yellow-400 bg-yellow-500/20";
      case "selected": return "text-emerald-400 bg-emerald-500/20";
      case "completed": return "text-purple-400 bg-purple-500/20";
      case "rejected": return "text-red-400 bg-red-500/20";
      default: return "text-white/60 bg-white/10";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Applications</h1>
          <p className="text-white/60">Review volunteers and update their application status.</p>
        </div>

        {loading ? (
          <Loader text="Loading applications..." />
        ) : applications.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {applications.map((app) => (
              <GlassCard key={app.id} className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white line-clamp-1">
                      {app.opportunity?.title || `Opportunity #${app.opportunity_id}`}
                    </h2>
                    <p className="text-white/50 text-sm mt-1">
                      Volunteer: <span className="text-white/80">{app.volunteer?.email || `User #${app.user_id}`}</span>
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${getStatusBadgeColor(app.status)}`}>
                    {app.status}
                  </div>
                </div>

                <div className="mt-auto pt-6 flex gap-2 flex-wrap">
                  {app.status === "pending" && (
                    <button
                      onClick={() => updateStatus(app.id, "shortlisted")}
                      className="flex-1 py-2 text-sm font-semibold rounded-xl bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
                    >
                      Shortlist
                    </button>
                  )}
                  {(app.status === "pending" || app.status === "shortlisted") && (
                    <button
                      onClick={() => updateStatus(app.id, "selected")}
                      className="flex-1 py-2 text-sm font-semibold rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                    >
                      Select
                    </button>
                  )}
                  {app.status === "selected" && (
                    <button
                      onClick={() => updateStatus(app.id, "completed")}
                      className="flex-1 py-2 text-sm font-semibold rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}
                  {['pending', 'shortlisted'].includes(app.status) && (
                    <button
                      onClick={() => updateStatus(app.id, "rejected")}
                      className="flex-1 py-2 text-sm font-semibold rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white/60 text-lg">No applications found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}