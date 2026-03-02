import api from "./api";

export const getOpportunities = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const res = await api.get(`/opportunities${queryParams ? `?${queryParams}` : ''}`);
  return res.data;
};

export const applyToOpportunity = async (opportunity_id) => {
  const res = await api.post("/applications", { opportunity_id });
  return res.data;
};

export const createOpportunity = async (data) => {
  const res = await api.post("/opportunities", data);
  return res.data;
};