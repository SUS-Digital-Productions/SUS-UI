import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "react-router";

export const RootLayout = () => {
  return (
    <div className="h-full w-full flex flex-col">
      <main className="flex-1">
        <Outlet></Outlet>
        <Toaster position="top-center"></Toaster>
      </main>
    </div>
  );
};
