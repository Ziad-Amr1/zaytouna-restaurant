function isSameDay(iso, ref = new Date()) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return false;
  return (
    d.getFullYear() === ref.getFullYear() &&
    d.getMonth() === ref.getMonth() &&
    d.getDate() === ref.getDate()
  );
}

function isSameMonth(iso, ref = new Date()) {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) return false;
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function computeDashboardStats(orders = [], reservations = []) {
  const dailyRevenue = orders
    .filter((o) => o.status !== "cancelled" && isSameDay(o.createdAt))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);
  const todayOrders = orders.filter((o) => isSameDay(o.createdAt)).length;
  const tableBookings = reservations.filter((r) => r.status !== "cancelled").length;
  const activeCustomers = new Set(orders.map((o) => String(o.userId)).filter(Boolean)).size;

  return { dailyRevenue, todayOrders, tableBookings, activeCustomers };
}

export function computeAnalytics(orders = []) {
  const nonCancelled = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = nonCancelled.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const completedOrders = orders.filter((o) => o.status === "completed").length;
  const avgOrderValue = nonCancelled.length ? totalRevenue / nonCancelled.length : 0;

  const monthlyRevenue = orders
    .filter((o) => o.status !== "cancelled" && isSameMonth(o.createdAt))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const customerCounts = {};
  orders.forEach((o) => {
    if (!o.userId) return;
    customerCounts[String(o.userId)] = (customerCounts[String(o.userId)] || 0) + 1;
  });
  const customerIds = Object.keys(customerCounts);
  const repeatCustomers = customerIds.filter((id) => customerCounts[id] > 1).length;
  const repeatRate = customerIds.length ? (repeatCustomers / customerIds.length) * 100 : 0;

  return { monthlyRevenue, completedOrders, avgOrderValue, repeatRate };
}

const CATEGORY_PALETTE = [
  "bg-brick-500",
  "bg-brass-500",
  "bg-olive-500",
  "bg-brick-300",
  "bg-brass-300",
  "bg-olive-300",
];

// Orders joined with the current menu by menuItemId — revenue per category.
export function computeCategoryStats(orders = [], menuItems = []) {
  const lookup = new Map(menuItems.map((item) => [String(item.id), item]));
  const categorySales = {};
  let total = 0;

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const menuItem = lookup.get(String(item.menuItemId));
      const category = menuItem?.category || "Other";
      const lineTotal = Number(item.lineTotal || 0);
      categorySales[category] = (categorySales[category] || 0) + lineTotal;
      total += lineTotal;
    });
  });

  return Object.entries(categorySales).map(([category, sales], index) => ({
    category,
    sales,
    share: total ? Math.round((sales / total) * 100) : 0,
    color: CATEGORY_PALETTE[index % CATEGORY_PALETTE.length],
  }));
}