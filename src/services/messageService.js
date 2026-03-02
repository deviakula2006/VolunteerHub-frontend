import api from "./api";

export const getMessages = async () => {
  const res = await api.get("/messages");
  return res.data;
};

export const sendMessage = async (receiver_id, content) => {
  const res = await api.post("/messages", { receiver_id, content });
  return res.data;
};