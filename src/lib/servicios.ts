import { getCollection } from 'astro:content';
import datos from '../content/servicios.json';

// Las colecciones de Astro no conservan el orden del archivo; aquí se respeta:
// el orden en servicios.json es el orden en el sitio.
const posicion = new Map(datos.map((s, i) => [s.id, i]));

export async function getServicios() {
  const servicios = await getCollection('servicios');
  return servicios.sort((a, b) => posicion.get(a.id)! - posicion.get(b.id)!);
}

export const duracionTexto = (min: number) => (min === 120 ? '2 horas' : '1 hora');
