import { axios } from "../lib/axios";

export const login = async (data) => {
  const res = await axios.post("/auth/login", data);
  return res?.data;
};

export const forgotPassword = async (data) => {
  const res = await axios.post("/auth/forgot-password", data);
  return res?.data;
};

export const resetPassword = async ({ data, token }) => {
  const res = await axios.post(`/auth/reset-password/${token}`, data);
  return res?.data;
};

export const getMe = async () => {
  const { data } = await axios.get("/auth/me");
  return data;
};

export const logout = async () => {
  const { data } = await axios.post("/auth/logout");
  return data;
};
