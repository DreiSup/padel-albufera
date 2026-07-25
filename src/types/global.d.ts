// Declaraciones globales de los objetos que inyectan los scripts de terceros.
// Centralizadas aquí para que no haya dos `declare global` del mismo campo con
// tipos distintos (TypeScript las fusiona y falla si discrepan).

export {};

declare global {
  interface Window {
    /** Cola de GTM. Acepta objetos de evento y el objeto `arguments` de gtag. */
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: {
      (...args: unknown[]): void;
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      push?: unknown;
      loaded?: boolean;
      version?: string;
    };
    _fbq?: Window["fbq"];
  }
}
