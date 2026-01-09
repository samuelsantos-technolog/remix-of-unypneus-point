// Record origin types
export type RecordOrigin = 'manual' | 'api';

// Record status types
export type RecordStatus = 'active' | 'inactive' | 'blocked' | 'syncing' | 'sync_error';

// Integration status types
export type IntegrationStatus = 'connected' | 'disconnected' | 'error';

// Sync log entry
export interface SyncLog {
  id: string;
  action: 'create' | 'update' | 'delete' | 'sync';
  status: 'success' | 'error';
  message: string;
  timestamp: Date;
  userId: string;
  userName: string;
}

// Base registration entity
export interface BaseRegistration {
  id: string;
  externalId?: string;
  origin: RecordOrigin;
  status: RecordStatus;
  integrationStatus?: IntegrationStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastSyncAt?: Date;
  syncLogs: SyncLog[];
}

// Customer entity
export interface Customer extends BaseRegistration {
  type: 'individual' | 'corporate';
  name: string;
  tradeName?: string;
  document: string; // CPF or CNPJ
  stateRegistration?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  creditLimit?: number;
  notes?: string;
}

// Branch entity
export interface Branch extends BaseRegistration {
  code: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  managerName?: string;
  isDistributionCenter: boolean;
  isActive: boolean;
}

// Stock Transfer entity
export type TransferStatus = 'pending' | 'approved' | 'in_transit' | 'received' | 'cancelled';

export interface TransferItem {
  id: string;
  productId: string;
  productCode: string;
  productDescription: string;
  quantity: number;
}

export interface StockTransfer extends BaseRegistration {
  code: string;
  originBranchId: string;
  originBranchName: string;
  destinationBranchId: string;
  destinationBranchName: string;
  transferStatus: TransferStatus;
  items: TransferItem[];
  totalItems: number;
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  shippedAt?: Date;
  receivedAt?: Date;
  receivedBy?: string;
  notes?: string;
}

// Enhanced Supplier from existing type
export interface SupplierRegistration extends BaseRegistration {
  corporateName: string;
  tradeName: string;
  cnpj: string;
  stateRegistration: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactName: string;
  phone: string;
  email: string;
  defaultPaymentCondition: string;
  customPaymentDays?: number;
}

// Enhanced Product from existing type
export interface ProductRegistration extends BaseRegistration {
  code: string;
  description: string;
  ncm: string;
  brand: string;
  model: string;
  size: string;
  price: number;
  cost: number;
  category: string;
  minStock?: number;
  maxStock?: number;
  weight?: number;
  barcode?: string;
}

// Status display configuration
export const RECORD_STATUS_CONFIG: Record<RecordStatus, { label: string; color: string }> = {
  active: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
  blocked: { label: 'Bloqueado', color: 'bg-red-100 text-red-800' },
  syncing: { label: 'Sincronizando', color: 'bg-blue-100 text-blue-800' },
  sync_error: { label: 'Erro de Sync', color: 'bg-orange-100 text-orange-800' },
};

export const TRANSFER_STATUS_CONFIG: Record<TransferStatus, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprovada', color: 'bg-blue-100 text-blue-800' },
  in_transit: { label: 'Em Trânsito', color: 'bg-purple-100 text-purple-800' },
  received: { label: 'Recebida', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800' },
};

export const ORIGIN_CONFIG: Record<RecordOrigin, { label: string; color: string }> = {
  manual: { label: 'Manual', color: 'bg-blue-100 text-blue-800' },
  api: { label: 'API', color: 'bg-purple-100 text-purple-800' },
};
