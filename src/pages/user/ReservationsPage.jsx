import { useEffect, useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

import EmptyState from "@/components/common/EmptyState";
import ReservationModal from "@/components/common/ReservationModal";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { getReservations, updateReservationStatus } from "@/lib/reservations";

function ReservationCard({ reservation, onCancel, cancelling }) {
  const dateTime =
    reservation.date && reservation.time
      ? `${reservation.date} at ${reservation.time}`
      : reservation.date || reservation.time || "";

  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Reservation #{reservation.id}
          </p>

          {dateTime && (
            <p className="mt-0.5 text-xs text-muted-foreground">{dateTime}</p>
          )}
        </div>

        <StatusBadge status={reservation.status} />
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-medium text-muted-foreground">Party size</dt>

            <dd className="mt-0.5 font-semibold">
              {reservation.partySize}{" "}
              {reservation.partySize === 1 ? "guest" : "guests"}
            </dd>
          </div>

          {reservation.phone && (
            <div>
              <dt className="font-medium text-muted-foreground">Phone</dt>

              <dd className="mt-0.5 font-semibold">{reservation.phone}</dd>
            </div>
          )}

          {reservation.notes && (
            <div className="sm:col-span-2">
              <dt className="font-medium text-muted-foreground">Notes</dt>

              <dd className="mt-0.5">{reservation.notes}</dd>
            </div>
          )}
        </dl>
      </div>

      {reservation.status !== "cancelled" && (
        <div className="mt-4 border-t border-border pt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={cancelling}
            className="text-destructive hover:text-destructive"
            onClick={() => onCancel(reservation.id)}
          >
            {cancelling && <Loader2 className="animate-spin" />}
            {cancelling ? "Cancelling…" : "Cancel reservation"}
          </Button>
        </div>
      )}
    </article>
  );
}

function ReservationsPage() {
  const { user } = useAuth();

  const [reservations, setReservations] = useState(getReservations);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    function handleChange() {
      setReservations(getReservations());
    }

    window.addEventListener("reservations:change", handleChange);

    return () => {
      window.removeEventListener("reservations:change", handleChange);
    };
  }, [user?.id]);

  function handleCancel(id) {
    setCancellingId(id);

    try {
      updateReservationStatus(id, "cancelled");
      toast.success("Reservation cancelled");
    } catch {
      toast.error("Could not cancel the reservation. Please try again.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My reservations</h1>

          <p className="mt-1 text-muted-foreground">
            Your upcoming and past table bookings.
          </p>
        </div>

        <ReservationModal
          trigger={
            <Button>
              <CalendarDays />
              New reservation
            </Button>
          }
        />
      </div>

      <div className="mt-8 space-y-5">
        {reservations.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No reservations yet"
            description="Book a table and it will appear here."
            action={
              <ReservationModal trigger={<Button>Reserve a table</Button>} />
            }
          />
        ) : (
          reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onCancel={handleCancel}
              cancelling={cancellingId === reservation.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ReservationsPage;