import api from "./api";

export const getCalendarEvents = async () => {
    const res = await api.get("/calendar");
    return res.data;
};
