import MainLayout from "@/layouts/MainLayout";
import { RootLayout } from "@/layouts/RootLayout";
import { SideLayout } from "@/layouts/SideLayout";
import { ComingSoonPage } from "@/pages/coming-soon-page/ComingSoonPage";
import { AdminLandingPage } from "@/pages/landing-page/AdminLandingPage";
import { LandingPage } from "@/pages/landing-page/LandingPage";
import { LogoutPage } from "@/pages/logout-page/LogoutPage";
import { NotFoundPage } from "@/pages/not-found-page/NotFoundPage";
import { SettingsPage } from "@/pages/settings-page/SettingsPage";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    errorElement: <NotFoundPage></NotFoundPage>,
    children: [
      {
        element: <MainLayout></MainLayout>,
        children: [
          {
            index: true,
            element: <LandingPage></LandingPage>,
          },
          {
            path: "logout",
            element: <LogoutPage></LogoutPage>,
          },
          {
            path: "admin",
            element: <SideLayout></SideLayout>,
            children: [
              {
                index: true,
                element: <AdminLandingPage></AdminLandingPage>,
              },
              {
                path: "settings",
                element: <ComingSoonPage></ComingSoonPage>,
              },
              {
                path: "collections",
                element: <ComingSoonPage></ComingSoonPage>,
              },
            ],
          },
          {
            path: "settings",
            element: <SettingsPage></SettingsPage>,
          },
          {
            path: "view/nfts",
            element: <ComingSoonPage></ComingSoonPage>,
          },
        ],
      },
    ],
  },
]);
