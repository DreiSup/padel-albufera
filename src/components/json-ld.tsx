import type { JsonLd } from "@/lib/structured-data";

// Inyecta JSON-LD en el HTML servido. Server Component: cero JavaScript de
// cliente, el marcado ya viene en la respuesta que lee el rastreador.
export function JsonLdScript({ data }: { data: JsonLd | JsonLd[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify escapa lo que hace falta; el "<" se neutraliza para que
      // un texto con etiquetas no pueda cerrar el <script> antes de tiempo.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
