import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";
import { supabase } from "../../config/supabaseClient";

const TYPE_OPTIONS = [
  { value: "positive", label: "👍 Positive", color: "text-emerald-400" },
  { value: "neutral", label: "😐 Neutral", color: "text-yellow-400" },
  { value: "negative", label: "👎 Negative", color: "text-red-400" },
];

const TYPE_CONFIG = {
  positive: { icon: "👍", bg: "bg-emerald-500/20", text: "text-emerald-400", label: "Positive" },
  neutral: { icon: "😐", bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Neutral" },
  negative: { icon: "👎", bg: "bg-red-500/20", text: "text-red-400", label: "Negative" },
};

export default function Reviews() {
  const [searchParams] = useSearchParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opportunityId, setOpportunityId] = useState(searchParams.get("opportunityId") || "");
  const [type, setType] = useState("positive");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchReviews();

    const channel = supabase
      .channel("public:reviews")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reviews" },
        () => fetchReviews()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!opportunityId || !type || !comment) return;
    setIsSubmitting(true);
    try {
      await api.post("/reviews", {
        opportunity_id: opportunityId,
        type,
        comment
      });
      setOpportunityId("");
      setType("positive");
      setComment("");
      setSuccess("Review posted successfully!");
    } catch (err) {
      const msg = err.response?.data?.error || "Error posting review.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Reviews</h1>
          <p className="text-white/60">Leave feedback and read what others are saying about volunteering opportunities.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <GlassCard>
              <h2 className="text-xl font-bold text-white mb-6">Write a Review</h2>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <InputField
                  label="Opportunity ID"
                  type="text"
                  placeholder="Paste the Opportunity ID here..."
                  value={opportunityId}
                  onChange={(e) => setOpportunityId(e.target.value)}
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80 ml-1">Review Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {TYPE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setType(opt.value)}
                        className={`flex-1 py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${type === opt.value
                          ? `${TYPE_CONFIG[opt.value].bg} ${TYPE_CONFIG[opt.value].text} border-current`
                          : "bg-white/5 text-white/50 border-white/10 hover:bg-white/10"
                          }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-white/80 ml-1">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
                    placeholder="Tell us about your experience..."
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {success && <p className="text-emerald-400 text-sm">{success}</p>}

                <PrimaryButton type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Submit Review"}
                </PrimaryButton>
              </form>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="h-full">
              <h2 className="text-xl font-bold text-white mb-6">Recent Reviews</h2>
              {loading ? (
                <Loader text="Loading recent reviews..." />
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => {
                    const cfg = TYPE_CONFIG[rev.type] || TYPE_CONFIG.neutral;
                    return (
                      <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-white truncate max-w-[200px]">
                              {rev.opportunity?.title || `Opportunity #${rev.opportunity_id}`}
                            </h4>
                            <span className="text-xs text-white/40">By {rev.volunteer?.email?.split('@')[0] || "Anonymous"}</span>
                          </div>
                          <div className={`flex items-center gap-1 ${cfg.bg} px-2 py-1 rounded-lg`}>
                            <span>{cfg.icon}</span>
                            <span className={`font-bold text-sm ${cfg.text}`}>{cfg.label}</span>
                          </div>
                        </div>
                        <p className="text-white/70 text-sm">"{rev.comment}"</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-white/50 bg-white/5 rounded-xl border border-dashed border-white/20">
                  <p>No reviews have been posted yet. Be the first!</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}