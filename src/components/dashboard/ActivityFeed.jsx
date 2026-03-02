import GlassCard from "../ui/GlassCard";

export default function ActivityFeed({ activities }) {
    if (!activities || activities.length === 0) {
        return (
            <GlassCard>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <p className="text-white/50 text-sm">No recent activity to show.</p>
            </GlassCard>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending": return "text-amber-400 bg-amber-500/20 border-amber-500/20";
            case "shortlisted": return "text-yellow-400 bg-yellow-500/20 border-yellow-500/20";
            case "selected": return "text-emerald-400 bg-emerald-500/20 border-emerald-500/20";
            case "completed": return "text-purple-400 bg-purple-500/20 border-purple-500/20";
            case "rejected": return "text-red-400 bg-red-500/20 border-red-500/20";
            default: return "text-white/60 bg-white/10";
        }
    };

    return (
        <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-400">📝</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start gap-2">
                                <p className="text-sm font-semibold text-white">
                                    {activity.title || "Activity"}
                                </p>
                                {activity.status && (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusBadge(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-white/50 mt-1">
                                {activity.date ? new Date(activity.date).toLocaleDateString() : "Recently updated"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
