import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "fr", "en", "de", "nl"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
