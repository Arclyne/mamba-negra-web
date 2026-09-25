import type { ImageMetadata } from 'astro';

// Todas las fotos de src/assets/galeria/ (reconocimientos y cortes), indexadas por su ruta
// dentro de esa carpeta, p. ej. "cortes/pompadour-frente.webp".
const fotos = import.meta.glob<{ default: ImageMetadata }>('../assets/galeria/**/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export function foto(ruta: string): ImageMetadata {
  const mod = fotos[`../assets/galeria/${ruta}`];
  if (!mod) throw new Error(`No existe la foto src/assets/galeria/${ruta}`);
  return mod.default;
}

/** Anchos para srcset sin pasar del tamaño original de la foto. */
export function anchos(img: ImageMetadata, candidatos = [320, 480, 640, 960]) {
  const w = candidatos.filter((n) => n <= img.width);
  return w.length ? w : [img.width];
}

/** Las colecciones de Astro no conservan el orden del archivo; esto lo respeta. */
export function enOrden<T extends { id: string }>(entradas: T[], datos: { id: string }[]) {
  const pos = new Map(datos.map((d, i) => [d.id, i]));
  return [...entradas].sort((a, b) => pos.get(a.id)! - pos.get(b.id)!);
}
