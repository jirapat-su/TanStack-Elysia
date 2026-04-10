import { Button } from "@repo/shadcn/components/Button";
import React, { useCallback } from "react";
import { locales, setLocale } from "@/paraglide/runtime";

const localeLabels: Record<string, string> = {
  en: "EN",
  th: "TH",
};

const LocaleSwitcher = React.memo(function LocaleSwitcher() {
  const handleLocaleChange = useCallback((locale: (typeof locales)[number]) => {
    setLocale(locale);
    window.location.reload();
  }, []);

  return (
    <div className="flex items-center gap-1">
      {locales.map((locale) => (
        <Button
          key={locale}
          variant="ghost"
          size="xs"
          onClick={() => handleLocaleChange(locale)}
          className="font-semibold"
        >
          {localeLabels[locale] ?? locale}
        </Button>
      ))}
    </div>
  );
});

LocaleSwitcher.displayName = "LocaleSwitcher";

export default LocaleSwitcher;
