import api from "./api";

export const getMessages = async () => {
  const token = localStorage.getItem("access_token");

  const res = await api.get("/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const sendMessage = async (receiver_id, content) => {
  const token = localStorage.getItem("access_token");

  const res = await api.post(
    "/messages",
    { receiver_id, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data;
};