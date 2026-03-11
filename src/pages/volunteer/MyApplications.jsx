import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";
import { Star, Clock, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_STYLE = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  applied: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  shortlisted: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  selected: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  completed: "bg-purple-500/20 text-purple-400 border-purple-500/20",
  incompleted: "bg-orange-500/20 text-orange-400 border-orange-500/20",
  rejected: "bg-red-500/20 text-red-400 border-red-500/20",
};

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

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">My Applications</h1>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Tracking {applications.length} Requests</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl">
          <div className="text-white/40 mb-4 text-5xl">📋</div>
          <div className="text-white/60 mb-4 font-medium">No applications yet.</div>
          <button
            onClick={() => navigate("/volunteer/explore")}
            className="text-emerald-400 hover:text-emerald-300 font-bold"
          >
            Explore Opportunities →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {applications.map((app) => {
            const opp = app.opportunities || {};
            const statusCls = STATUS_STYLE[app.status] || "bg-white/10 text-white/60 border-white/10";
            const isCompleted = app.status === "completed";

            return (
              <div
                key={app.id}
                className="flex flex-col h-[340px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 group"
              >
                {/* Status header bar */}
                <div className="px-5 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between shrink-0">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusCls}`}>
                    {app.status}
                  </span>
                  <span className="text-[9px] font-mono text-white/20 truncate max-w-[140px]">
                    {app.opportunity_id}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-5 min-h-0">
                  {/* Title */}
                  <h2 className="text-base font-extrabold text-white line-clamp-2 leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                    {opp.title || "Untitled Opportunity"}
                  </h2>

                  {/* Description */}
                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-3">
                    {opp.description || "No description provided."}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-col gap-1.5 mt-auto">
                    <div className="flex items-center text-xs text-white/60">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{opp.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center text-xs text-white/60">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-cyan-400 shrink-0" />
                      <span className="truncate">
                        {opp.start_date || "Flexible"}
                        {opp.end_date ? ` - ${opp.end_date}` : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action footer — only for completed */}
                <div className="px-5 pb-5 shrink-0">
                  {isCompleted ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/volunteer/hours?opportunityId=${app.opportunity_id}`)}
                        className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all font-bold text-[10px] uppercase tracking-widest"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Log Hours
                      </button>
                      <button
                        onClick={() => navigate(`/volunteer/reviews?opportunityId=${app.opportunity_id}`)}
                        className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-bold text-[10px] uppercase tracking-widest"
                      >
                        <Star className="w-3.5 h-3.5" />
                        Review
                      </button>
                    </div>
                  ) : (
                    <div className="h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
                      <span className="text-white/30 text-[10px] uppercase font-semibold tracking-widest">
                        {app.status === "rejected" ? "Application Closed" : "Awaiting Update"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}