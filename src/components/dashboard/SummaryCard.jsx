export default function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="relative rounded-2xl border border-white/15 bg-white/5 backdrop-blur-2xl p-6 shadow-xl">

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

    </div>
  );
}