import api from "./api";

export const getMyReviews = async () => {
  const res = await api.get("/reviews");
  return res.data;
};

export const addReview = async (opportunity_id, rating, comment) => {
  const res = await api.post("/reviews", { opportunity_id, rating, comment });
  return res.data;
};