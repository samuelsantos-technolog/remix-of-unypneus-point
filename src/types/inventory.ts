export interface Product {
  id: string;
  code: string;
  description: string;
  ncm: string;
  brand: string;
  model: string;
  size: string;
  price: number;
  cost: number;
  category: string;
}

export interface StockItem {
  productId: string;
  franchiseId: string;
  quantity: number;
  minStock: number;
  lastUpdated: Date;
}

export interface Supplier {
  id: string;
  cnpj: string;
  name: string;
  tradeName: string;
  address: string;
  phone: string;
  email: string;
}

export type MovementType = 'entry' | 'exit' | 'adjustment' | 'sale';

export interface StockMovement {
  id: string;
  productId: string;
  franchiseId: string;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  referenceId?: string; // NF-e key or Sale ID
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface XMLImport {
  id: string;
  nfeKey: string;
  nfeNumber: string;
  supplierId: string;
  supplierName: string;
  franchiseId: string;
  totalValue: number;
  itemsCount: number;
  importedAt: Date;
  importedBy: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface XMLProduct {
  code: string;
  description: string;
  ncm: string;
  cfop: string;
  quantity: number;
  unitValue: number;
  totalValue: number;
  existingProductId?: string;
  isNew: boolean;
}

export interface ParsedXML {
  nfeKey: string;
  nfeNumber: string;
  supplier: {
    cnpj: string;
    name: string;
    tradeName: string;
  };
  products: XMLProduct[];
  totalValue: number;
  issueDate: string;
}
