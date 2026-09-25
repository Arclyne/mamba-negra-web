// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL pública del sitio, para URLs canónicas, Open Graph y sitemap.
// En Netlify se usa `URL`, que Netlify define en cada compilación con el dominio principal del
// proyecto: hoy la-mamba-negra.netlify.app y, cuando se conecte el dominio propio, ese dominio.
const SITE = process.env.SITE_URL ?? process.env.URL ?? 'https://la-mamba-negra.netlify.app';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
