import api from "@/api/axiosClient";

export const getMenuItems = (params) =>
  api.get("/menu", { params }).then((res) => res.data);

export const getMenuItem = (id) =>
  api.get(`/menu/${id}`).then((res) => res.data);

export const createMenuItem = (payload) =>
  api.post("/menu", payload).then((res) => res.data);

export const updateMenuItem = (id, payload) =>
  api.put(`/menu/${id}`, payload).then((res) => res.data);

export const deleteMenuItem = (id) =>
  api.delete(`/menu/${id}`).then((res) => res.data);