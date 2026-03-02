import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import { BookOpen, ExternalLink, Video } from "lucide-react";

const mockResources = [
  {
    id: 1,
    title: "The Ultimate Guide to Community Volunteering",
    description: "Learn how to make the most impact in your local community.",
    type: "article",
    author: "Volunteerhub Team",
    link: "#"
  },
  {
    id: 2,
    title: "Health & Safety Protocol for Outdoor Events",
    description: "Important safety guidelines for participating in outdoor cleanups and construction.",
    type: "video",
    author: "Safety First Org",
    link: "#"
  },
  {
    id: 3,
    title: "How to Lead a Volunteer Group Effectively",
    description: "Tips and tricks for tracking attendance and keeping morale high.",
    type: "article",
    author: "Leadership Academy",
    link: "#"
  }
];

export default function Resources() {
  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Resource Center</h1>
          <p className="text-white/60">Educational materials and guides to help you on your volunteering journey.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockResources.map((resource) => (
            <GlassCard key={resource.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-emerald-400">
                {resource.type === "video" ? <Video className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                <span className="text-xs font-bold uppercase tracking-wider">{resource.type}</span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
              <p className="text-white/60 text-sm mb-6 flex-1">{resource.description}</p>

              <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/40">By {resource.author}</span>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
                >
                  Read More <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}