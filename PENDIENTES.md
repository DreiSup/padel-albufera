Pendientes del repositorio 
Lo que falta por hacer en el código. Nada más: las variables de entorno, la configuración de Vercel y de GTM y los datos que tiene que
aportar el cliente están al final, en §7, solo para que nadie los busque aquí. 
Las reglas viven en CLAUDE.md.
El mapa de cómo está montado el proyecto, en ARQUITECTURA.md.
Esto es la lista de trabajo. 
Última revisión: 2 de septiembre de 2026, sobre claude/padel-albufera-3d-render-h37oww @ 6c2f14e. 
BLUF. Quedan ocho tareas de código, y solo cuatro son bloqueantes antes de promocionar el deploy: el mapa de
redirecciones, dos defectos que publican URLs y miniaturas equivocadas, y un panel de consentimiento que no deja
rechazar. El resto de lo que falta en el proyecto no es desarrollo: son variables de entorno, un ajuste en Vercel y datos que
tiene que dar el cliente. 
⚠️ node_modules no está instalado en esta copia. Nada de lo medible (tsc, eslint, build, peso de chunks) se ha podido
comprobar. Los puntos 1.1 y 1.2 se quedan por eso en plausible, no en confirmado. 
 1. Bloqueantes antes de promocionar el deploy 
Los cuatro son de código y los cuatro hacen daño en producción el día que se promocione. 
1.1 No hay redirects() — 16 URLs cambian de dirección 
next.config.ts no tiene ninguna regla de redirección. Verificado: cero ocurrencias de redirects en el fichero. 
Hoy producción sirve /fr/padel, /fr/contacto, /en/proyectos... con 200. Al desplegar los slugs traducidos de src/i18n
routing.ts pasan a ser /fr/terrain-de-padel, /fr/contact, /en/projects, y nada recoge las viejas: 8 rutas publicadas × fr y
en. 
⚠️ Premisa sin verificar: no consta si next-intl devuelve 404 o redirige solo cuando le piden el slug interno bajo un locale prefijado. Si
lo redirige, esta tarea se encoge o desaparece. Hasta comprobarlo, asumir 404. 
i️ Y conviene dimensionarlo: esas 16 URLs viven en padel-albufera.vercel.app, un subdominio que nunca se anunció y que jamás
ha servido sitemap, canonical ni robots. El SEO acumulado está en el WordPress, no aquí. Esto es seguro barato, no una pérdida contra
reloj. El mapa de redirecciones que sí importa es WordPress → Next, y ese depende del traspaso del dominio. 
1.2 og:image se pierde en 21 páginas 
src/lib/metadata.ts:48 devuelve: 
openGraph: { title, description, url: rutaLocalizada(locale, ruta) },

Sin images. Next fusiona los metadatos de layout y página de forma superficial: un openGraph definido en la página reemplaza
entero el del layout, no lo completa. Así que las 7 rutas que usan metadataPagina (/, /padel, /pickleball, /proyectos, /proceso,
/sobre-nosotros, /contacto) × 3 idiomas = 21 páginas se quedan sin og:image, sin og:site_name, sin og:type y sin og:locale. 
Las 4 que solo usan alternatesDe (/configurador, /como-se-construye y las dos legales) heredan el openGraph del layout
intacto y no están afectadas. 
Por qué importa y no es cosmético: el propio comentario del layout dice que la imagen existe porque al compartir por WhatsApp —el
canal de conversión del negocio— si no, no aparece ni miniatura ni descripción. La home compartida por WhatsApp saldría sin foto. 
Arreglo: añadir images dentro de metadataPagina, o difundir el openGraph del layout. 
⚠️ Plausible, no confirmado. La forma del código sí está verificada; el comportamiento de fusión no se ha comprobado contra
node_modules/next/dist/docs/ porque no hay node_modules. Firma para verificarlo el día del build: esas páginas emiten
twitter:image pero no og:image — el bloque twitter del layout sí sobrevive, porque metadataPagina no lo toca. 
1.3 El JSON-LD de servicio se salta los slugs traducidos 
src/components/service-page.tsx:132 construye la URL a mano: 
const rutaServicio = `${locale === "es" ? "" : `/${locale}`}/${ns}`;
Es exactamente lo que prohíbe el comentario de src/lib/metadata.ts. En /fr/terrain-de-padel el resultado es incoherente:Pieza Cómo se genera Resultadocanonical getPathname() de next-intl ✅ .../fr/terrain-de-padelService.url (línea 137) a mano ❌ .../fr/padel, URL que no existiráBreadcrumbList (líneas 141-142) a mano ❌ ídem 
Lo mismo en inglés y en las dos rutas de servicio. 
Arreglo de una línea: usar rutaLocalizada(locale, "/padel"). 
1.4 El panel de preferencias no deja rechazar 
src/components/consent/preferences-modal.tsx:113-124: los dos botones son “Guardar” con variant="ghost" y “Aceptar
todo” con la variante destacada por defecto. No hay ningún botón de rechazar todo. 
Es el mismo patrón que el comentario de cookie-banner.tsx declara invalidante: 
“Requisito legal, no decisión de diseño... NO degradar el rechazo a variant="ghost" ni a un enlace: hacerlo convierte el
consentimiento en no válido.” 
El banner sí lo cumple —"Aceptar" y “Rechazar” comparten variant="outline", size="sm" y flex-1—; el panel que abre el enlace
del pie, no. Mercado objetivo: Francia, con la CNIL entre las autoridades más activas de la UE. 
Arreglo: añadir “Rechazar todo” y subir “Guardar” a una variante que no degrade la opción conservadora. 
 2. Falta escribir 
2.1 /aviso-legal no existe 
messages/es.json:312: 
© 2026 Pavimentos Albufera · <privacidad>Política de privacidad</privacidad> · Aviso legal · <cookies>Cookies</cookies>

“Política de privacidad” y “Cookies” son etiquetas ricas que src/components/site-footer.tsx convierte en <Link>. “Aviso legal” es
texto plano: no tiene etiqueta, no tiene enlace, no hay entrada en pathnames de src/i18n/routing.ts ni carpeta bajo src/app
[locale]/. Igual en francés y en inglés. 
Es mejor que enlazar a una página rota, pero el pie anuncia algo que no existe. Falta la ruta, el pathnames, el texto en los tres idiomas
y la etiqueta rica en footer.legal. 
2.2 Dos landings sin escribir 
Landing de venta residencial de lujo.
Landing de clubes y promotores. 
 3. Medición y atribución 
3.1 /api/consent-log no persiste nada 
src/lib/consent/record.ts: saveConsentRecord es un no-op deliberado — el comentario lo dice y explica por qué (no hay base
de datos en el proyecto). El Route Handler valida el origen, valida la forma del cuerpo y hashea la IP con SHA-256 +
CONSENT_IP_SALT... y ahí acaba. 
Consecuencia: no hay prueba de consentimiento (RGPD art. 7.1). La cookie no sirve como prueba: vive en el navegador del usuario y él
puede borrarla. 
La interfaz está lista para enchufar Postgres/Supabase sin tocar el Route Handler. Falta la base de datos y la escritura. 
3.2 Meta — solo si vuelve Click-to-WhatsApp 
El píxel y la CAPI se retiraron enteros en 6c2f14e (356 líneas, 5 ficheros), con el motivo escrito en el commit: “no Meta campaigns are
running”. No es una casilla que activar. Si Meta vuelve a ser canal:Reponer píxel + CAPI desde e3a2df6. Están en el historial.
Escribir de cero la captura de ctwa_clid. Nunca se instrumentó, en ninguna versión del repo: su única aparición es un
comentario en src/lib/analytics.ts:5. Lo que hubo en su día fue fbclid para reconstruir la cookie _fbc, que es otra cosa.
Sin ctwa_clid no se puede atribuir un Click-to-WhatsApp.
Arreglar src/consent.config.ts. El comentario de THIRD_PARTY_COOKIES dice cubrir “Google Analytics, Ads y Meta”, pero la
lista solo tiene _ga* y _gcl*: sin _fbp ni _fbc. Verificado: cero ocurrencias de ambas en todo src/. Si vuelve el píxel, retirar el
consentimiento no borraría sus cookies. 
3.3 Conversiones offline: no hay nada 
Ni subida a Google Ads, ni Enhanced Conversions, ni formato de exportación. Lo único previsto es el destino genérico
LEAD_WEBHOOK_URL. El cierre del bucle es manual, cruzando a mano el código de referencia de pa_attr. 
i️ El punto de enganche para alertas de lead (Telegram, hoja de cálculo, CRM) es /api/lead-ref, no los formularios. Y ahí está la
ventaja: se dispara antes del salto a WhatsApp, así que también caza al visitante que rellena el formulario y no pulsa enviar — que hoy
se pierde en silencio. 
 4. Bloqueado por el cliente 
Se toca en el repo, pero el dato no lo puede poner ni un desarrollador ni un modelo. Es puerta dura antes de promocionar el deploy:
hoy es inocuo porque producción no emite JSON-LD; al desplegar se publicarían datos registrales falsos en un sitio dirigido a Francia.Qué DóndeCIF B-00000000 messages/es.json, messages/fr.json (páginas legales)C/ Dirección física, 00 · 46000 Valencia src/lib/structured-data.ts (con TODO(cliente) explícito) y
los dos ficheros de mensajesOcho proyectos de relleno y testimonios firmados por “Nombre
 src/components/proyectos/gallery.tsxApellido · cargo, entidad”Cifras de la home sin confirmar: 17 años, +120 proyectos, garantía
 messages/*.jsonde 10 años 
Publicar reseñas inventadas no es un placeholder feo: es publicidad engañosa. O el cliente aporta datos reales, o esas secciones se
retiran. 
 5. Bloqueado por decisión o por permiso 
Versión de muro/obra en el configurador. El catálogo tiene hoy tres versiones (estandar, semipanoramica,
fullpanoramica). La de muro/obra es la que más hormigón lleva, y el margen está en el hormigón. Es código, no diseño — pero
depende de que el dueño cierre el catálogo definitivo.
Scrollytelling animado en /como-se-construye. El contenido existe (205 líneas, las seis fases con fotos de obra); la animación
no. Verificado: cero referencias a GSAP en el repo. Es una dependencia nueva, y CLAUDE.md la condiciona a permiso explícito,
indicando peso en bundle y por qué no vale hacerlo con CSS. 
 6. Deuda menor 🟢 
Nada de esto rompe nada. Ordenado por lo que más despista a quien llegue nuevo. 
Deuda de documentación dentro del propio repo. Quien lea antes de tocar se equivoca en tres sitios: 
ARQUITECTURA.md §8.2 describe components/contact-link.tsx y el envío de Contact a Meta (píxel + CAPI
deduplicado). Ese fichero no existe y Meta se retiró en 6c2f14e. El texto vigente es el de §6.4.
ARQUITECTURA.md §10 sigue pidiendo NEXT_PUBLIC_META_PIXEL_ID, META_CAPI_ACCESS_TOKEN y
META_GRAPH_API_VERSION en Vercel. Ningún código las lee.
CLAUDE.md dice que GTM se carga “exclusivamente” con @next/third-parties. Regla muerta desde e3a2df6: hoy lo
inyecta a mano src/components/consent/gtm-loader.tsx, y por un motivo legítimo — el orden consent default →
update → contenedor tiene que ser controlable.
ARQUITECTURA.md §6.3 y el README documentan configurador_interaccion con el parámetro placement; el código
empuja origen.
@next/third-parties está declarada y no se usa. Cero referencias en src/. O se desinstala, o se recupera la regla.
scripts/optimize-images.ts no existe. El directorio scripts/ no existe. CLAUDE.md dice que “ningún archivo entra al reposin pasar por” ese script.
Nadie mide en campo. CLAUDE.md dice que el presupuesto se mide en Vercel Speed Insights; no hay @vercel/speed
insights ni @vercel/analytics en package.json.
src/lib/structured-data.ts:60: knowsLanguage: ["es", "fr", "en"] escrito a mano en vez de derivarse de
routing.locales. Si alguien reactiva de/nl, el JSON-LD se queda desactualizado en silencio.
src/app/sitemap.ts:29: lastModified: new Date() → la fecha del build, no la del contenido. Todas las URLs dirán
siempre “modificada hoy”. Señal ruidosa; no rompe nada.
x-default apunta al español. Para un negocio cuyo único mercado objetivo es Francia, es discutible: es el idioma que ve quien
no encaja en ningún hreflang. No es un error técnico, es una decisión implícita que nadie escribió — probablemente heredada
del defaultLocale.
z-index con sintaxis mezclada: z-45, z-[60], z-70. Mapa actual: cabecera 40 · barra CTA 45 · banner de cookies 50 · sheet 60
· lightbox 70 · panel de preferencias 80.
Throttling de los dos Route Handlers = Map en memoria. En serverless cada instancia tiene el suyo. Frena abuso trivial, no un
ataque distribuido.
Deriva de comentario en structured-data.ts: el TODO(cliente) dice que “address y taxID llevan datos de relleno”, pero
taxID no existe en el objeto. El CIF de relleno vive en los messages/*.json. 
 7. Lo que NO es código 
Aquí no hay nada que programar. Está listado solo para que nadie lo busque en el repo. 
Variables de entorno en Vercel (todas vacías hoy):Variable Sin ellaNEXT_PUBLIC_GTM_ID GtmLoader devuelve null. Los cinco eventos van a un dataLayer que nadie
consume. Es el bloqueante no1 de mediciónNEXT_PUBLIC_SITE_URL SITE_URL cae a https://www.padelalbufera.com — el WordPress ajeno.
Las 33 canónicas, los 132 hreflang, el sitemap, el robots y el JSON-LD
apuntarían a un dominio donde varias de esas rutas ni existenLEAD_WEBHOOK_URL /api/lead-ref devuelve 204 sin escribir. El código de referencia que viaja
en el WhatsApp es una clave de cruce sin tabla contra la que cruzarCONSENT_IP_SALT Hoy irrelevante (no se persiste); imprescindible el día que haya BDNEXT_PUBLIC_PHONE_FR · NEXT_PUBLIC_WHATSAPP_FR Los leads franceses caen al fallback español +34 614 20 76 33 
En Vercel: la Production Branch apunta a claude/web-design-github-link-2f7y1e, una rama muerta. Manda claude/padel
albufera-3d-render-h37oww. Por eso producción sirve un build congelado y todo lo escrito desde entonces no llega al usuario. 
En GTM: desactivar el page_view automático de la etiqueta de configuración de GA4 (esta web lo emite manualmente en todas las
vistas, incluida la inicial), marcar el consentimiento incorporado de cada etiqueta, crear los activadores de whatsapp_click y
phone_click, y apuntar la sustitución dinámica de número a los nodos con clase js-phone-number. 
Del cliente: revisión profesional de las dos páginas legales por su asesoría, y los datos de §4. 
 8. Cómo verificar cuando haya node_modules 
npm install
npx tsc --noEmit
npx eslint src
npm run build # las rutas de marketing deben salir ●
grep -rl "ACESFilmicToneMapping" .next/static/chunks | wc -l
# debe dar 1
Y las comprobaciones que no salen de un comando están en ARQUITECTURA.md §11 (capa de consentimiento) y §9 (checklist de cierre
de cambio)
