# SUS-UI AI Coding Agent Instructions

## Project Overview
SUS-UI is a React-based UI template for WAX blockchain applications featuring WharfKit integration, dynamic RPC/API switching, and a comprehensive component library built on Radix UI primitives. This is a frontend template designed to help developers build WAX dApps faster.

## Architecture & Provider Pattern

### Core Provider Stack (App.tsx)
The app uses a nested provider pattern with this exact order:
```tsx
QueryClientProvider → BlockchainNodeProvider → AtomicProvider → WaxSessionProvider → SidebarProvider → ThemeProvider → RouterProvider
```

### Context/Provider/Hook Pattern
Follow the established 3-file pattern for state management:
- **Context** (`src/contexts/`): Type definitions and createContext
- **Provider** (`src/providers/`): State logic and localStorage persistence  
- **Hook** (`src/hooks/`): Consumer hook with error boundaries

Example: `WaxSessionContext.ts` → `WaxSessionProvider.tsx` → `use-wax-session.ts`

## Form Handling System

### React Hook Form Integration
- Uses compound form components with context passing: `FormField` → `FormItem` → `FormControl`
- `useFormField()` hook provides field state, IDs, and error handling
- Form validation integrated with `aria-invalid` and `aria-describedby` attributes
- Error states automatically reflected in component styling via data attributes

## WAX Blockchain Integration

### WharfKit Session Management
- `sessionKitObject` in `WaxSessionContext.ts` configures wallet plugins (CloudWallet, Anchor, Wombat)
- Session restoration happens automatically on app load
- Always check `session?.actor` for user authentication state
- Use `useWaxSession()` hook, never access context directly
- App designed to work for both authenticated and non-authenticated users (template approach)

### Dynamic Endpoint Switching
- **Blockchain RPC**: `useBlockchainNode()` for WAX chain endpoints (default: `https://wax.greymass.com/v1`)
- **AtomicAssets API**: `useAtomic()` for NFT/marketplace data (default: `https://atomic-wax.tacocrypto.io`)
- Both persist to localStorage with keys `APP_SESSION_BLOCKCHAIN_NODE_KEY` and `APP_SESSION_ATOMIC_NODE_KEY`
- Runtime switching allows users to change endpoints without app restart

## Component Architecture

### UI Components (`src/components/ui/`)
- Built on Radix UI primitives with Tailwind styling
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- Component variants defined in `src/components/functions/` using `class-variance-authority`

### Navigation Components
- `Sidebar.tsx`: Conditional rendering based on `session` state
- `Topbar.tsx`: Global navigation with wallet connection status
- Use `useSidebar()` for responsive sidebar state management

## Styling & Theming

### Theme System
- Multi-theme support with 16 variants: zinc/green/blue/rose/red/violet/yellow/orange × light/dark
- ThemeProvider dynamically adds/removes CSS classes from document root
- Theme persistence via localStorage with `APP_THEME_STORAGE_KEY`
- Default theme: `ZINC_DARK_THEME`

### Tailwind Configuration
- Uses Tailwind CSS v4 with `@tailwindcss/vite` plugin
- Custom CSS variables for theme colors in component variants
- Focus states: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Aria validation: `aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`

## Routing & Layouts

### Router Structure
- `RootLayout`: Base layout with Topbar, Sidebar, and responsive design
- `MarketplaceLayout`: Nested layout for marketplace-specific pages
- File-based organization: pages in `src/pages/`, layouts in `src/layouts/`

### NavLink Pattern
```tsx
<NavLink
  to={item.href}
  className={({ isActive }) => cn(
    "base-classes",
    isActive ? "active-classes" : "inactive-classes"
  )}
>
```

## Development Workflows

### Build & Dev Commands
- `npm run dev`: Vite dev server on port 3000
- `npm run build`: TypeScript compilation + Vite build
- `npm install --force`: Required for dependency resolution

### File Structure Patterns
- **Absolute imports**: Use `@/` alias for `src/` directory
- **Component co-location**: Related types, contexts, and hooks grouped by feature
- **Constants centralization**: All app constants in `src/util/constants.ts`

## Component Variant System

### Class Variance Authority Pattern
- All component styling uses `cva()` from `class-variance-authority`
- Variants defined in `src/components/functions/` with consistent patterns:
  - Base classes with focus states, aria attributes, and transitions
  - Variant objects for different visual styles
  - Size variants for responsive design
  - `defaultVariants` object for fallback styling

### Accessibility Integration
- All variants include `focus-visible:ring-ring/50 focus-visible:ring-[3px]` for keyboard navigation
- Error states via `aria-invalid:ring-destructive/20` with dark mode variants
- Semantic data attributes: `data-[state=on]:bg-accent` for toggle states

## NFT & Asset Components

### Asset Display Pattern
- `Asset.tsx` component handles WAX NFT display with consistent structure
- Image fallback to `/placeholder-nft.png` on error
- External links to AtomicHub explorer: `https://wax.atomichub.io/explorer/asset/{mint}`
- Conditional rendering for template vs asset, selectable states

## Data Fetching Architecture

### TanStack Query Setup
- Minimal `QueryClient` setup in `src/util/query-client.ts`
- API methods go in `src/api/` as simple HTTP request handlers for use with TanStack Query
- Provider wraps entire app for global query state management

### API Integration Pattern
- Create methods in `src/api/` that return Promise-based HTTP requests
- Use these methods directly in TanStack Query hooks within components
- No complex API client - keep HTTP requests simple and focused

## Code Conventions

### State Management
- React Context for global state, TanStack Query for server state
- localStorage keys prefixed with `sus_app_`
- Error boundaries in custom hooks with descriptive error messages

### TypeScript Patterns
- Strict typing with interfaces for all context types
- Optional chaining for blockchain data: `session?.actor`
- Type exports from context files for provider props

### Component Patterns
- Functional components with hooks, no class components
- Props destructuring in component signatures
- Conditional rendering based on `session` state for authenticated features
- Simple error handling with toast notifications for blockchain API failures

## Key Files Reference
- **Entry**: `src/main.tsx` → `src/App.tsx`
- **Utils**: `src/lib/utils.ts` (cn function), `src/util/constants.ts`
- **Types**: Context files for TypeScript definitions
- **Styles**: Component variants in `src/components/functions/`
- **Config**: `vite.config.ts`, `package.json` for build setup