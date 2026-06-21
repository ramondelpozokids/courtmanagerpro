function avatar(name: string, bg: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=384&bold=true`;
}

const accent = 'FF6600';

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
    birth_place: 'Valencia',
    matches_played: 28,
    points: 320,
    rebounds: 80,
    assists: 45,
    palmares: ['Valencia Basket — Plantilla 25/26'],
  };
}

/** Plantilla oficial demo — Equipo Masculino Valencia Basket 25/26 (valenciabasket.com) */
export const vbcPlayers = [
  // Bases
  mk({ id: 'p1', firstName: 'Sergio', lastName: 'De Larrea', number: 5, position: 'base', nationality: 'España', birthDate: '2005-12-15', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p2', firstName: 'Darius', lastName: 'Thompson', number: 13, position: 'base', nationality: 'Estados Unidos', birthDate: '2000-05-08', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p3', firstName: 'Álvaro', lastName: 'Cárdenas', number: 23, position: 'base', nationality: 'España', birthDate: '2005-03-28', sizes: { jersey: 'M', shorts: 'M', shoes: '42', socks: 'M', warmupShirt: 'M' } }),
  // Escoltas
  mk({ id: 'p4', firstName: 'Brancou', lastName: 'Badio', number: 0, position: 'escolta', nationality: 'Francia', birthDate: '2001-07-27', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p5', firstName: 'Jean', lastName: 'Montero', number: 8, position: 'escolta', nationality: 'Rep. Dominicana', birthDate: '2003-07-03', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p6', firstName: 'Omari', lastName: 'Moore', number: 10, position: 'escolta', nationality: 'Estados Unidos', birthDate: '2001-09-14', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' } }),
  // Aleros
  mk({ id: 'p7', firstName: 'Kameron', lastName: 'Taylor', number: 1, position: 'alero', nationality: 'Estados Unidos', birthDate: '1997-05-11', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p8', firstName: 'Josep', lastName: 'Puerto', number: 2, position: 'alero', nationality: 'España', birthDate: '1994-03-11', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p9', firstName: 'Xabi', lastName: 'López-Arostegui', number: 6, position: 'alero', nationality: 'España', birthDate: '1997-05-19', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p10', firstName: 'Isaac', lastName: 'Nogués', number: 32, position: 'alero', nationality: 'España', birthDate: '2003-08-12', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' } }),
  // Ala-pívots
  mk({ id: 'p11', firstName: 'Jaime', lastName: 'Pradilla', number: 4, position: 'ala-pivot', nationality: 'España', birthDate: '2001-07-08', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p12', firstName: 'Braxton', lastName: 'Key', number: 7, position: 'ala-pivot', nationality: 'Estados Unidos', birthDate: '1997-02-14', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '48', socks: 'XL', warmupShirt: 'XXL' } }),
  // Pívots
  mk({ id: 'p13', firstName: 'Nate', lastName: 'Reuvers', number: 3, position: 'pivot', nationality: 'Estados Unidos', birthDate: '1999-03-21', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '49', socks: 'XL', warmupShirt: 'XXL' } }),
  mk({ id: 'p14', firstName: 'Neal', lastName: 'Sako', number: 12, position: 'pivot', nationality: 'Francia', birthDate: '2002-08-13', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '50', socks: 'XL', warmupShirt: 'XXL' } }),
  mk({ id: 'p15', firstName: 'Matt', lastName: 'Costello', number: 24, position: 'pivot', nationality: 'Reino Unido', birthDate: '1993-07-05', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '49', socks: 'XL', warmupShirt: 'XXL' } }),
  mk({ id: 'p16', firstName: 'Yankuba', lastName: 'Sima', number: 77, position: 'pivot', nationality: 'España', birthDate: '1997-07-01', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '50', socks: 'XL', warmupShirt: 'XXL' } }),
];

export const vbcInventory = [
  { id: 'i1', name: 'Camiseta Juego Local VBC 25/26', sku: 'VBC-HOME-25', category: 'camiseta_juego', stock_total: 40, stock_available: 32, stock_min: 10, location: 'Roig Arena — Almacén', qr_code: 'VBC-HOME-25', size: 'XL', price: 80, unit_cost: 80, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
  { id: 'i2', name: 'Camiseta Juego Visitante VBC 25/26', sku: 'VBC-AWAY-25', category: 'camiseta_juego', stock_total: 35, stock_available: 28, stock_min: 10, location: 'Roig Arena — Almacén', qr_code: 'VBC-AWAY-25', size: 'L', price: 80, unit_cost: 80, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
  { id: 'i3', name: 'Pantalón Corto Juego VBC', sku: 'VBC-SHORTS', category: 'pantalon_juego', stock_total: 30, stock_available: 24, stock_min: 8, location: 'Almacén Principal', qr_code: 'VBC-SHORTS', size: 'XL', price: 42, unit_cost: 42, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
  { id: 'i4', name: 'Zapatillas Pro Bounce VBC Edition', sku: 'VBC-SHOES', category: 'calzado', stock_total: 20, stock_available: 4, stock_min: 8, location: 'Almacén Calzado', qr_code: 'VBC-SHOES', size: '47', price: 115, unit_cost: 115, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
  { id: 'i5', name: 'Chándal Naranja Entrenamiento', sku: 'VBC-TRACK', category: 'entrenamiento', stock_total: 48, stock_available: 42, stock_min: 15, location: 'Ciudad Deportiva', qr_code: 'VBC-TRACK', size: 'XXL', price: 90, unit_cost: 90, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
];

export const vbcRequests = [
  { id: 'r1', playerId: 'p11', playerName: 'Jaime Pradilla', itemName: 'Camiseta Juego Local VBC 25/26', quantity: 2, size: 'XL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Playoffs ACB — reposición urgente' },
  { id: 'r2', playerId: 'p1', playerName: 'Sergio De Larrea', itemName: 'Zapatillas Pro Bounce VBC Edition', quantity: 1, size: '43', status: 'APPROVED', requestDate: '2026-06-17', notes: 'Calzado competición Euroliga' },
  { id: 'r3', playerId: 'p8', playerName: 'Josep Puerto', itemName: 'Chándal Naranja Entrenamiento', quantity: 1, size: 'L', status: 'DELIVERED', requestDate: '2026-06-14', notes: 'Entrega completada' },
  { id: 'r4', playerId: 'p16', playerName: 'Yankuba Sima', itemName: 'Camiseta Visitante VBC 25/26', quantity: 1, size: 'XXL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Viaje a Barcelona — Clásico ACB' },
  { id: 'r5', playerId: 'p9', playerName: 'Xabi López-Arostegui', itemName: 'Camiseta Juego Local VBC 25/26', quantity: 1, size: 'L', status: 'PENDING', requestDate: '2026-06-19', notes: 'Rotura costura en entrenamiento' },
];

export const vbcTrips = [
  { id: 't1', destination: 'Barcelona', opponent: 'FC Barcelona', departureDate: '2026-06-21', returnDate: '2026-06-21', status: 'planificado', packingList: [{ id: 'tp1', itemName: 'Equipación Visitante', quantityRequired: 16, quantityPacked: 12, category: 'camiseta_juego', isPacked: false }], notes: 'Palau Blaugrana — logística partido clave (16 jugadores plantilla)' },
  { id: 't2', destination: 'Madrid', opponent: 'Real Madrid', departureDate: '2026-06-27', returnDate: '2026-06-27', status: 'planificado', packingList: [{ id: 'tp2', itemName: 'Equipación Visitante', quantityRequired: 16, quantityPacked: 0, category: 'camiseta_juego', isPacked: false }], notes: 'WiZink Center — semifinal playoff' },
];

export const vbcAlerts = [
  { id: 'a1', team_id: 'vbc', type: 'stock_bajo', severity: 'critical', title: 'Stock Crítico', message: 'Zapatillas Pro Bounce VBC Edition bajo mínimos (4 unidades)', entity_type: 'inventory_item', entity_id: 'i4', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T08:30:00.000Z' },
  { id: 'a2', team_id: 'vbc', type: 'solicitud_pendiente', severity: 'info', message: 'Nueva solicitud de Jaime Pradilla — camiseta local', entity_type: 'request', entity_id: 'r1', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T09:15:00.000Z' },
  { id: 'a3', team_id: 'vbc', type: 'solicitud_pendiente', severity: 'info', message: 'Xabi López-Arostegui solicita camiseta local', entity_type: 'request', entity_id: 'r5', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-19T09:00:00.000Z' },
];

export const vbcLaundry = [
  { id: 'l1', name: 'Lote Entrenamiento Roig Arena', itemCount: 24, status: 'WASHING', receivedDate: '2026-06-18', responsible: 'Carlos R. Kobe (Utillero)' },
  { id: 'l2', name: 'Juego vs Joventut', itemCount: 18, status: 'READY', receivedDate: '2026-06-16', completedDate: '2026-06-17', responsible: 'Carlos R. Kobe (Utillero)' },
];

export const vbcCoachingStaff = [
  { id: 'c1', full_name: 'Pedro Martínez', role: 'Entrenador Principal', email: 'pmartinez@valenciabasket.com', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
  { id: 'c2', full_name: 'Adrián Kovács', role: 'Entrenador Ayudante', email: 'akovacs@valenciabasket.com', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'Hungría' },
  { id: 'c3', full_name: 'Xavi Albert', role: 'Entrenador Ayudante', email: 'xalbert@valenciabasket.com', shirt_size: 'M', shorts_size: 'M', shoe_size: 42, nationality: 'España' },
  { id: 'c4', full_name: 'Juan Maroto', role: 'Entrenador Ayudante', email: 'jmaroto@valenciabasket.com', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
  { id: 'c5', full_name: 'Rubén Portes', role: 'Preparador Físico', email: 'rportes@valenciabasket.com', shirt_size: 'XL', shorts_size: 'L', shoe_size: 44, nationality: 'España' },
];
