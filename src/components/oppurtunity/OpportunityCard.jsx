import GlassCard from "../ui/GlassCard";
import PrimaryButton from "../ui/PrimaryButton";
import { Calendar, MapPin, Share2 } from "lucide-react";

export default function OpportunityCard({ opportunity, isApplied, onApply, onShare }) {
    return (
        <GlassCard className="flex flex-col h-full">
            <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-extrabold text-white line-clamp-2 tracking-tight group-hover:text-emerald-400 transition-colors">
                            {opportunity.title}
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-white/40 font-mono tracking-tighter">
                                OPP#{opportunity.id}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/5 border border-emerald-500/10 text-[9px] text-emerald-500/40 font-mono tracking-tighter uppercase">
                                ORG:MATCHED
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => onShare(opportunity)}
                        className="p-2 text-white/40 hover:text-emerald-400 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-white/60 line-clamp-3">
                    {opportunity.description || "No description provided."}
                </p>

                <div className="space-y-2 pt-4">
                    {opportunity.category && (
                        <div className="inline-block bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-2.5 py-1 rounded-md mb-1">
                            {opportunity.category}
                        </div>
                    )}
                    <div className="flex items-center text-sm text-white/70">
                        <MapPin className="w-4 h-4 mr-2 text-emerald-400" />
                        {opportunity.location || "Remote"}
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                        <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
                        {opportunity.start_date || "Flexible"} {opportunity.end_date ? `- ${opportunity.end_date}` : ""}
                    </div>
                </div>
            </div>

            <div className="pt-6 mt-auto">
                {isApplied ? (
                    <button
                        disabled
                        className="w-full bg-white/10 text-white/50 p-3 rounded-xl cursor-not-allowed font-medium"
                    >
                        Requested / Applied
                    </button>
                ) : (
                    <PrimaryButton onClick={() => onApply(opportunity.id)} className="w-full">
                        Apply Now
                    </PrimaryButton>
                )}
            </div>
        </GlassCard>
    );
}
