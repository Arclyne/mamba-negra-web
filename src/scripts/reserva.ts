// Crea la reserva con la API pública de Cal.com (POST /v2/bookings, sin clave).
// Los datos van del navegador directo a Cal.com: el sitio no los guarda (ADR-03).
// Cal.com guarda la cita, la agrega al Google Calendar conectado y manda al cliente
// la confirmación, el recordatorio y los enlaces para cambiar o cancelar.

import { ZONA } from './horarios';

export interface DatosReserva {
  evento: string;   // "usuario/slug" de Cal.com
  inicio: string;   // instante ISO de la hora elegida
  nombre: string;
  correo: string;
  telefono?: string; // 10 dígitos, México
  notas?: string;
}

export type ResultadoReserva =
  | { ok: true }
  | { ok: false; motivo: 'ocupada' | 'limite' | 'datos' | 'red' | 'otro'; detalle?: string };

export async function crearReserva(d: DatosReserva): Promise<ResultadoReserva> {
  const [username, eventTypeSlug] = d.evento.split('/');
  const telefono = d.telefono ? `+52${d.telefono}` : undefined;
  const cuerpo = {
    start: new Date(d.inicio).toISOString(),
    username,
    eventTypeSlug,
    attendee: {
      name: d.nombre,
      email: d.correo,
      timeZone: ZONA,
      language: 'es',
      ...(telefono ? { phoneNumber: telefono } : {}),
    },
    bookingFieldsResponses: {
      ...(d.notas ? { notes: d.notas } : {}),
      ...(telefono ? { attendeePhoneNumber: telefono } : {}),
    },
    metadata: { origen: 'sitio-web' },
  };

  let r: Response;
  try {
    r = await fetch('https://api.cal.com/v2/bookings', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'cal-api-version': '2026-02-25' },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    return { ok: false, motivo: 'red' };
  }
  if (r.ok) return { ok: true };

  const json = await r.json().catch(() => ({}));
  const detalle: string = json?.error?.message || json?.message || `HTTP ${r.status}`;
  console.warn('[reservas] Cal.com rechazó la reserva:', r.status, detalle);
  if (r.status === 409 || /not available|already has booking/i.test(detalle)) return { ok: false, motivo: 'ocupada', detalle };
  if (/limit|max.*booking/i.test(detalle)) return { ok: false, motivo: 'limite', detalle };
  if (r.status === 400) return { ok: false, motivo: 'datos', detalle };
  return { ok: false, motivo: 'otro', detalle };
}
