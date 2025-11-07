import { Topbar } from "@/components/navigation/Topbar";
import Footer from "@/components/shared/Footer";
import { Outlet } from "react-router";

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Topbar />
      <main className="flex-1 pt-14">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}