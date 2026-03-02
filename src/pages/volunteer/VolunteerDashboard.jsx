import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SummaryCard from "../../components/dashboard/SummaryCard";
import api from "../../services/api";

export default function VolunteerDashboard() {
  const [stats, setStats] = useState({
    hours: 0,
    activities: 0,
    upcoming: 0,
    applications: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/volunteer/dashboard-stats");
      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <div className="p-8 space-y-8">

        <h1 className="text-3xl font-bold text-white">
          Volunteer Dashboard
        </h1>

        {loading ? (
          <div className="text-white/60">Loading stats...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

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
        )}

      </div>

    </DashboardLayout>
  );
}