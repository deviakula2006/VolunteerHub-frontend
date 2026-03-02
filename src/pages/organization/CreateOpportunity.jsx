import { useState } from "react";
import api from "../../services/api";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function CreateOpportunity() {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await api.post("/opportunities", formData);
    alert("Created successfully");
  } catch (err) {
    alert(err.response?.data?.error);
  }
};

  return (
    <DashboardLayout>
      <div className="p-10 space-y-8">
        <h1 className="text-3xl text-white font-semibold">
          Create Opportunity
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white/12 p-8 rounded-2xl space-y-6"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 rounded-xl bg-white/10 text-white"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            className="w-full p-3 rounded-xl bg-white/10 text-white"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <PrimaryButton type="submit">
            Create
          </PrimaryButton>
        </form>
      </div>
    </DashboardLayout>
  );
}