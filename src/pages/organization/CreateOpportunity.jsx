import { useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PrimaryButton from "../../components/ui/PrimaryButton";
import InputField from "../../components/ui/InputField";
import GlassCard from "../../components/ui/GlassCard";

export default function CreateOpportunity() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/opportunities", form);
      alert("Opportunity created successfully!");
      setForm({
        title: "",
        description: "",
        location: "",
        start_date: "",
        end_date: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Error creating opportunity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-8 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl text-white font-bold mb-2">Create Opportunity</h1>
          <p className="text-white/60">Post a new volunteer event for users to find and apply.</p>
        </div>

        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField
              label="Opportunity Title"
              placeholder="e.g. Community Garden Cleanup"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/80 ml-1">
                Description <span className="text-emerald-400">*</span>
              </label>
              <textarea
                placeholder="Describe the tasks, requirements, and impact..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={5}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none transition-all"
              />
            </div>

            <InputField
              label="Location"
              placeholder="e.g. Central Park (or Remote)"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Start Date"
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
              />
              <InputField
                label="End Date"
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                required
              />
            </div>

            <PrimaryButton type="submit" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Opportunity"}
            </PrimaryButton>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}