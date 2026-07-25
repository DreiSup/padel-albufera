# Arquitectura del proyecto

Referencia técnica de `padel-albufera`. Léela antes de tocar código: describe
cómo está montado el proyecto de verdad, no cómo debería estar.

Las **reglas** viven en `CLAUDE.md` (qué se puede y qué no). Este documento es
el **mapa**: dónde está cada cosa, por qué está así y qué está roto.

Última revisión: julio 2026.

---

## 1. Qué es esto

Web de captación de leads de **Pavimentos Albufera S.L.** (Valencia): pavimentos
de hormigón y construcción de pistas de pádel y pickleball.

- **Ticket:** 20.000 € o más. Ciclo de venta de semanas o meses.
- **Conversión:** clic en WhatsApp o teléfono. Los formularios no envían a un
  backend (no existe): componen un mensaje de WhatsApp con lo que el visitante
  ha rellenado y abren la conversación. Ver §8.1.
- **Tráfico:** mayoritariamente móvil y de pago (Google Ads, Meta Ads,
  click-to-WhatsApp). El visitante llega en frío desde un anuncio.
- **Mercados:** España primero. Francia es la prioridad de expansión, después
  Bélgica y Alemania. De ahí el multiidioma.

---

## 2. Stack

| | |
|---|---|
| Framework | Next.js **16.2.10** (App Router, Turbopack) |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS v4 (`@import "tailwindcss"`, sin `tailwind.config`) |
| Componentes | shadcn/ui (copiados al repo: `accordion`, `button`, `sheet`) |
| i18n | next-intl v4 |
| 3D | Three.js 0.185 (**solo** en `/configurador`) |
| Medición | GTM + Meta Pixel + Conversions API, tras consentimiento |
| Despliegue | Vercel |

**Next.js 16 no es el Next que conoces.** Hay cambios que rompen respecto a
versiones anteriores. Antes de escribir código consulta
`node_modules/next/dist/docs/` — la documentación viene instalada con el
paquete. Detalles que ya han mordido:

- `params` es una **Promise**: `const { locale } = await params`.
- `cookies()` y `headers()` de `next/headers` son **async**.
- `ssr: false` en `next/dynamic` **solo** funciona dentro de un Client
  Component. En un Server Component da error.
- Un `route.ts` solo puede exportar verbos HTTP y config. Exportar cualquier
  otra función rompe el build.
- El build con Turbopack **no imprime los tamaños por ruta**. Para medir hay
  que usar `npm run analyze` o inspeccionar `.next/static/chunks`.

---

## 3. Rutas

Todas bajo `src/app/[locale]/`. Locales activos: **`es` (por defecto), `fr`,
`en`**. `de` y `nl` están desactivados en `src/i18n/routing.ts` pero conservan
sus ficheros de mensajes.

`localePrefix: "as-needed"` → el español no lleva prefijo: `/configurador`,
pero `/fr/configurador`.

| Ruta | Fichero | Estado |
|---|---|---|
| `/` | `page.tsx` | SSG |
| `/padel` | `padel/page.tsx` → `service-page.tsx` | SSG |
| `/pickleball` | `pickleball/page.tsx` → `service-page.tsx` | SSG |
| `/configurador` | `configurador/page.tsx` | SSG + island 3D |
| `/proyectos` | `proyectos/page.tsx` | SSG |
| `/proceso` | `proceso/page.tsx` | SSG |
| `/como-se-construye` | `como-se-construye/page.tsx` | SSG |
| `/sobre-nosotros` | `sobre-nosotros/page.tsx` | SSG |
| `/contacto` | `contacto/page.tsx` | SSG |
| `/politica-cookies` | `politica-cookies/page.tsx` | SSG |
| `/politica-privacidad` | `politica-privacidad/page.tsx` | SSG |
| `/sitemap.xml` · `/robots.txt` | `sitemap.ts` · `robots.ts` | Estáticos |
| `/api/meta-capi` | Route Handler | Dinámica (correcto) |
| `/api/consent-log` | Route Handler | Dinámica (correcto) |

**Regla dura:** las rutas de marketing son estáticas y deben seguir siéndolo.
En el build tienen que salir con `●`. Nada de `cookies()`, `headers()` ni
`searchParams` en un `page.tsx`. Los dos Route Handlers salen `ƒ` y eso es
correcto: son API, no páginas.

`src/proxy.ts` contiene el middleware de next-intl (en Next 16 el fichero se
llama `proxy.ts`, no `middleware.ts`).

---

## 4. Estructura de `src/`

```
src/
├── app/[locale]/…              rutas (Server Components, todas estáticas)
│   └── api/                    meta-capi · consent-log
├── components/
│   ├── ui/                     shadcn: accordion, button, sheet
│   ├── consent/                capa de consentimiento (§6)
│   ├── configurador/           island 3D (§5)
│   ├── home/ service/ about/ proyectos/ contacto/
│   ├── site-header · site-footer · sticky-cta · service-page · icons
├── lib/
│   ├── consent/                storage · types · record
│   ├── configurador/           engine · catalogo · estado · mensaje
│   ├── meta/                   track · hash
│   ├── site.ts                 teléfono, WhatsApp, rutas de navegación
│   ├── image-blur.ts           mapa de blurDataURL
│   └── analytics.ts            pushEvento al dataLayer
├── i18n/                       routing · request · navigation
├── types/global.d.ts           Window.dataLayer / gtag / fbq
├── consent.config.ts           configuración de la capa de consentimiento
└── proxy.ts                    middleware de next-intl
```

**Convención de client components:** `"use client"` solo en hojas. Ningún
`page.tsx` ni `layout.tsx` lo lleva, y así debe seguir. Las páginas son Server
Components que pasan contenido servido a islands interactivos.

---

## 5. El configurador 3D (`/configurador`)

La pieza más compleja. Es una landing de conversión, no una demo técnica.

### Excepción de peso, documentada

Three.js **no entra** en el presupuesto de 150 KB de JS. Es una excepción
acotada a esta ruta:

- Entra por npm y se carga con **`import()` dinámico dentro de un `useEffect`**
  (`configurador-3d.tsx`), no con `next/dynamic`.
- Acaba en **un único chunk diferido de ~145 KB gzip**, ausente de todos los
  manifiestos de entrada. Verificado: ninguna otra ruta lo arrastra.
- Comprobar tras cualquier cambio:
  ```bash
  grep -rl "ACESFilmicToneMapping" .next/static/chunks | wc -l   # debe dar 1
  ```

### Reparto de responsabilidades

| Fichero | Qué hace |
|---|---|
| `lib/configurador/engine.ts` | Motor Three.js. **Sin React, sin DOM de interfaz, sin español.** Recibe canvas + estado, expone `applyChange` / `setView` / `setNight` / `setQuality` / `dispose`. |
| `lib/configurador/catalogo.ts` | Solo estructura: ids, hex, qué grupo invalida cada control. Cero texto. |
| `lib/configurador/estado.ts` | Tipo del estado + serialización a query string. |
| `lib/configurador/mensaje.ts` | Ficha técnica y mensaje de WhatsApp desde el estado. |
| `components/configurador/configurador-3d.tsx` | El island: estado React, monta el motor, eventos, URL. |

Los textos del catálogo viven en `messages/*.json` bajo `configurator.cat.*`.
**No metas español en la capa 3D**: Francia es el siguiente mercado.

### Decisiones que no hay que rediscutir

- **Renderizado bajo demanda**, no bucle continuo.
- **Reconstrucción quirúrgica**: cada control declara qué grupos invalida
  (`afecta` en el catálogo). Cambiar el RAL recolorea; cambiar de versión
  rehace solo el cerramiento.
- **Texturas procedurales** generadas en `<canvas>`, cacheadas por clave
  (`color|fibra|altura|modalidad`) y a media resolución en táctil. Regenerarlas
  sin caché era el mayor riesgo de INP.
- **Dos rutas de calidad**: `transmission` real solo donde la GPU aguanta,
  detectado por capacidades y no por user-agent.
- **El LCP lo marca un póster** (`next/image` + `priority`), nunca el canvas.
- **Teardown completo** en `dispose()`. Si se toca el motor, verificar entrando
  y saliendo de la ruta 10 veces sin que crezca la memoria.

### Especificaciones reglamentarias — no las cambies

20 × 10 m (dobles) o 20 × 6 m (individual) · cristal de fondo de 3 m rematado
con malla hasta 4 m · laterales escalonados · líneas de saque a 6,95 m · red de
10 m con curvatura real (0,88 m centro / 0,92 m laterales) · cristal templado
10 o 12 mm · solera de hormigón armado ≥ 15 cm.

**La solera siempre va incluida y destacada.** Es el argumento de venta que
separa a esta empresa de un montador de kits.

---

## 6. Consentimiento y medición

**Consent Mode BÁSICO.** Sin consentimiento **no se descarga nada** de Google
ni de Meta. No es que carguen y no midan: no se piden.

Se eligió básico y no avanzado a propósito: el modelado de conversiones de
Google exige ~700 clics de anuncio en 7 días y el conductual de GA4 ~1.000
eventos diarios denegados. Este cliente no llega, así que el modo avanzado solo
aportaría exposición legal sin beneficio.

### Flujo

```
ConsentProvider  ← lee la cookie cc_consent
   ├─ sin cookie ─────► CookieBanner (no se carga NADA de terceros)
   ├─ analitica||marketing ─► GtmLoader
   │      consent default (denied) → consent update → gtm.start → inyecta GTM
   ├─ marketing ──────► MetaPixel (fbq init + PageView)
   └─ siempre ────────► RouteChangeTracker (spa_page_view / fbq PageView)

Conversión → mismo eventId → fbq('track', …, {eventID}) + POST /api/meta-capi
                                          el servidor RELEE la cookie
```

### Reglas que no son opinables

- **El orden de carga es obligatorio:** `consent default` (todo denegado) →
  `consent update` → y solo entonces inyectar el contenedor.
- **`gtag` empuja el objeto `arguments`, no un array.** Con un array plano
  Google ignora los comandos de consentimiento en silencio.
- **Aceptar y rechazar comparten variante, tamaño y jerarquía.** Degradar el
  rechazo a `ghost` o a un enlace invalida el consentimiento (criterio AEPD y
  CNIL). Hay un comentario en el código para que nadie lo "mejore".
- **Sin casillas premarcadas**: `analitica` y `marketing` arrancan en `false`.
- **Cerrar no es consentir.** No hay "X" de cierre en el banner.
- **El servidor nunca se fía del cliente.** `/api/meta-capi` relee `cc_consent`
  con `cookies()` y responde 204 si no hay marketing.
- **El píxel va en React, no en GTM.** Dentro de GTM se pierde el control del
  `eventID` y Meta cuenta cada conversión dos veces.
- **`event_id` y `event_name` idénticos** en píxel y CAPI, o no hay
  deduplicación.
- **El token de la CAPI jamás lleva prefijo `NEXT_PUBLIC_`.**

### Eventos

| Evento | Cuándo | Dónde está |
|---|---|---|
| `configurador_interaccion` | primer cambio de opción | `configurador-3d.tsx` |
| `whatsapp_click` | clic en WhatsApp del configurador | `configurador-3d.tsx` |
| `telefono_click` | clic en llamar del configurador | `configurador-3d.tsx` |
| `spa_page_view` | navegación cliente posterior | `route-change-tracker.tsx` |
| `formulario_whatsapp` | envío de cualquier formulario | `lead-form.tsx` · `contacto/form.tsx` |

**Todos** los CTA de WhatsApp y teléfono miden, vía `components/contact-link.tsx`,
que además envía `Contact` a Meta (píxel + CAPI) si hay consentimiento de
marketing. El parámetro `origen` distingue desde dónde se convirtió
(`barra_fija`, `cabecera`, `pie`, `home`, `servicio`, `proceso`…).

### Variables de entorno

Ver `.env.example`. `NEXT_PUBLIC_GTM_ID` está configurado (`GTM-KDTKF4J6`);
faltan las de Meta. Sin valor, el cargador correspondiente simplemente no hace
nada — la web no se rompe.

**En Vercel hay que declararlas también**: `.env.local` no se sube al repo.

---

## 7. Rendimiento

### Presupuesto (móvil, campo, no Lighthouse de escritorio)

| Métrica | Objetivo |
|---|---|
| LCP | < 2,5 s |
| INP | < 200 ms |
| CLS | < 0,1 |
| JS por ruta | < 150 KB gzip (excepto `/configurador`) |

### Imágenes

Son el 80-90 % del peso. Estado actual: **23 ficheros, 5,9 MB en `/public`**,
todas ≤ 2400 px y < 500 KB. Cumplen.

Reglas en cada `<Image>`: `sizes` siempre (describiendo el ancho **en el
layout**, no el de la pantalla), `priority` solo en el hero de la página,
`placeholder="blur"` con `blurDataURL` de `lib/image-blur.ts`, `quality={70}`,
y contenedor con aspect-ratio reservado si se usa `fill`.

### Comandos de verificación

```bash
npm run build      # las rutas de marketing deben salir ●
npm run analyze    # informe de bundle por ruta
npx tsc --noEmit
npx eslint src
```

---

## 8. Problemas conocidos

Auditoría de julio de 2026, revisada tras la ronda de correcciones.

### 8.1 ✅ Formularios: resuelto, pero con una decisión pendiente

Los tres formularios (`lead-form.tsx` en home y servicios, `contacto/form.tsx`)
mostraban «te contactamos en 24 h» **sin enviar nada a ninguna parte**: no hay
backend. El lead se perdía y al usuario se le decía algo falso.

Ahora componen un mensaje de WhatsApp con todo lo rellenado y abren la
conversación. El lead llega, ya cualificado, por el canal que la empresa usa de
verdad, y el texto dice exactamente lo que va a pasar.

**Sigue sin haber endpoint de correo ni CRM.** Si algún día se quiere que el
lead entre también por email o a una hoja de cálculo, el punto de enganche es la
función `enviar()` de esos dos componentes.

### 8.2 ✅ Medición de conversiones: resuelto

Todos los enlaces de WhatsApp y teléfono pasan por
`components/contact-link.tsx`, que emite `whatsapp_click` / `telefono_click` al
dataLayer con el parámetro `origen`, y envía `Contact` a Meta (píxel + CAPI,
deduplicado) si hay consentimiento de marketing. Antes solo medía el
configurador, así que Ads y Meta optimizaban sobre una fracción de las
conversiones.

Los formularios emiten además `formulario_whatsapp` y un evento `Lead`.

### 8.3 ✅ FR y EN: traducidos

Los cinco ficheros de mensajes tienen ahora paridad total de claves y FR/EN
están traducidos de verdad, incluidos el configurador, la capa de
consentimiento y las páginas legales. `de` y `nl` siguen desactivados en
`routing.ts` y se mantienen sincronizados con el español como marcador.

**Conviene que un hablante nativo revise el francés antes de invertir en Ads en
Francia**: la traducción es correcta pero no la ha validado un profesional.

### 8.4 ✅ `sitemap.xml` y `robots.txt`: creados

`src/app/sitemap.ts` genera las 11 rutas con sus alternantes hreflang;
`src/app/robots.ts` apunta al sitemap y excluye `/api/`.

### 8.5 ✅ `metadataBase` y Open Graph: resuelto

El layout declara `metadataBase` con `SITE_URL` y una imagen Open Graph real.
Las 11 rutas × 3 idiomas llevan `canonical` y cuatro `hreflang` (es, fr, en,
x-default), centralizados en `lib/metadata.ts`.

⚠️ **`SITE_URL` está fijado a `https://www.padelalbufera.com`** en `lib/site.ts`.
Si el dominio real es otro, hay que cambiarlo ahí o definir
`NEXT_PUBLIC_SITE_URL`: si no, los enlaces canónicos y las miniaturas apuntarán
a un dominio equivocado.

### 8.6 🔴 Datos de empresa y contenido de relleno — REQUIERE AL CLIENTE

Visible en producción y **no se puede resolver desde el código**:

- `CIF B-00000000` y `C/ Dirección física, 00` en el pie y en las dos páginas
  legales. Inventar un CIF o una dirección sería falsear la identidad de una
  empresa real.
- `proyectos/gallery.tsx`: los ocho proyectos son de relleno («Club deportivo —
  nombre», ubicaciones y plazos inventados) y los testimonios están firmados por
  «Nombre Apellido · cargo, entidad». **Publicar reseñas inventadas no es solo un
  placeholder feo: es publicidad engañosa.**
- Las cifras de la home (17 años, +120 proyectos, garantía de 10 años) vienen del
  diseño original y nadie las ha confirmado.

Hace falta que el cliente aporte datos reales o que se retiren esas secciones.

### 8.7 🟠 Textos legales sin revisión profesional

`/politica-cookies` y `/politica-privacidad` están redactadas como punto de
partida y llevan un aviso visible que lo dice. La asesoría del cliente tiene que
revisarlas antes de publicar.

### 8.8 🟢 Menores pendientes

- Las escalas de `z-index` mezclan sintaxis (`z-45`, `z-[60]`, `z-70`).
  Mapa actual: cabecera 40 · barra CTA 45 · banner de cookies 50 · `sheet` 60 ·
  lightbox 70 · panel de preferencias 80.
- El throttling de `/api/meta-capi` es un `Map` en memoria: en serverless cada
  instancia tiene el suyo. Frena abuso trivial, no un ataque distribuido.
- El registro de consentimientos (`lib/consent/record.ts`) es un no-op: la
  interfaz está lista, falta la base de datos.

---

## 9. Checklist antes de dar por terminado un cambio

- [ ] ¿Las rutas de marketing siguen saliendo `●` en el build?
- [ ] ¿Cada `<Image>` nueva tiene `sizes`, `alt` descriptivo en español y
      aspect-ratio reservado?
- [ ] ¿Hay más de un `priority` **en la misma página**?
- [ ] ¿He metido `"use client"` en un `page.tsx` o `layout.tsx`?
- [ ] ¿He añadido alguna dependencia o script de terceros?
- [ ] ¿El CTA de WhatsApp sigue visible sin scroll en móvil, y el banner de
      cookies no lo tapa?
- [ ] ¿Sigue Three.js confinado a un único chunk?
- [ ] `npx tsc --noEmit` y `npx eslint src` en verde.

---

## 10. Configuración pendiente fuera del código

### En Vercel
- `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`,
  `META_CAPI_ACCESS_TOKEN`, `META_GRAPH_API_VERSION`, `CONSENT_IP_SALT`.

### En GTM
- Marcar el consentimiento incorporado de cada etiqueta: `analytics_storage`
  para GA4; `ad_storage` + `ad_user_data` para Google Ads.
- Crear el activador para el evento personalizado `spa_page_view`.
- Dejar activo el `page_view` automático de la etiqueta de configuración de
  GA4: cubre la carga inicial, y `spa_page_view` cubre solo las navegaciones
  posteriores. Desactivarlo obligaría a disparar también la primera vista a
  mano y es una fuente clásica de vistas duplicadas o perdidas.
- Revisar la vista general de consentimiento para detectar etiquetas sin
  comprobación.

### En Meta
- Generar el token de la CAPI en Gestor de Eventos → Configuración.
- Validar la deduplicación con `META_TEST_EVENT_CODE` y **vaciarlo después**:
  con ese código puesto, los eventos no cuentan como reales.

---

## 11. Verificar la capa de consentimiento

**Rechazando todo:** en la pestaña Red no debe haber ni una petición a
`googletagmanager.com`, `google-analytics.com`, `connect.facebook.net` ni
`facebook.com`. En Application → Cookies solo debe existir `cc_consent` (y
`NEXT_LOCALE`). `window.dataLayer` y `window.fbq` no deben existir. La web
tiene que seguir siendo totalmente navegable.

**Aceptando todo:** Tag Assistant debe mostrar el `consent default` (denied)
seguido del `consent update` (granted), en ese orden. Meta Pixel Helper debe
detectar **un solo** `PageView`. Navegar a otra ruta genera un `spa_page_view`
y un `PageView` de Meta, sin duplicados. Una conversión debe aparecer en el
Gestor de Eventos marcada como **deduplicada**.

**Consentimiento parcial (analítica sí, marketing no):** GTM carga, GA4 mide,
`ad_storage` en `denied`, el píxel **no** se carga y `/api/meta-capi` responde
204.

**Revocación:** desde el pie, borra las cookies de terceros y recarga; el
estado resultante es idéntico al de un usuario que rechaza por primera vez.

Subir `policyVersion` en `consent.config.ts` hace reaparecer el banner a todo
el mundo.

> Un estado verde en Tag Assistant **no** confirma que el consentimiento
> funcione: solo que la etiqueta existe y dispara. La verificación real es la
> lista de arriba.

---

## 12. Reutilizar la capa de consentimiento en otro proyecto

Copiar `src/consent.config.ts`, `src/lib/consent/`, `src/lib/meta/`,
`src/components/consent/`, `src/app/api/meta-capi/`, `src/app/api/consent-log/`
y `src/types/global.d.ts`.

Después tocar **solo**:

1. `consent.config.ts` — nombre de cookie, vigencia, versión de política y
   rutas legales.
2. Las variables de entorno.
3. El namespace `consent` de los ficheros de mensajes (o sustituir `next-intl`
   por literales si el proyecto es monoidioma).

Cero dependencias externas: el switch es un `<button role="switch">` propio y
el hashing usa `node:crypto`.
