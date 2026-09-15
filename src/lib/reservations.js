import { storage } from "./storage";

const STORAGE_KEY = "zaytouna.reservations";

const SEED_RESERVATIONS = [
  {
    id: "res-101",
    userId: "user-1",
    guestName: "Youssef Mansour",
    phone: "+20 100 123 4567",
    date: "2026-09-15",
    time: "20:00",
    partySize: 4,
    notes: "Window table requested.",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "res-102",
    userId: "user-2",
    guestName: "Nour El-Din",
    phone: "+20 111 987 6543",
    date: "2026-09-15",
    time: "21:30",
    partySize: 2,
    notes: "Anniversary celebration.",
    status: "pending",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "res-103",
    userId: "user-3",
    guestName: "Mariam Hassan",
    phone: "+20 122 555 4321",
    date: "2026-09-16",
    time: "19:00",
    partySize: 6,
    notes: "Outdoor seating.",
    status: "confirmed",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

function readReservations() {
  const items = storage.getJSON(STORAGE_KEY, null);
  if (!items || !Array.isArray(items) || items.length === 0) {
    storage.setItem(STORAGE_KEY, SEED_RESERVATIONS);
    return SEED_RESERVATIONS;
  }
  return items;
}

function saveReservations(reservations) {
  storage.setItem(STORAGE_KEY, reservations);
}

export function getReservations(userId = null) {
  const all = readReservations();
  const filtered = userId ? all.filter((r) => r.userId === userId || !r.userId) : all;
  return [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createReservation(data, user = null) {
  const reservation = {
    id: `res-${Date.now().toString().slice(-6)}`,
    userId: user?.id || null,
    guestName: data.guestName || user?.name || "Guest User",
    phone: data.phone || "",
    date: data.date,
    time: data.time,
    partySize: Number(data.partySize || 2),
    notes: data.notes || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const reservations = readReservations();
  reservations.push(reservation);

  saveReservations(reservations);

  window.dispatchEvent(new Event("reservations:change"));

  return reservation;
}

export function updateReservationStatus(id, status) {
  const reservations = readReservations();

  const index = reservations.findIndex(
    (reservation) => String(reservation.id) === String(id)
  );

  if (index === -1) {
    throw new Error("Reservation not found.");
  }

  reservations[index] = {
    ...reservations[index],
    status,
  };

  saveReservations(reservations);

  window.dispatchEvent(new Event("reservations:change"));

  return reservations[index];
}
