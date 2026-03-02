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

    return (
        <GlassCard>
            <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-emerald-400">📝</span>
                        </div>
                        <div>
                            <p className="text-sm text-white">
                                <span className="font-semibold">{activity.title || "Activity"}</span>
                            </p>
                            <p className="text-xs text-white/50 mt-1">
                                {activity.date ? new Date(activity.date).toLocaleDateString() : "Recently"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}
