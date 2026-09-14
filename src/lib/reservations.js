const STORAGE_KEY = "zaytouna.reservations";

function readReservations() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

function saveReservations(reservations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}

export function getReservations() {
  return [...readReservations()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createReservation(data) {
  const reservation = {
    id: Date.now().toString(),
    ...data,
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
    (reservation) => String(reservation.id) === String(id),
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
