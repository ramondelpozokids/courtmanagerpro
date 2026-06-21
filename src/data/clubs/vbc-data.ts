function avatar(name: string, bg: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=384&bold=true`;
}

const accent = 'FF6600';

export const vbcPlayers = [
  { id: 'p1', firstName: 'Brandon', lastName: 'Davies', number: 35, position: 'pivot', status: 'ACTIVE', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '50', socks: 'XL', warmupShirt: 'XXL' }, nationality: 'Estados Unidos', birthDate: '1991-07-17', imageUrl: avatar('Brandon Davies', accent), birth_place: 'Philadelphia', weight: '115 kg.', height: '2,08 m.', matches_played: 50, points: 720, rebounds: 380, assists: 90, palmares: ['1 Euroliga', '2 Ligas ACB'] },
  { id: 'p2', firstName: 'Semi', lastName: 'Ojeleye', number: 37, position: 'ala-pivot', status: 'ACTIVE', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '48', socks: 'XL', warmupShirt: 'XXL' }, nationality: 'Nigeria', birthDate: '1994-12-05', imageUrl: avatar('Semi Ojeleye', accent), birth_place: 'Lagos', weight: '111 kg.', height: '2,01 m.', matches_played: 45, points: 510, rebounds: 220, assists: 45, palmares: ['1 Liga ACB'] },
  { id: 'p3', firstName: 'Chris', lastName: 'Jones', number: 3, position: 'base', status: 'ACTIVE', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' }, nationality: 'Estados Unidos', birthDate: '1991-04-04', imageUrl: avatar('Chris Jones', accent), birth_place: 'Houston', weight: '86 kg.', height: '1,88 m.', matches_played: 52, points: 680, rebounds: 60, assists: 190, palmares: ['MVP Liga BCL'] },
  { id: 'p4', firstName: 'Tyson', lastName: 'Pérez', number: 8, position: 'alero', status: 'ACTIVE', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' }, nationality: 'Cuba', birthDate: '1994-07-26', imageUrl: avatar('Tyson Perez', accent), birth_place: 'La Habana', weight: '98 kg.', height: '2,03 m.', matches_played: 38, points: 420, rebounds: 110, assists: 55, palmares: ['1 Liga ACB'] },
  { id: 'p5', firstName: 'Josep', lastName: 'Puerto', number: 5, position: 'alero', status: 'ACTIVE', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' }, nationality: 'España', birthDate: '1994-03-11', imageUrl: avatar('Josep Puerto', accent), birth_place: 'Inca', weight: '90 kg.', height: '1,96 m.', matches_played: 48, points: 390, rebounds: 85, assists: 70, palmares: ['1 Copa del Rey', '1 Supercopa'] },
  { id: 'p6', firstName: 'Xabi', lastName: 'López-Arostegui', number: 16, position: 'base', status: 'ACTIVE', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' }, nationality: 'España', birthDate: '1997-05-19', imageUrl: avatar('Xabi Lopez', accent), birth_place: 'Bilbao', weight: '84 kg.', height: '1,90 m.', matches_played: 42, points: 450, rebounds: 55, assists: 120, palmares: ['1 Copa del Rey'] },
  { id: 'p7', firstName: 'Jaime', lastName: 'Pradilla', number: 22, position: 'ala-pivot', status: 'ACTIVE', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' }, nationality: 'España', birthDate: '2001-07-08', imageUrl: avatar('Jaime Pradilla', accent), birth_place: 'Valencia', weight: '102 kg.', height: '2,05 m.', matches_played: 35, points: 280, rebounds: 140, assists: 30, palmares: ['Oro Eurobasket U20'] },
  { id: 'p8', firstName: 'Dejan', lastName: 'Todorovic', number: 12, position: 'pivot', status: 'ACTIVE', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '49', socks: 'XL', warmupShirt: 'XXL' }, nationality: 'Serbia', birthDate: '1997-12-10', imageUrl: avatar('Dejan Todorovic', accent), birth_place: 'Belgrado', weight: '108 kg.', height: '2,10 m.', matches_played: 30, points: 240, rebounds: 160, assists: 15, palmares: ['1 Liga Serbia'] },
  { id: 'p9', firstName: 'Stefan', lastName: 'Jankovic', number: 15, position: 'ala-pivot', status: 'ACTIVE', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' }, nationality: 'Serbia', birthDate: '1993-02-01', imageUrl: avatar('Stefan Jankovic', accent), birth_place: 'Belgrado', weight: '100 kg.', height: '2,07 m.', matches_played: 40, points: 350, rebounds: 130, assists: 40, palmares: ['1 Euroliga'] },
  { id: 'p10', firstName: 'Vanja', lastName: 'Marinkovic', number: 9, position: 'alero', status: 'ACTIVE', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' }, nationality: 'Serbia', birthDate: '1997-02-11', imageUrl: avatar('Vanja Marinkovic', accent), birth_place: 'Belgrado', weight: '96 kg.', height: '2,01 m.', matches_played: 44, points: 480, rebounds: 75, assists: 50, palmares: ['1 Euroliga'] },
  { id: 'p11', firstName: 'Sergi', lastName: 'García', number: 17, position: 'base', status: 'ACTIVE', sizes: { jersey: 'M', shorts: 'M', shoes: '42', socks: 'M', warmupShirt: 'M' }, nationality: 'España', birthDate: '2000-01-15', imageUrl: avatar('Sergi Garcia', accent), birth_place: 'Valencia', weight: '80 kg.', height: '1,87 m.', matches_played: 25, points: 150, rebounds: 30, assists: 55, palmares: ['Cantera VBC'] },
  { id: 'p12', firstName: 'Davor', lastName: 'Prgomet', number: 44, position: 'pivot', status: 'ACTIVE', sizes: { jersey: 'XXXL', shorts: 'XXXL', shoes: '51', socks: 'XL', warmupShirt: 'XXXL' }, nationality: 'Croacia', birthDate: '1999-04-20', imageUrl: avatar('Davor Prgomet', accent), birth_place: 'Split', weight: '118 kg.', height: '2,12 m.', matches_played: 28, points: 220, rebounds: 145, assists: 18, palmares: ['1 Liga Croacia'] },
];

export const vbcInventory = [
  { id: 'i1', name: 'Camiseta Juego Local VBC 25/26', sku: 'VBC-HOME-25', category: 'camiseta_juego', stock_total: 38, stock_available: 30, stock_min: 10, location: 'Roig Arena — Almacén', qr_code: 'VBC-HOME-25', size: 'XL', price: 80, unit_cost: 80, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
  { id: 'i2', name: 'Camiseta Juego Visitante VBC 25/26', sku: 'VBC-AWAY-25', category: 'camiseta_juego', stock_total: 32, stock_available: 26, stock_min: 10, location: 'Roig Arena — Almacén', qr_code: 'VBC-AWAY-25', size: 'L', price: 80, unit_cost: 80, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
  { id: 'i3', name: 'Pantalón Corto Juego VBC', sku: 'VBC-SHORTS', category: 'pantalon_juego', stock_total: 28, stock_available: 22, stock_min: 8, location: 'Almacén Principal', qr_code: 'VBC-SHORTS', size: 'XL', price: 42, unit_cost: 42, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
  { id: 'i4', name: 'Zapatillas Pro Bounce VBC Edition', sku: 'VBC-SHOES', category: 'calzado', stock_total: 18, stock_available: 4, stock_min: 8, location: 'Almacén Calzado', qr_code: 'VBC-SHOES', size: '47', price: 115, unit_cost: 115, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
  { id: 'i5', name: 'Chándal Naranja Entrenamiento', sku: 'VBC-TRACK', category: 'entrenamiento', stock_total: 45, stock_available: 40, stock_min: 15, location: 'Ciudad Deportiva', qr_code: 'VBC-TRACK', size: 'XXL', price: 90, unit_cost: 90, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/vbc/logo.svg' },
];

export const vbcRequests = [
  { id: 'r1', playerId: 'p1', playerName: 'Brandon Davies', itemName: 'Camiseta Juego Local VBC 25/26', quantity: 2, size: 'XXL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Playoffs ACB — reposición urgente' },
  { id: 'r2', playerId: 'p3', playerName: 'Chris Jones', itemName: 'Zapatillas Pro Bounce VBC Edition', quantity: 1, size: '44', status: 'APPROVED', requestDate: '2026-06-17', notes: 'Calzado competición Euroliga' },
  { id: 'r3', playerId: 'p5', playerName: 'Josep Puerto', itemName: 'Chándal Naranja Entrenamiento', quantity: 1, size: 'L', status: 'DELIVERED', requestDate: '2026-06-14', notes: 'Entrega completada' },
  { id: 'r4', playerId: 'p7', playerName: 'Jaime Pradilla', itemName: 'Camiseta Visitante VBC 25/26', quantity: 1, size: 'XL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Talla actualizada' },
];

export const vbcTrips = [
  { id: 't1', destination: 'Barcelona', opponent: 'FC Barcelona', departureDate: '2026-06-21', returnDate: '2026-06-21', status: 'planificado', packingList: [{ id: 'tp1', itemName: 'Equipación Visitante', quantityRequired: 13, quantityPacked: 10, category: 'camiseta_juego', isPacked: false }], notes: 'Palau Blaugrana — logística partido clave' },
  { id: 't2', destination: 'Madrid', opponent: 'Real Madrid', departureDate: '2026-06-27', returnDate: '2026-06-27', status: 'planificado', packingList: [{ id: 'tp2', itemName: 'Equipación Visitante', quantityRequired: 13, quantityPacked: 0, category: 'camiseta_juego', isPacked: false }], notes: 'WiZink Center — semifinal playoff' },
];

export const vbcAlerts = [
  { id: 'a1', team_id: 'vbc', type: 'stock_bajo', severity: 'critical', title: 'Stock Crítico', message: 'Zapatillas Pro Bounce VBC Edition bajo mínimos (4 unidades)', entity_type: 'inventory_item', entity_id: 'i4', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T08:30:00.000Z' },
  { id: 'a2', team_id: 'vbc', type: 'solicitud_pendiente', severity: 'info', message: 'Nueva solicitud de Brandon Davies — camiseta local', entity_type: 'request', entity_id: 'r1', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T09:15:00.000Z' },
];

export const vbcLaundry = [
  { id: 'l1', name: 'Lote Entrenamiento Roig Arena', itemCount: 20, status: 'WASHING', receivedDate: '2026-06-18', responsible: 'Carlos R. Kobe (Utillero)' },
  { id: 'l2', name: 'Juego vs Joventut', itemCount: 14, status: 'READY', receivedDate: '2026-06-16', completedDate: '2026-06-17', responsible: 'Carlos R. Kobe (Utillero)' },
];
