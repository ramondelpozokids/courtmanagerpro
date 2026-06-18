export type LegalSlug =
  | 'aviso-legal'
  | 'politica-privacidad'
  | 'proteccion-datos'
  | 'politica-cookies'
  | 'mapa-sitio'
  | 'condiciones-uso';

export interface LegalPageContent {
  title: string;
  updated: string;
  sections: { heading?: string; body: string }[];
}

export const legalPages: Record<LegalSlug, LegalPageContent> = {
  'aviso-legal': {
    title: 'Aviso Legal',
    updated: '18 de junio de 2026',
    sections: [
      {
        body: 'En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que el titular de este sitio web es CourtManager Pro, plataforma de gestión de utilería deportiva desarrollada por Ramón del Pozo Rott y administrada operativamente por Carlos Rodriguez Kobe en el entorno del Real Madrid Baloncesto (demostración técnica temporada 2025/2026).',
      },
      {
        heading: 'Datos identificativos',
        body: 'Denominación: CourtManager Pro · Contacto: charlie-r-k@hotmail.com · Soporte técnico: ramon.delpozo@realmadrid.com · Dominio de producción: courtmanagerpro.vercel.app',
      },
      {
        heading: 'Objeto',
        body: 'Este aviso legal regula el acceso y uso del portal CourtManager Pro. El acceso implica la aceptación de las condiciones aquí descritas y de las políticas complementarias (privacidad, cookies y condiciones de uso).',
      },
      {
        heading: 'Propiedad intelectual',
        body: 'Los contenidos, diseño, código fuente, logotipos propios y documentación técnica son propiedad de sus autores. Las marcas Real Madrid, ACB y Euroliga pertenecen a sus respectivos titulares y se utilizan con fines demostrativos del proyecto.',
      },
      {
        heading: 'Responsabilidad',
        body: 'CourtManager Pro se ofrece como herramienta de gestión interna. No se garantiza la disponibilidad ininterrumpida del servicio. El titular no se hace responsable de daños derivados del uso indebido de la plataforma o de enlaces a sitios de terceros.',
      },
    ],
  },
  'politica-privacidad': {
    title: 'Política de Privacidad',
    updated: '18 de junio de 2026',
    sections: [
      {
        body: 'CourtManager Pro trata datos personales conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD). Esta política explica qué datos recogemos, con qué finalidad y cuáles son tus derechos.',
      },
      {
        heading: 'Responsable del tratamiento',
        body: 'Responsable: CourtManager Pro / equipo técnico del proyecto. Contacto para privacidad: charlie-r-k@hotmail.com',
      },
      {
        heading: 'Datos que tratamos',
        body: 'Identificación y contacto del staff (nombre, email, teléfono), datos profesionales (rol, equipo), datos de jugadores (ficha técnica, tallajes, fotografía), registros de inventario, solicitudes, alertas y logs de auditoría generados por el sistema.',
      },
      {
        heading: 'Finalidad y legitimación',
        body: 'Gestión de utilería, trazabilidad de material, comunicaciones operativas y mejora del servicio. La base legal es la ejecución de la relación profesional/servicio y, en su caso, el consentimiento para comunicaciones no esenciales.',
      },
      {
        heading: 'Conservación y destinatarios',
        body: 'Los datos se conservan mientras exista relación con el club y durante los plazos legales aplicables. Pueden acceder proveedores tecnológicos (Vercel, Supabase) como encargados de tratamiento con contrato y garantías adecuadas.',
      },
      {
        heading: 'Tus derechos',
        body: 'Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a charlie-r-k@hotmail.com. También puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).',
      },
    ],
  },
  'proteccion-datos': {
    title: 'Protección de Datos',
    updated: '18 de junio de 2026',
    sections: [
      {
        body: 'CourtManager Pro aplica medidas técnicas y organizativas para proteger la información del primer equipo, especialmente datos sensibles de tallajes, historial médico simulado y datos biométricos deportivos.',
      },
      {
        heading: 'Medidas de seguridad',
        body: 'Cifrado HTTPS en tránsito (Vercel), Row Level Security (RLS) en Supabase PostgreSQL, control de acceso por roles (admin, equipment_manager, medical, etc.), registro de auditoría en base de datos y segregación entre entorno demo y producción.',
      },
      {
        heading: 'Datos de categorías especiales',
        body: 'Los datos de salud o tallaje detallado se tratan con acceso restringido únicamente al personal autorizado (utilería, staff médico y administradores). El acceso superadmin queda registrado para supervisión.',
      },
      {
        heading: 'Incidentes de seguridad',
        body: 'Ante una brecha de seguridad, se notificará al responsable designado en un plazo máximo de 72 horas y, si procede, a la AEPD y a los afectados conforme al RGPD.',
      },
      {
        heading: 'Delegado / contacto',
        body: 'Para consultas sobre protección de datos: Carlos Rodriguez Kobe (equipment manager) — charlie-r-k@hotmail.com · Supervisión: Ramón del Pozo Rott — ramon.delpozo@realmadrid.com',
      },
    ],
  },
  'politica-cookies': {
    title: 'Política de Cookies',
    updated: '18 de junio de 2026',
    sections: [
      {
        body: 'Este sitio utiliza cookies y tecnologías similares para garantizar el funcionamiento de la aplicación, recordar preferencias de sesión y analizar el uso de forma agregada.',
      },
      {
        heading: 'Tipos de cookies',
        body: 'Cookies técnicas (necesarias): autenticación Supabase, preferencias de equipo (currentTeamId en localStorage), estado de la PWA. Cookies analíticas: solo si se activan servicios de medición (actualmente no se usan cookies de publicidad de terceros).',
      },
      {
        heading: 'Gestión',
        body: 'Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que desactivar cookies técnicas puede impedir el inicio de sesión o el guardado de preferencias.',
      },
      {
        heading: 'Más información',
        body: 'Para cualquier duda sobre cookies, contacta con charlie-r-k@hotmail.com. Consulta también nuestra Política de Privacidad.',
      },
    ],
  },
  'mapa-sitio': {
    title: 'Mapa del Sitio',
    updated: '18 de junio de 2026',
    sections: [
      {
        body: 'Índice completo de secciones de CourtManager Pro:',
      },
      {
        heading: 'Operativa',
        body: '· Dashboard (/) · Jugadores (/players) · Inventario (/inventory) · Escáner QR (/inventory/scanner) · Tabla de Tallas (/sizing) · Solicitudes (/requests) · Viajes (/trips) · Lavandería (/laundry) · Material Médico (/medical) · Informes (/reports) · Alertas (/alerts)',
      },
      {
        heading: 'Portal RMB',
        body: '· Blog e Historia (/blog) · Noticias (/blog/noticias) · Calendario oficial (/calendario) · Tienda oficial (/tienda)',
      },
      {
        heading: 'Legal',
        body: '· Aviso Legal (/aviso-legal) · Política de Privacidad (/politica-privacidad) · Protección de Datos (/proteccion-datos) · Política de Cookies (/politica-cookies) · Condiciones de Uso (/condiciones-uso) · Mapa del Sitio (/mapa-sitio)',
      },
      {
        heading: 'Contacto',
        body: 'Carlos Rodriguez Kobe: +34 637 23 71 00 · charlie-r-k@hotmail.com · Ramón del Pozo Rott: ramon.delpozo@realmadrid.com',
      },
    ],
  },
  'condiciones-uso': {
    title: 'Condiciones de Uso',
    updated: '18 de junio de 2026',
    sections: [
      {
        body: 'Al acceder a CourtManager Pro aceptas estas condiciones. Si no estás de acuerdo, no utilices la plataforma.',
      },
      {
        heading: 'Uso permitido',
        body: 'La plataforma está destinada al personal autorizado del club para gestionar utilería, inventario, solicitudes y logística. Queda prohibido el acceso no autorizado, la extracción masiva de datos o el uso con fines distintos al operativo del equipo.',
      },
      {
        heading: 'Cuentas y roles',
        body: 'Cada usuario debe utilizar sus credenciales personales. La simulación de roles (superadmin, jugador, etc.) está pensada para demostración y pruebas internas. El usuario es responsable de mantener la confidencialidad de su sesión.',
      },
      {
        heading: 'Contenidos',
        body: 'Los datos de jugadores y equipaciones pueden incluir información oficial del Real Madrid Baloncesto con fines demostrativos. No está permitida su reproducción comercial sin autorización.',
      },
      {
        heading: 'Modificaciones',
        body: 'CourtManager Pro puede actualizar estas condiciones. Los cambios relevantes se comunicarán en el portal. El uso continuado implica aceptación de la versión vigente.',
      },
      {
        heading: 'Legislación',
        body: 'Estas condiciones se rigen por la legislación española. Para controversias, las partes se someten a los juzgados del domicilio del usuario consumidor o, en relaciones B2B, a Madrid capital.',
      },
    ],
  },
};

export const footerLegalLinks: { href: string; label: string; slug: LegalSlug }[] = [
  { href: '/aviso-legal', label: 'Aviso Legal', slug: 'aviso-legal' },
  { href: '/politica-privacidad', label: 'Política de Privacidad', slug: 'politica-privacidad' },
  { href: '/proteccion-datos', label: 'Protección de Datos', slug: 'proteccion-datos' },
  { href: '/politica-cookies', label: 'Política de Cookies', slug: 'politica-cookies' },
  { href: '/mapa-sitio', label: 'Mapa del Sitio', slug: 'mapa-sitio' },
  { href: '/condiciones-uso', label: 'Condiciones de Uso', slug: 'condiciones-uso' },
];
