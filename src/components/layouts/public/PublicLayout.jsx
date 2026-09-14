import { Outlet } from "react-router-dom";

import Navbar from "@/components/layouts/public/Navbar";
import Footer from "@/components/layouts/public/Footer";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;
