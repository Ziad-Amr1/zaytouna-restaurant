import { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Calendar, X } from "lucide-react";

export default function ReservationsManagement() {
  const [reservations, setReservations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRes, setNewRes] = useState({ guest: "", phone: "", date: "", guests: "2 Guests", table: "Main Hall" });

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
    setNewRes({ guest: "", phone: "", date: "", guests: "2 Guests", table: "Main Hall" });
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
      render: (row) => {
        const colorMap = {
          Confirmed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
          Pending: "bg-amber-500/10 text-amber-700 border-amber-500/20",
          Cancelled: "bg-rose-500/10 text-rose-700 border-rose-500/20",
        };
        return (
          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorMap[row.status] || "bg-muted text-muted-foreground"}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Manage",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === "Pending" && (
            <button
              onClick={() => updateStatus(row.id, "Confirmed")}
              className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20"
            >
              Confirm
            </button>
          )}
          {row.status !== "Cancelled" && (
            <button
              onClick={() => updateStatus(row.id, "Cancelled")}
              className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-500/20"
            >
              Cancel
            </button>
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
          <p className="text-sm text-muted-foreground">Manage seating, bookings, and customer table allocations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          <Calendar size={16} /> New Reservation
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={reservations} 
        emptyMessage="No table reservations found yet."
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-lg font-bold text-foreground">Add New Reservation</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddReservation} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Guest Name</label>
                <input
                  type="text"
                  required
                  value={newRes.guest}
                  onChange={(e) => setNewRes({ ...newRes, guest: e.target.value })}
                  placeholder="Guest Full Name"
                  className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newRes.phone}
                  onChange={(e) => setNewRes({ ...newRes, phone: e.target.value })}
                  placeholder="+20 1..."
                  className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Party Size</label>
                  <input
                    type="text"
                    value={newRes.guests}
                    onChange={(e) => setNewRes({ ...newRes, guests: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Area</label>
                  <input
                    type="text"
                    value={newRes.table}
                    onChange={(e) => setNewRes({ ...newRes, table: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}