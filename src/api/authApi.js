import api from "@/api/axiosClient";

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password }).then((res) => res.data);

export const registerUser = (payload) =>
  api.post("/auth/register", payload).then((res) => res.data);

export const getCurrentUser = () =>
  api.get("/auth/me").then((res) => res.data);

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return Promise.resolve();
};