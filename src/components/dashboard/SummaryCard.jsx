import GlassCard from "../ui/GlassCard";

export default function SummaryCard({ title, value, icon, color }) {
  return (
    <GlassCard className="relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/70 text-sm font-medium">
          {title}
        </h3>
        <span className="text-2xl">
          {icon}
        </span>
      </div>
      <div className="text-3xl font-bold text-white">
        {value}
      </div>
    </GlassCard>
  );
}