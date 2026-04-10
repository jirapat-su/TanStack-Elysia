import React, { useMemo } from "react";
import * as m from "@/paraglide/messages";

const Footer = React.memo(function Footer() {
  const year = useMemo(() => new Date().getFullYear().toString(), []);

  return (
    <footer className="mt-20 border-t border-border px-4 pb-14 pt-10 text-muted-foreground">
      <div className="mx-auto max-w-5xl text-center text-sm">
        <p className="m-0">{m.common_copyright({ year })}</p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
