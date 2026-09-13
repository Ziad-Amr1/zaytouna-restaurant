import { useState } from "react";
import { Calendar } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const STATUS_STYLES = {
  Confirmed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Cancelled: "bg-rose-500/10 text-rose-700 border-rose-500/20",
};

const EMPTY_FORM = {
  guest: "",
  phone: "",
  date: "",
  guests: "2 Guests",
  table: "Main Hall",
};

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRes, setNewRes] = useState(EMPTY_FORM);

  const updateStatus = (id, newStatus) => {
    setReservations((prev) =>
      prev.map((res) => (res.id === id ? { ...res, status: newStatus } : res))
    );
  };

  const handleAddReservation = (e) => {
    e.preventDefault();
    if (!newRes.guest || !newRes.phone) return;

    setReservations((prev) => [
      ...prev,
      {
        id: `#RES-${Date.now().toString().slice(-4)}`,
        guest: newRes.guest,
        phone: newRes.phone,
        date: newRes.date || "Today",
        guests: newRes.guests,
        table: newRes.table,
        status: "Pending",
      },
    ]);
    setNewRes(EMPTY_FORM);
    setIsModalOpen(false);
  };

  const columns = [
    { header: "Reservation ID", accessor: "id" },
    { header: "Guest Name", accessor: "guest" },
    { header: "Phone Number", accessor: "phone" },
    { header: "Date & Time", accessor: "date" },
    { header: "Party Size", accessor: "guests" },
    { header: "Table Area", accessor: "table" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <Badge className={STATUS_STYLES[row.status] || "bg-muted text-muted-foreground"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Manage",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "Pending" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatus(row.id, "Confirmed")}
            >
              Confirm
            </Button>
          )}
          {row.status !== "Cancelled" && (
            <Button
              size="sm"
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => updateStatus(row.id, "Cancelled")}
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Table Reservations</h2>
          <p className="text-sm text-muted-foreground">
            Manage seating, bookings, and customer table allocations.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="rounded-xl px-4 text-sm">
          <Calendar size={16} aria-hidden="true" /> New Reservation
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reservations}
        emptyMessage="No table reservations found yet."
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reservation</DialogTitle>
            <DialogDescription>
              Enter the guest&apos;s details to create a table reservation.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddReservation} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="res-guest" className="text-xs font-semibold text-muted-foreground">
                Guest Name
              </label>
              <Input
                id="res-guest"
                type="text"
                required
                value={newRes.guest}
                onChange={(e) => setNewRes({ ...newRes, guest: e.target.value })}
                placeholder="Guest Full Name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="res-phone" className="text-xs font-semibold text-muted-foreground">
                Phone Number
              </label>
              <Input
                id="res-phone"
                type="tel"
                required
                value={newRes.phone}
                onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
                placeholder="+20 1..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label htmlFor="res-guests" className="text-xs font-semibold text-muted-foreground">
                  Party Size
                </label>
                <Input
                  id="res-guests"
                  type="text"
                  value={newRes.guests}
                  onChange={(e) => setNewRes({ ...newRes, guests: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="res-table" className="text-xs font-semibold text-muted-foreground">
                  Area
                </label>
                <Input
                  id="res-table"
                  type="text"
                  value={newRes.table}
                  onChange={(e) => setNewRes({ ...newRes, table: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
