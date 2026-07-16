import type { Locale } from "@/i18n/routing";

export function formatPrice(locale: Locale, amount: number, prefix: string): string {
  let number: string;
  if (locale === "en") {
    number = `€${amount.toLocaleString("en-US")}`;
    return `${prefix} ${number}`;
  }
  if (locale === "fr") {
    number = `${amount.toLocaleString("fr-FR").replace(/ | /g, " ")} €`;
  } else if (locale === "de") {
    number = `${amount.toLocaleString("de-DE")} €`;
  } else if (locale === "nl") {
    number = `€ ${amount.toLocaleString("nl-NL")}`;
  } else {
    number = `${amount.toLocaleString("es-ES")} €`;
  }
  return `${prefix} ${number}`;
}
