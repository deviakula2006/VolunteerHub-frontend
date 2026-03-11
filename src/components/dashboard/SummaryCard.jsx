import GlassCard from "../ui/GlassCard";

const colorMap = {
  emerald: "border-emerald-500/20 shadow-emerald-500/5",
  cyan: "border-cyan-500/20 shadow-cyan-500/5",
  purple: "border-purple-500/20 shadow-purple-500/5",
  amber: "border-amber-500/20 shadow-amber-500/5",
};

export default function SummaryCard({ title, value, icon, color = "emerald" }) {
  return (
    <GlassCard className={`relative group hover:border-white/20 transition-all duration-500 ${colorMap[color] || colorMap.emerald}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
          {title}
        </h3>
        <span className="text-xl opacity-80 group-hover:scale-125 transition-transform duration-500">
          {icon}
        </span>
      </div>
      <div className="text-3xl font-black text-white tracking-tighter">
        {value}
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-current opacity-20 ${color === 'emerald' ? 'text-emerald-500' : color === 'cyan' ? 'text-cyan-500' : color === 'purple' ? 'text-purple-500' : 'text-amber-500'}`} />
    </GlassCard>
  );
}