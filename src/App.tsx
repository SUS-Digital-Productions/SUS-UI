import { RouterProvider } from "react-router";
import { SessionProvider } from "./providers/SessionProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import { APP_THEME_STORAGE_KEY, ZINC_DARK_THEME } from "./utils/constants";
import { router } from "./providers/RouterProvider";
import { GreymassProvider } from "./providers/GreymassProvider";
import { AtomicProvider } from "./providers/AtomicProvider";

function App() {
  return (
    <ThemeProvider
      defaultTheme={ZINC_DARK_THEME}
      storageKey={APP_THEME_STORAGE_KEY}
    >
      <GreymassProvider>
        <AtomicProvider>
          <SessionProvider>
            <RouterProvider router={router}></RouterProvider>
          </SessionProvider>
        </AtomicProvider>
      </GreymassProvider>
    </ThemeProvider>
  );
}

export default App;
