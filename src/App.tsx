import "./App.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/query-client";
import { SidebarProvider } from "./providers/SidebarProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { APP_THEME_STORAGE_KEY, ZINC_DARK_THEME } from "./util/constants";
import { BlockchainNodeProvider } from "./providers/BlockchainNodeProvider";
import { AtomicProvider } from "./providers/AtomicProvider";
import { WaxSessionProvider } from "./providers/WaxSessionProvider";
import { RouterProvider } from "./providers/RouterProvider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BlockchainNodeProvider>
        <AtomicProvider>
          <WaxSessionProvider>
            <SidebarProvider>
              <ThemeProvider
                defaultTheme={ZINC_DARK_THEME}
                storageKey={APP_THEME_STORAGE_KEY}
              >
                <RouterProvider />
              </ThemeProvider>
            </SidebarProvider>
          </WaxSessionProvider>
        </AtomicProvider>
      </BlockchainNodeProvider>
    </QueryClientProvider>
  );
}

export default App;
