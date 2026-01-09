export interface Franchise {
  id: string;
  name: string;
  cnpj: string;
  address: string;
}

export interface Operator {
  id: string;
  name: string;
  cpf: string;
  password: string;
  franchiseId: string;
}

export interface Tire {
  id: string;
  brand: string;
  model: string;
  size: string;
  price: number;
  stock: number;
}

export interface CartItem {
  tire: Tire;
  quantity: number;
}

export interface Customer {
  document: string;
  name: string;
  plate: string;
  phone: string;
}

export type PaymentType = 'credit' | 'debit' | 'pix' | 'cash';

export interface PaymentMethod {
  type: PaymentType;
  installments?: number;
}

export type PendingSaleStatus = 'pending_payment' | 'paid' | 'ready_for_pickup' | 'completed' | 'cancelled';

export interface PendingSale {
  id: string;
  franchiseId: string;
  operatorId: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountType: 'percent' | 'value';
  discountValue: number;
  total: number;
  status: PendingSaleStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  franchiseId: string;
  operatorId: string;
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  interestRate: number;
  total: number;
  payment: PaymentMethod;
  createdAt: Date;
  status: 'completed' | 'cancelled';
  pendingSaleId?: string;
}

export interface InstallmentOption {
  installments: number;
  rate: number;
  label: string;
}

export interface DashboardStats {
  totalSales: number;
  tiresCount: number;
  averageTicket: number;
}
