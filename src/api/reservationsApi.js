import { getReservations } from "@/lib/reservations";

export const getAllReservations = () =>
  Promise.resolve({ data: getReservations() });