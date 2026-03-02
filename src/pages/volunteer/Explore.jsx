import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import api from "../../services/api";

export default function Explore() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const oppRes = await api.get("/opportunities");
      const appRes = await api.get("/applications/my");

      setOpportunities(oppRes.data);

      const applied = appRes.data.map(app => app.opportunity_id);
      setAppliedIds(applied);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    try {
      await api.post("/applications", {
        opportunity_id: id,
      });

      setAppliedIds([...appliedIds, id]);
      alert("Applied successfully ✅");

    } catch (err) {
      alert(err.response?.data?.error || "Error applying");
    }
  };

  return (
    <DashboardLayout>

      <div className="p-8 space-y-8">

        <h1 className="text-3xl font-bold text-white">
          Explore Opportunities
        </h1>

        {loading ? (
          <div className="text-white/60">Loading opportunities...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 shadow-xl text-white space-y-4"
              >

                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">
                    {opp.title}
                  </h2>

                  <p className="text-white/60 text-sm">
                    📍 {opp.location}
                  </p>

                  <p className="text-white/60 text-sm">
                    🗓 {opp.start_date} - {opp.end_date}
                  </p>
                </div>

                <div>
                  {appliedIds.includes(opp.id) ? (
                    <button
                      disabled
                      className="w-full bg-white/20 text-white/60 p-3 rounded-xl cursor-not-allowed"
                    >
                      Already Applied
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply(opp.id)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 transition p-3 rounded-xl font-semibold shadow-lg"
                    >
                      Apply
                    </button>
                  )}
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </DashboardLayout>
  );
}