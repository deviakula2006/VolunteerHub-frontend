import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";
import OpportunityCard from "../../components/oppurtunity/OpportunityCard";
import { Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      case "pending":
      case "applied":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/20";
      case "shortlisted":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20";
      case "selected":
        return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20";
      case "completed":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/20";
      case "incompleted":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/20";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/20";
      default:
        return "bg-white/10 text-white/60";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          My Applications
        </h1>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Tracking {applications.length} Active Requests</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-white/60 mb-4">No applications yet.</div>
          <button
            onClick={() => navigate("/volunteer/explore")}
            className="text-emerald-400 hover:text-emerald-300 font-bold"
          >
            Explore Opportunities →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {applications.map((app) => (
            <div key={app.id} className="flex flex-col">
              <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-500 group">
                {/* Status Header */}
                <div className="px-6 py-4 border-b border-white/5 flex flex-col gap-2 bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Status</span>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor(app.status)} shadow-lg shadow-black/20`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                      <span>Opportunity ID:</span>
                      <span className="text-white/40">{app.opportunity_id}</span>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <OpportunityCard
                    opportunity={app.opportunities}
                    isApplied={true}
                  />
                </div>

                {/* Action Footer — only for completed applications */}
                {app.status === "completed" && (
                  <div className="px-6 pb-6 pt-2 space-y-3">
                    <button
                      onClick={() => navigate(`/volunteer/hours?opportunityId=${app.opportunity_id}`)}
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                      <Clock className="w-4 h-4" />
                      Log Contribution Hours
                    </button>
                    <button
                      onClick={() => navigate(`/volunteer/reviews?opportunityId=${app.opportunity_id}`)}
                      className="w-full h-12 flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-bold text-xs uppercase tracking-widest"
                    >
                      <Star className="w-4 h-4" />
                      Give Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}