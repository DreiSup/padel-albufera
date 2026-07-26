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
| Medición | GTM + Consent Mode v2 + atribución propia de GCLID |
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

`localePrefix: "as-needed"` → el español no lleva prefijo. Además los **slugs
están traducidos** (`pathnames` en `src/i18n/routing.ts`): `/configurador` en
español, `/fr/configurateur` en francés, `/en/configurator` en inglés.

La landing de Google Ads para Francia es **`/fr/terrain-de-padel`** (la keyword
exacta), que es la propia página de servicio de pádel.

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
| `/api/lead-ref` | Route Handler | Dinámica (correcto) |
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
│   └── api/                    lead-ref · consent-log
├── components/
│   ├── ui/                     shadcn: accordion, button, sheet
│   ├── consent/                capa de consentimiento (§6.1)
│   ├── conversion/             WhatsAppLink · PhoneLink · PhoneNumber (§6.4)
│   ├── attribution/            captura de gclid (§6.2)
│   ├── configurador/           island 3D (§5)
│   ├── home/ service/ about/ proyectos/ contacto/
│   ├── site-header · site-footer · sticky-cta · service-page · icons
├── lib/
│   ├── consent/                storage · types · record
│   ├── attribution/            storage · types · use-attribution
│   ├── contact.ts              números por idioma (env) · placements
│   ├── structured-data.ts      JSON-LD tipado
│   ├── configurador/           engine · catalogo · estado · mensaje
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

## 6. Consentimiento, medición y atribución

### 6.1 Consentimiento: dos modos, conmutados por variable

Se decide con `NEXT_PUBLIC_CMP_ID`, sin tocar código.

**Sin CMP (por defecto).** Banner propio (`components/consent/`). Sin un sí
explícito **no se descarga nada** de Google: ni el contenedor. Más conservador
que lo que exige la CNIL, y ya conforme para lanzar en Francia.

**Con CMP externa (Axeptio/Didomi).** `ConsentDefaultScript` emite el
`consent default` restrictivo **inline en el `<head>`** —no con `next/script`:
`beforeInteractive` no garantiza precedencia sobre un script que inyecta la
propia CMP, y aquí el orden ES el requisito—. Lleva `wait_for_update: 500` y
`region` acotada a EEE + UK + Suiza. La CMP emite el `update`. El banner propio
se desactiva solo.

### Reglas que no son opinables

- **El orden de carga:** `consent default` (denegado) → CMP → `consent update`
  → contenedor. Nunca al revés.
- **`gtag` empuja el objeto `arguments`, no un array.** Con un array plano
  Google ignora los comandos de consentimiento en silencio.
- **Aceptar y rechazar comparten variante, tamaño y jerarquía** en el banner
  propio. Degradar el rechazo invalida el consentimiento (AEPD y CNIL).
- **Sin casillas premarcadas.** Cerrar no es consentir: no hay "X".

### 6.2 Atribución de campaña — el corazón del sistema

Con un ticket de 20.000 € y presupuesto ajustado, saber **qué keyword generó
cada obra** es el objetivo de todo esto.

```
Aterrizaje con ?gclid=…
   → AttributionTracker (hoja cliente, lee window.location.search en useEffect)
   → cookie pa_attr (90 d, SameSite=Lax) con gclid/utm + ref_code de 6 chars
   → POST /api/lead-ref → LEAD_WEBHOOK_URL (hoja de cálculo hoy, CRM mañana)
   → el ref_code viaja en el mensaje de WhatsApp
```

- **Se lee `window.location.search`, NO `useSearchParams`.** Con
  `useSearchParams` Next exige un límite de Suspense y saca la página del
  prerenderizado. El componente no renderiza nada, así que el SSG queda intacto.
- **Código de referencia sin caracteres ambiguos** (`ABCDEFGHJKMNPQRSTUVWXYZ23456789`):
  se dicta por teléfono y se teclea a mano en una hoja.
- **Criterio: último clic no directo gana** (el modelo de GA4). Navegar dentro
  del sitio no sobrescribe; solo una llegada nueva con parámetros de campaña.
- **El `ref_code` NO se regenera al reatribuir**: si el visitante ya mandó un
  WhatsApp con ese código, cambiarlo rompería el cruce en la hoja.
- El POST va con `sendBeacon` y **falla en silencio**: si el webhook está caído,
  el usuario no se entera y los CTA siguen funcionando.

### 6.3 Eventos

Los triggers de GTM se configuran contra estos nombres. **No los cambies sin
avisar a quien lleva Ads.**

| Evento | Cuándo | Parámetros |
|---|---|---|
| `page_view` | Cada vista, **incluida la inicial** | `page_path`, `page_title`, `locale`, `ref_code` |
| `whatsapp_click` | Clic en cualquier WhatsApp | `ref_code`, `placement`, `page_path`, `locale` |
| `phone_click` | Clic en cualquier teléfono | `ref_code`, `placement`, `page_path`, `locale` |
| `formulario_whatsapp` | Envío de formulario | + `tipo_proyecto` |
| `configurador_interaccion` | Primer cambio en el 3D | — |

⚠️ **`page_view` es manual y cubre TODAS las vistas.** Hay que **desactivar el
`page_view` automático de la etiqueta de configuración de GA4** en GTM o cada
vista inicial se contará dos veces.

### 6.4 Componentes de conversión

Única forma de enlazar a WhatsApp o al teléfono en toda la web:

| Componente | Qué hace |
|---|---|
| `conversion/whatsapp-link.tsx` | URL `wa.me` con el número del idioma activo, mensaje traducido y `ref_code` |
| `conversion/phone-link.tsx` | `tel:` con el número del idioma activo |
| `conversion/phone-number.tsx` | El número **visible**, como texto |

Los números salen de variables de entorno por idioma (`lib/contact.ts`).

**El teléfono se renderiza SIEMPRE desde estos componentes**, y el nodo lleva la
clase `js-phone-number` (`PHONE_DNI_CLASS`) para que la sustitución dinámica de
número de Google Ads pueda actuar. Un `tel:` escrito a mano en otro sitio queda
fuera del informe de llamadas.

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
- El throttling de `/api/lead-ref` y `/api/consent-log` es un `Map` en memoria:
  en serverless cada instancia tiene el suyo. Frena abuso trivial, no un ataque
  distribuido.
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
- **DESACTIVAR el `page_view` automático de la etiqueta de configuración de
  GA4.** Esta web lo emite manualmente en todas las vistas, incluida la
  inicial. Si se deja activo, cada vista inicial se cuenta dos veces.
- Crear el activador para `whatsapp_click` y `phone_click`, y pasar `ref_code`
  y `placement` como parámetros del evento de conversión de Google Ads.
- Si se usan números de desvío: la sustitución dinámica debe apuntar a los nodos
  con la clase `js-phone-number`.
- Revisar la vista general de consentimiento para detectar etiquetas sin
  comprobación.

---

## 11. Verificar la capa de consentimiento

**Rechazando todo:** en la pestaña Red no debe haber ni una petición a
`googletagmanager.com`, `google-analytics.com`, `connect.facebook.net` ni
`facebook.com`. En Application → Cookies solo debe existir `cc_consent` (y
`NEXT_LOCALE`). `window.dataLayer` y `window.fbq` no deben existir. La web
tiene que seguir siendo totalmente navegable.

**Aceptando todo:** Tag Assistant debe mostrar el `consent default` (denied)
seguido del `consent update` (granted), en ese orden. Navegar a otra ruta
genera **un solo** `page_view` en el dataLayer, con su `page_path` y su
`ref_code`. Un clic en WhatsApp genera un `whatsapp_click` con `placement`.

**Consentimiento parcial (analítica sí, marketing no):** GTM carga, GA4 mide,
`ad_storage` en `denied` y `ads_data_redaction` en `true`.

**Revocación:** desde el pie, borra las cookies de terceros y recarga; el
estado resultante es idéntico al de un usuario que rechaza por primera vez.

Subir `policyVersion` en `consent.config.ts` hace reaparecer el banner a todo
el mundo.

**Atribución:** entra con `?gclid=TEST123`. En Application → Cookies debe
aparecer `pa_attr` con el `gclid` y un `ref` de 6 caracteres. El botón de
WhatsApp debe llevar ese código en el mensaje. `npm run build` debe seguir
marcando las rutas de marketing como `●`.

> Un estado verde en Tag Assistant **no** confirma que el consentimiento
> funcione: solo que la etiqueta existe y dispara. La verificación real es la
> lista de arriba.

---

## 12. Reutilizar la capa de consentimiento en otro proyecto

Copiar `src/consent.config.ts`, `src/lib/consent/`, `src/components/consent/`,
`src/app/api/consent-log/` y `src/types/global.d.ts`.

Para llevarte también la atribución de campaña: `src/lib/attribution/`,
`src/components/attribution/` y `src/app/api/lead-ref/`.

Después tocar **solo**:

1. `consent.config.ts` — nombre de cookie, vigencia, versión de política y
   rutas legales.
2. Las variables de entorno.
3. El namespace `consent` de los ficheros de mensajes (o sustituir `next-intl`
   por literales si el proyecto es monoidioma).

Cero dependencias externas: el switch es un `<button role="switch">` propio y
el hashing usa `node:crypto`.
