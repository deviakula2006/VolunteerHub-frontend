import api from "./api";

export const getOpportunities = async () => {
  const res = await api.get("/opportunities");
  return res.data;
};

export const applyToOpportunity = async (opportunity_id) => {
  const token = localStorage.getItem("access_token");

  const res = await api.post(
    "/applications",
    { opportunity_id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};