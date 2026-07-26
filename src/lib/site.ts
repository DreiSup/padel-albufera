import type { AppPathname } from "@/i18n/routing";

// Dominio canónico. Necesario para metadataBase, sitemap y las URLs absolutas
// de Open Graph (sin él, al compartir por WhatsApp no sale miniatura).
// Se puede sobrescribir por entorno para previsualizaciones.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.padelalbufera.com";

// Los datos de contacto (números por idioma, waHref, placements) viven en
// src/lib/contact.ts y salen de variables de entorno. No los dupliques aquí.

export type NavKey = "home" | "padel" | "pickleball" | "configurator" | "construction" | "projects" | "process" | "about" | "contact";

export const NAV_ROUTES: { key: NavKey; href: AppPathname }[] = [
  { key: "home", href: "/" },
  { key: "padel", href: "/padel" },
  { key: "pickleball", href: "/pickleball" },
  { key: "configurator", href: "/configurador" },
  { key: "construction", href: "/como-se-construye" },
  { key: "projects", href: "/proyectos" },
  { key: "process", href: "/proceso" },
  { key: "about", href: "/sobre-nosotros" },
  { key: "contact", href: "/contacto" },
];

// Desktop navbar: only the routes that drive conversion are shown directly.
// The rest live under the "more" dropdown (see NavMoreMenu).
export const PRIMARY_NAV_ROUTES = NAV_ROUTES.filter((r) =>
  (["home", "padel", "pickleball", "contact"] as NavKey[]).includes(r.key)
);
export const MORE_NAV_ROUTES = NAV_ROUTES.filter((r) =>
  (["configurator", "construction", "projects", "process", "about"] as NavKey[]).includes(r.key)
);

// "de" and "nl" are temporarily disabled — re-add here (and in src/i18n/routing.ts) to bring them back.
export const LANGS: { code: "es" | "fr" | "en"; label: string; flag: string }[] = [
  { code: "es", label: "ES", flag: "🇪🇸" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
  { code: "en", label: "EN", flag: "🇬🇧" },
];
