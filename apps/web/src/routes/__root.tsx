import { Button } from "@repo/shadcn/components/Button";
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { initThemeListener } from "@/components/providers/ThemeProvider";
import { getLocale } from "@/paraglide/runtime";
import appCss from "@/styles.css?url";

type MyRouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "My App" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootLayout,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-20 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-muted-foreground">Page not found.</p>
      <Button asChild className="mt-6">
        <Link to="/">Go Home</Link>
      </Button>
    </main>
  );
}

const THEME_SCRIPT = `(function(){var m=document.cookie.match(/(?:^|; )theme=([^;]*)/);var t=m&&m[1];var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme:dark)").matches);if(d)document.documentElement.classList.add("dark")})()`;

function ThemeScript() {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: blocking script to prevent dark mode flash
  // biome-ignore lint/style/useNamingConvention: __html is a React API
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}

function RootLayout() {
  useEffect(() => {
    initThemeListener();
  }, []);

  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <HeadContent />
      </head>
      <body className="bg-background text-foreground antialiased">
        <Header />
        <Outlet />
        <Footer />
        {import.meta.env.DEV && (
          <TanStackRouterDevtools position="bottom-right" />
        )}
        <Scripts />
      </body>
    </html>
  );
}
