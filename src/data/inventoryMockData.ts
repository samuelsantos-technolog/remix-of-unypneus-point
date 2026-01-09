import { Product, StockItem, Supplier, StockMovement, XMLImport } from '@/types/inventory';

export const products: Product[] = [
  { id: '1', code: 'PN001', description: 'Pirelli Cinturato P1 185/65 R15', ncm: '40111000', brand: 'Pirelli', model: 'Cinturato P1', size: '185/65 R15', price: 350, cost: 250, category: 'Pneu Passeio' },
  { id: '2', code: 'PN002', description: 'Michelin Primacy 4 205/55 R16', ncm: '40111000', brand: 'Michelin', model: 'Primacy 4', size: '205/55 R16', price: 520, cost: 380, category: 'Pneu Passeio' },
  { id: '3', code: 'PN003', description: 'Goodyear Assurance 195/60 R15', ncm: '40111000', brand: 'Goodyear', model: 'Assurance', size: '195/60 R15', price: 410, cost: 290, category: 'Pneu Passeio' },
  { id: '4', code: 'PN004', description: 'Bridgestone Turanza 225/45 R17', ncm: '40111000', brand: 'Bridgestone', model: 'Turanza', size: '225/45 R17', price: 630, cost: 450, category: 'Pneu Esportivo' },
  { id: '5', code: 'PN005', description: 'Continental PowerContact 2 175/70 R14', ncm: '40111000', brand: 'Continental', model: 'PowerContact 2', size: '175/70 R14', price: 290, cost: 200, category: 'Pneu Passeio' },
  { id: '6', code: 'PN006', description: 'Firestone F-600 185/70 R14', ncm: '40111000', brand: 'Firestone', model: 'F-600', size: '185/70 R14', price: 320, cost: 220, category: 'Pneu Passeio' },
  { id: '7', code: 'PN007', description: 'Dunlop SP Sport 215/50 R17', ncm: '40111000', brand: 'Dunlop', model: 'SP Sport', size: '215/50 R17', price: 580, cost: 420, category: 'Pneu Esportivo' },
  { id: '8', code: 'PN008', description: 'Yokohama BluEarth 195/55 R16', ncm: '40111000', brand: 'Yokohama', model: 'BluEarth', size: '195/55 R16', price: 480, cost: 350, category: 'Pneu Passeio' },
];

export const stockItems: StockItem[] = [
  { productId: '1', franchiseId: '1', quantity: 24, minStock: 10, lastUpdated: new Date() },
  { productId: '2', franchiseId: '1', quantity: 18, minStock: 8, lastUpdated: new Date() },
  { productId: '3', franchiseId: '1', quantity: 32, minStock: 12, lastUpdated: new Date() },
  { productId: '4', franchiseId: '1', quantity: 5, minStock: 8, lastUpdated: new Date() }, // Below min
  { productId: '5', franchiseId: '1', quantity: 45, minStock: 15, lastUpdated: new Date() },
  { productId: '6', franchiseId: '1', quantity: 3, minStock: 10, lastUpdated: new Date() }, // Below min
  { productId: '7', franchiseId: '1', quantity: 15, minStock: 6, lastUpdated: new Date() },
  { productId: '8', franchiseId: '1', quantity: 20, minStock: 8, lastUpdated: new Date() },
];

export const suppliers: Supplier[] = [
  { id: '1', cnpj: '11.222.333/0001-44', name: 'Distribuidora Nacional de Pneus Ltda', tradeName: 'DNP Pneus', address: 'Av. Industrial, 1500 - São Paulo/SP', phone: '(11) 3333-4444', email: 'contato@dnppneus.com.br' },
  { id: '2', cnpj: '55.666.777/0001-88', name: 'Importadora de Pneus Premium S/A', tradeName: 'Premium Tires', address: 'Rod. Anhanguera, km 45 - Campinas/SP', phone: '(19) 4444-5555', email: 'vendas@premiumtires.com.br' },
  { id: '3', cnpj: '99.000.111/0001-22', name: 'Centro de Distribuição Automotivo', tradeName: 'CDA Auto', address: 'Rua dos Distribuidores, 800 - Guarulhos/SP', phone: '(11) 2222-3333', email: 'pedidos@cdaauto.com.br' },
];

export const stockMovements: StockMovement[] = [
  { id: 'MOV001', productId: '1', franchiseId: '1', type: 'entry', quantity: 20, previousQuantity: 4, newQuantity: 24, reason: 'NF-e 001234', referenceId: '35231012345678000190550010001234561234567890', userId: '1', userName: 'João Silva', createdAt: new Date(Date.now() - 86400000) },
  { id: 'MOV002', productId: '2', franchiseId: '1', type: 'sale', quantity: 4, previousQuantity: 22, newQuantity: 18, referenceId: 'VND-001', userId: '1', userName: 'João Silva', createdAt: new Date(Date.now() - 43200000) },
  { id: 'MOV003', productId: '4', franchiseId: '1', type: 'adjustment', quantity: -3, previousQuantity: 8, newQuantity: 5, reason: 'Inventário - divergência encontrada', userId: '2', userName: 'Maria Santos', createdAt: new Date(Date.now() - 21600000) },
  { id: 'MOV004', productId: '3', franchiseId: '1', type: 'entry', quantity: 12, previousQuantity: 20, newQuantity: 32, reason: 'NF-e 001235', referenceId: '35231012345678000190550010001235561234567891', userId: '1', userName: 'João Silva', createdAt: new Date(Date.now() - 7200000) },
];

export const xmlImports: XMLImport[] = [
  { id: 'IMP001', nfeKey: '35231012345678000190550010001234561234567890', nfeNumber: '001234', supplierId: '1', supplierName: 'DNP Pneus', franchiseId: '1', totalValue: 5000, itemsCount: 20, importedAt: new Date(Date.now() - 86400000), importedBy: 'João Silva', status: 'confirmed' },
  { id: 'IMP002', nfeKey: '35231012345678000190550010001235561234567891', nfeNumber: '001235', supplierId: '2', supplierName: 'Premium Tires', franchiseId: '1', totalValue: 3480, itemsCount: 12, importedAt: new Date(Date.now() - 7200000), importedBy: 'João Silva', status: 'confirmed' },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getStockForProduct = (productId: string, franchiseId: string): StockItem | undefined => {
  return stockItems.find(s => s.productId === productId && s.franchiseId === franchiseId);
};

export const getLowStockItems = (franchiseId: string): StockItem[] => {
  return stockItems.filter(s => s.franchiseId === franchiseId && s.quantity < s.minStock);
};
