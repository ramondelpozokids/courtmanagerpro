function avatar(name: string, bg: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=384&bold=true`;
}

const accent = 'A50044';

export const fcbPlayers = [
  { id: 'p1', firstName: 'Alex', lastName: 'Abrines', number: 8, position: 'alero', status: 'ACTIVE', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' }, nationality: 'España', birthDate: '1993-08-01', imageUrl: avatar('Alex Abrines', accent), birth_place: 'Palma de Mallorca', weight: '95 kg.', height: '1,98 m.', matches_played: 42, points: 512, rebounds: 98, assists: 45, palmares: ['1 Euroliga', '2 Ligas ACB', '1 Copa del Rey'] },
  { id: 'p2', firstName: 'Niko', lastName: 'Mirotic', number: 33, position: 'pivot', status: 'ACTIVE', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '48', socks: 'XL', warmupShirt: 'XXL' }, nationality: 'España', birthDate: '1990-02-11', imageUrl: avatar('Niko Mirotic', accent), birth_place: 'Barcelona', weight: '102 kg.', height: '2,08 m.', matches_played: 55, points: 890, rebounds: 310, assists: 120, palmares: ['1 Euroliga', '3 Ligas ACB', '2 Copas del Rey'] },
  { id: 'p3', firstName: 'Juancho', lastName: 'Hernangómez', number: 41, position: 'ala-pivot', status: 'ACTIVE', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '49', socks: 'XL', warmupShirt: 'XXL' }, nationality: 'España', birthDate: '1995-09-28', imageUrl: avatar('Juancho Hernangomez', accent), birth_place: 'Madrid', weight: '104 kg.', height: '2,06 m.', matches_played: 38, points: 445, rebounds: 180, assists: 55, palmares: ['1 Eurobasket', '1 Liga ACB'] },
  { id: 'p4', firstName: 'Kyle', lastName: 'Guy', number: 2, position: 'base', status: 'ACTIVE', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' }, nationality: 'Estados Unidos', birthDate: '1997-12-02', imageUrl: avatar('Kyle Guy', accent), birth_place: 'Indianapolis', weight: '77 kg.', height: '1,88 m.', matches_played: 40, points: 520, rebounds: 40, assists: 95, palmares: ['1 NCAA', '1 Liga ACB'] },
  { id: 'p5', firstName: 'Tomás', lastName: 'Satoransky', number: 6, position: 'base', status: 'ACTIVE', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' }, nationality: 'Rep. Checa', birthDate: '1991-10-30', imageUrl: avatar('Tomas Satoransky', accent), birth_place: 'Praga', weight: '95 kg.', height: '2,01 m.', matches_played: 48, points: 380, rebounds: 120, assists: 210, palmares: ['1 Euroliga', '2 Ligas ACB'] },
  { id: 'p6', firstName: 'James', lastName: 'Nnaji', number: 19, position: 'pivot', status: 'ACTIVE', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '50', socks: 'XL', warmupShirt: 'XXL' }, nationality: 'Nigeria', birthDate: '2002-10-01', imageUrl: avatar('James Nnaji', accent), birth_place: 'Kaduna', weight: '108 kg.', height: '2,11 m.', matches_played: 35, points: 290, rebounds: 165, assists: 20, palmares: ['Campeón ABA League U19'] },
  { id: 'p7', firstName: 'Hugo', lastName: 'González', number: 23, position: 'base', status: 'ACTIVE', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' }, nationality: 'España', birthDate: '2006-02-05', imageUrl: avatar('Hugo Gonzalez', accent), birth_place: 'Madrid', weight: '82 kg.', height: '1,93 m.', matches_played: 28, points: 210, rebounds: 45, assists: 60, palmares: ['Oro Eurobasket U18'] },
  { id: 'p8', firstName: 'Michael', lastName: 'Caicedo', number: 25, position: 'alero', status: 'ACTIVE', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' }, nationality: 'España', birthDate: '2003-04-04', imageUrl: avatar('Michael Caicedo', accent), birth_place: 'Barcelona', weight: '88 kg.', height: '2,00 m.', matches_played: 22, points: 145, rebounds: 55, assists: 25, palmares: ['Campeón Liga U'] },
  { id: 'p9', firstName: 'Roger', lastName: 'Carulla', number: 16, position: 'base', status: 'ACTIVE', sizes: { jersey: 'M', shorts: 'M', shoes: '42', socks: 'M', warmupShirt: 'M' }, nationality: 'España', birthDate: '2004-08-16', imageUrl: avatar('Roger Carulla', accent), birth_place: 'Barcelona', weight: '78 kg.', height: '1,85 m.', matches_played: 18, points: 95, rebounds: 20, assists: 40, palmares: ['Cantera FCB'] },
  { id: 'p10', firstName: 'Kaspar', lastName: 'Tambja', number: 44, position: 'alero', status: 'ACTIVE', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' }, nationality: 'Estonia', birthDate: '2000-05-14', imageUrl: avatar('Kaspar Tambja', accent), birth_place: 'Tallin', weight: '92 kg.', height: '2,03 m.', matches_played: 30, points: 260, rebounds: 70, assists: 35, palmares: ['1 Liga Estonia'] },
  { id: 'p11', firstName: 'Pau', lastName: 'Ribas', number: 5, position: 'base', status: 'ACTIVE', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' }, nationality: 'España', birthDate: '1987-03-05', imageUrl: avatar('Pau Ribas', accent), birth_place: 'Barcelona', weight: '88 kg.', height: '1,92 m.', matches_played: 62, points: 410, rebounds: 80, assists: 180, palmares: ['1 Euroliga', '4 Ligas ACB', '1 Eurobasket'] },
  { id: 'p12', firstName: 'Nicola', lastName: 'Laprovittola', number: 20, position: 'base', status: 'ACTIVE', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' }, nationality: 'Argentina', birthDate: '1990-01-31', imageUrl: avatar('Nicola Laprovittola', accent), birth_place: 'Mar del Plata', weight: '84 kg.', height: '1,90 m.', matches_played: 44, points: 480, rebounds: 50, assists: 130, palmares: ['1 Euroliga', '1 Oro Olímpico'] },
];

export const fcbInventory = [
  { id: 'i1', name: 'Camiseta Juego Local FCB 25/26', sku: 'FCB-HOME-25', category: 'camiseta_juego', stock_total: 40, stock_available: 32, stock_min: 10, location: 'Palau Blaugrana — Almacén A', qr_code: 'FCB-HOME-25', size: 'XL', price: 85, unit_cost: 85, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i2', name: 'Camiseta Juego Visitante FCB 25/26', sku: 'FCB-AWAY-25', category: 'camiseta_juego', stock_total: 35, stock_available: 28, stock_min: 10, location: 'Palau Blaugrana — Almacén A', qr_code: 'FCB-AWAY-25', size: 'L', price: 85, unit_cost: 85, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i3', name: 'Pantalón Corto Juego FCB', sku: 'FCB-SHORTS', category: 'pantalon_juego', stock_total: 30, stock_available: 24, stock_min: 8, location: 'Almacén A', qr_code: 'FCB-SHORTS', size: 'XL', price: 45, unit_cost: 45, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i4', name: 'Zapatillas Pro Bounce FCB Edition', sku: 'FCB-SHOES', category: 'calzado', stock_total: 20, stock_available: 6, stock_min: 8, location: 'Almacén Calzado', qr_code: 'FCB-SHOES', size: '47', price: 120, unit_cost: 120, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i5', name: 'Chándal Completo Entrenamiento', sku: 'FCB-TRACK', category: 'entrenamiento', stock_total: 50, stock_available: 45, stock_min: 15, location: 'Ciutat Esportiva', qr_code: 'FCB-TRACK', size: 'XXL', price: 95, unit_cost: 95, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
];

export const fcbRequests = [
  { id: 'r1', playerId: 'p1', playerName: 'Alex Abrines', itemName: 'Camiseta Juego Local FCB 25/26', quantity: 2, size: 'XL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Euroliga — partido en Belgrado' },
  { id: 'r2', playerId: 'p2', playerName: 'Niko Mirotic', itemName: 'Zapatillas Pro Bounce FCB Edition', quantity: 1, size: '48', status: 'APPROVED', requestDate: '2026-06-17', notes: 'Reposición calzado competición' },
  { id: 'r3', playerId: 'p4', playerName: 'Kyle Guy', itemName: 'Chándal Completo Entrenamiento', quantity: 1, size: 'L', status: 'DELIVERED', requestDate: '2026-06-15', notes: 'Entrega vestuario completada' },
  { id: 'r4', playerId: 'p3', playerName: 'Juancho Hernangómez', itemName: 'Camiseta Visitante FCB 25/26', quantity: 1, size: 'XXL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Rotura costura en Clásico ACB' },
];

export const fcbTrips = [
  { id: 't1', destination: 'Atenas', opponent: 'Panathinaikos', departureDate: '2026-06-22', returnDate: '2026-06-24', status: 'planificado', packingList: [{ id: 'tp1', itemName: 'Equipación Visitante', quantityRequired: 14, quantityPacked: 8, category: 'camiseta_juego', isPacked: false }], notes: 'Euroliga — maleta logística prioritaria' },
  { id: 't2', destination: 'Madrid', opponent: 'Real Madrid', departureDate: '2026-06-28', returnDate: '2026-06-28', status: 'planificado', packingList: [{ id: 'tp2', itemName: 'Equipación Local', quantityRequired: 14, quantityPacked: 14, category: 'camiseta_juego', isPacked: true }], notes: 'Clásico ACB — WiZink Center' },
];

export const fcbAlerts = [
  { id: 'a1', team_id: 'fcb', type: 'stock_bajo', severity: 'critical', title: 'Stock Crítico', message: 'Zapatillas Pro Bounce FCB Edition bajo mínimos (6 unidades)', entity_type: 'inventory_item', entity_id: 'i4', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T08:30:00.000Z' },
  { id: 'a2', team_id: 'fcb', type: 'solicitud_pendiente', severity: 'info', message: 'Nueva solicitud de Alex Abrines — camiseta local', entity_type: 'request', entity_id: 'r1', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T09:15:00.000Z' },
];

export const fcbLaundry = [
  { id: 'l1', name: 'Lote Entrenamiento Palau Blaugrana', itemCount: 22, status: 'WASHING', receivedDate: '2026-06-18', responsible: 'Carlos R. Kobe (Utillero)' },
  { id: 'l2', name: 'Juego vs Baskonia', itemCount: 16, status: 'READY', receivedDate: '2026-06-17', completedDate: '2026-06-18', responsible: 'Carlos R. Kobe (Utillero)' },
];
