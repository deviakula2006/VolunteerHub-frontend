import api from "./api";

export const getMyApplications = async () => {
  const res = await api.get("/applications");
  return res.data;
};