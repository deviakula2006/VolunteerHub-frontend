import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import Loader from "../../components/ui/Loader";
import api from "../../services/api";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opportunityId, setOpportunityId] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
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
    if (!opportunityId || !rating || !comment) return;
    setIsSubmitting(true);
    try {
      await api.post("/reviews", {
        opportunity_id: parseInt(opportunityId),
        rating: parseInt(rating),
        comment
      });
      setOpportunityId("");
      setRating("");
      setComment("");
      fetchReviews();
      alert("Review posted successfully!");
    } catch (err) {
      alert("Error posting review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Reviews</h1>
          <p className="text-white/60">Leave feedback for your past volunteer experiences.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <GlassCard>
              <h2 className="text-xl font-bold text-white mb-6">Write a Review</h2>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <InputField
                  label="Opportunity ID"
                  type="number"
                  placeholder="e.g. 1"
                  value={opportunityId}
                  onChange={(e) => setOpportunityId(e.target.value)}
                  required
                />
                <InputField
                  label="Rating (1-5)"
                  type="number"
                  placeholder="e.g. 5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                />
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
                <PrimaryButton type="submit" className="w-full mt-4" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Submit Review"}
                </PrimaryButton>
              </form>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="h-full">
              <h2 className="text-xl font-bold text-white mb-6">Your Past Reviews</h2>
              {loading ? (
                <Loader text="Loading your history..." />
              ) : reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-white">Opportunity #{rev.opportunity_id}</h4>
                        <div className="flex bg-emerald-500/20 px-2 py-1 rounded-lg">
                          <span className="text-emerald-400 font-bold text-sm">⭐ {rev.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-sm">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-white/50 bg-white/5 rounded-xl border border-dashed border-white/20">
                  <p>You haven't written any reviews yet.</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}