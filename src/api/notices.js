import { axios } from "../lib/axios";

export const fetchAllNotices = async (params = {}) => {
  const { data } = await axios.get("/notices", { params });
  return data;
};

export const fetchNotice = async (id) => {
  const { data } = await axios.get(`/notices/${id}`);
  return data;
};

export const createNotice = async (formData) => {
  const res = await axios.post("/notices", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const editNotice = async ({ id, formData }) => {
  const res = await axios.patch(`/notices/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteNotice = async (id) => {
  const { data } = await axios.delete(`/notices/${id}`);
  return data;
};
