import { MapPin, Calendar, Share2 } from "lucide-react";

export default function OpportunityCard({ opportunity, isApplied, onApply, onShare }) {
    return (
        <div className="flex flex-col h-[320px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.05)] hover:border-emerald-500/30 transition-all duration-300 group">
            {/* Top: Title + Share */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <h2 className="text-base font-extrabold text-white tracking-tight line-clamp-2 leading-snug flex-1 group-hover:text-emerald-400 transition-colors">
                    {opportunity.title}
                </h2>
                {onShare && (
                    <button
                        onClick={() => onShare(opportunity)}
                        className="shrink-0 p-1.5 text-white/30 hover:text-emerald-400 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* ID badge */}
            <div className="mb-3">
                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-white/30 font-mono tracking-tighter">
                    OPP#{opportunity.id?.slice(0, 8)}
                </span>
            </div>

            {/* Description — fixed 2-line clamp */}
            <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-3 flex-shrink-0">
                {opportunity.description || "No description provided."}
            </p>

            {/* Meta info */}
            <div className="flex flex-col gap-1.5 mt-auto mb-4">
                {opportunity.category && (
                    <span className="inline-block self-start bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {opportunity.category}
                    </span>
                )}
                <div className="flex items-center text-xs text-white/60">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{opportunity.location || "Remote"}</span>
                </div>
                <div className="flex items-center text-xs text-white/60">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-cyan-400 shrink-0" />
                    <span className="truncate">
                        {opportunity.start_date || "Flexible"}
                        {opportunity.end_date ? ` - ${opportunity.end_date}` : ""}
                    </span>
                </div>
            </div>

            {/* Action */}
            <div className="shrink-0">
                {isApplied ? (
                    <button
                        disabled
                        className="w-full h-10 bg-white/10 text-white/40 rounded-xl cursor-not-allowed font-semibold text-xs uppercase tracking-widest"
                    >
                        Requested / Applied
                    </button>
                ) : (
                    <button
                        onClick={() => onApply && onApply(opportunity.id)}
                        className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
                    >
                        Apply Now
                    </button>
                )}
            </div>
        </div>
    );
}
