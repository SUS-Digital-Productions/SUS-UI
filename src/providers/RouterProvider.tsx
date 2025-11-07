import { RootLayout } from "@/layouts/RootLayout";
import { MainLayout } from "@/layouts/MainLayout";
import { MarketplaceLayout } from "@/layouts/MarketplaceLayout";
import { AboutPage } from "@/pages/AboutPage";
import { CollectionsPage } from "@/pages/CollectionsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ViewNFTsPage } from "@/pages/ViewNFTsPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";
import { createBrowserRouter, RouterProvider as ReactRouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "about",
            element: <AboutPage />,
          },

          {
            path: "marketplace",
            element: <MarketplaceLayout />,
            children: [
              {
                index: true,
                element: <CollectionsPage />,
              },
              {
                path: "collections",
                element: <CollectionsPage />,
              },
            ],
          },
          {
            path: "collections",
            element: <CollectionsPage />,
          },
          {
            path: "view",
            element: <MarketplaceLayout />,
            children: [
              {
                path: "nfts",
                element: <ViewNFTsPage />,
              },
            ],
          },
          {
            path: "inventory",
            element: <ComingSoonPage />,
          },
          {
            path: "activity",
            element: <ComingSoonPage />,
          },
          {
            path: "watchlist",
            element: <ComingSoonPage />,
          },
          {
            path: "profile/:actor",
            element: <ComingSoonPage />,
          },
        ],
      },
    ],
  },
]);

export const RouterProvider = () => {
  return <ReactRouterProvider router={router} />;
};
