import GlassCard from "../ui/GlassCard";

export default function ActivityFeed({ activities }) {
    if (!activities || activities.length === 0) {
        return (
            <GlassCard className="h-full">
                <h3 className="text-lg font-extrabold text-white mb-6 uppercase tracking-tight opacity-50">Recent Activity</h3>
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                    <span className="text-4xl mb-4">📭</span>
                    <p className="text-xs font-bold uppercase tracking-widest text-center">No recent activity to show.</p>
                </div>
            </GlassCard>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
            case "shortlisted": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "selected": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20 shadow-lg shadow-emerald-400/5";
            case "completed": return "text-purple-400 bg-purple-400/10 border-purple-400/20 shadow-lg shadow-purple-400/5";
            case "rejected": return "text-red-400 bg-red-400/10 border-red-400/20";
            default: return "text-white/40 bg-white/5 border-white/10";
        }
    };

    return (
        <GlassCard className="h-full border-white/5 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white mb-8 uppercase tracking-tight">Recent Activity</h3>
            <div className="space-y-6">
                {activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start space-x-4 group transition-all duration-300">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-all duration-500 shadow-xl">
                            <span className="text-xl opacity-70 group-hover:scale-110 group-hover:opacity-100 transition-all">📝</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <p className="text-sm font-bold text-white truncate max-w-[150px] group-hover:text-emerald-400 transition-colors">
                                    {activity.title || "Activity"}
                                </p>
                                {activity.status && (
                                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${getStatusBadge(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.1em]">
                                {activity.date ? new Date(activity.date).toLocaleDateString() : "Recently updated"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
