import { Player } from "../../../types";
import { InventoryItem } from "../../../types";
import { Request } from "../../../types";
import { Trip } from "../../../types";
import { LaundryBatch } from "../../../types";
import { MedicalItem } from "../../../types";
import { Alert } from "../../../types";
import type { SizingProduct } from "@/content/sizing-products";
import {
  buildRmbDemoPlayersFromOfficial,
  buildRmbDemoStaffFromOfficial,
} from "@/lib/build-rmb-demo-roster";

// Plantilla RMB desde realmadrid.com — regenerar: npm run sync:rm-plantilla
export const initialPlayers: any[] = buildRmbDemoPlayersFromOfficial();

/** Equipación oficial RMB 26/27 — shop.realmadrid.com/collections/jerseys-kits-basketball */
export const initialInventory: any[] = [
  {
    id: "i1",
    name: "Camiseta Baloncesto Primera Equipación Hombre 26/27 Blanca",
    sku: "RMB-HOME-2627",
    category: "camiseta_juego",
    stock_total: 45,
    stock_available: 45,
    stock_assigned: 0,
    stock_min: 15,
    location: "Almacén Principal (Estantería A)",
    qr_code: "RMB-HOME-2627",
    barcode: "4069998426038",
    size: "XL",
    price: 90,
    unit_cost: 90,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KT9672 · Climacool · shop RMCFMZ0949",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KT9672_2_APPAREL_Photography_Front_Center_View_white_48a54e3f-f5f8-49c3-b9f6-97f81fd2ea7e.jpg?v=1782476312&width=832",
  },
  {
    id: "i2",
    name: "Camiseta Baloncesto Segunda Equipación Hombre 26/27 Verde",
    sku: "RMB-AWAY-2627",
    category: "camiseta_juego",
    stock_total: 8, // Trigger alert
    stock_available: 8,
    stock_assigned: 0,
    stock_min: 15,
    location: "Almacén Principal (Estantería A)",
    qr_code: "RMB-AWAY-2627",
    barcode: "4069998427000",
    size: "XL",
    price: 90,
    unit_cost: 90,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KT9674 · shop RMCFMZ0950",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KT9674_2_APPAREL_Photography_Front_Center_View_white.jpg?v=1783937292&width=832",
  },
  {
    id: "i3",
    name: "Pantalón Corto Baloncesto Primera Equipación Hombre 26/27 Blanco",
    sku: "RMB-SHORTS-H-2627",
    category: "pantalon_juego",
    stock_total: 32,
    stock_available: 32,
    stock_assigned: 0,
    stock_min: 10,
    location: "Almacén Principal (Estantería B)",
    qr_code: "RMB-SHORTS-H-2627",
    barcode: "4069998427100",
    size: "XL",
    price: 60,
    unit_cost: 60,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KU1387 · shop RMCFMP0445",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KU1387_01.jpg?v=1782466897&width=832",
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
    is_active: true,
    image_url: null,
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
    updated_at: new Date().toISOString(),
    image_url: null,
  },
  {
    id: "i6",
    name: "Camiseta Reversible Entrenamiento Baloncesto Hombre 26/27 Blanca",
    sku: "RMB-TRAIN-REV-W-2627",
    category: "camiseta_entrenamiento",
    stock_total: 55,
    stock_available: 55,
    stock_assigned: 0,
    stock_min: 20,
    location: "Almacén Principal (Estantería C)",
    qr_code: "RMB-TRAIN-REV-W-2627",
    barcode: "4069998427200",
    size: "XXL",
    price: 40,
    unit_cost: 40,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KU1396 · shop RMCFMT1542",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KU1396_01.jpg?v=1784545116&width=832",
  },
  {
    id: "i7",
    name: "Chaqueta Calentamiento Baloncesto Hombre 26/27 Blanca",
    sku: "RMB-WARM-JKT-2627",
    category: "chaqueta",
    stock_total: 20,
    stock_available: 20,
    stock_assigned: 0,
    stock_min: 5,
    location: "Almacén Principal (Estantería C)",
    qr_code: "RMB-WARM-JKT-2627",
    barcode: "4069998427300",
    size: "XL",
    price: 90,
    unit_cost: 90,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KU1388 · shop RMCFMS0587",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KU1388_01.jpg?v=1782466810&width=832",
  },
  {
    id: "i8",
    name: "Pantalón Corto Baloncesto Segunda Equipación Hombre 26/27 Verde",
    sku: "RMB-SHORTS-A-2627",
    category: "pantalon_juego",
    stock_total: 18,
    stock_available: 18,
    stock_assigned: 0,
    stock_min: 8,
    location: "Almacén Principal (Estantería B)",
    qr_code: "RMB-SHORTS-A-2627",
    barcode: "4069998427400",
    size: "XL",
    price: 60,
    unit_cost: 60,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KT8981 · shop RMCFMP0444",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KT8981_01.jpg?v=1783514779&width=832",
  },
  {
    id: "i9",
    name: "Chubasquero Real Madrid AW JKT (Adidas JP4057)",
    sku: "JP4057",
    category: "chaqueta",
    stock_total: 18,
    stock_available: 14,
    stock_assigned: 4,
    stock_min: 6,
    location: "Vestuario principal — perchero capitanes",
    qr_code: "CMP-RMB-I9-P6-001",
    barcode: "4068807308923",
    size: "2XL",
    price: 120,
    unit_cost: 120,
    is_active: true,
    lastUpdated: "2026-06-19",
    updated_at: new Date().toISOString(),
    image_url: "/garments/rmb/llull-chubasquero-jp4057.jpg",
    brand: "Adidas",
    notes: "REAL AW JKT · RFID EAN 696 KH · Demo Sergio Llull #23",
  },
  {
    id: "i10",
    name: "Sudadera Manga Corta Calentamiento Baloncesto Hombre 26/27 Blanca",
    sku: "RMB-WARM-SS-2627",
    category: "camiseta_entrenamiento",
    stock_total: 24,
    stock_available: 24,
    stock_assigned: 0,
    stock_min: 8,
    location: "Almacén Principal (Estantería C)",
    qr_code: "RMB-WARM-SS-2627",
    barcode: "4069998427500",
    size: "XL",
    price: 60,
    unit_cost: 60,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KT8983 · shop RMCFMT1540",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KT8983_01.jpg?v=1782466690&width=832",
  },
  {
    id: "i11",
    name: "Pantalón Calentamiento Baloncesto Hombre 26/27 Blanco",
    sku: "RMB-WARM-PANT-2627",
    category: "pantalon_entrenamiento",
    stock_total: 22,
    stock_available: 22,
    stock_assigned: 0,
    stock_min: 8,
    location: "Almacén Principal (Estantería C)",
    qr_code: "RMB-WARM-PANT-2627",
    barcode: "4069998427600",
    size: "XL",
    price: 75,
    unit_cost: 75,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KU1394 · shop RMCFMP0446",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KU1394_01.jpg?v=1782466853&width=832",
  },
  {
    id: "i12",
    name: "Camiseta Reversible Entrenamiento Baloncesto Hombre 26/27 Verde",
    sku: "RMB-TRAIN-REV-G-2627",
    category: "camiseta_entrenamiento",
    stock_total: 40,
    stock_available: 40,
    stock_assigned: 0,
    stock_min: 15,
    location: "Almacén Principal (Estantería C)",
    qr_code: "RMB-TRAIN-REV-G-2627",
    barcode: "4069998427700",
    size: "XL",
    price: 40,
    unit_cost: 40,
    is_active: true,
    lastUpdated: "2026-08-12",
    updated_at: new Date().toISOString(),
    brand: "Adidas",
    notes: "Adidas KU1395 · shop RMCFMT1541",
    image_url:
      "https://cdn.shopify.com/s/files/1/0985/4143/7258/files/KU1395_1_APPAREL_Photography_FrontCenterView_white.jpg?v=1786528847&width=832",
  },
];

export const initialRequests: any[] = [
  {
    id: "r1",
    playerId: "p1",
    playerName: "Facundo Campazzo",
    itemId: "i1",
    itemName: "Camiseta Baloncesto Primera Equipación Hombre 26/27 Blanca",
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
    notes: "Entregado por Carlos Kobe en vestuario",
    category: "accesorios"
  },
  {
    id: "r4",
    playerId: "p3",
    playerName: "Mario Hezonja",
    itemId: "i2",
    itemName: "Camiseta Baloncesto Segunda Equipación Hombre 26/27 Verde",
    quantity: 1,
    size: "XL",
    status: "PENDING",
    requestDate: "2026-06-18",
    notes: "Rotura en partido vs Baskonia — reposición urgente",
    category: "equipacion"
  },
  {
    id: "r5",
    playerId: "p8",
    playerName: "Izan Almansa",
    itemId: "i6",
    itemName: "Camiseta Entrenamiento Reversible",
    quantity: 2,
    size: "XXL",
    status: "PENDING",
    requestDate: "2026-06-18",
    notes: "Talla actualizada tras control médico",
    category: "entrenamiento"
  },
  {
    id: "r6",
    playerId: "p12",
    playerName: "Theo Maledon",
    itemId: "i7",
    itemName: "Chaqueta Cortavientos Calentamiento",
    quantity: 1,
    size: "L",
    status: "APPROVED",
    requestDate: "2026-06-17",
    neededByDate: "2026-06-22",
    notes: "Viaje a Málaga — Euroliga",
    category: "entrenamiento"
  },
  {
    id: "r7",
    playerId: "p16",
    playerName: "Alex Len",
    itemId: "i3",
    itemName: "Pantalón Corto Juego Blanco",
    quantity: 2,
    size: "XXXL",
    status: "APPROVED",
    requestDate: "2026-06-16",
    notes: "Stock bajo en almacén — pedido a proveedor Adidas",
    category: "equipacion"
  },
  {
    id: "r8",
    playerId: "p6",
    playerName: "Mady Sissoko",
    itemId: "i4",
    itemName: "Zapatillas Pro Bounce RMB Edition",
    quantity: 1,
    size: "47",
    status: "PENDING",
    requestDate: "2026-06-18",
    notes: "Desgaste suela — cambio mid-season",
    category: "calzado"
  },
  {
    id: "r9",
    playerId: "p10",
    playerName: "Gabriel Vezenkov",
    itemName: "Chaqueta Calentamiento Baloncesto Hombre 26/27 Blanca",
    quantity: 1,
    size: "XL",
    status: "DELIVERED",
    requestDate: "2026-06-10",
    notes: "Entrega pre-temporada completada",
    category: "entrenamiento"
  },
  {
    id: "r10",
    playerId: "p14",
    playerName: "Sergio Llull",
    itemName: "Polo Staff Oficial",
    quantity: 1,
    size: "L",
    status: "PENDING",
    requestDate: "2026-06-18",
    notes: "Material promocional acto institucional",
    category: "accesorios"
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
  { id: "m1", name: "Vendas de Compresión Elástica (Tape)", quantity: 48, minQuantity: 20, expiryDate: "2028-12-31", batchNumber: "B-8822", status: "OK", location: "Botiquín Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "material_cura", brand: "Mueller", reference: "T-9922", unit_cost: 4.5, is_active: true },
  { id: "m2", name: "Spray Frío / Hielo Químico", quantity: 6, minQuantity: 15, expiryDate: "2026-08-15", batchNumber: "B-1090", status: "EXPIRING_SOON", location: "Nevera Vestuario", kit: "Vestuario Principal", team_id: "team-acb-123", category: "fármaco", brand: "Biofreeze", reference: "S-109", unit_cost: 8, is_active: true },
  { id: "m3", name: "Geles Antiinflamatorios (Voltaren)", quantity: 15, minQuantity: 5, expiryDate: "2026-05-10", batchNumber: "B-2291", status: "EXPIRED", location: "Armario Médico", kit: "Armario Central", team_id: "team-acb-123", category: "fármaco", brand: "Voltaren", reference: "G-22", unit_cost: 12, is_active: true, prescription_required: true },
  { id: "m4", name: "Botiquín de Urgencias ACB (Completo)", quantity: 4, minQuantity: 2, expiryDate: "2027-06-30", batchNumber: "B-7001", status: "OK", location: "Vestuario — Banquillo", kit: "Botiquín Partido", team_id: "team-acb-123", category: "botiquin", brand: "RMB Medical", reference: "BQ-ACB-01", unit_cost: 280, is_active: true },
  { id: "m5", name: "Botiquín de Viaje Euroliga", quantity: 2, minQuantity: 2, expiryDate: "2027-03-15", batchNumber: "B-7002", status: "OK", location: "Almacén Logística", kit: "Botiquín Viaje", team_id: "team-acb-123", category: "botiquin", brand: "RMB Medical", reference: "BQ-EU-01", unit_cost: 350, is_active: true },
  { id: "m6", name: "Vendaje Cohesivo (Coban)", quantity: 36, minQuantity: 12, expiryDate: "2029-01-01", batchNumber: "B-3310", status: "OK", location: "Botiquín Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "material_cura", brand: "3M", reference: "CB-10", unit_cost: 3.2, is_active: true },
  { id: "m7", name: "Gasas Estériles 10x10 (Paquete 100)", quantity: 22, minQuantity: 10, expiryDate: "2028-08-20", batchNumber: "B-4412", status: "OK", location: "Armario Médico", kit: "Armario Central", team_id: "team-acb-123", category: "material_cura", brand: "Hartmann", reference: "GS-100", unit_cost: 18, is_active: true },
  { id: "m8", name: "Suero Fisiológico 0,9% (500ml)", quantity: 8, minQuantity: 20, expiryDate: "2026-11-30", batchNumber: "B-5520", status: "EXPIRING_SOON", location: "Nevera Vestuario", kit: "Vestuario Principal", team_id: "team-acb-123", category: "suero", brand: "B Braun", reference: "SF-500", unit_cost: 2.5, is_active: true },
  { id: "m9", name: "Paracetamol 1g (Caja 20 sobres)", quantity: 5, minQuantity: 8, expiryDate: "2027-02-28", batchNumber: "B-6611", status: "OK", location: "Armario Médico", kit: "Armario Central", team_id: "team-acb-123", category: "fármaco", brand: "Cinfa", reference: "PC-1G", unit_cost: 6, is_active: true, prescription_required: true },
  { id: "m10", name: "Ibuprofeno 600mg (Caja 40 comp.)", quantity: 4, minQuantity: 6, expiryDate: "2027-04-15", batchNumber: "B-6612", status: "OK", location: "Armario Médico", kit: "Armario Central", team_id: "team-acb-123", category: "fármaco", brand: "Kern", reference: "IB-600", unit_cost: 7.5, is_active: true, prescription_required: true },
  { id: "m11", name: "Esparadrapo Hipoalergénico (Rollo 5m)", quantity: 18, minQuantity: 8, expiryDate: "2028-05-01", batchNumber: "B-7720", status: "OK", location: "Botiquín Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "material_cura", brand: "Urgo", reference: "ESP-5", unit_cost: 5, is_active: true },
  { id: "m12", name: "Bolsas de Hielo Instantáneo", quantity: 45, minQuantity: 30, expiryDate: "2027-12-31", batchNumber: "B-8830", status: "OK", location: "Nevera Vestuario", kit: "Vestuario Principal", team_id: "team-acb-123", category: "crioterapia", brand: "Instant Ice", reference: "HI-01", unit_cost: 1.2, is_active: true },
  { id: "m13", name: "Desinfectante Clorhexidina 500ml", quantity: 6, minQuantity: 4, expiryDate: "2026-09-30", batchNumber: "B-9940", status: "EXPIRING_SOON", location: "Botiquín Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "desinfección", brand: "Betadine", reference: "DS-500", unit_cost: 9, is_active: true },
  { id: "m14", name: "Mascarillas RCP + Guantes (Kit 10 uds)", quantity: 3, minQuantity: 2, expiryDate: "2028-01-01", batchNumber: "B-9950", status: "OK", location: "Botiquín Partido", kit: "Botiquín Partido", team_id: "team-acb-123", category: "emergencia", brand: "Laerdal", reference: "RCP-10", unit_cost: 45, is_active: true },
  { id: "m15", name: "Electrodos TENS / EMS (Pack 4)", quantity: 12, minQuantity: 6, expiryDate: "2027-08-01", batchNumber: "B-9960", status: "OK", location: "Sala Fisioterapia", kit: "Fisioterapia", team_id: "team-acb-123", category: "electroterapia", brand: "Compex", reference: "TENS-4", unit_cost: 22, is_active: true },
];

export const initialAlerts: any[] = [
  { id: "a1", team_id: "team-acb-123", type: "stock_bajo", severity: "critical", title: "Stock Crítico", message: "Zapatillas Baloncesto Pro Bounce RMB Edition están bajo mínimos (2 unidades)", entity_type: "inventory_item", entity_id: "i4", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-18T08:30:00.000Z" },
  { id: "a2", team_id: "team-acb-123", type: "caducidad_proxima", severity: "warning", message: "Geles Antiinflamatorios Rápido han CADUCADO el 2026-05-10", entity_type: "medical_item", entity_id: "m3", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-17T10:00:00.000Z" },
  { id: "a3", team_id: "team-acb-123", type: "solicitud_pendiente", severity: "info", message: "Nueva solicitud de equipación de Facundo Campazzo", entity_type: "request", entity_id: "r1", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-18T09:15:00.000Z" },
  { id: "a4", team_id: "team-acb-123", type: "cumpleaños", severity: "info", title: "Cumpleaños de la Plantilla", message: "¡ALERTA DE CUMPLEAÑOS! El pívot Alex Len cumple años el 16 de Junio. Preparar lote de equipación oficial de regalo.", entity_type: "player", entity_id: "p16", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-16T09:00:00.000Z" },
  { id: "a5", team_id: "team-acb-123", type: "cumpleaños", severity: "info", title: "Cumpleaños de la Plantilla", message: "¡ALERTA DE CUMPLEAÑOS! El base Theo Maledon cumple años el 12 de Junio. Preparar lote de equipación oficial de regalo.", entity_type: "player", entity_id: "p5", is_read: false, is_dismissed: false, read_by: null, read_at: null, auto_generated: true, metadata: {}, created_at: "2026-06-12T09:00:00.000Z" }
];

// Cuerpo técnico RMB desde realmadrid.com — regenerar: npm run sync:rm-plantilla
export const initialCoachingStaff: any[] = buildRmbDemoStaffFromOfficial();

class InMemoryDatabase {
  players = [...initialPlayers];
  inventory = [...initialInventory];
  requests = [...initialRequests];
  trips = [...initialTrips];
  laundry = [...initialLaundry];
  medical = [...initialMedical];
  alerts = [...initialAlerts];
  coachingStaff = [...initialCoachingStaff];
  customSizingProducts: SizingProduct[] = [];
  garmentUnits: any[] = [];
}

export const db = new InMemoryDatabase();
export type DBType = InMemoryDatabase;

export interface ClubDemoDataSlice {
  players: any[];
  inventory: any[];
  requests: any[];
  trips: any[];
  laundry: any[];
  alerts: any[];
  coachingStaff?: any[];
  garmentUnits?: any[];
  medical?: any[];
}

export function loadClubDemoData(data: ClubDemoDataSlice): void {
  db.players = [...data.players];
  db.inventory = [...data.inventory];
  db.requests = [...data.requests];
  db.trips = [...data.trips];
  db.laundry = [...data.laundry];
  db.alerts = [...data.alerts];
  db.coachingStaff = [...(data.coachingStaff ?? initialCoachingStaff)];
  db.garmentUnits = [...(data.garmentUnits ?? [])];
  if (data.medical) {
    db.medical = [...data.medical];
  }
}
