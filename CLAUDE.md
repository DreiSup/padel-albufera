@AGENTS.md

# CLAUDE.md — Reglas del proyecto

## Contexto

Web de captación de leads para una empresa española de **pavimentos de cemento y construcción de pistas de pádel**.

- Stack: **Next.js (App Router) + TypeScript + Tailwind + shadcn/ui**, deploy en **Vercel**.
- Los leads entran por **WhatsApp y teléfono**, no por formulario. La conversión medible es el **clic** en esos botones.
- Tráfico mayoritariamente **móvil y de pago** (Google Ads / Meta Ads). Cada 100 ms de carga cuestan dinero real: el objetivo del proyecto es **conversión**, y la velocidad es parte del argumento.
- Las fotos de obra son el principal argumento de venta **y** el 80–90% del peso de la página.

**Prioridad al decidir cualquier cosa: conversión > velocidad > todo lo demás.**

---

## Presupuesto de rendimiento (no negociable)

Medido en campo (Vercel Speed Insights), móvil, no en Lighthouse de escritorio:

| Métrica | Objetivo |
|---|---|
| LCP | < 2,5 s |
| INP | < 200 ms |
| CLS | < 0,1 |
| JS de la ruta `/` | < 150 KB gzip |

Si un cambio empeora cualquiera de estos, no se hace sin avisarme antes.

### Excepción documentada: `/configurador`

La ruta `/configurador` (render 3D con Three.js) **no entra en los 150 KB**: Three.js
solo ya ronda esa cifra. Es una **excepción acotada a esa única ruta**:

- Three.js entra por npm (no CDN) y se carga **en diferido** (`import()` dinámico del
  motor dentro de un `useEffect`), fuera del bundle inicial y del hilo del LCP.
- El peso **no puede contaminar ninguna otra ruta**. Verificar con
  `npm run analyze` (bundle analyzer) que solo `/configurador` lo arrastra.
- El LCP de la ruta lo marca un **póster estático** (`next/image` + `priority`), no el canvas.
- El motor 3D vive en `src/lib/configurador/` (aislado de React y del DOM de la interfaz,
  sin español incrustado) y libera todo al desmontar (`dispose()`).

---

## Renderizado

- **Todas las páginas de marketing son estáticas (SSG).** Se sirven ya renderizadas desde el CDN.
- **No romper el SSG sin avisar.** Nada de `cookies()`, `headers()`, `searchParams` ni `fetch` sin caché en un `page.tsx` de marketing. Si algo lo exige, dímelo y lo discutimos antes de escribir código.
- **`"use client"` solo en las hojas del árbol** (un botón, un carrusel, un acordeón). Nunca en un `page.tsx` ni en un layout.
- **`next/dynamic` con `ssr: false`** para todo lo pesado y bajo el fold: mapa, lightbox de galería, embeds.

### Sobre los skeletons

El `Skeleton` de shadcn **no acelera nada**: es percepción, y solo aplica a contenido que llega después (fetch en cliente, `Suspense` con streaming).

- ❌ **Nunca** un skeleton en el hero ni en contenido estático. Retrasa el LCP y añade CLS.
- ✅ Solo si hay una carga real diferida (galería paginada, contenido de un CMS en cliente).
- Para imágenes, el equivalente correcto es **`placeholder="blur"`**, no un skeleton.

---

## Imágenes — las reglas que más importan

### Almacenamiento y preparación

- Los masters viven en `/public` (o `src/images/`) y se usan con **import estático**: `import hero from '@/images/hero.jpg'`. Esto da `width`/`height` automáticos (adiós CLS) y `blurDataURL` gratis.
- **Ningún archivo entra al repo sin pasar por el script de optimización** (`scripts/optimize-images.ts`): redimensionado a **≤2400 px** de ancho, EXIF eliminado, JPEG mozjpeg calidad 85, **peso <500 KB**.
- Formato de origen: **JPEG** (PNG solo si hay transparencia real). AVIF/WebP los genera Next al vuelo, no se guardan como master.
- **Nombres en kebab-case y con intención SEO local**: `pista-padel-panoramica-valencia.jpg`, nunca `IMG_4471.jpg`.
- Si detectas una imagen en el repo que incumple esto, **avísame en vez de arreglarla en silencio**.

### Uso de `<Image>`

Reglas de obligado cumplimiento en **cada** `<Image>`:

1. **`sizes` siempre**, describiendo el ancho **en el layout**, no el de la pantalla. Sin `sizes`, `fill` asume `100vw` y el móvil se baja la imagen de 1920 px para pintarla a 380. Es el error nº1.
2. **`priority` SOLO en la imagen del hero.** Una en toda la web. Nunca en galería.
3. **`placeholder="blur"`** en toda foto de galería o contenido.
4. **`fill` exige contenedor con aspect-ratio reservado** (`relative aspect-[4/3]`). Sin excepción.
5. **`alt` descriptivo y en español**, con intención SEO local. Nunca vacío ni genérico.
6. **`quality={70}`** por defecto para fotos de obra (el default de Next es 75; 65–70 es indistinguible y ahorra 20–30%).

Patrón de referencia:

```tsx
<Image
  src={obra}
  alt="Pista de pádel panorámica construida en Valencia"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  quality={70}
  placeholder="blur"
  className="object-cover"
/>
```

### Configuración

```js
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
}
```

---

## El hero

Es donde se decide la conversión y el LCP.

- ❌ **Nada de carrusel en el hero.** Carga N imágenes, mata el LCP y casi nadie pasa del primer slide.
- ❌ **Nada de vídeo de fondo** en la primera pantalla. Si se pide, póster estático + carga diferida.
- ✅ Una foto fija y potente: `priority`, `sizes="100vw"`, `quality={70}`, master ≤2000 px.
- ✅ Overlay con **degradado CSS**, nunca una segunda imagen encima.
- ✅ CTA de WhatsApp y teléfono visibles sin scroll.

---

## Scripts de terceros (GTM / GA4 / Meta) — zona roja

**GTM + GA4 + píxel de Meta cuestan 300–600 ms de main thread y son la causa nº1 de mal INP** en webs por lo demás perfectas. Se puede tener un LCP de 1,2 s y arruinarlo aquí.

- GTM se carga **exclusivamente** con `@next/third-parties` (`<GoogleTagManager gtmId="..." />`).
- **Consent Mode v2 va inline y ANTES de GTM**, en estado denegado por defecto. No se mete dentro de GTM.
- **No añadir ningún otro script de terceros sin preguntarme antes.** Ninguno. Ni chat, ni heatmap, ni A/B.
- Los eventos de conversión (`whatsapp_click`, `phone_click`) van por `dataLayer.push` desde el handler del botón, con parámetros de contexto (página y ubicación del botón).

---

## Fuentes

- `next/font` siempre (se self-hostea en build; **cero peticiones a Google**).
- `display: 'swap'`, subset `latin`, `preload` solo la fuente del hero.
- **Máximo 2 familias.** Si hace falta una tercera, pregúntame.

---

## Dependencias

- **shadcn/ui no penaliza**: son componentes copiados al repo, no una librería en runtime. Úsalo con libertad.
- `lucide-react`: importar iconos sueltos (`import { Phone } from 'lucide-react'`), nunca el paquete entero.
- **No instalar ninguna dependencia nueva sin pedirme permiso**, indicando su peso en bundle y por qué no vale hacerlo con CSS o con lo que ya hay.
- Carruseles de logos/testimonios: **CSS puro**. Nada de librerías de 40 KB para eso.

---

## Antes de dar por terminado cualquier cambio

Repasa y confírmame explícitamente:

- [ ] ¿Sigue siendo estática la página?
- [ ] ¿Cada `<Image>` nueva tiene `sizes`, `alt` y aspect-ratio reservado?
- [ ] ¿Hay más de un `priority` en la web?
- [ ] ¿He añadido JS al cliente que podría ser un server component?
- [ ] ¿He metido alguna dependencia o script de terceros?
- [ ] ¿Sigue el CTA de WhatsApp visible sin scroll en móvil?

Si algo de esto falla, dímelo en vez de seguir.
