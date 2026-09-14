import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { getReservations, updateReservationStatus } from "@/lib/reservations";

function ReservationsManagement() {
  const [reservations, setReservations] = useState(getReservations);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    function handleChange() {
      setReservations(getReservations());
    }

    window.addEventListener("reservations:change", handleChange);

    return () => {
      window.removeEventListener("reservations:change", handleChange);
    };
  }, []);

  function loadReservations() {
    setReservations(getReservations());
  }

  function handleStatusChange(id, status) {
    setUpdatingId(id);

    try {
      updateReservationStatus(id, status);

      toast.success(`Reservation ${id} marked ${status}.`);
    } catch {
      toast.error("Could not update the reservation.");
    } finally {
      setUpdatingId(null);
    }
  }

  const columns = [
    {
      header: "Reservation ID",
      accessor: "id",
    },
    {
      header: "Guest Name",
      accessor: "guestName",
    },
    {
      header: "Phone Number",
      accessor: "phone",
    },
    {
      header: "Date & Time",
      accessor: "date",
      render: (row) => `${row.date} at ${row.time}`,
    },
    {
      header: "Party Size",
      accessor: "partySize",
    },
    {
      header: "Notes",
      accessor: "notes",
      render: (row) => row.notes || "—",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Manage",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "pending" && (
            <Button
              size="sm"
              variant="outline"
              disabled={updatingId === row.id}
              onClick={() => handleStatusChange(row.id, "confirmed")}
            >
              Confirm
            </Button>
          )}

          {row.status !== "cancelled" && (
            <Button
              size="sm"
              variant="outline"
              disabled={updatingId === row.id}
              className="text-destructive hover:text-destructive"
              onClick={() => handleStatusChange(row.id, "cancelled")}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Table Reservations
          </h2>

          <p className="text-sm text-muted-foreground">
            Review booking requests and manage reservations.
          </p>
        </div>

        <Button variant="outline" onClick={loadReservations}>
          <RefreshCcw />
          Refresh
        </Button>
      </div>

      {reservations.length === 0 ? (
        <EmptyState
          title="No reservations yet"
          description="Table booking requests will appear here."
        />
      ) : (
        <DataTable
          columns={columns}
          data={reservations}
          emptyMessage="No reservations found."
        />
      )}
    </div>
  );
}

export default ReservationsManagement;
