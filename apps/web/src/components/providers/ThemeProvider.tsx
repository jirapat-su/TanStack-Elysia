import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

type Theme = "light" | "dark" | "system";

const COOKIE_NAME = "theme";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const readCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
};

const writeCookie = (name: string, value: string, maxAge: number) => {
  if (typeof document === "undefined") return;
  // biome-ignore lint/suspicious/noDocumentCookie: SSR-compatible cookie persistence for theme
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const getInitialTheme = (): Theme => {
  const value = readCookie(COOKIE_NAME);
  if (value === "light" || value === "dark" || value === "system") return value;
  return "system";
};

const resolveTheme = (theme: Theme): "light" | "dark" => {
  if (theme !== "system") return theme;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const themeStore = new Store<{ theme: Theme; resolved: "light" | "dark" }>({
  theme: getInitialTheme(),
  resolved: resolveTheme(getInitialTheme()),
});

const applyTheme = (resolved: "light" | "dark") => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", resolved === "dark");
};

export const setTheme = (theme: Theme) => {
  const resolved = resolveTheme(theme);
  themeStore.setState(() => ({ theme, resolved }));
  applyTheme(resolved);
  writeCookie(COOKIE_NAME, theme, COOKIE_MAX_AGE);
};

export const useTheme = () => useStore(themeStore, (s) => s.theme);

export const useResolvedTheme = () => useStore(themeStore, (s) => s.resolved);

export const initThemeListener = () => {
  if (typeof window === "undefined") return;

  applyTheme(themeStore.state.resolved);

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", () => {
    const current = themeStore.state;
    if (current.theme !== "system") return;
    const resolved = resolveTheme("system");
    themeStore.setState(() => ({ ...current, resolved }));
    applyTheme(resolved);
  });
};
