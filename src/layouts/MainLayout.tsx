import { Topbar } from "@/components/navigation/Topbar";
import Footer from "@/components/shared/footer";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="h-svh flex flex-col">
      <Topbar></Topbar>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer></Footer>
    </div>
  );
}
