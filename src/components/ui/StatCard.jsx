import { Clock, CheckCircle, CalendarDays, FileText } from "lucide-react";

const iconMap = {
  hours: Clock,
  activities: CheckCircle,
  upcoming: CalendarDays,
  applications: FileText,
};

const colorMap = {
  hours: "text-emerald-400",
  activities: "text-cyan-400",
  upcoming: "text-amber-400",
  applications: "text-purple-400",
};

export default function StatCard({ title, value, icon }) {
  const Icon = iconMap[icon];

  return (
    <div
      className="
        bg-white/12
        border border-white/20
        rounded-2xl
        p-8
        shadow-lg
        hover:shadow-xl
        transition-all
        duration-300
        hover:scale-[1.02]
      "
    >
      <div className="flex justify-between items-start">

        {/* Left Content */}
        <div>
          <h3 className="text-white/80 text-lg font-medium">
            {title}
          </h3>

          {/* Reduced Count Size */}
          <p className="text-4xl font-semibold text-white mt-4">
            {value}
          </p>
        </div>

        {/* Icon Box */}
        <div
          className={`
            ${colorMap[icon]}
            bg-white/10
            p-3
            rounded-xl
          `}
        >
          <Icon size={26} />
        </div>

      </div>
    </div>
  );
}