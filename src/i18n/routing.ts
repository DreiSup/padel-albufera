import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // "de" and "nl" are temporarily disabled — re-add here to bring them back.
  locales: ["es", "fr", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
