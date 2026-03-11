import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SummaryCard from "../../components/dashboard/SummaryCard";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import { Share2, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function VolunteerDashboard() {
  const [stats, setStats] = useState({
    hours: 0,
    activities: 0,
    upcoming: 0,
    applications: 0,
    uniqueOrgs: 0
  });

  const { user } = useAuth();
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await api.get("/volunteer/dashboard-stats");
      setStats(statsRes.data);

      const appsRes = await api.get("/applications/my");
      // Map to fit activity feed format
      const recent = appsRes.data.slice(0, 5).map(app => ({
        title: `Applied to Opportunity #${app.opportunity_id}`,
        status: app.status
      }));
      setRecentApplications(recent);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareImpact = () => {
    const text = `I've contributed ${stats.hours} hours across ${stats.uniqueOrgs} organizations on Volunteer Hub! Let's make a difference together! ✨`;
    if (navigator.share) {
      navigator.share({
        title: "My Volunteer Impact",
        text,
        url: window.location.origin
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("Impact report copied to clipboard! Paste it on your social media.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Volunteer Dashboard</h1>
            <p className="text-white/60 text-sm">Your real-time impact report and recent activities.</p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono tracking-tighter">
                VOLUNTEER#{user?.id?.substring(0, 8)}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-500/60 font-black uppercase tracking-widest">Active Status</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button onClick={() => window.print()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 border border-white/10 text-white/80 hover:bg-white/5 rounded-2xl transition-all duration-300 font-bold text-xs uppercase tracking-widest">
              <Download className="w-4 h-4" /> Download Report
            </button>
            <button onClick={handleShareImpact} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-emerald-500/20 active:scale-95">
              <Share2 className="w-4 h-4" /> Share Impact
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                  title="Total Hours"
                  value={stats.hours}
                  icon="⏳"
                  color="emerald"
                />
                <SummaryCard
                  title="Activities"
                  value={stats.activities}
                  icon="✅"
                  color="cyan"
                />
                <SummaryCard
                  title="Orgs Helped"
                  value={stats.uniqueOrgs || 0}
                  icon="🤝"
                  color="purple"
                />
                <SummaryCard
                  title="Upcoming"
                  value={stats.upcoming}
                  icon="📅"
                  color="amber"
                />
              </div>

              {/* Optional secondary content could go here */}
            </div>

            <div className="lg:col-span-4">
              <ActivityFeed activities={recentApplications} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}