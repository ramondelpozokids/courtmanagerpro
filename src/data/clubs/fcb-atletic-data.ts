function avatar(name: string, bg: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=384&bold=true`;
}

const accent = '004D98';

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
    matches_played: 18,
    points: 120,
    rebounds: 45,
    assists: 25,
    palmares: ['Barça Atlètic — Plantilla U22 25/26'],
  };
}

/** Plantilla oficial demo — Barça Atlètic U22 25/26 (2526_BASQUET_u22) */
export const fbatPlayers = [
  mk({ id: 'p1', firstName: 'Ma Samba', lastName: 'Gueye', number: 4, position: 'ala-pivot', nationality: 'Senegal', birthDate: '2005-03-12', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p2', firstName: 'Nil', lastName: 'Poza Cervantes', number: 7, position: 'base', nationality: 'España', birthDate: '2006-01-18', sizes: { jersey: 'M', shorts: 'M', shoes: '42', socks: 'M', warmupShirt: 'M' } }),
  mk({ id: 'p3', firstName: 'Oriol', lastName: 'Filbà González', number: 11, position: 'escolta', nationality: 'España', birthDate: '2005-09-22', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p4', firstName: 'Jakob', lastName: 'Siftar', number: 14, position: 'alero', nationality: 'Eslovenia', birthDate: '2005-06-04', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p5', firstName: 'Eric', lastName: 'Montaner García', number: 15, position: 'base', nationality: 'España', birthDate: '2005-11-30', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p6', firstName: 'Diego', lastName: 'Ferreras Camarero', number: 17, position: 'escolta', nationality: 'España', birthDate: '2006-02-08', sizes: { jersey: 'M', shorts: 'M', shoes: '42', socks: 'M', warmupShirt: 'M' } }),
  mk({ id: 'p7', firstName: 'Nikola', lastName: 'Kusturica', number: 19, position: 'pivot', nationality: 'Serbia', birthDate: '2005-04-15', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p8', firstName: 'Joaquim', lastName: 'Bertrand Boumtje Boumtje', number: 21, position: 'ala-pivot', nationality: 'Camerún', birthDate: '2005-08-20', sizes: { jersey: 'XL', shorts: 'XL', shoes: '46', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p9', firstName: 'Abrahamane', lastName: 'Koné', number: 22, position: 'alero', nationality: 'Mali', birthDate: '2005-12-01', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p10', firstName: 'Mohamed Namakan', lastName: 'Keita', number: 24, position: 'pivot', nationality: 'Mali', birthDate: '2004-10-10', sizes: { jersey: 'XXL', shorts: 'XXL', shoes: '48', socks: 'XL', warmupShirt: 'XXL' } }),
  mk({ id: 'p11', firstName: 'Samuel Ikenna Emenike', lastName: 'Lozano', number: 25, position: 'escolta', nationality: 'España', birthDate: '2005-07-14', sizes: { jersey: 'L', shorts: 'L', shoes: '44', socks: 'M', warmupShirt: 'L' } }),
  mk({ id: 'p12', firstName: 'Sayon K.', lastName: 'Keita', number: 27, position: 'ala-pivot', nationality: 'Mali', birthDate: '2005-05-25', sizes: { jersey: 'XL', shorts: 'XL', shoes: '47', socks: 'L', warmupShirt: 'XL' } }),
  mk({ id: 'p13', firstName: 'Jan', lastName: 'Cerdán Palacios', number: 30, position: 'base', nationality: 'España', birthDate: '2006-03-03', sizes: { jersey: 'M', shorts: 'M', shoes: '42', socks: 'M', warmupShirt: 'M' } }),
  mk({ id: 'p14', firstName: 'Mohamed Samsoudine', lastName: 'Dabone', number: 33, position: 'alero', nationality: 'España', birthDate: '2005-01-09', sizes: { jersey: 'L', shorts: 'L', shoes: '43', socks: 'M', warmupShirt: 'L' } }),
];

export const fbatCoachingStaff = [
  { id: 'c1', full_name: 'Álvaro Salinas González', role: 'Primer Entrenador', email: 'salinas@fcbarcelona.cat', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
  { id: 'c2', full_name: 'Alex Rodríguez Colmenero', role: 'Entrenador Ajudante', email: 'arodriguez@fcbarcelona.cat', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
  { id: 'c3', full_name: 'Arnau Calsapeu Codina', role: 'Entrenador Ajudante', email: 'acalsapeu@fcbarcelona.cat', shirt_size: 'M', shorts_size: 'M', shoe_size: 42, nationality: 'España' },
  { id: 'c4', full_name: 'Aleix Vindel Quintana', role: 'Delegado', email: 'avindel@fcbarcelona.cat', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
  { id: 'c5', full_name: 'Biel Puig Gatell', role: 'Delegado', email: 'bpuig@fcbarcelona.cat', shirt_size: 'M', shorts_size: 'M', shoe_size: 42, nationality: 'España' },
  { id: 'c6', full_name: 'Francisco Javier Campos Martín', role: 'Fisioterapeuta', email: 'fjcampos@fcbarcelona.cat', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
  { id: 'c7', full_name: 'Francisco Javier Santana Barco', role: 'Preparador Físico', email: 'fjsantana@fcbarcelona.cat', shirt_size: 'XL', shorts_size: 'L', shoe_size: 44, nationality: 'España' },
  { id: 'c8', full_name: 'Ignasi Moix Gil', role: 'Doctor', email: 'imoix@fcbarcelona.cat', shirt_size: 'L', shorts_size: 'L', shoe_size: 43, nationality: 'España' },
];

export const fbatInventory = [
  { id: 'i1', name: 'Camiseta Juego Barça Atlètic U22 25/26', sku: 'FBAT-HOME-25', category: 'camiseta_juego', stock_total: 32, stock_available: 26, stock_min: 8, location: 'Ciutat Esportiva — Almacén Cantera', qr_code: 'FBAT-HOME-25', size: 'L', price: 65, unit_cost: 65, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i2', name: 'Camiseta Entrenamiento Cantera', sku: 'FBAT-TRAIN-25', category: 'entrenamiento', stock_total: 40, stock_available: 34, stock_min: 10, location: 'Ciutat Esportiva', qr_code: 'FBAT-TRAIN-25', size: 'L', price: 55, unit_cost: 55, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i3', name: 'Pantalón Corto Juego Cantera', sku: 'FBAT-SHORTS', category: 'pantalon_juego', stock_total: 28, stock_available: 22, stock_min: 8, location: 'Ciutat Esportiva', qr_code: 'FBAT-SHORTS', size: 'L', price: 35, unit_cost: 35, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i4', name: 'Zapatillas Cantera FCB', sku: 'FBAT-SHOES', category: 'calzado', stock_total: 18, stock_available: 5, stock_min: 6, location: 'Almacén Calzado', qr_code: 'FBAT-SHOES', size: '44', price: 95, unit_cost: 95, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
  { id: 'i5', name: 'Chándal Cantera Completo', sku: 'FBAT-TRACK', category: 'entrenamiento', stock_total: 42, stock_available: 38, stock_min: 12, location: 'Ciutat Esportiva', qr_code: 'FBAT-TRACK', size: 'XL', price: 75, unit_cost: 75, is_active: true, updated_at: new Date().toISOString(), image_url: '/clubs/fcb/logo.svg' },
];

export const fbatRequests = [
  { id: 'r1', playerId: 'p2', playerName: 'Nil Poza Cervantes', itemName: 'Camiseta Juego Barça Atlètic U22 25/26', quantity: 2, size: 'M', status: 'PENDING', requestDate: '2026-06-18', notes: 'Liga EBA — doble jornada' },
  { id: 'r2', playerId: 'p10', playerName: 'Mohamed Namakan Keita', itemName: 'Zapatillas Cantera FCB', quantity: 1, size: '48', status: 'APPROVED', requestDate: '2026-06-17', notes: 'Reposición calzado competición' },
  { id: 'r3', playerId: 'p3', playerName: 'Oriol Filbà González', itemName: 'Chándal Cantera Completo', quantity: 1, size: 'L', status: 'DELIVERED', requestDate: '2026-06-15', notes: 'Entrega vestuario completada' },
  { id: 'r4', playerId: 'p7', playerName: 'Nikola Kusturica', itemName: 'Camiseta Entrenamiento Cantera', quantity: 1, size: 'XL', status: 'PENDING', requestDate: '2026-06-18', notes: 'Rotura en entrenamiento' },
];

export const fbatTrips = [
  { id: 't1', destination: 'Manresa', opponent: 'Bàsquet Manresa', departureDate: '2026-06-22', returnDate: '2026-06-22', status: 'planificado', packingList: [{ id: 'tp1', itemName: 'Equipación Visitante', quantityRequired: 14, quantityPacked: 10, category: 'camiseta_juego', isPacked: false }], notes: 'Liga EBA — plantilla U22 (14 jugadores)' },
  { id: 't2', destination: 'Badalona', opponent: 'Joventut Badalona', departureDate: '2026-06-28', returnDate: '2026-06-28', status: 'planificado', packingList: [{ id: 'tp2', itemName: 'Equipación Local', quantityRequired: 14, quantityPacked: 14, category: 'camiseta_juego', isPacked: true }], notes: 'Derbi catalán cantera' },
];

export const fbatAlerts = [
  { id: 'a1', team_id: 'fbat', type: 'stock_bajo', severity: 'critical', title: 'Stock Crítico', message: 'Zapatillas Cantera FCB bajo mínimos (5 unidades)', entity_type: 'inventory_item', entity_id: 'i4', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T08:30:00.000Z' },
  { id: 'a2', team_id: 'fbat', type: 'solicitud_pendiente', severity: 'info', message: 'Nueva solicitud de Nil Poza Cervantes — camiseta juego', entity_type: 'request', entity_id: 'r1', is_read: false, is_dismissed: false, auto_generated: true, metadata: {}, created_at: '2026-06-18T09:15:00.000Z' },
];

export const fbatLaundry = [
  { id: 'l1', name: 'Lote Entrenamiento Ciutat Esportiva', itemCount: 18, status: 'WASHING', receivedDate: '2026-06-18', responsible: 'Carlos R. Kobe (Utillero)' },
  { id: 'l2', name: 'Juego vs Cornellà', itemCount: 16, status: 'READY', receivedDate: '2026-06-17', completedDate: '2026-06-18', responsible: 'Carlos R. Kobe (Utillero)' },
];
