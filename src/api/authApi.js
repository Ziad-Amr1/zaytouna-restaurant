import api from "@/api/axiosClient";

export async function loginUser(email, password) {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
}

export async function registerUser(payload) {
  const { data } = await api.post("/auth/register", payload);

  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");

  return data;
}