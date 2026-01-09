export type PurchasePaymentCondition = 'cash' | '7_days' | '14_days' | '21_days' | '28_days' | 'custom';

export type PurchaseStatus = 'created' | 'awaiting_delivery' | 'in_load' | 'received' | 'cancelled';

export interface Supplier {
  id: string;
  corporateName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  address: string;
  contactName: string;
  phone: string;
  email: string;
  defaultPaymentCondition: PurchasePaymentCondition;
  customPaymentDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseItem {
  id: string;
  brand: string;
  model: string;
  dimension: string;
  quantity: number;
  unitCost: number;
  freightPerTire: number;
  totalUnitCost: number; // unitCost + freightPerTire
  totalCost: number; // quantity * totalUnitCost
  productId?: string; // linked product in inventory
}

export interface Purchase {
  id: string;
  franchiseId: string;
  supplierId: string;
  supplierName: string;
  purchaseDate: Date;
  expectedDeliveryDate: Date;
  paymentCondition: PurchasePaymentCondition;
  customPaymentDays?: number;
  invoiceNumber?: string;
  nfeKey?: string;
  observations: string;
  items: PurchaseItem[];
  totalItems: number;
  totalQuantity: number;
  totalCost: number;
  averageCostPerTire: number;
  status: PurchaseStatus;
  loadId?: string; // linked load
  confirmedAt?: Date;
  confirmedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface PurchaseFinancialData {
  purchaseId: string;
  supplierId: string;
  supplierName: string;
  totalAmount: number;
  dueDate: Date;
  paymentCondition: PurchasePaymentCondition;
  installments?: {
    number: number;
    amount: number;
    dueDate: Date;
    status: 'pending' | 'paid';
  }[];
}

export const PURCHASE_PAYMENT_CONDITIONS: { value: PurchasePaymentCondition; label: string }[] = [
  { value: 'cash', label: 'À vista' },
  { value: '7_days', label: '7 dias' },
  { value: '14_days', label: '14 dias' },
  { value: '21_days', label: '21 dias' },
  { value: '28_days', label: '28 dias' },
  { value: 'custom', label: 'Customizado' },
];

export const PURCHASE_STATUS_CONFIG: Record<PurchaseStatus, { label: string; color: string }> = {
  created: { label: 'Criada', color: 'bg-blue-100 text-blue-800' },
  awaiting_delivery: { label: 'Aguardando Entrega', color: 'bg-yellow-100 text-yellow-800' },
  in_load: { label: 'Em Carga', color: 'bg-purple-100 text-purple-800' },
  received: { label: 'Recebida', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
};

export const calculatePurchaseItemTotals = (item: Omit<PurchaseItem, 'totalUnitCost' | 'totalCost'>): Pick<PurchaseItem, 'totalUnitCost' | 'totalCost'> => {
  const totalUnitCost = item.unitCost + item.freightPerTire;
  const totalCost = item.quantity * totalUnitCost;
  return { totalUnitCost, totalCost };
};

export const calculatePurchaseTotals = (items: PurchaseItem[]) => {
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = items.reduce((sum, item) => sum + item.totalCost, 0);
  const averageCostPerTire = totalQuantity > 0 ? totalCost / totalQuantity : 0;

  return { totalItems, totalQuantity, totalCost, averageCostPerTire };
};

export const calculateDueDate = (purchaseDate: Date, condition: PurchasePaymentCondition, customDays?: number): Date => {
  const dueDate = new Date(purchaseDate);
  
  switch (condition) {
    case 'cash':
      return dueDate;
    case '7_days':
      dueDate.setDate(dueDate.getDate() + 7);
      return dueDate;
    case '14_days':
      dueDate.setDate(dueDate.getDate() + 14);
      return dueDate;
    case '21_days':
      dueDate.setDate(dueDate.getDate() + 21);
      return dueDate;
    case '28_days':
      dueDate.setDate(dueDate.getDate() + 28);
      return dueDate;
    case 'custom':
      dueDate.setDate(dueDate.getDate() + (customDays || 0));
      return dueDate;
    default:
      return dueDate;
  }
};
