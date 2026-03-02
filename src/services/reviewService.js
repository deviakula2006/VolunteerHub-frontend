import api from "./api";

export const getMyReviews = async () => {
  const token = localStorage.getItem("access_token");

  const res = await api.get("/reviews", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const addReview = async (opportunity_id, rating, comment) => {
  const token = localStorage.getItem("access_token");

  const res = await api.post(
    "/reviews",
    { opportunity_id, rating, comment },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};