import { Player } from "../../../types";
import { InventoryItem } from "../../../types";
import { Request } from "../../../types";
import { Trip } from "../../../types";
import { LaundryBatch } from "../../../types";
import { MedicalItem } from "../../../types";
import { Alert } from "../../../types";

// Standard demo players (Real Real Madrid Baloncesto 2025/2026 Complete Roster!)
export const initialPlayers: any[] = [
  {
    id: "p1",
    firstName: "Facundo",
    lastName: "Campazzo",
    number: 7,
    position: "base",
    status: "ACTIVE",
    sizes: { jersey: "M", shorts: "M", shoes: "42.5", socks: "M", warmupShirt: "M" },
    nationality: "Argentina",
    birthDate: "1991-04-17",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/facundo-campazzo"
  },
  {
    id: "p2",
    firstName: "Walter Samuel",
    lastName: "Tavares",
    number: 22,
    position: "pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXXL", shorts: "XXXL", shoes: "52", socks: "XL", warmupShirt: "XXXL" },
    nationality: "Cabo Verde",
    birthDate: "1992-03-22",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/walter-samuel-tavares-da-veiga"
  },
  {
    id: "p3",
    firstName: "Mario",
    lastName: "Hezonja",
    number: 11,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "XL", shorts: "XL", shoes: "47.5", socks: "L", warmupShirt: "XL" },
    nationality: "Croacia",
    birthDate: "1995-02-25",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/mario-hezonja"
  },
  {
    id: "p4",
    firstName: "Gabriel",
    lastName: "Deck",
    number: 14,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "XL", shorts: "XL", shoes: "46.5", socks: "L", warmupShirt: "XL" },
    nationality: "Argentina",
    birthDate: "1995-02-08",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/gabriel-deck"
  },
  {
    id: "p5",
    firstName: "Theo",
    lastName: "Maledon",
    number: 9,
    position: "base",
    status: "ACTIVE",
    sizes: { jersey: "L", shorts: "L", shoes: "45", socks: "M", warmupShirt: "L" },
    nationality: "Francia",
    birthDate: "2001-06-12",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/theo-maledon"
  },
  {
    id: "p6",
    firstName: "Sergio",
    lastName: "Llull",
    number: 23,
    position: "escolta",
    status: "ACTIVE",
    sizes: { jersey: "L", shorts: "L", shoes: "44", socks: "M", warmupShirt: "L" },
    nationality: "España",
    birthDate: "1987-11-15",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/sergio-llull-melia"
  },
  {
    id: "p7",
    firstName: "Usman",
    lastName: "Garuba",
    number: 16,
    position: "ala_pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXL", shorts: "XXL", shoes: "49.5", socks: "XL", warmupShirt: "XXL" },
    nationality: "España",
    birthDate: "2002-03-09",
    imageUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/usman-garuba"
  },
  {
    id: "p8",
    firstName: "Andrés",
    lastName: "Feliz",
    number: 24,
    position: "base",
    status: "ACTIVE",
    sizes: { jersey: "M", shorts: "L", shoes: "43", socks: "M", warmupShirt: "L" },
    nationality: "República Dominicana",
    birthDate: "1997-07-15",
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/andres-feliz"
  },
  {
    id: "p9",
    firstName: "David",
    lastName: "Kramer",
    number: 1,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "L", shorts: "L", shoes: "45", socks: "M", warmupShirt: "L" },
    nationality: "Alemania",
    birthDate: "1997-01-14",
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/david-kramer"
  },
  {
    id: "p10",
    firstName: "Alberto",
    lastName: "Abalde",
    number: 6,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "XL", shorts: "XL", shoes: "46", socks: "L", warmupShirt: "XL" },
    nationality: "España",
    birthDate: "1995-12-15",
    imageUrl: "https://images.unsplash.com/photo-1489980508314-941910ded1f4?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/alberto-abalde-diaz"
  },
  {
    id: "p11",
    firstName: "Gabriele",
    lastName: "Procida",
    number: 3,
    position: "alero",
    status: "ACTIVE",
    sizes: { jersey: "L", shorts: "L", shoes: "46", socks: "M", warmupShirt: "L" },
    nationality: "Italia",
    birthDate: "2002-06-01",
    imageUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a27?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/gabriele-procida"
  },
  {
    id: "p12",
    firstName: "Trey",
    lastName: "Lyles",
    number: 10,
    position: "ala_pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXL", shorts: "XXL", shoes: "48.5", socks: "XL", warmupShirt: "XXL" },
    nationality: "Canadá",
    birthDate: "1995-11-05",
    imageUrl: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/trey-lyles"
  },
  {
    id: "p13",
    firstName: "Chuma",
    lastName: "Okeke",
    number: 0,
    position: "ala_pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXL", shorts: "XXL", shoes: "47", socks: "L", warmupShirt: "XXL" },
    nationality: "Estados Unidos",
    birthDate: "1998-08-18",
    imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/chukwuma-julian-okeke"
  },
  {
    id: "p14",
    firstName: "Izan",
    lastName: "Almansa",
    number: 33,
    position: "ala_pivot",
    status: "ACTIVE",
    sizes: { jersey: "XL", shorts: "XL", shoes: "48", socks: "L", warmupShirt: "XL" },
    nationality: "España",
    birthDate: "2005-06-07",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/izan-almansa"
  },
  {
    id: "p15",
    firstName: "Mady",
    lastName: "Sissoko",
    number: 21,
    position: "pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXL", shorts: "XXL", shoes: "50", socks: "XL", warmupShirt: "XXL" },
    nationality: "Mali",
    birthDate: "2000-12-20",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/mady-sissoko"
  },
  {
    id: "p16",
    firstName: "Alex",
    lastName: "Len",
    number: 15,
    position: "pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXXL", shorts: "XXXL", shoes: "51.5", socks: "XL", warmupShirt: "XXXL" },
    nationality: "Ucrania",
    birthDate: "1993-06-16",
    imageUrl: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/alex-len"
  },
  {
    id: "p17",
    firstName: "Ömer",
    lastName: "Yurtseven",
    number: 13,
    position: "pivot",
    status: "ACTIVE",
    sizes: { jersey: "XXXL", shorts: "XXXL", shoes: "51", socks: "XL", warmupShirt: "XXXL" },
    nationality: "Turquía",
    birthDate: "1998-06-19",
    imageUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150",
    profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/omer-yurtseven"
  }
];

export const initialInventory: any[] = [
  {
    id: "i1",
    name: "Camiseta Oficial Real Madrid Baloncesto Local 25/26",
    sku: "RMB-HOME-2526",
    category: "camiseta_juego",
    stock_total: 45,
    stock_available: 45,
    stock_assigned: 0,
    stock_min: 15,
    location: "Almacén Principal (Estantería A)",
    qr_code: "RMB-HOME-2526",
    barcode: "8412345678901",
    size: "XL",
    price: 85,
    unit_cost: 85,
    is_active: true,
    lastUpdated: "2026-06-17",
    updated_at: new Date().toISOString()
  },
  {
    id: "i2",
    name: "Camiseta Oficial Real Madrid Visitante 25/26",
    sku: "RMB-AWAY-2526",
    category: "camiseta_juego",
    stock_total: 8, // Trigger alert
    stock_available: 8,
    stock_assigned: 0,
    stock_min: 15,
    location: "Almacén Principal (Estantería A)",
    qr_code: "RMB-AWAY-2526",
    barcode: "8412345678918",
    size: "XL",
    price: 85,
    unit_cost: 85,
    is_active: true,
    lastUpdated: "2026-06-16",
    updated_at: new Date().toISOString()
  },
  {
    id: "i3",
    name: "Pantalón Corto Juego Blanco RMB 25/26",
    sku: "RMB-SHORTS-H",
    category: "pantalon_juego",
    stock_total: 32,
    stock_available: 32,
    stock_assigned: 0,
    stock_min: 10,
    location: "Almacén Principal (Estantería B)",
    qr_code: "RMB-SHORTS-H",
    barcode: "8412345678925",
    size: "XL",
    price: 45,
    unit_cost: 45,
    is_active: true,
    lastUpdated: "2026-06-15",
    updated_at: new Date().toISOString()
  },
  {
    id: "i4",
    name: "Zapatillas Baloncesto Pro Bounce RMB Edition",
    sku: "RMB-FW-PRO",
    category: "zapatillas",
    stock_total: 2, // Low stock trigger
    stock_available: 2,
    stock_assigned: 0,
    stock_min: 5,
    location: "Zapatero Vestuario",
    qr_code: "RMB-FW-PRO",
    barcode: "8412345678932",
    size: "47.5",
    price: 140,
    lastUpdated: "2026-06-14",
    unit_cost: 140,
    is_active: true
  },
  {
    id: "i5",
    name: "Medias de Compresión Blancas",
    sku: "SO-COMP-W",
    category: "calcetines",
    stock_total: 120,
    stock_available: 120,
    stock_assigned: 0,
    stock_min: 30,
    location: "Almacén Principal (Caja 12)",
    qr_code: "SO-COMP-W",
    barcode: "8412345678949",
    size: "L",
    price: 15,
    unit_cost: 15,
    is_active: true,
    lastUpdated: "2026-06-10",
    updated_at: new Date().toISOString()
  },
  {
    id: "i6",
    name: "Camiseta de Entrenamiento Reversible",
    sku: "TS-TRAIN-REV",
    category: "camiseta_entrenamiento",
    stock_total: 55,
    stock_available: 55,
    stock_assigned: 0,
    stock_min: 20,
    location: "Almacén Principal (Estantería C)",
    qr_code: "TS-TRAIN-REV",
    barcode: "8412345678956",
    size: "XXL",
    price: 35,
    unit_cost: 35,
    is_active: true,
    lastUpdated: "2026-06-12",
    updated_at: new Date().toISOString()
  }
];

export const initialRequests: any[] = [
  {
    id: "r1",
    playerId: "p1",
    playerName: "Facundo Campazzo",
    itemId: "i1",
    itemName: "Camiseta Oficial Real Madrid Baloncesto Local 25/26",
    quantity: 2,
    size: "M",
    status: "PENDING",
    requestDate: "2026-06-17",
    notes: "Para partido de Euroliga"
  },
  {
    id: "r2",
    playerId: "p2",
    playerName: "Walter Samuel Tavares",
    itemId: "i4",
    itemName: "Zapatillas Baloncesto Pro Bounce RMB Edition",
    quantity: 1,
    size: "52",
    status: "APPROVED",
    requestDate: "2026-06-16",
    neededByDate: "2026-06-20",
    notes: "Repuesto urgente para semifinal ACB"
  },
  {
    id: "r3",
    playerId: "p4",
    playerName: "Gabriel Deck",
    itemId: "i5",
    itemName: "Medias de Compresión Blancas",
    quantity: 5,
    size: "XL",
    status: "DELIVERED",
    requestDate: "2026-06-15",
    notes: "Entregado por Carlos Kobe en vestuario"
  }
];

export const initialTrips: any[] = [
  {
    id: "t1",
    destination: "Málaga",
    opponent: "Unicaja",
    departureDate: "2026-06-20",
    returnDate: "2026-06-22",
    status: "planificado",
    packingList: [
      { id: "tp1", itemName: "Equipación Local Blanca (Camisetas + Shorts)", quantityRequired: 15, quantityPacked: 15, category: "camiseta_juego", isPacked: true },
      { id: "tp2", itemName: "Equipación Visitante Morada", quantityRequired: 15, quantityPacked: 5, category: "camiseta_juego", isPacked: false },
      { id: "tp3", itemName: "Camisetas de Calentamiento", quantityRequired: 15, quantityPacked: 15, category: "camiseta_entrenamiento", isPacked: true },
      { id: "tp4", itemName: "Toallas Oficiales RMB", quantityRequired: 30, quantityPacked: 10, category: "accesorios", isPacked: false },
      { id: "tp5", itemName: "Botiquín Médico Principal", quantityRequired: 2, quantityPacked: 2, category: "medico", isPacked: true }
    ],
    notes: "Partido crítico Liga Endesa. Asegurar doble petate de balones oficiales."
  },
  {
    id: "t2",
    destination: "Atenas",
    opponent: "Panathinaikos",
    departureDate: "2026-06-26",
    returnDate: "2026-06-28",
    status: "planificado",
    packingList: [
      { id: "tp10", itemName: "Equipación Visitante Morada", quantityRequired: 15, quantityPacked: 0, category: "camiseta_juego", isPacked: false },
      { id: "tp11", itemName: "Camisetas de Calentamiento", quantityRequired: 15, quantityPacked: 0, category: "camiseta_entrenamiento", isPacked: false },
      { id: "tp12", itemName: "Botiquín Sanitario", quantityRequired: 2, quantityPacked: 0, category: "medico", isPacked: false }
    ],
    notes: "Vuelo chárter Iberia. Restricción de 32kg por petate de utilería."
  }
];

export const initialLaundry: any[] = [
  { id: "l1", name: "Lote Entrenamiento Principal - RMB", itemCount: 24, status: "WASHING", receivedDate: "2026-06-18", responsible: "Carlos R. Kobe (Utillero)" },
  { id: "l2", name: "Juego Blanco vs Barça Baloncesto", itemCount: 18, status: "READY", receivedDate: "2026-06-17", completedDate: "2026-06-18", responsible: "Carlos R. Kobe (Utillero)" },
  { id: "l3", name: "Chándales de Viaje", itemCount: 15, status: "PENDING", receivedDate: "2026-06-18", responsible: "Carlos R. Kobe (Utillero)" }
];

export const initialMedical: any[] = [
  { id: "m1", name: "Vendas de Compresión Elástica (Tape)", quantity: 48, minQuantity: 20, expiryDate: "2028-12-31", batchNumber: "B-8822", status: "OK", location: "Botiquín Fisioterapia", team_id: "team-acb-123", category: "material_cura", brand: "Mueller", reference: "T-9922", barcode: null, stock_total: 48, stock_min: 20, unit: "unidad", storage_temp: "ambiente", prescription_required: false, supplier: "FisioPro", unit_cost: 4.5, is_active: true, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "m2", name: "Spray Frío / Hielo Químico", quantity: 6, minQuantity: 15, expiryDate: "2026-08-15", batchNumber: "B-1090", status: "EXPIRING_SOON", location: "Nevera Vestuario", team_id: "team-acb-123", category: "fármaco", brand: "Biofreeze", reference: "S-109", barcode: null, stock_total: 6, stock_min: 15, unit: "unidad", storage_temp: "frío", prescription_required: false, supplier: "FisioPro", unit_cost: 8, is_active: true, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "m3", name: "Geles Antiinflamatorios Rápido", quantity: 15, minQuantity: 5, expiryDate: "2026-05-10", batchNumber: "B-2291", status: "EXPIRED", location: "Armario Médico", team_id: "team-acb-123", category: "fármaco", brand: "Voltaren", reference: "G-22", barcode: null, stock_total: 15, stock_min: 5, unit: "unidad", storage_temp: "ambiente", prescription_required: true, supplier: "FisioPro", unit_cost: 12, is_active: true, notes: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

export const initialAlerts: any[] = [
  { id: "a1", team_id: "team-acb-123", type: "stock_bajo", severity: "critical", title: "Stock Crítico", message: "Zapatillas Baloncesto Pro Bounce RMB Edition están bajo mínimos (2 unidades)", entity_type: "inventory_item", entity_id: "i4", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-18T08:30:00.000Z" },
  { id: "a2", team_id: "team-acb-123", type: "caducidad_proxima", severity: "warning", message: "Geles Antiinflamatorios Rápido han CADUCADO el 2026-05-10", entity_type: "medical_item", entity_id: "m3", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-17T10:00:00.000Z" },
  { id: "a3", team_id: "team-acb-123", type: "solicitud_pendiente", severity: "info", message: "Nueva solicitud de equipación de Facundo Campazzo", entity_type: "request", entity_id: "r1", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-18T09:15:00.000Z" }
];

export const initialCoachingStaff: any[] = [
  { id: "c1", full_name: "Sergio Scariolo", role: "Entrenador Principal", email: "scariolo@realmadrid.com", shirt_size: "L", shorts_size: "L", shoe_size: 43, photo_url: "/images/staff/scariolo.jpg", nationality: "Italia", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/sergio-scariolo" },
  { id: "c2", full_name: "Luis Guil", role: "Entrenador Ayudante", email: "guil@realmadrid.com", shirt_size: "XL", shorts_size: "L", shoe_size: 44, photo_url: "/images/staff/luis_guil.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/luis-guil" },
  { id: "c3", full_name: "Stefan Ivanovic", role: "Entrenador Ayudante", email: "ivanovic@realmadrid.com", shirt_size: "L", shorts_size: "L", shoe_size: 43, photo_url: "/images/staff/stefan_ivanovic.jpg", nationality: "Montenegro", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/stefan-ivanovic" },
  { id: "c4", full_name: "Isidoro Calín", role: "Entrenador Ayudante", email: "calin@realmadrid.com", shirt_size: "XXL", shorts_size: "XL", shoe_size: 45, photo_url: "/images/staff/isidoro_calin.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/isidoro-calin" },
  { id: "c5", full_name: "Matteo Cassinerio", role: "Entrenador Ayudante", email: "cassinerio@realmadrid.com", shirt_size: "L", shorts_size: "L", shoe_size: 43, photo_url: "/images/staff/matteo_cassinerio.jpg", nationality: "Italia", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/matteo-cassinerio" },
  { id: "c6", full_name: "Piti Hurtado", role: "Entrenador Ayudante (Estadística/Audiovisual)", email: "piti@realmadrid.com", shirt_size: "XL", shorts_size: "XL", shoe_size: 44, photo_url: "/images/staff/piti_hurtado.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/piti-hurtado" },
  { id: "c7", full_name: "David Jimeno", role: "Entrenador Ayudante (Mejora Individual)", email: "jimeno@realmadrid.com", shirt_size: "L", shorts_size: "L", shoe_size: 43, photo_url: "/images/staff/david_jimeno.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/david-jimeno" },
  { id: "c8", full_name: "Juan Trapero", role: "Preparador Físico", email: "trapero@realmadrid.com", shirt_size: "XL", shorts_size: "L", shoe_size: 44, photo_url: "/images/staff/juan_trapero.jpg", nationality: "España", profile_url: "https://www.realmadrid.com/es-ES/baloncesto/primer-equipo/plantilla/juan-trapero" }
];

class InMemoryDatabase {
  players = [...initialPlayers];
  inventory = [...initialInventory];
  requests = [...initialRequests];
  trips = [...initialTrips];
  laundry = [...initialLaundry];
  medical = [...initialMedical];
  alerts = [...initialAlerts];
  coachingStaff = [...initialCoachingStaff];
}

export const db = new InMemoryDatabase();
export type DBType = InMemoryDatabase;
