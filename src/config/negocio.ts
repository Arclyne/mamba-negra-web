// Datos públicos del negocio. Un solo lugar para editarlos: los usan el sitio,
// los datos estructurados (SEO local) y el aviso de privacidad.
// Aquí solo va información pública. Nada de contraseñas ni API keys (ADR-05).

export const negocio = {
  nombre: 'La Mamba Negra',
  nombreLegal: 'La Mamba Negra Barbería',
  lema: 'Precision. Style. Culture.',
  descripcion:
    'Barbería premium en el centro de Coatepec, Veracruz. Cortes, barba, facial y permacología. Reserva tu cita en línea.',

  direccion: {
    calle: 'C. Leona Vicario 64',
    colonia: 'Centro',
    cp: '91505',
    ciudad: 'Coatepec',
    estado: 'Veracruz',
    estadoCorto: 'Ver.',
    pais: 'MX',
  },

  // Días: 1 = lunes … 6 = sábado. Domingo cerrado.
  horario: {
    dias: [1, 2, 3, 4, 5, 6],
    bloques: [
      { abre: '10:00', cierra: '15:00' },
      { abre: '16:00', cierra: '20:00' },
    ],
    resumen: 'Lun a Sáb · 10:00–15:00 y 16:00–20:00',
  },

  whatsapp: {
    numero: '522283249721', // formato wa.me, sin "+" ni espacios
    visible: '+52 228 324 9721',
  },
  instagram: {
    usuario: 'lamambanegra_barberia',
    url: 'https://www.instagram.com/lamambanegra_barberia/',
  },

  mapsUrl: 'https://maps.google.com/?q=C.+Leona+Vicario+64,+Centro,+91505+Coatepec,+Ver.',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=C.+Leona+Vicario+64,+Centro,+91505+Coatepec,+Ver.&output=embed',
  resenasUrl: 'https://www.google.com/maps/search/?api=1&query=La+Mamba+Negra+Barberia+Coatepec',

  // Cal.com (ADR-03). Usuario PÚBLICO de la cuenta del negocio: es parte de la URL
  // de reservas, no es un secreto. Mientras esté vacío, la sección de reservas
  // muestra el respaldo por WhatsApp en lugar del calendario.
  calcom: {
    usuario: 'la-mamba-negra',
    origen: 'https://app.cal.com',
  },

  // Calificación de Google. Déjala en null hasta tener el dato real.
  google: {
    calificacion: null as number | null,
    totalResenas: null as number | null,
  },

  // Aviso de privacidad (LFPDPPP). Completar antes de publicar.
  privacidad: {
    responsable: '[NOMBRE COMPLETO DEL TITULAR O RAZÓN SOCIAL]',
    correo: '[correo@lamambanegra.com.mx]',
    actualizado: '[FECHA DE ÚLTIMA ACTUALIZACIÓN]',
  },
} as const;

export const direccionCompleta = `${negocio.direccion.calle}, ${negocio.direccion.colonia}, ${negocio.direccion.cp} ${negocio.direccion.ciudad}, ${negocio.direccion.estado}`;

export function waLink(mensaje?: string) {
  const base = `https://wa.me/${negocio.whatsapp.numero}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
