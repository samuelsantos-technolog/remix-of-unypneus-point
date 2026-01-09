import { 
  Module, 
  Profile, 
  SystemUser, 
  AuditLog, 
  Permission,
  ModuleId,
  ActionType 
} from '@/types/access-control';

// Lista de módulos do sistema
export const systemModules: Module[] = [
  { id: 'registrations', name: 'Cadastros', description: 'Gestão de cadastros gerais' },
  { id: 'registrations-overview', name: 'Visão Geral', description: 'Dashboard de cadastros', parentId: 'registrations' },
  { id: 'registrations-suppliers', name: 'Fornecedores', description: 'Cadastro de fornecedores', parentId: 'registrations' },
  { id: 'registrations-customers', name: 'Clientes', description: 'Cadastro de clientes', parentId: 'registrations' },
  { id: 'registrations-products', name: 'Produtos', description: 'Cadastro de produtos', parentId: 'registrations' },
  { id: 'registrations-branches', name: 'Filiais', description: 'Cadastro de filiais', parentId: 'registrations' },
  { id: 'registrations-transfers', name: 'Transferências', description: 'Transferências entre filiais', parentId: 'registrations' },
  { id: 'new-sale', name: 'Nova Venda', description: 'Realizar vendas no PDV' },
  { id: 'cashier', name: 'Caixa', description: 'Gestão do caixa e pagamentos' },
  { id: 'withdrawals', name: 'Retiradas', description: 'Controle de retiradas' },
  { id: 'inventory', name: 'Controle de Estoque', description: 'Gestão de estoque e movimentações' },
  { id: 'purchases', name: 'Compras', description: 'Gestão de compras com fornecedores' },
  { id: 'orders', name: 'Pedidos', description: 'Gestão de pedidos comerciais' },
  { id: 'loads', name: 'Cargas', description: 'Gestão de cargas e logística' },
  { id: 'financial', name: 'Financeiro', description: 'Gestão financeira e repasses' },
  { id: 'admin', name: 'Administração', description: 'Configurações e controle de acesso' },
];

// Lista de ações disponíveis
export const availableActions: { id: ActionType; label: string }[] = [
  { id: 'view', label: 'Visualizar' },
  { id: 'create', label: 'Criar' },
  { id: 'edit', label: 'Editar' },
  { id: 'delete', label: 'Excluir' },
  { id: 'approve', label: 'Aprovar' },
  { id: 'finalize', label: 'Finalizar' },
];

// Função auxiliar para criar permissões
const createPermission = (moduleId: ModuleId, actions: ActionType[]): Permission => ({
  moduleId,
  actions,
});

// Permissões completas para Admin
const adminPermissions: Permission[] = systemModules.map(m => 
  createPermission(m.id, ['view', 'create', 'edit', 'delete', 'approve', 'finalize'])
);

// Permissões para Gerente de Franquia
const managerPermissions: Permission[] = [
  createPermission('registrations', ['view']),
  createPermission('registrations-overview', ['view']),
  createPermission('registrations-suppliers', ['view']),
  createPermission('registrations-customers', ['view', 'create', 'edit']),
  createPermission('registrations-products', ['view']),
  createPermission('registrations-branches', ['view']),
  createPermission('registrations-transfers', ['view', 'create']),
  createPermission('new-sale', ['view', 'create']),
  createPermission('cashier', ['view', 'create', 'edit', 'finalize']),
  createPermission('withdrawals', ['view', 'finalize']),
  createPermission('inventory', ['view', 'edit', 'approve']),
  createPermission('purchases', ['view', 'create', 'edit', 'approve']),
  createPermission('orders', ['view', 'create', 'edit', 'approve']),
  createPermission('loads', ['view', 'create', 'finalize']),
  createPermission('financial', ['view']),
];

// Permissões para Operador de Caixa
const cashierPermissions: Permission[] = [
  createPermission('new-sale', ['view', 'create']),
  createPermission('cashier', ['view', 'create', 'edit']),
];

// Permissões para Estoquista
const stockistPermissions: Permission[] = [
  createPermission('registrations-products', ['view']),
  createPermission('registrations-transfers', ['view', 'create']),
  createPermission('inventory', ['view', 'create', 'edit']),
];

// Permissões para Compras/Comercial
const purchasingPermissions: Permission[] = [
  createPermission('registrations-suppliers', ['view', 'create', 'edit']),
  createPermission('registrations-products', ['view', 'create', 'edit']),
  createPermission('purchases', ['view', 'create', 'edit']),
  createPermission('orders', ['view', 'create', 'edit']),
];

// Permissões para Logística
const logisticsPermissions: Permission[] = [
  createPermission('registrations-transfers', ['view', 'create']),
  createPermission('orders', ['view']),
  createPermission('loads', ['view', 'create', 'edit', 'finalize']),
];

// Permissões para Financeiro
const financialPermissions: Permission[] = [
  createPermission('purchases', ['view']),
  createPermission('orders', ['view']),
  createPermission('loads', ['view']),
  createPermission('financial', ['view', 'create', 'edit', 'approve', 'finalize']),
];

// Permissões para Cliente
const customerPermissions: Permission[] = [
  createPermission('orders', ['view', 'create']),
];

// Perfis do sistema
export const systemProfiles: Profile[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso total a todos os módulos e funcionalidades do sistema',
    isSystem: true,
    permissions: adminPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'manager',
    name: 'Gerente de Franquia',
    description: 'Gestão completa da franquia, sem acesso a configurações globais',
    isSystem: true,
    permissions: managerPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'cashier',
    name: 'Operador de Caixa',
    description: 'Acesso restrito a vendas e caixa',
    isSystem: true,
    permissions: cashierPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'stockist',
    name: 'Estoquista',
    description: 'Gestão de estoque e movimentações',
    isSystem: true,
    permissions: stockistPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'purchasing',
    name: 'Compras / Comercial',
    description: 'Gestão de compras, fornecedores e pedidos comerciais',
    isSystem: true,
    permissions: purchasingPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'logistics',
    name: 'Logística',
    description: 'Gestão de cargas e transferências',
    isSystem: true,
    permissions: logisticsPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'financial',
    name: 'Financeiro',
    description: 'Gestão financeira, contas a pagar e receber',
    isSystem: true,
    permissions: financialPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'customer',
    name: 'Cliente',
    description: 'Acesso para clientes solicitarem pedidos',
    isSystem: true,
    permissions: customerPermissions,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Usuários do sistema
export const systemUsers: SystemUser[] = [
  {
    id: 'admin-1',
    name: 'Administrador Master',
    email: 'admin@unypneus.com.br',
    cpf: '123.456.789-00',
    password: '1234',
    profileId: 'admin',
    franchiseId: null, // Acesso a todas as filiais
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    lastLogin: new Date(),
  },
  {
    id: 'manager-1',
    name: 'Carlos Gerente',
    email: 'carlos@unypneus.com.br',
    cpf: '111.222.333-44',
    password: '1234',
    profileId: 'manager',
    franchiseId: '1',
    active: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'cashier-1',
    name: 'João Silva',
    email: 'joao@unypneus.com.br',
    cpf: '222.333.444-55',
    password: '1234',
    profileId: 'cashier',
    franchiseId: '1',
    active: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'stockist-1',
    name: 'Maria Estoque',
    email: 'maria@unypneus.com.br',
    cpf: '333.444.555-66',
    password: '1234',
    profileId: 'stockist',
    franchiseId: '1',
    active: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'purchasing-1',
    name: 'Ana Compras',
    email: 'ana@unypneus.com.br',
    cpf: '444.555.666-77',
    password: '1234',
    profileId: 'purchasing',
    franchiseId: null,
    active: true,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'logistics-1',
    name: 'Pedro Logística',
    email: 'pedro@unypneus.com.br',
    cpf: '555.666.777-88',
    password: '1234',
    profileId: 'logistics',
    franchiseId: '1',
    active: true,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'financial-1',
    name: 'Fernanda Financeiro',
    email: 'fernanda@unypneus.com.br',
    cpf: '666.777.888-99',
    password: '1234',
    profileId: 'financial',
    franchiseId: null,
    active: true,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25'),
  },
  {
    id: 'customer-1',
    name: 'Roberto Cliente',
    email: 'roberto@empresa.com.br',
    cpf: '777.888.999-00',
    password: '1234',
    profileId: 'customer',
    franchiseId: '1',
    active: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
];

// Logs de auditoria
export const auditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'admin-1',
    userName: 'Administrador Master',
    action: 'login',
    description: 'Login realizado com sucesso',
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: 'log-2',
    userId: 'admin-1',
    userName: 'Administrador Master',
    action: 'user_create',
    description: 'Usuário "João Silva" criado',
    details: { userId: 'cashier-1', profile: 'Operador de Caixa' },
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: 'log-3',
    userId: 'manager-1',
    userName: 'Carlos Gerente',
    action: 'stock_adjustment',
    description: 'Ajuste de estoque realizado',
    details: { productId: '1', quantity: -5, reason: 'Avaria' },
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: 'log-4',
    userId: 'cashier-1',
    userName: 'João Silva',
    action: 'login',
    description: 'Login realizado com sucesso',
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: 'log-5',
    userId: 'admin-1',
    userName: 'Administrador Master',
    action: 'permission_change',
    description: 'Permissões do perfil "Gerente de Franquia" alteradas',
    details: { profileId: 'manager', changes: ['financial: view adicionado'] },
    timestamp: new Date(Date.now() - 259200000),
  },
];

// Função para adicionar log de auditoria
export const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog => {
  const newLog: AuditLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date(),
  };
  auditLogs.unshift(newLog);
  return newLog;
};

// Função para obter permissões de um usuário
export const getUserPermissions = (userId: string): Permission[] => {
  const user = systemUsers.find(u => u.id === userId);
  if (!user) return [];
  
  const profile = systemProfiles.find(p => p.id === user.profileId);
  return profile?.permissions ?? [];
};

// Função para obter perfil do usuário
export const getUserProfile = (userId: string): Profile | undefined => {
  const user = systemUsers.find(u => u.id === userId);
  if (!user) return undefined;
  
  return systemProfiles.find(p => p.id === user.profileId);
};
