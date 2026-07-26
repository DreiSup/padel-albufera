# Pádel & Pickleball Albufera

Web de captación de leads de **Pavimentos Albufera S.L.** (Valencia): pavimentos
de hormigón y construcción de pistas de pádel y pickleball.

La conversión es un **clic en WhatsApp o en el teléfono**. No hay CRM: los leads
se gestionan en hoja de cálculo, cruzados por el código de referencia.

- **Reglas del proyecto** (qué se puede y qué no): `CLAUDE.md`
- **Mapa técnico** (cómo está montado y qué está roto): `ARQUITECTURA.md`

---

## Arrancar

```bash
npm install
cp .env.example .env.local     # y rellenar
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción. Las rutas de marketing deben salir `●` |
| `npm run analyze` | Informe de bundle por ruta (Turbopack no imprime tamaños) |
| `npx tsc --noEmit` | Comprobación de tipos |
| `npx eslint src` | Linter |

---

## Variables de entorno

Todas documentadas en `.env.example`. **En Vercel hay que declararlas también**:
`.env.local` no se sube al repo.

| Variable | Para qué | Si falta |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical, sitemap, Open Graph | Se usa `padelalbufera.com` |
| `NEXT_PUBLIC_GTM_ID` | Contenedor de GTM | GTM no se carga |
| `NEXT_PUBLIC_CMP_ID` | CMP externa (Axeptio/Didomi) | **Modo básico**: nada de Google hasta consentir |
| `NEXT_PUBLIC_CMP_SRC` | URL del SDK de la CMP | La CMP no se carga |
| `NEXT_PUBLIC_WHATSAPP_ES` / `_FR` | Número de WhatsApp por idioma | Cae al número español |
| `NEXT_PUBLIC_PHONE_ES` / `_FR` | Teléfono por idioma | Cae al número español |
| `LEAD_WEBHOOK_URL` | Destino de los registros de atribución | Cookie y código funcionan; no se registra |
| `CONSENT_IP_SALT` | Hash de IP en el registro de consentimientos | Hash reversible por fuerza bruta |

---

## Atribución de campaña (lo que hay que entender antes de tocar nada)

Con un ticket de 20.000 € y presupuesto ajustado en Google Ads, saber **qué
keyword generó cada obra** es el objetivo del sistema entero.

1. Al aterrizar, `AttributionTracker` lee `window.location.search` y captura
   `gclid`, `gbraid`, `wbraid` y los `utm_*`.
2. Los guarda en la cookie de primera parte `pa_attr` (90 días, `SameSite=Lax`)
   junto con un **código de referencia** de 6 caracteres, sin caracteres
   ambiguos (`K7QM4X`). Se dicta por teléfono, así que fuera `0/O` y `1/I/l`.
3. Envía el registro a `/api/lead-ref`, que lo reenvía a `LEAD_WEBHOOK_URL`.
4. Ese código viaja **en el mensaje de WhatsApp**. Al recibir el lead, se busca
   el código en la hoja y aparece la campaña, la keyword y la landing.

**Criterio de atribución: último clic no directo gana.** Es el modelo de GA4.
Si alguien llegó hace dos meses por una campaña y hoy vuelve por otra y pide
presupuesto, la venta es de la campaña de hoy. Navegar dentro del sitio no
sobrescribe nada; solo lo hace una llegada nueva con parámetros de campaña.
**El código NO se regenera al reatribuir**: si el visitante ya mandó un WhatsApp
con ese código, cambiarlo rompería el cruce.

---

## Eventos que llegan al dataLayer

Los triggers de GTM se configuran contra estos nombres. **No los cambies sin
avisar a quien lleva la cuenta de Ads.**

| Evento | Cuándo | Parámetros |
|---|---|---|
| `page_view` | Cada vista, incluida la inicial | `page_path`, `page_title`, `locale`, `ref_code` |
| `whatsapp_click` | Clic en cualquier WhatsApp | `ref_code`, `placement`, `page_path`, `locale` |
| `phone_click` | Clic en cualquier teléfono | `ref_code`, `placement`, `page_path`, `locale` |
| `formulario_whatsapp` | Envío de un formulario | + `tipo_proyecto` |
| `configurador_interaccion` | Primer cambio en el configurador 3D | — |

`placement` dice desde qué punto de la página se convirtió (`hero`, `sticky`,
`cabecera`, `footer`, `formulario`, `configurador`, `servicio`…), para poder ver
qué CTA funciona y mover el resto.

### ⚠️ Configuración obligatoria en GTM

**Desactiva el `page_view` automático de la etiqueta de configuración de GA4**
(«Enviar un evento de vista de página cuando se cargue esta configuración»).
Esta web emite `page_view` manualmente en todas las vistas, incluida la primera.
Si dejas el automático activo, **cada vista inicial se cuenta dos veces**.

El resto de la checklist de GTM está en `ARQUITECTURA.md` §10.

---

## Consentimiento: dos modos

Se conmuta con `NEXT_PUBLIC_CMP_ID`, sin tocar código.

**Sin CMP (por defecto).** Banner propio. Sin un sí explícito **no se descarga
nada** de Google: ni el contenedor. Es más conservador de lo que exige la CNIL y
ya es conforme para lanzar en Francia.

**Con CMP (Axeptio o Didomi).** El `consent default` restrictivo se emite
**inline en el `<head>`**, antes que la CMP y que GTM, con `wait_for_update: 500`
y `region` acotada a EEE + UK + Suiza. La CMP emite el `consent update`. El
banner propio se desactiva solo para que no haya dos.

Cómo verificarlo, en `ARQUITECTURA.md` §11.

---

## Idiomas y URLs

Locales activos: **es** (por defecto, sin prefijo), **fr**, **en**.

Los slugs están traducidos por idioma en `src/i18n/routing.ts`. La landing de
Google Ads para Francia es **`/fr/terrain-de-padel`**, que es la keyword exacta.

```
/padel   ·  /fr/terrain-de-padel   ·  /en/padel-court
/proyectos  ·  /fr/realisations    ·  /en/projects
```

`hreflang` y `canonical` se generan con `getPathname` de next-intl desde ese
mismo mapa (`src/lib/metadata.ts`). **Nunca los construyas a mano**: un solo
error en un clúster hreflang hace que Google ignore el clúster entero.

---

## Antes de dar por terminado un cambio

```bash
npx tsc --noEmit && npx eslint src && npm run build
```

- Las rutas de marketing tienen que salir `●` en el build.
- Three.js debe seguir en un único chunk:
  `grep -rl "ACESFilmicToneMapping" .next/static/chunks | wc -l` → `1`
- Sin consentimiento, cero referencias a `googletagmanager` en el HTML servido.
