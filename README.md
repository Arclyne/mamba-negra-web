# La Mamba Negra · sitio web

Sitio de la barbería La Mamba Negra (Coatepec, Veracruz). Astro 7 + Tailwind CSS 4, estático, desplegado en Netlify.
El sitio no guarda citas ni datos personales: las reservas viven en la cuenta de Cal.com del negocio.

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run check    # revisión de tipos
```

Requiere Node 22.12 o superior.

## Qué se edita y dónde

| Quiero cambiar…                          | Archivo                                   |
|------------------------------------------|-------------------------------------------|
| Precios, servicios, duración, combos     | `src/content/servicios.json`              |
| Dirección, horario, WhatsApp, Instagram  | `src/config/negocio.ts`                   |
| Cuenta de Cal.com                        | `src/config/negocio.ts` → `calcom.usuario` |
| Cortes (fotos por perspectiva)           | `src/assets/galeria/cortes/` + `src/content/cortes.json` |
| Fotos de reconocimientos                 | `src/assets/galeria/reconocimientos/` + `src/content/galeria.json` |
| Reseñas (solo reales, con permiso)       | `src/content/resenas.json`                |
| Aviso de privacidad                      | `src/config/negocio.ts` → `privacidad`    |

El orden de `servicios.json`, `cortes.json` y `galeria.json` es el orden en que aparecen en el sitio.

### Servicios

Cada servicio lleva `id`, `nombre`, `descripcion`, `precio` (MXN), `duracion` (60 o 120 min),
`categoria` (`servicio` o `combo`) y, opcionalmente, `ahorro`. Si un dato no cumple el formato, el build falla y dice cuál.

### Cortes

Cada corte tiene un nombre y una foto por perspectiva: `frente`, `izquierdo`, `derecho` y `atras`.
Las que falten aparecen deshabilitadas en su tarjeta. Para agregar un corte:

1. Copia sus fotos a `src/assets/galeria/cortes/` (JPG, PNG o WebP, verticales 4:5 de preferencia).
2. Agrega una entrada a `cortes.json`:

```json
{ "id": "mid-fade", "nombre": "Mid fade", "vistas": { "frente": "cortes/mid-fade-frente.jpg", "atras": "cortes/mid-fade-atras.jpg" } }
```

### Reconocimientos

Copia la foto a `src/assets/galeria/reconocimientos/` y agrégala a `galeria.json` con `tipo`
(`Competencia` o `Reconocimiento`), `titulo`, `archivo` y un `alt` que describa la foto.
Si el encuadre corta caras, ajusta `"posicion": "center 20%"`.

Astro convierte todas las fotos a WebP en varios tamaños y las carga de forma diferida.
Antes de publicar fotos de clientes, confirma que dieron su permiso.

### Reseñas

`resenas.json` empieza vacío y, mientras lo esté, la sección no aparece en el sitio ni en el menú.
Formato: `{ "nombre", "servicio", "fecha", "estrellas" (1–5), "fuente" (Google | Instagram | WhatsApp), "texto" }`.
La calificación global de Google va en `negocio.ts` → `google`.

## Reservas con Cal.com

Mientras `calcom.usuario` esté vacío, la sección de reservas ofrece agendar por WhatsApp con el servicio ya escrito en el mensaje.
Para activar el calendario:

1. En la cuenta de Cal.com **del negocio**, crea un tipo de evento por servicio, con **el mismo slug que su `id`**
   en `servicios.json` (`corte-de-cabello`, `corte-y-barba`, …) y la duración real. Si un slug debe ser distinto, agrega `"calEvento": "otro-slug"` a ese servicio.
2. Pon el nombre de usuario público de Cal.com en `negocio.ts` → `calcom.usuario`. No es un secreto: forma parte de la URL pública de reservas.
3. Configura en Cal.com: aviso mínimo de 30 min, recordatorio 24 h antes, verificación de correo y límite de reservas por persona (RF-10 a RF-12).
   Los textos «Reserva hasta 30 min antes» y «Cancela o cambia hasta 1 h antes» del sitio deben coincidir con esa configuración.

El calendario (un iframe de Cal.com) solo se descarga cuando alguien llega a la sección de reservas o elige un servicio.
Los botones «Reservar» de cada tarjeta y los enlaces `/?servicio=<id>#reservar` abren la reserva con ese servicio ya elegido.

## Despliegue (Netlify)

`netlify.toml` ya define el build (`npm run build` → `dist/`) y las cabeceras de seguridad y caché.
Conecta el repositorio del negocio en Netlify con despliegue automático desde `main`.
Si el dominio final no es `lamambanegra.com.mx`, cámbialo en `astro.config.mjs` o define la variable `SITE_URL` en Netlify.

## Reglas

- Nada de contraseñas, API keys ni tokens en este repositorio (ADR-05). `.env` está en `.gitignore`.
- Si algún día hace falta un panel propio, va en una función de servidor con variables de entorno, nunca en JavaScript del navegador.

## Pendiente antes de publicar

- [ ] Registrar el dominio y confirmar `site` en `astro.config.mjs`
- [ ] Crear la cuenta de Cal.com del negocio y sus tipos de evento; llenar `calcom.usuario`
- [ ] Completar los datos del responsable en `negocio.ts` → `privacidad` y revisar el aviso con un asesor
- [ ] Confirmar el permiso de los clientes que aparecen en las fotos de cortes
- [ ] Agregar reseñas reales (opcional)
# mamba-negra-web
