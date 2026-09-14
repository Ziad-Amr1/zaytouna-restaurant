import AdminSidebarContent from "./AdminSidebarContent";

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-e border-border bg-card md:block">
      <AdminSidebarContent />
    </aside>
  );
}
