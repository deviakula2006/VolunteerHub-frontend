import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import OpportunityCard from "../../components/oppurtunity/OpportunityCard";
import InputField from "../../components/ui/InputField";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import { Search } from "lucide-react";

export default function Explore() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpps, setFilteredOpps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedIds, setAppliedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredOpps(opportunities);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = opportunities.filter(opp =>
        (opp.title && opp.title.toLowerCase().includes(lowerQuery)) ||
        (opp.location && opp.location.toLowerCase().includes(lowerQuery)) ||
        (opp.description && opp.description.toLowerCase().includes(lowerQuery))
      );
      setFilteredOpps(filtered);
    }
  }, [searchQuery, opportunities]);

  const fetchData = async () => {
    try {
      const oppRes = await api.get("/opportunities");
      const appRes = await api.get("/applications/my");

      setOpportunities(oppRes.data);
      setFilteredOpps(oppRes.data);

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

  const handleShare = (opp) => {
    if (navigator.share) {
      navigator.share({
        title: opp.title,
        text: `Check out this volunteer opportunity: ${opp.title} at ${opp.location}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`Check out this volunteer opportunity: ${opp.title} at ${opp.location}`);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Explore Opportunities</h1>
            <p className="text-white/60">Find and apply for volunteer events that match your skills.</p>
          </div>
          <div className="w-full md:w-96">
            <InputField
              icon={Search}
              placeholder="Search by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <Loader text="Finding opportunities..." />
        ) : filteredOpps.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpps.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                isApplied={appliedIds.includes(opp.id)}
                onApply={handleApply}
                onShare={handleShare}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-white/60 text-lg">No opportunities found matching your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}