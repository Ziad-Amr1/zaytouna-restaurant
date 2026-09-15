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

export function computeCategoryStats(orders = [], menuItems = []) {
  const lookup = new Map(menuItems.map((item) => [String(item.id), item]));
  const categorySales = {};
  let total = 0;

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const menuItem = lookup.get(String(item.menuItemId));
      const category = menuItem?.category || "Other";
      const lineTotal = Number(item.lineTotal || (item.quantity * (menuItem?.price || 0)) || 0);
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

export function computeFullDashboardData(orders = [], menuItems = [], reservations = []) {
  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  
  const now = new Date();
  const thisMonthRevenue = orders
    .filter((o) => o.status !== "cancelled" && isSameMonth(o.createdAt, now))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthRevenue = orders
    .filter((o) => o.status !== "cancelled" && isSameMonth(o.createdAt, prevMonth))
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const growthPercent = lastMonthRevenue > 0
    ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    : thisMonthRevenue > 0 ? 100 : 0;

  // Last 7 days revenue trend
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    const dateKey = d.toISOString().split("T")[0];
    const dayOrders = orders.filter((o) => o.createdAt && o.createdAt.startsWith(dateKey));
    const revenue = dayOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
    return {
      dateKey,
      date: d,
      revenue,
      orders: dayOrders.length,
    };
  });

  // Status breakdown
  const statusCounts = { pending: 0, processing: 0, completed: 0, cancelled: 0 };
  orders.forEach((o) => {
    const st = o.status || "pending";
    statusCounts[st] = (statusCounts[st] || 0) + 1;
  });

  const totalOrders = orders.length;
  const ordersByStatus = [
    { id: "pending", count: statusCounts.pending, color: "hsl(38 92% 50%)", badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
    { id: "processing", count: statusCounts.processing, color: "hsl(217 91% 60%)", badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" },
    { id: "completed", count: statusCounts.completed, color: "hsl(142 71% 45%)", badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" },
    { id: "cancelled", count: statusCounts.cancelled, color: "hsl(0 84% 60%)", badgeClass: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" },
  ].map((item) => ({
    ...item,
    percent: totalOrders > 0 ? (item.count / totalOrders) * 100 : 0,
  }));

  // Top products calculation
  const menuLookup = new Map(menuItems.map((m) => [String(m.id), m]));
  const itemAggregation = {};

  orders.forEach((order) => {
    if (order.status === "cancelled") return;
    (order.items || []).forEach((item) => {
      const menuItem = menuLookup.get(String(item.menuItemId));
      const id = item.menuItemId || item.name;
      if (!itemAggregation[id]) {
        itemAggregation[id] = {
          id,
          name: menuItem?.name || item.name || `Item #${id}`,
          image: menuItem?.image || "",
          totalSold: 0,
          revenue: 0,
        };
      }
      const qty = Number(item.quantity || 1);
      const price = Number(menuItem?.price || item.price || 0);
      itemAggregation[id].totalSold += qty;
      itemAggregation[id].revenue += Number(item.lineTotal || (qty * price) || 0);
    });
  });

  const topProducts = Object.values(itemAggregation)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const activeCustomers = new Set(orders.map((o) => String(o.userId)).filter(Boolean)).size;
  const tableBookings = reservations.filter((r) => r.status !== "cancelled").length;

  return {
    totalRevenue,
    thisMonthRevenue,
    growthPercent,
    dailyRevenue: last7Days,
    totalOrders,
    pendingOrders: statusCounts.pending,
    ordersByStatus,
    topProducts,
    activeCustomers,
    tableBookings,
    recentOrders: [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
  };
}