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
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Environment", "Education", "Health", "Community Outreach", "Technology", "Animals", "Event Planning"];

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = opportunities;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(opp =>
        opp.category === selectedCategory ||
        (opp.skills_required && opp.skills_required.includes(selectedCategory))
      );
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(opp =>
        (opp.title && opp.title.toLowerCase().includes(lowerQuery)) ||
        (opp.location && opp.location.toLowerCase().includes(lowerQuery)) ||
        (opp.description && opp.description.toLowerCase().includes(lowerQuery))
      );
    }

    setFilteredOpps(filtered);
  }, [searchQuery, selectedCategory, opportunities]);

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
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Explore Opportunities</h1>
            <p className="text-white/60 text-sm">Find and apply for volunteer events that match your skills.</p>
          </div>
          <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 ml-1">Filter by Skill</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-[#1e293b]/50 border border-white/10 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all duration-300 backdrop-blur-xl appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-[#0f172a] text-white py-2">{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 ml-1">Live Search</label>
              <InputField
                icon={Search}
                placeholder="Title, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-2xl border-white/10"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : filteredOpps.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
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
          <GlassCard className="text-center py-24 border-white/5">
            <div className="text-white/60 text-lg mb-2">No matches found.</div>
            <p className="text-white/30 text-sm">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-6 text-emerald-400 hover:text-emerald-300 font-bold uppercase text-xs tracking-widest"
            >
              Reset All Filters
            </button>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
}