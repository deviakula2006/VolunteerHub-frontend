import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SummaryCard from "../../components/dashboard/SummaryCard";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

export default function VolunteerDashboard() {
  const [stats, setStats] = useState({
    hours: 0,
    activities: 0,
    upcoming: 0,
    applications: 0,
  });

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

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white">
          Volunteer Dashboard
        </h1>

        {loading ? (
          <Loader text="Loading your dashboard..." />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <SummaryCard
                  title="Total Hours"
                  value={stats.hours}
                  icon="⏳"
                  color="emerald"
                />
                <SummaryCard
                  title="Completed Activities"
                  value={stats.activities}
                  icon="✅"
                  color="cyan"
                />
                <SummaryCard
                  title="Upcoming Events"
                  value={stats.upcoming}
                  icon="📅"
                  color="amber"
                />
                <SummaryCard
                  title="Applications"
                  value={stats.applications}
                  icon="📄"
                  color="purple"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <ActivityFeed activities={recentApplications} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}