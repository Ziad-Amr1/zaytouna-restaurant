import { useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pencil, Plus, RefreshCcw, Search, Trash2 } from "lucide-react";
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

  useEffect(() => {
    reset({
      name: item?.name || "",
      category: item?.category || "Main Course",
      price: item?.price ?? "",
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
      <DialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit dish" : "Add new dish"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update this dish's details." : "Add a new dish to the menu."}
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
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
            <div className="space-y-2">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="dish-image">Image URL</Label>
            <Input id="dish-image" type="url" className="h-11" {...register("image")} />
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
  const [searchQuery, setSearchQuery] = useState("");
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

  const categories = [
    ...new Set([...DEFAULT_CATEGORIES, ...items.map((item) => item.category).filter(Boolean)]),
  ];

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

  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory === "All" || item.category === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const columns = [
    { header: "Item Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    {
      header: "Price",
      accessor: "price",
      render: (row) => formatPrice(row.price),
    },
    {
      header: "Availability",
      accessor: "available",
      render: (row) =>
        row.available === false ? (
          <Badge variant="secondary">Sold out</Badge>
        ) : (
          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20">Available</Badge>
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
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
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
          data={filteredItems}
          emptyMessage="No dishes found in the menu yet."
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