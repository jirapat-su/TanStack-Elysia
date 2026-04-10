import { Link } from "@tanstack/react-router";
import React from "react";
import * as m from "@/paraglide/messages";
import LocaleSwitcher from "./LocaleSwitcher";
import ThemeToggle from "./ThemeToggle";

const Header = React.memo(function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 px-4 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-5xl items-center gap-4 py-3 sm:py-4">
        <Link
          to="/"
          className="text-base font-semibold tracking-tight text-foreground no-underline"
        >
          {m.common_app_name()}
        </Link>

        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link
            to="/"
            className="text-muted-foreground transition hover:text-foreground"
            activeProps={{
              className: "text-foreground transition hover:text-foreground",
            }}
          >
            {m.nav_home()}
          </Link>
          <Link
            to="/about"
            className="text-muted-foreground transition hover:text-foreground"
            activeProps={{
              className: "text-foreground transition hover:text-foreground",
            }}
          >
            {m.nav_about()}
          </Link>
          <Link
            to="/example"
            className="text-muted-foreground transition hover:text-foreground"
            activeProps={{
              className: "text-foreground transition hover:text-foreground",
            }}
          >
            {m.nav_example()}
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </nav>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
