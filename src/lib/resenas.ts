import { z } from 'astro/zod';
import datos from '../content/resenas.json';

// Solo reseñas reales, copiadas tal cual y publicadas con permiso del cliente.
// Mientras el arreglo esté vacío, la sección de reseñas no se publica.
// (Es un JSON validado y no una colección para no llenar el build de avisos cuando está vacío.)
const Resena = z.object({
  nombre: z.string().min(1),
  servicio: z.string(),
  fecha: z.string(),
  estrellas: z.number().int().min(1).max(5),
  fuente: z.enum(['Google', 'Instagram', 'WhatsApp']),
  texto: z.string().min(1),
});

export type Resena = z.infer<typeof Resena>;
export const resenas: Resena[] = z.array(Resena).parse(datos);
