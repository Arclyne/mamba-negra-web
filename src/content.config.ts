import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// RF-01: servicios, precios y duración viven aquí, no en el HTML.
// Cada `id` es también el slug del tipo de evento en Cal.com (RF-09),
// salvo que se indique otro en `calEvento`.
const servicios = defineCollection({
  loader: file('src/content/servicios.json'),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    precio: z.number().int().positive(),
    duracion: z.union([z.literal(60), z.literal(120)]),
    categoria: z.enum(['servicio', 'combo']),
    ahorro: z.string().optional(),
    calEvento: z.string().optional(),
  }),
});

// RF-03: `archivo` es el nombre de una foto dentro de src/assets/galeria/.
// Astro la convierte a WebP con carga diferida. Sin archivo se muestra un espacio reservado.
const galeria = defineCollection({
  loader: file('src/content/galeria.json'),
  schema: z.object({
    tipo: z.enum(['Competencia', 'Reconocimiento', 'Trabajo']),
    titulo: z.string(),
    archivo: z.string().optional(),
    alt: z.string().optional(),
    tamano: z.enum(['normal', 'grande', 'ancho']).default('normal'),
  }),
});

export const collections = { servicios, galeria };
