// Cargador del embed oficial de Cal.com (ADR-03). El script de Cal.com y su
// calendario (cientos de KB) solo se descargan cuando alguien se acerca a la sección de reservas o elige
// un servicio, así la carga inicial del sitio se mantiene ligera (RNF-02).
//
// El sitio no guarda citas ni datos personales: todo el formulario vive dentro del iframe
// de Cal.com, en la cuenta del negocio.

type CalApi = ((...args: unknown[]) => void) & { q?: unknown[] };
type Cal = CalApi & { loaded?: boolean; ns: Record<string, CalApi> };

declare global {
  interface Window { Cal?: Cal }
}

function bootstrap(origin: string) {
  if (window.Cal) return window.Cal;
  // Adaptación del snippet oficial de instalación de Cal.com.
  const push = (api: CalApi, args: unknown) => (api.q ??= []).push(args);
  const cal = function (this: unknown, ...args: unknown[]) {
    const c = window.Cal!;
    if (!c.loaded) {
      c.ns = {};
      c.q ??= [];
      const s = document.createElement('script');
      s.src = `${origin}/embed/embed.js`;
      s.async = true;
      document.head.appendChild(s);
      c.loaded = true;
    }
    if (args[0] === 'init') {
      const api: CalApi = (...a: unknown[]) => push(api, a);
      const namespace = args[1];
      if (typeof namespace === 'string') {
        c.ns[namespace] ??= api;
        push(c.ns[namespace], args);
        push(c, ['initNamespace', namespace]);
      } else push(c, args);
      return;
    }
    push(c, args);
  } as Cal;
  window.Cal = cal;
  return cal;
}

const iniciados = new Set<string>();

/** Monta el calendario de un tipo de evento dentro de `el`. `alReservar` se llama cuando se confirma una reserva. */
export function montarCalendario(
  el: HTMLElement,
  opts: { origin: string; calLink: string; namespace: string; alReservar?: () => void },
) {
  const Cal = bootstrap(opts.origin);
  const ns = opts.namespace;
  if (!iniciados.has(ns)) {
    Cal('init', ns, { origin: opts.origin });
    iniciados.add(ns);
  }
  Cal.ns[ns]('inline', {
    elementOrSelector: el,
    calLink: opts.calLink,
    config: { layout: 'month_view', theme: 'dark' },
  });
  Cal.ns[ns]('ui', {
    theme: 'dark',
    layout: 'month_view',
    // El servicio, duración y precio ya se muestran en el sitio; así el calendario y las horas caben lado a lado.
    hideEventTypeDetails: true,
    cssVarsPerTheme: { dark: { 'cal-brand': '#D7262E' } },
  });
  if (opts.alReservar) {
    // Cal.com avisa con estos eventos cuando se confirma una reserva (V2 es el actual; el otro, el anterior).
    for (const action of ['bookingSuccessfulV2', 'bookingSuccessful']) {
      Cal.ns[ns]('on', { action, callback: opts.alReservar });
    }
  }
}
