import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Plus, RefreshCcw, Search, Trash2, Utensils } from "lucide-react";
import { toast } from "sonner";

import { createMenuItem, deleteMenuItem, getMenuItems, updateMenuItem } from "@/api/menuApi";
import DataTable from "@/components/common/DataTable";
import EmptyState from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const DEFAULT_CATEGORIES = [
  "Main Course",
  "Cold Mezze",
  "Hot Mezze",
  "Grills & Mains",
  "Desserts",
  "Beverages",
];

function blankDishValues() {
  return {
    name: "",
    category: "Main Course",
    price: "",
    discountPercent: "0",
    description: "",
    image: "",
    available: true,
  };
}

const dishSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  category: z.string().trim().min(1, "Category is required."),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .positive("Price must be greater than zero."),
  discountPercent: z.coerce
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .optional(),
  description: z.string().trim().optional(),
  image: z.string().trim().optional(),
  available: z.boolean(),
});

function DishFormDialog({ open, onOpenChange, categories, item, onSaved }) {
  const editing = Boolean(item?.id);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(dishSchema),
    defaultValues: blankDishValues(),
  });

  const imageUrl = useWatch({ control, name: "image" });

  useEffect(() => {
    reset({
      name: item?.name || "",
      category: item?.category || "Main Course",
      price: item?.price ?? "",
      discountPercent: item?.discountPercent ?? 0,
      description: item?.description || "",
      image: item?.image || "",
      available: item ? item.available !== false : true,
    });
  }, [item, reset, open]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        name: values.name,
        category: values.category,
        price: values.price,
        discountPercent: Number(values.discountPercent || 0),
        description: values.description || "",
        image: values.image || "",
        available: values.available,
      };
      const response = editing
        ? await updateMenuItem(item.id, payload)
        : await createMenuItem(payload);
      toast.success(editing ? "Dish updated" : "Dish added");
      onSaved(response.data);
      onOpenChange(false);
    } catch (err) {
      const message =
        err?.response?.data?.message || "We couldn't save this dish. Please try again.";
      setError("root", { message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit dish" : "Add new dish"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update this dish's details, price, and discount." : "Add a new dish to the menu."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {errors.root && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {errors.root.message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dish-name">Name</Label>
            <Input id="dish-name" className="h-11" aria-invalid={Boolean(errors.name)} {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="dish-category">Category</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="dish-category" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="dish-price">Price (EGP)</Label>
              <Input
                id="dish-price"
                type="number"
                min="0"
                step="1"
                className="h-11"
                aria-invalid={Boolean(errors.price)}
                {...register("price")}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="dish-discount">Discount %</Label>
              <Input
                id="dish-discount"
                type="number"
                min="0"
                max="100"
                step="5"
                className="h-11"
                {...register("discountPercent")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dish-image">Image URL</Label>
            <Input
              id="dish-image"
              type="url"
              placeholder="https://images.unsplash.com/..."
              className="h-11"
              {...register("image")}
            />
            {imageUrl && (
              <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="size-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dish-description">Description</Label>
            <Textarea
              id="dish-description"
              rows={3}
              className="resize-none border-border bg-background"
              {...register("description")}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Available</p>
              <p className="text-xs text-muted-foreground">
                Sold-out dishes are hidden from the public menu.
              </p>
            </div>
            <Controller
              name="available"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-label="Available for ordering"
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-28">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden="true" /> Saving…
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Add dish"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMenuItems();
      setItems(response.data || []);
    } catch {
      setError("We couldn't load the menu right now. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const categories = useMemo(() => {
    return [...new Set([...DEFAULT_CATEGORIES, ...items.map((item) => item.category).filter(Boolean)])];
  }, [items]);

  const replaceItem = (updated) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.id === updated.id);
      return exists
        ? prev.map((item) => (item.id === updated.id ? updated : item))
        : [...prev, updated];
    });
  };

  const handleToggleAvailability = async (item, available) => {
    try {
      const response = await updateMenuItem(item.id, { available });
      replaceItem(response.data);
      toast.success(`${item.name} is now ${available ? "available" : "sold out"}.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update availability.");
    }
  };

  const handleDelete = async (item) => {
    try {
      await deleteMenuItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
      toast.success(`${item.name} was removed from the menu.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete this dish.");
    }
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesCategory = filterCategory === "All" || item.category === filterCategory;
        const matchesStatus =
          filterStatus === "All" ||
          (filterStatus === "available" && item.available !== false) ||
          (filterStatus === "sold_out" && item.available === false);
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];

        if (sortColumn === "available") {
          aVal = a.available !== false ? 1 : 0;
          bVal = b.available !== false ? 1 : 0;
        } else if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = (bVal || "").toLowerCase();
        }

        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [items, filterCategory, filterStatus, searchQuery, sortColumn, sortDirection]);

  const columns = [
    {
      header: "Meal",
      accessor: "name",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="size-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <Utensils className="size-4" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">{row.name}</p>
            {row.description && (
              <p className="line-clamp-1 text-xs text-muted-foreground max-w-xs">
                {row.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    { header: "Category", accessor: "category", sortable: true },
    {
      header: "Price",
      accessor: "price",
      sortable: true,
      render: (row) => formatPrice(row.price),
    },
    {
      header: "Availability",
      accessor: "available",
      sortable: true,
      render: (row) =>
        row.available === false ? (
          <Badge variant="secondary">Sold out</Badge>
        ) : (
          <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700">Available</Badge>
        ),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.available !== false}
            onCheckedChange={(checked) => handleToggleAvailability(row, checked)}
            aria-label={`Toggle availability for ${row.name}`}
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingItem(row);
              setDialogOpen(true);
            }}
          >
            <Pencil className="mr-1 size-3.5" aria-hidden="true" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-1 size-3.5" aria-hidden="true" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &quot;{row.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the dish from the menu. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={cn("rounded-lg")}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(row)} className="rounded-lg bg-destructive text-white hover:bg-destructive/90">
                  Delete dish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Menu Management</h2>
          <p className="text-sm text-muted-foreground">
            Manage Levantine appetizers, grills, desserts, and live stock.
          </p>
        </div>
        {error ? (
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCcw className="mr-2 size-4" aria-hidden="true" /> Retry
          </Button>
        ) : (
          <Button
            className="rounded-xl px-4 text-sm"
            onClick={() => {
              setEditingItem(null);
              setDialogOpen(true);
            }}
          >
            <Plus size={18} aria-hidden="true" /> Add New Dish
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search dish name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold_out">Sold Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-6">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="mt-3 h-5 w-full" />
          <Skeleton className="mt-3 h-5 w-3/4" />
        </div>
      ) : error ? (
        <EmptyState
          title="Something went wrong"
          description={error}
          action={
            <Button variant="outline" onClick={() => void load()}>
              Try again
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredAndSortedItems}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyMessage="No dishes found in the menu matching your filters."
        />
      )}

      <DishFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        item={editingItem}
        onSaved={replaceItem}
      />
    </div>
  );
}