import api from "./api";

export const getGroupAnnouncements = async (groupId) => {
  const res = await api.get(`/messages/group/${groupId}`);
  return res.data;
};

export const postAnnouncement = async (groupId, content) => {
  const res = await api.post(`/messages/group/${groupId}`, { content });
  return res.data;
};