import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import { BookOpen, ExternalLink, Video, Plus, Loader2, X } from "lucide-react";
import api from "../../services/api";
import { supabase } from "../../config/supabaseClient";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newType, setNewType] = useState("article");

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.get("/resources");
      // Backend returns data directly or wrapped, res.data should be the array
      setResources(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching resources:", error);
      // Fallback or empty state
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();

    const channel = supabase
      .channel("public:resources")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resources" },
        (payload) => {
          console.log("Realtime event received:", payload);
          fetchResources();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newTitle || !newLink) return;

    try {
      await api.post("/resources", {
        title: newTitle,
        description: newDesc,
        link: newLink
      });
      setNewTitle("");
      setNewDesc("");
      setNewLink("");
      setIsAdding(false);
    } catch (err) {
      console.error("Failed to add resource", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Resource Center</h1>
            <p className="text-white/60 text-sm">Educational materials and guides to help you on your volunteering journey.</p>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl shadow-emerald-500/20 active:scale-95"
          >
            {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isAdding ? "Close Form" : "Share Resource"}
          </button>
        </div>

        {isAdding && (
          <GlassCard className="p-8 border-emerald-500/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <h2 className="text-xl font-extrabold text-white mb-6 uppercase tracking-tight">Post New Resource</h2>
            <form onSubmit={handleAddResource} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-[#1e293b]/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-xl transition-all"
                    placeholder="E.g., The Ultimate Guide to Volunteering"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Resource URL</label>
                  <input
                    type="url"
                    required
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    className="w-full bg-[#1e293b]/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-xl transition-all"
                    placeholder="https://example.com/guide"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-[#1e293b]/50 border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 backdrop-blur-xl h-32 transition-all resize-none"
                  placeholder="Provide a short, impactful description..."
                ></textarea>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </GlassCard>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
            {resources.length === 0 ? (
              <GlassCard className="col-span-full py-20 text-center opacity-50 border-white/5">
                <p className="text-lg font-bold uppercase tracking-widest">No resources found</p>
                <p className="text-xs mt-2">Be the first to share something impactful!</p>
              </GlassCard>
            ) : (
              resources.map((resource) => (
                <GlassCard key={resource.id} className="flex flex-col group hover:border-emerald-500/30 transition-all duration-500 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                        {resource.link.includes("youtube.com") || resource.link.includes("vimeo.com") ? (
                          <Video className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                        {resource.link.includes("youtube.com") || resource.link.includes("vimeo.com") ? "video" : "article"}
                      </span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
                  </div>

                  <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight">
                    {resource.title}
                  </h3>
                  <p className="text-white/50 text-sm mb-8 flex-1 leading-relaxed line-clamp-3">
                    {resource.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-bold text-white/40">
                        {resource.author?.email?.charAt(0).toUpperCase() || "C"}
                      </div>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter truncate max-w-[100px]">
                        {resource.author?.email?.split('@')[0] || "Community"}
                      </span>
                    </div>
                    <a
                      href={resource.link.startsWith('http') ? resource.link : `https://${resource.link}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-[10px] font-black uppercase tracking-widest transition-all duration-300"
                    >
                      Access
                    </a>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}