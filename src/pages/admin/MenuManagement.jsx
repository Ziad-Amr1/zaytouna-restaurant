import { useState } from "react";
import DataTable from "@/components/common/DataTable";
import { Plus, Search } from "lucide-react";

export default function MenuManagement() {
  // Empty state ready for incoming API dishes data
  const [items] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { header: "Item Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    { header: "Price", accessor: "price" },
    {
      header: "Availability",
      accessor: "status",
      render: (row) => (
        <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          {row.status}
        </span>
      ),
    },
  ];

  // Filter items matching search input and selected category dropdown
  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Menu Management</h2>
          <p className="text-sm text-muted-foreground">Manage Levantine appetizers, grills, desserts, and live stock.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-800">
          <Plus size={18} /> Add New Dish
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-2 pr-4 pl-9 text-sm text-foreground outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Category filter dropdown remains intact */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground outline-none transition focus:border-emerald-600"
        >
          <option value="All">All Categories</option>
          <option value="Cold Mezze">Cold Mezze</option>
          <option value="Hot Mezze">Hot Mezze</option>
          <option value="Grills & Mains">Grills & Mains</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
        </select>
      </div>

      {/* Renders empty state message by default */}
      <DataTable
        columns={columns}
        data={filteredItems}
        emptyMessage="No dishes found in the menu yet."
      />
    </div>
  );
}