import { useEffect, useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuth";
import { createReservation } from "@/lib/reservations";

const reservationSchema = z.object({
  guestName: z.string().trim().min(1, "Name is required."),
  phone: z.string().trim().min(1, "Phone number is required."),
  date: z.string().min(1, "Date is required."),
  time: z.string().min(1, "Time is required."),
  partySize: z.coerce.number().int().min(1).max(20),
  notes: z.string().trim().optional(),
});

function todayISO() {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

const partySizes = Array.from({ length: 20 }, (_, index) => index + 1);

function ReservationModal({ trigger }) {
  const { user, isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guestName: user?.name || "",
      phone: "",
      date: "",
      time: "",
      partySize: 2,
      notes: "",
    },
  });

  useEffect(() => {
    if (user?.name) {
      reset((current) => ({
        ...current,
        guestName: user.name,
      }));
    }
  }, [user?.name, reset]);

  async function onSubmit(values) {
    setSubmitting(true);

    try {
      createReservation(values);

      toast.success("Table requested", {
        description: "Your reservation has been saved.",
      });

      reset();
      setOpen(false);
    } catch {
      toast.error("Could not submit your reservation.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="size-5" />
            Reserve a table
          </DialogTitle>

          <DialogDescription>
            Choose your date, time, and party size.
          </DialogDescription>
        </DialogHeader>

        {isAuthenticated ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="res-name">Name</Label>

              <Input
                id="res-name"
                autoComplete="name"
                className="h-11"
                aria-invalid={Boolean(errors.guestName)}
                {...register("guestName")}
              />

              {errors.guestName && (
                <p className="text-sm text-destructive">
                  {errors.guestName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="res-phone">Phone</Label>

              <Input
                id="res-phone"
                type="tel"
                autoComplete="tel"
                className="h-11"
                aria-invalid={Boolean(errors.phone)}
                {...register("phone")}
              />

              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="res-date">Date</Label>

                <Input
                  id="res-date"
                  type="date"
                  min={todayISO()}
                  className="h-11"
                  {...register("date")}
                />

                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="res-time">Time</Label>

                <Input
                  id="res-time"
                  type="time"
                  className="h-11"
                  {...register("time")}
                />

                {errors.time && (
                  <p className="text-sm text-destructive">
                    {errors.time.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="res-party">Party size</Label>

              <Controller
                name="partySize"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="res-party" className="h-11">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {partySizes.map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size} {size === 1 ? "guest" : "guests"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="res-notes">Notes (optional)</Label>

              <Textarea
                id="res-notes"
                rows={3}
                className="resize-none"
                {...register("notes")}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="animate-spin" />}

                {submitting ? "Submitting…" : "Reserve a table"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in to reserve a table at Zaytouna.
            </p>

            <Button asChild className="w-full">
              <Link
                to="/login"
                state={{ from: window.location.pathname }}
                onClick={() => setOpen(false)}
              >
                Log in to reserve
              </Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReservationModal;
