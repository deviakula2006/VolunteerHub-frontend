import api from "./api";

export const addHours = async (opportunity_id, hours) => {
  const token = localStorage.getItem("access_token");

  const res = await api.post(
    "/hours",
    { opportunity_id, hours },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

export const getMyHours = async () => {
  const token = localStorage.getItem("access_token");

  const res = await api.get("/hours", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};