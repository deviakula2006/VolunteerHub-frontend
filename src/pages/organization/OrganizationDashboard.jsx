import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

export default function OrganizationDashboard() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/applications/organization");
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8">
        <h1 className="text-3xl font-bold text-white">
          Organization Dashboard
        </h1>

        <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 text-white shadow-xl">
          <h2 className="text-lg font-semibold mb-4">
            Total Applications Received
          </h2>

          <div className="text-4xl font-bold text-emerald-400">
            {applications.length}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}