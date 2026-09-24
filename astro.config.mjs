// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Dominio definitivo del negocio (Fase 0). Se usa para URLs canónicas, Open Graph y sitemap.
const SITE = process.env.SITE_URL ?? 'https://lamambanegra.com.mx';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
