import { useState } from "react";
import { Plus, Search } from "lucide-react";

import DataTable from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = [
  "Cold Mezze",
  "Hot Mezze",
  "Grills & Mains",
  "Desserts",
  "Beverages",
];

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
      render: (row) => <Badge variant="secondary">{row.status}</Badge>,
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
          <p className="text-sm text-muted-foreground">
            Manage Levantine appetizers, grills, desserts, and live stock.
          </p>
        </div>
        <Button className="rounded-xl px-4 text-sm">
          <Plus size={18} aria-hidden="true" /> Add New Dish
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <label htmlFor="admin-menu-search" className="sr-only">
            Search dish name
          </label>
          <Input
            id="admin-menu-search"
            type="search"
            placeholder="Search dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div>
          <label htmlFor="admin-menu-category" className="sr-only">
            Filter by category
          </label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger id="admin-menu-category" className="w-full sm:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredItems}
        emptyMessage="No dishes found in the menu yet."
      />
    </div>
  );
}
