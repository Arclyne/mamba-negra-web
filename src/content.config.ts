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

// RF-03: las fotos viven en src/assets/galeria/; `archivo` es su ruta dentro de esa carpeta.
// Astro las convierte a WebP en varios tamaños y las carga de forma diferida.

// Reconocimientos y competencias. `posicion` (opcional) ajusta el encuadre, p. ej. "center 30%".
const galeria = defineCollection({
  loader: file('src/content/galeria.json'),
  schema: z.object({
    tipo: z.enum(['Competencia', 'Reconocimiento']),
    titulo: z.string(),
    archivo: z.string(),
    alt: z.string(),
    posicion: z.string().optional(),
  }),
});

// Cortes: un nombre y una foto por perspectiva. Las perspectivas que falten se muestran deshabilitadas.
const cortes = defineCollection({
  loader: file('src/content/cortes.json'),
  schema: z.object({
    nombre: z.string(),
    vistas: z
      .object({
        frente: z.string().optional(),
        izquierdo: z.string().optional(),
        derecho: z.string().optional(),
        atras: z.string().optional(),
      })
      .refine((v) => Object.values(v).some(Boolean), 'Cada corte necesita al menos una foto'),
  }),
});

export const collections = { servicios, galeria, cortes };
