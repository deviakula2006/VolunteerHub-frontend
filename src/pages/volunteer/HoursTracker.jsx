import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

export default function HoursTracker() {
  const [searchParams] = useSearchParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opportunityId, setOpportunityId] = useState(searchParams.get("opportunityId") || "");
  const [hours, setHours] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/hours/my");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogHours = async (e) => {
    e.preventDefault();
    if (!opportunityId || !hours) return;
    setIsSubmitting(true);
    try {
      // Check for duplicates in local state first for immediate UI feedback
      const alreadyLogged = logs.some(log => log.opportunity_id === opportunityId);
      if (alreadyLogged) {
        alert("You have already logged hours for this opportunity.");
        setIsSubmitting(false);
        return;
      }

      await api.post("/hours", { opportunity_id: opportunityId, hours: parseInt(hours) });
      setOpportunityId("");
      setHours("");
      fetchLogs();
      alert("Hours logged successfully!");
    } catch (err) {
      alert("Error logging hours. Check opportunity ID.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hours Tracker</h1>
          <p className="text-white/60">Log your recent volunteer work and view your entire history.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <GlassCard>
              <h2 className="text-xl font-bold text-white mb-6">Log New Hours</h2>
              <form onSubmit={handleLogHours} className="space-y-4">
                <InputField
                  label="Opportunity ID"
                  type="text"
                  placeholder="Paste the Opportunity ID here..."
                  value={opportunityId}
                  onChange={(e) => setOpportunityId(e.target.value)}
                  required
                />
                <InputField
                  label="Hours Completed"
                  type="number"
                  placeholder="e.g. 4"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                />
                <PrimaryButton type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Logging..." : "Submit Hours"}
                </PrimaryButton>
              </form>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="h-full">
              <h2 className="text-xl font-bold text-white mb-6">Your Logged History</h2>
              {loading ? (
                <Loader text="Loading your history..." />
              ) : logs.length > 0 ? (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10">
                      <div>
                        <h4 className="font-semibold text-white text-lg">{log.hours} Hours Logged</h4>
                        <p className="text-white/50 text-sm mt-1">
                          For Opportunity #{log.opportunity_id}
                        </p>
                      </div>
                      <div className="text-emerald-400 font-medium">
                        Approved
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/50 bg-white/5 rounded-xl border border-dashed border-white/20">
                  <p>You haven't logged any hours yet.</p>
                  <p className="text-sm mt-2">Submit your first log using the form.</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}