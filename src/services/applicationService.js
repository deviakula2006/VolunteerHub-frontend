import api from "./api";

export const getMyApplications = async () => {
  const token = localStorage.getItem("access_token");

  const res = await api.get("/applications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};