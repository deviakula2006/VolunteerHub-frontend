import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import Loader from "../../components/ui/Loader";
import { getCalendarEvents } from "../../services/calendarService";
import { Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const data = await getCalendarEvents();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Event Calendar</h1>
          <p className="text-white/60">View upcoming volunteer opportunities and accepted events.</p>
        </div>

        {loading ? (
          <Loader text="Loading calendar..." />
        ) : events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <GlassCard key={evt.id} className="flex flex-col border-emerald-500/20">
                <div className="flex items-center gap-3 mb-4 text-emerald-400">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-semibold">{evt.start_date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{evt.title}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{evt.description}</p>
                <div className="mt-auto space-y-2">
                  <div className="flex items-center text-white/50 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {evt.location || "Location TBD"}
                  </div>
                  {evt.end_date && (
                    <div className="flex items-center text-white/50 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Until {evt.end_date}
                    </div>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
            <CalendarIcon className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No upcoming events found on the calendar.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}