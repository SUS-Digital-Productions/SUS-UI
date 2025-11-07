import { Outlet } from "react-router";

export function MarketplaceLayout() {
  return (
    <div className="w-full flex">
      {/* Filters Sidebar - Fixed width, not constraining main content */}
      <aside className="hidden xl:block w-64 2xl:w-72 3xl:w-80 shrink-0 px-4 py-4">
        <div className="sticky top-20 space-y-4">
          {/* Filter components will go here */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Filters</h3>
            <p className="text-sm text-muted-foreground">Coming soon...</p>
          </div>
        </div>
      </aside>

      {/* Main Content - Takes remaining width */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
