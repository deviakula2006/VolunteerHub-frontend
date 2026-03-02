import api from "./api";

export const addHours = async (opportunity_id, hours) => {
  const res = await api.post("/hours", { opportunity_id, hours });
  return res.data;
};

export const getMyHours = async () => {
  const res = await api.get("/hours");
  return res.data;
};