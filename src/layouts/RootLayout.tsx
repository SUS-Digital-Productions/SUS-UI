import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Outlet />
      <Toaster position="top-center" />
    </div>
  );
}
