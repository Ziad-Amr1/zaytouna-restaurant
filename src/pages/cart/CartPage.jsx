import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Loader2,
  LogIn,
  Minus,
  PackageOpen,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { createOrder } from "@/api/ordersApi";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { formatPrice } from "@/lib/format";

function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, updateQuantity, removeItem, clear } = useCart();

  const [isClearOpen, setIsClearOpen] = useState(false);
  const [placing, setPlacing] = useState(false);

  function handleQuantityChange(item, quantity) {
    if (quantity < 1) return;
    updateQuantity(item.id, quantity);
  }

  function handleRemove(item) {
    removeItem(item.id);
    toast.success(t("cart.removed", { name: item.name }));
  }

  function handleClear() {
    clear();
    setIsClearOpen(false);
    toast.success(t("cart.cleared"));
  }

  async function handleCheckout() {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    if (placing || cart.items.length === 0) return;

    setPlacing(true);
    try {
      await createOrder(
        cart.items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      );

      toast.success(t("cart.orderPlaced"), {
        description: t("cart.orderPlacedDescription"),
      });
      clear();
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || t("cart.orderFailed"));
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("cart.title")}
        </h1>

        {cart.itemCount > 0 && (
          <p className="text-sm text-muted-foreground">
            {t("cart.itemsCount", { count: cart.itemCount })}
          </p>
        )}
      </div>

      {cart.items.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title={t("cart.emptyTitle")}
          description={t("cart.emptyDescription")}
          action={
            <Button asChild>
              <Link to="/menu">{t("cart.browseMenu")}</Link>
            </Button>
          }
          className="mt-8"
        />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <Card className="overflow-hidden border-border p-0">
            <ul className="divide-y divide-border">
              {cart.items.map((item) => (
                <li key={item.id}>
                  <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <PackageOpen
                            className="size-5 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/menu/${item.id}`}
                        className="line-clamp-2 font-medium text-foreground transition-colors hover:text-accent-strong"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t("cart.unitPrice", { price: formatPrice(item.price) })}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-md"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || placing}
                          aria-label={t("cart.minus")}
                        >
                          <Minus className="size-3.5" aria-hidden="true" />
                        </Button>

                        <span
                          className="min-w-8 text-center text-sm font-semibold tabular-nums text-foreground"
                          aria-label={t("cart.quantity")}
                        >
                          {item.quantity}
                        </span>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-8 rounded-md"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          disabled={placing}
                          aria-label={t("cart.plus")}
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end justify-between gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(item)}
                        disabled={placing}
                        aria-label={t("cart.removeItem", { name: item.name })}
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                      <p className="font-semibold tabular-nums text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-4">
            {!isAuthenticated && (
              <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-4">
                <LogIn
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  {t("cart.guestNote")}{" "}
                  <Link
                    to="/login"
                    className="font-medium text-accent-strong underline-offset-2 hover:underline"
                  >
                    {t("cart.loginLink")}
                  </Link>
                </p>
              </div>
            )}

            <Card className="border-border">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {t("cart.subtotal")}
                  </span>
                  <span className="font-medium tabular-nums text-foreground">
                    {formatPrice(cart.subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="font-medium text-foreground">
                    {t("cart.total")}
                  </span>
                  <span className="text-xl font-bold tabular-nums text-foreground">
                    {formatPrice(cart.total)}
                  </span>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <Button
                    size="lg"
                    onClick={() => void handleCheckout()}
                    disabled={placing || cart.items.length === 0}
                  >
                    {placing && <Loader2 className="animate-spin" />}
                    {placing ? t("cart.placingOrder") : t("cart.checkout")}
                  </Button>

                  <Button variant="outline" asChild>
                    <Link to="/menu">{t("cart.continueShopping")}</Link>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setIsClearOpen(true)}
                    disabled={placing}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                    {t("cart.clear")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <AlertDialog
        open={isClearOpen}
        onOpenChange={(open) => !open && !placing && setIsClearOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("cart.clearTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("cart.clearDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={placing}>
              {t("cart.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleClear}>
              {t("cart.clearConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CartPage;