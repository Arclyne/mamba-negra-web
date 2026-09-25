// Horarios disponibles desde la API pública de Cal.com (v2 /slots). No requiere clave:
// es la misma información que muestra la página pública de reservas. Ya respeta el horario
// del negocio, la hora de comida, el aviso mínimo, las citas existentes y lo que el barbero
// anote en su Google Calendar conectado.

export const ZONA = 'America/Mexico_City';
const API = 'https://api.cal.com/v2/slots';

/** Día (AAAA-MM-DD) → horas disponibles, como instantes ISO. */
export type Horarios = Record<string, string[]>;

const cache = new Map<string, Promise<Horarios>>();

const pad = (n: number) => String(n).padStart(2, '0');

/** Fecha de hoy en Coatepec, AAAA-MM-DD. */
export function hoy(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA }).format(new Date());
}

/** Primer día del mes siguiente a `mes` (AAAA-MM). */
export function mesSiguiente(mes: string, n = 1): string {
  const [a, m] = mes.split('-').map(Number);
  const d = new Date(Date.UTC(a, m - 1 + n, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
}

/** Horarios de un servicio (`usuario/slug` de Cal.com) para un mes (AAAA-MM). */
export function horariosDelMes(evento: string, mes: string): Promise<Horarios> {
  const clave = `${evento}|${mes}`;
  if (!cache.has(clave)) {
    const peticion = pedir(evento, mes).catch((e) => {
      cache.delete(clave); // si falla, que el siguiente intento vuelva a pedirlos
      throw e;
    });
    cache.set(clave, peticion);
  }
  return cache.get(clave)!;
}

/** Olvida los horarios guardados de un servicio (p. ej. después de reservar). */
export function olvidar(evento: string) {
  for (const clave of cache.keys()) if (clave.startsWith(`${evento}|`)) cache.delete(clave);
}

async function pedir(evento: string, mes: string): Promise<Horarios> {
  const [username, eventTypeSlug] = evento.split('/');
  const hoyStr = hoy();
  const inicioMes = `${mes}-01`;
  const inicio = hoyStr > inicioMes ? hoyStr : inicioMes;
  // La API corta los días en UTC: se pide un día de más y luego se filtra por el mes.
  const fin = `${mesSiguiente(mes)}-02`;
  const url = `${API}?${new URLSearchParams({ username, eventTypeSlug, start: inicio, end: fin, timeZone: ZONA })}`;
  const r = await fetch(url, { headers: { 'cal-api-version': '2024-09-04' } });
  if (!r.ok) throw new Error(`Cal.com respondió ${r.status}`);
  const json = (await r.json()) as { data?: Record<string, { start: string }[]> };
  if (!json.data) throw new Error('Respuesta de Cal.com sin datos');
  const horarios: Horarios = {};
  for (const [dia, lista] of Object.entries(json.data)) {
    if (dia.startsWith(mes) && lista.length) horarios[dia] = lista.map((s) => s.start);
  }
  return horarios;
}

/** "10:00" a partir de un instante ISO, en la hora de Coatepec. */
export function horaLocal(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', { timeZone: ZONA, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));
}
