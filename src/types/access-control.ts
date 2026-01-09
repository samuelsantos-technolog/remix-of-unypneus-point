// Tipos para controle de acesso

export type ModuleId = 
  | 'registrations' 
  | 'registrations-overview'
  | 'registrations-suppliers'
  | 'registrations-customers'
  | 'registrations-products'
  | 'registrations-branches'
  | 'registrations-transfers'
  | 'new-sale' 
  | 'cashier' 
  | 'withdrawals' 
  | 'inventory' 
  | 'purchases' 
  | 'orders' 
  | 'loads' 
  | 'financial'
  | 'admin';

export type ActionType = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'finalize';

export interface Module {
  id: ModuleId;
  name: string;
  description: string;
  icon?: string;
  parentId?: ModuleId;
}

export interface Permission {
  moduleId: ModuleId;
  actions: ActionType[];
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  isSystem: boolean; // Perfis do sistema não podem ser excluídos
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  cpf: string;
  password: string;
  profileId: string;
  franchiseId: string | null; // null = acesso a todas as filiais
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export type AuditActionType = 
  | 'login'
  | 'logout'
  | 'permission_change'
  | 'user_create'
  | 'user_update'
  | 'user_delete'
  | 'profile_create'
  | 'profile_update'
  | 'profile_delete'
  | 'stock_adjustment'
  | 'load_finalize'
  | 'cashier_close'
  | 'sale_cancel'
  | 'purchase_approve'
  | 'order_approve';

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: AuditActionType;
  description: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: Date;
}

// Helper para verificar permissões
export const hasPermission = (
  userPermissions: Permission[],
  moduleId: ModuleId,
  action: ActionType
): boolean => {
  const modulePermission = userPermissions.find(p => p.moduleId === moduleId);
  return modulePermission?.actions.includes(action) ?? false;
};

// Helper para verificar se usuário pode ver um módulo
export const canViewModule = (
  userPermissions: Permission[],
  moduleId: ModuleId
): boolean => {
  return hasPermission(userPermissions, moduleId, 'view');
};
