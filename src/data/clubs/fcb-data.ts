function avatar(name: string, bg: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=384&bold=true`;
}

const accent = 'A50044';

type DemoPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  number: number;
  position: string;
  nationality: string;
  birthDate: string;
  sizes: { jersey: string; shorts: string; shoes: string; socks: string; warmupShirt: string };
};

function mk(p: DemoPlayer) {
  return {
    ...p,
    status: 'ACTIVE' as const,
    imageUrl: avatar(`${p.firstName} ${p.lastName}`, accent),
    birth_place: 'Barcelona',
    matches_played: 28,
    points: 320,
    rebounds: 80,
    assists: 45,
    palmares: ['FC Barcelona Basquet — Plantilla 25/26'],
  };
}

/** Plantilla oficial demo — Primer Equipo FC Barcelona Basquet 25/26 */
export const fcbPlayers = [
  // Bases
  mk({ id: 'p1', firstName: 'Tomás', lastName: 'Satoransky', number: 5, position: 'base', nationality: 'Rep. Checa', birthDate: '1991-10-30', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p2', firstName: 'Juan', lastName: 'Núñez', number: 20, position: 'base', nationality: 'España', birthDate: '2004-07-25', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p3', firstName: 'Juani', lastName: 'Marcos', number: 3, position: 'base', nationality: 'España', birthDate: '2003-02-14', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p4', firstName: 'Nicolás', lastName: 'Laprovittola', number: 6, position: 'base', nationality: 'Argentina', birthDate: '1990-01-31', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' } }),
  // Escoltas
  mk({ id: 'p5', firstName: 'Kevin', lastName: 'Punter', number: 9, position: 'escolta', nationality: 'Estados Unidos', birthDate: '1994-04-06', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p6', firstName: 'Darío', lastName: 'Brizuela', number: 8, position: 'escolta', nationality: 'España', birthDate: '1994-07-08', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p7', firstName: 'Myles', lastName: 'Cale', number: 12, position: 'escolta', nationality: 'Estados Unidos', birthDate: '1999-08-08', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' } }),
  // Aleros
  mk({ id: 'p8', firstName: 'Joel', lastName: 'Parra', number: 21, position: 'alero', nationality: 'España', birthDate: '1996-07-25', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p9', firstName: 'Álex', lastName: 'Abrines', number: 10, position: 'alero', nationality: 'España', birthDate: '1993-08-01', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p10', firstName: 'Justin', lastName: 'Anderson', number: 1, position: 'alero', nationality: 'Estados Unidos', birthDate: '1993-11-19', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' } }),
  // Pívots y ala-pívots
  mk({ id: 'p11', firstName: 'Jan', lastName: 'Vesely', number: 24, position: 'pivot', nationality: 'Rep. Checa', birthDate: '1990-04-24', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '49', socks: 'XL', warmupShirt: 'XXL' } }),
  mk({ id: 'p12', firstName: 'Willy', lastName: 'Hernangómez', number: 14, position: 'ala-pivot', nationality: 'España', birthDate: '1994-05-27', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '48', socks: 'XL', warmupShirt: 'XXL' } }),
  mk({ id: 'p13', firstName: 'Chimezie', lastName: 'Metu', number: 23, position: 'ala-pivot', nationality: 'Nigeria', birthDate: '1997-03-22', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '48', socks: 'XL', warmupShirt: 'XXL' } }),
  mk({ id: 'p14', firstName: 'Tornike', lastName: 'Shengelia', number: 35, position: 'ala-pivot', nationality: 'Georgia', birthDate: '1991-07-05', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '50', socks: 'XL', warmupShirt: 'XXL' } }),
];

export const fcbInventory = [
  { id: 'i1', name: 'Camiseta Juego Local FCB 25/26', sku: 'FCB-HOME-25', category: 'camiseta_juego', stock_total: 40, stock_available: 32, stock_min: 10, location: 'Palau Blaugrana — Almacén A', qr_code: 'FCB-HOME-25', size: 'XL', price: 85, unit_cost: 85, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i2', name: 'Camiseta Juego Visitante FCB 25/26', sku: 'FCB-AWAY-25', category: 'camiseta_juego', stock_total: 35, stock_available: 28, stock_min: 10, location: 'Palau Blaugrana — Almacén A', qr_code: 'FCB-AWAY-25', size: 'L', price: 85, unit_cost: 85, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i3', name: 'Pantalón Corto Juego FCB', sku: 'FCB-SHORTS', category: 'pantalon_juego', stock_total: 30, stock_available: 24, stock_min: 8, location: 'Almacén A', qr_code: 'FCB-SHORTS', size: 'XL', price: 45, unit_cost: 45, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i4', name: 'Zapatillas Pro Bounce FCB Edition', sku: 'FCB-SHOES', category: 'calzado', stock_total: 20, stock_available: 6, stock_min: 8, location: 'Almacén Calzado', qr_code: 'FCB-SHOES', size: '47', price: 120, unit_cost: 120, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i5', name: 'Chándal Completo Entrenamiento', sku: 'FCB-TRACK', category: 'entrenamiento', stock_total: 50, stock_available: 45, stock_min: 15, location: 'Ciutat Esportiva', qr_code: 'FCB-TRACK', size: 'XXL', price: 95, unit_cost: 95, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
];

export const fcbRequests = [
  { id: 'r1', playerId: 'p9', playerName: 'Álex Abrines', itemName: 'Camiseta Juego Local FCB 25/26', quantity: 2, size: 'XL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Euroliga — partido en Belgrado' },
  { id: 'r2', playerId: 'p11', playerName: 'Jan Vesely', itemName: 'Zapatillas Pro Bounce FCB Edition', quantity: 1, size: '49', status: 'APPROVED', requestDate: '2026-06-17', notes: 'Reposición calzado competición' },
  { id: 'r3', playerId: 'p5', playerName: 'Kevin Punter', itemName: 'Chándal Completo Entrenamiento', quantity: 1, size: 'XL', status: 'DELIVERED', requestDate: '2026-06-15', notes: 'Entrega vestuario completada' },
  { id: 'r4', playerId: 'p12', playerName: 'Willy Hernangómez', itemName: 'Camiseta Visitante FCB 25/26', quantity: 1, size: 'XXL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Rotura costura en Clásico ACB' },
  { id: 'r5', playerId: 'p1', playerName: 'Tomás Satoransky', itemName: 'Camiseta Juego Local FCB 25/26', quantity: 1, size: 'XL', status: 'PENDING', requestDate: '2026-06-19', notes: 'Viaje Euroliga — Atenas' },
];

export const fcbTrips = [
  { id: 't1', destination: 'Atenas', opponent: 'Panathinaikos', departureDate: '2026-06-22', returnDate: '2026-06-24', status: 'planificado', packingList: [{ id: 'tp1', itemName: 'Equipación Visitante', quantityRequired: 14, quantityPacked: 8, category: 'camiseta_juego', isPacked: false }], notes: 'Euroliga — maleta logística prioritaria (14 jugadores plantilla)' },
  { id: 't2', destination: 'Madrid', opponent: 'Real Madrid', departureDate: '2026-06-28', returnDate: '2026-06-28', status: 'planificado', packingList: [{ id: 'tp2', itemName: 'Equipación Local', quantityRequired: 14, quantityPacked: 14, category: 'camiseta_juego', isPacked: true }], notes: 'Clásico ACB — WiZink Center' },
];

export const fcbAlerts = [
  { id: 'a1', team_id: 'fcb', type: 'stock_bajo', severity: 'critical', title: 'Stock Crítico', message: 'Zapatillas Pro Bounce FCB Edition bajo mínimos (6 unidades)', entity_type: 'inventory_item', entity_id: 'i4', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T08:30:00.000Z' },
  { id: 'a2', team_id: 'fcb', type: 'solicitud_pendiente', severity: 'info', message: 'Nueva solicitud de Álex Abrines — camiseta local', entity_type: 'request', entity_id: 'r1', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T09:15:00.000Z' },
  { id: 'a3', team_id: 'fcb', type: 'solicitud_pendiente', severity: 'info', message: 'Tomás Satoransky solicita equipación para viaje a Atenas', entity_type: 'request', entity_id: 'r5', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-19T09:00:00.000Z' },
];

export const fcbLaundry = [
  { id: 'l1', name: 'Lote Entrenamiento Palau Blaugrana', itemCount: 22, status: 'WASHING', receivedDate: '2026-06-18', responsible: 'Carlos R. Kobe (Utillero)' },
  { id: 'l2', name: 'Juego vs Baskonia', itemCount: 16, status: 'READY', receivedDate: '2026-06-17', completedDate: '2026-06-18', responsible: 'Carlos R. Kobe (Utillero)' },
];

export const fcbCoachingStaff = [
  { id: 'c1', full_name: 'Roger Grimau', role: 'Entrenador Principal', email: 'rgrimau@fcbarcelona.cat', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España', profile_url: 'https://www.fcbarcelona.es/es/baloncesto/primer-equipo/jugadores' },
  { id: 'c2', full_name: 'Jose Ramón Cortés', role: 'Entrenador Asistente', email: 'jrcortes@fcbarcelona.cat', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
  { id: 'c3', full_name: 'Roberto Acosta', role: 'Entrenador Asistente', email: 'racosta@fcbarcelona.cat', shirt_size: 'XL', shorts_size: 'L', shoe_size: 44, nationality: 'España' },
  { id: 'c4', full_name: 'Pau Gómez', role: 'Preparador Físico', email: 'pgomez@fcbarcelona.cat', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
  { id: 'c5', full_name: 'Jordi Busquets', role: 'Fisioterapeuta', email: 'jbusquets@fcbarcelona.cat', shirt_size: 'M', shorts_size: 'M', shoe_size: 42, nationality: 'España' },
];
