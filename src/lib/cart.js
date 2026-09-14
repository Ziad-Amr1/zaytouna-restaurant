const STORAGE_KEY = "zaytouna.cart";
const EVENT_NAME = "cart:change";

export const EMPTY_CART = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  total: 0,
};

function roundMoney(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || !Array.isArray(parsed.items)) return { ...EMPTY_CART };
    return parsed;
  } catch {
    return { ...EMPTY_CART };
  }
}

function computeTotals(lines) {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = roundMoney(
    lines.reduce((sum, line) => sum + line.price * line.quantity, 0),
  );

  return { items: lines, itemCount, subtotal, total: subtotal };
}

export function dishToLine(dish) {
  return {
    id: dish.id,
    name: dish.name || "",
    image: dish.image || "",
    price: Number(dish.price) || 0,
    quantity: 1,
  };
}

export function addDish(cart, dish) {
  if (!dish?.id) return cart;

  const line = dishToLine(dish);
  const existing = cart.items.find((item) => item.id === line.id);

  if (existing) {
    const lines = cart.items.map((item) =>
      item.id === line.id ? { ...item, quantity: item.quantity + 1 } : item,
    );
    return computeTotals(lines);
  }

  return computeTotals([...cart.items, line]);
}

export function setCartQuantity(cart, dishId, quantity) {
  const next = Math.max(1, Math.floor(Number(quantity) || 1));

  return computeTotals(
    cart.items.map((item) =>
      item.id === dishId ? { ...item, quantity: next } : item,
    ),
  );
}

export function removeDish(cart, dishId) {
  return computeTotals(cart.items.filter((item) => item.id !== dishId));
}

export function clearCart() {
  return { ...EMPTY_CART };
}

export function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // storage unavailable
  }
  window.dispatchEvent(new Event(EVENT_NAME));
  return cart;
}

export function loadCart() {
  return readStoredCart();
}

export function formatItemCount(count) {
  const value = Number(count);
  if (!Number.isFinite(value) || value <= 0) return "";
  if (value > 99) return "99+";
  return String(value);
}