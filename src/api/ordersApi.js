import api from "@/api/axiosClient";

export const createOrder = (items) =>
  api.post("/orders", { items }).then((res) => res.data);

export const getMyOrders = () =>
  api.get("/orders/my").then((res) => res.data);

export const getAllOrders = () =>
  api.get("/orders").then((res) => res.data);

export const getOrder = (id) =>
  api.get(`/orders/${id}`).then((res) => res.data);

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}/status`, { status }).then((res) => res.data);