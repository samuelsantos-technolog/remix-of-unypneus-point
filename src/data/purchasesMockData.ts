import { Supplier, Purchase, PurchaseItem, calculatePurchaseItemTotals, calculatePurchaseTotals } from '@/types/purchases';

const createPurchaseItem = (
  id: string,
  brand: string,
  model: string,
  dimension: string,
  quantity: number,
  unitCost: number,
  freightPerTire: number,
  productId?: string
): PurchaseItem => {
  const totals = calculatePurchaseItemTotals({ id, brand, model, dimension, quantity, unitCost, freightPerTire, productId });
  return {
    id,
    brand,
    model,
    dimension,
    quantity,
    unitCost,
    freightPerTire,
    productId,
    ...totals,
  };
};

export const mockSuppliers: Supplier[] = [
  {
    id: 'sup-001',
    corporateName: 'Distribuidora de Pneus Brasil Ltda',
    tradeName: 'PneusBrasil',
    cnpj: '12.345.678/0001-90',
    stateRegistration: '123.456.789.012',
    address: 'Av. Industrial, 1000 - São Paulo, SP',
    contactName: 'Carlos Silva',
    phone: '(11) 3456-7890',
    email: 'vendas@pneusbrasil.com.br',
    defaultPaymentCondition: '28_days',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'sup-002',
    corporateName: 'Importadora Continental de Pneus S.A.',
    tradeName: 'Continental Express',
    cnpj: '98.765.432/0001-10',
    stateRegistration: '987.654.321.098',
    address: 'Rua das Indústrias, 500 - Guarulhos, SP',
    contactName: 'Maria Oliveira',
    phone: '(11) 4567-8901',
    email: 'compras@continentalexpress.com.br',
    defaultPaymentCondition: '21_days',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'sup-003',
    corporateName: 'Pneus Premium Distribuidora Eireli',
    tradeName: 'Premium Pneus',
    cnpj: '45.678.901/0001-23',
    stateRegistration: '456.789.012.345',
    address: 'Rodovia BR-101, Km 45 - Campinas, SP',
    contactName: 'João Santos',
    phone: '(19) 3456-7890',
    email: 'comercial@premiumpneus.com.br',
    defaultPaymentCondition: '14_days',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },
];

const purchaseItems1: PurchaseItem[] = [
  createPurchaseItem('pi-001', 'Pirelli', 'Cinturato P1', '195/65R15', 20, 320.00, 15.00, 'prod-001'),
  createPurchaseItem('pi-002', 'Michelin', 'Primacy 4', '205/55R16', 15, 450.00, 18.00, 'prod-002'),
  createPurchaseItem('pi-003', 'Continental', 'ExtremeContact', '225/45R17', 10, 520.00, 22.00),
];

const purchaseItems2: PurchaseItem[] = [
  createPurchaseItem('pi-004', 'Goodyear', 'Eagle F1', '235/40R18', 8, 680.00, 25.00),
  createPurchaseItem('pi-005', 'Bridgestone', 'Turanza T005', '215/60R16', 12, 380.00, 16.00, 'prod-003'),
];

const purchaseItems3: PurchaseItem[] = [
  createPurchaseItem('pi-006', 'Dunlop', 'Sport Maxx', '245/35R19', 6, 750.00, 30.00),
  createPurchaseItem('pi-007', 'Yokohama', 'Advan Sport', '255/40R19', 4, 820.00, 32.00),
  createPurchaseItem('pi-008', 'Hankook', 'Ventus S1', '225/50R17', 16, 340.00, 14.00),
];

const totals1 = calculatePurchaseTotals(purchaseItems1);
const totals2 = calculatePurchaseTotals(purchaseItems2);
const totals3 = calculatePurchaseTotals(purchaseItems3);

export const mockPurchases: Purchase[] = [
  {
    id: 'pur-001',
    franchiseId: 'franchise-1',
    supplierId: 'sup-001',
    supplierName: 'PneusBrasil',
    purchaseDate: new Date('2024-11-15'),
    expectedDeliveryDate: new Date('2024-11-22'),
    paymentCondition: '28_days',
    invoiceNumber: '12345',
    nfeKey: '35241112345678000190550010000123451234567890',
    observations: 'Pedido mensal regular',
    items: purchaseItems1,
    ...totals1,
    status: 'received',
    confirmedAt: new Date('2024-11-22'),
    confirmedBy: 'João Operador',
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-22'),
    createdBy: 'João Operador',
  },
  {
    id: 'pur-002',
    franchiseId: 'franchise-1',
    supplierId: 'sup-002',
    supplierName: 'Continental Express',
    purchaseDate: new Date('2024-12-01'),
    expectedDeliveryDate: new Date('2024-12-10'),
    paymentCondition: '21_days',
    invoiceNumber: '54321',
    observations: 'Reposição de estoque premium',
    items: purchaseItems2,
    ...totals2,
    status: 'awaiting_delivery',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
    createdBy: 'Maria Supervisora',
  },
  {
    id: 'pur-003',
    franchiseId: 'franchise-1',
    supplierId: 'sup-003',
    supplierName: 'Premium Pneus',
    purchaseDate: new Date('2024-12-05'),
    expectedDeliveryDate: new Date('2024-12-15'),
    paymentCondition: '14_days',
    observations: 'Pneus esportivos para estoque',
    items: purchaseItems3,
    ...totals3,
    status: 'created',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
    createdBy: 'João Operador',
  },
];

export const getSupplierById = (id: string): Supplier | undefined => {
  return mockSuppliers.find(s => s.id === id);
};

export const getPurchaseById = (id: string): Purchase | undefined => {
  return mockPurchases.find(p => p.id === id);
};

export const getPurchasesByStatus = (status: Purchase['status']): Purchase[] => {
  return mockPurchases.filter(p => p.status === status);
};

export const getPurchasesBySupplierId = (supplierId: string): Purchase[] => {
  return mockPurchases.filter(p => p.supplierId === supplierId);
};

export const checkDuplicateNfeKey = (nfeKey: string, excludePurchaseId?: string): boolean => {
  return mockPurchases.some(p => p.nfeKey === nfeKey && p.id !== excludePurchaseId);
};

export const validateCnpj = (cnpj: string): boolean => {
  // Basic CNPJ format validation
  const cleanCnpj = cnpj.replace(/\D/g, '');
  return cleanCnpj.length === 14;
};
