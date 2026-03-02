import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SummaryCard from "../../components/dashboard/SummaryCard";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

export default function OrganizationDashboard() {
  const [applications, setApplications] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const appRes = await api.get("/applications/organization");
      const oppRes = await api.get("/opportunities"); // ideally an endpoint for 'my posted opps'

      setApplications(appRes.data || []);
      setOpportunities(oppRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-white">
            Organization Dashboard
          </h1>
          <Link
            to="/organization/create"
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg transition"
          >
            + Create Opportunity
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading your dashboard..." />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <SummaryCard
              title="Total Applications Received"
              value={applications.length}
              icon="📄"
              color="emerald"
            />
            <SummaryCard
              title="Active Opportunities"
              value={opportunities.length}
              icon="📢"
              color="cyan"
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}