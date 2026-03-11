import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import { getOpportunities } from "../../services/opportunityService";
import {
  ArrowLeft,
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

export default function ManageApplications() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const data = await getOpportunities();
      setOpportunities(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsForOpportunity = async (opportunity) => {
    setSelectedOpportunity(opportunity);
    setAppLoading(true);
    try {
      const res = await api.get("/applications/organization");
      const filtered = (res.data || []).filter(
        (app) => app.opportunity_id === opportunity.id
      );
      setApplications(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setAppLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      // Refresh applications for the current opportunity
      fetchApplicationsForOpportunity(selectedOpportunity);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update status");
    }
  };

  const goBack = () => {
    setSelectedOpportunity(null);
    setApplications([]);
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
      case "applied":
        return "text-amber-400 bg-amber-500/20";
      case "shortlisted":
        return "text-yellow-400 bg-yellow-500/20";
      case "selected":
        return "text-emerald-400 bg-emerald-500/20";
      case "completed":
        return "text-purple-400 bg-purple-500/20";
      case "incompleted":
        return "text-orange-400 bg-orange-500/20";
      case "rejected":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-white/60 bg-white/10";
    }
  };

  // ─── VIEW: List of Opportunity Cards ────────────────────────────
  if (!selectedOpportunity) {
    return (
      <DashboardLayout>
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Manage Applications
            </h1>
            <p className="text-white/60">
              Select an opportunity to view and manage its applications.
            </p>
          </div>

          {loading ? (
            <Loader text="Loading opportunities..." />
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp, index) => (
                <GlassCard
                  key={opp.id}
                  delay={index * 0.05}
                  onClick={() => fetchApplicationsForOpportunity(opp)}
                  className="flex flex-col h-full group cursor-pointer hover:border-emerald-500/40 transition-all active:scale-[0.98]"
                >
                  <div className="p-1 flex flex-col h-full">
                    {/* Card Header */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-lg font-bold text-white line-clamp-2 flex-1 mr-2 leading-tight">
                          {opp.title}
                        </h2>
                        <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" />
                      </div>

                      {opp.description && (
                        <p className="text-white/50 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {opp.description}
                        </p>
                      )}
                    </div>

                    {/* Card Meta */}
                    <div className="space-y-2 pt-4 border-t border-white/10 mt-auto">
                      {opp.location && (
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{opp.location}</span>
                        </div>
                      )}
                      {opp.start_date && (
                        <div className="flex items-center gap-2 text-white/50 text-sm">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(opp.start_date).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mt-2">
                        <Users className="w-4 h-4" />
                        <span>Manage Applicants</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/60 text-lg">
                No opportunities posted yet.
              </p>
              <p className="text-white/40 text-sm mt-1">
                Create an opportunity first, then manage its applications here.
              </p>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // ─── VIEW: Applications for a specific Opportunity ──────────────
  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        {/* Back Button + Opportunity Header */}
        <div>
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Opportunities</span>
          </button>

          <h1 className="text-3xl font-bold text-white mb-1">
            {selectedOpportunity.title}
          </h1>
          <p className="text-white/60">
            Manage volunteer applications for this opportunity.
          </p>
        </div>

        {/* Applications List */}
        {appLoading ? (
          <Loader text="Loading applications..." />
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((app, index) => (
              <GlassCard key={app.id} delay={index * 0.05} className="flex flex-col p-6">
                {/* Applicant Info */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 pr-4">
                    <h2 className="text-lg font-bold text-white truncate mb-1">
                      {app.volunteer?.email || `Volunteer #${app.volunteer_id}`}
                    </h2>
                    <p className="text-white/40 text-xs">
                      Applied on {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 shadow-sm ${getStatusBadgeColor(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </div>
                </div>

                {/* ID Reference for easy copying */}
                <div className="mb-6 p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Volunteer ID</span>
                    <code className="text-[10px] text-emerald-400 font-mono bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                      {app.volunteer_id}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Opportunity ID</span>
                    <code className="text-[10px] text-blue-400 font-mono bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                      {app.opportunity_id || selectedOpportunity.id}
                    </code>
                  </div>
                </div>

                {/* Action Buttons Container */}
                <div className="mt-auto pt-6 border-t border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Management Actions */}
                    <div className="flex gap-2 w-full">
                      {(app.status === "pending" || app.status === "applied" || app.status === "shortlisted") && (
                        <>
                          <button
                            onClick={() => updateStatus(app.id, "selected")}
                            className="flex-1 h-11 text-[10px] font-black rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all uppercase tracking-widest shadow-sm"
                          >
                            Select
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, "rejected")}
                            className="flex-1 h-11 text-[10px] font-black rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all uppercase tracking-widest shadow-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {app.status === "selected" && (
                        <>
                          <button
                            onClick={() => updateStatus(app.id, "completed")}
                            className="flex-1 h-11 text-[10px] font-black rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all uppercase tracking-widest shadow-sm"
                          >
                            ✅ Complete
                          </button>
                          <button
                            onClick={() => updateStatus(app.id, "incompleted")}
                            className="flex-1 h-11 text-[10px] font-black rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40 transition-all uppercase tracking-widest shadow-sm"
                          >
                            ⚠️ Incomplete
                          </button>
                        </>
                      )}
                    </div>

                    {/* Chat Action */}
                    <button
                      onClick={() => navigate(`/messages?receiverId=${app.volunteer_id}`)}
                      className="w-full h-11 px-4 text-[10px] font-black rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-sm"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Chat with Volunteer
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">
              No applications for this opportunity yet.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}