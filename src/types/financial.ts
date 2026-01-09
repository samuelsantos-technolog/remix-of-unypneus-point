import { 
  FinancialTransactionStatus, 
  SalesOrderStatus 
} from './statusFlows';

// ===========================================
// TIPOS DO MÓDULO FINANCEIRO
// ===========================================

// Tipo de Transação
export type TransactionType = 'income' | 'expense';

// Tipo de Conta
export type AccountType = 'payable' | 'receivable';

// Status de Conta
export type AccountStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';

// Forma de Pagamento
export type PaymentMethod = 
  | 'cash' 
  | 'credit_card' 
  | 'debit_card' 
  | 'pix' 
  | 'bank_transfer' 
  | 'boleto'
  | 'check';

// Categoria Financeira
export type FinancialCategory = 
  | 'product_sale'      // Venda de produto
  | 'product_purchase'  // Compra de produto
  | 'freight'           // Frete
  | 'commission'        // Comissão
  | 'tax'               // Impostos
  | 'operational'       // Despesas operacionais
  | 'other';            // Outros

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethod, { label: string; icon: string }> = {
  cash: { label: 'Dinheiro', icon: 'Banknote' },
  credit_card: { label: 'Cartão de Crédito', icon: 'CreditCard' },
  debit_card: { label: 'Cartão de Débito', icon: 'CreditCard' },
  pix: { label: 'PIX', icon: 'Smartphone' },
  bank_transfer: { label: 'Transferência', icon: 'Building2' },
  boleto: { label: 'Boleto', icon: 'FileText' },
  check: { label: 'Cheque', icon: 'FileCheck' }
};

export const ACCOUNT_STATUS_CONFIG: Record<AccountStatus, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  partial: { label: 'Parcial', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
  overdue: { label: 'Vencido', color: 'bg-red-100 text-red-800' },
  cancelled: { label: 'Cancelado', color: 'bg-slate-100 text-slate-800' }
};

export const CATEGORY_CONFIG: Record<FinancialCategory, { label: string; type: TransactionType }> = {
  product_sale: { label: 'Venda de Produto', type: 'income' },
  product_purchase: { label: 'Compra de Produto', type: 'expense' },
  freight: { label: 'Frete', type: 'expense' },
  commission: { label: 'Comissão', type: 'expense' },
  tax: { label: 'Impostos', type: 'expense' },
  operational: { label: 'Despesas Operacionais', type: 'expense' },
  other: { label: 'Outros', type: 'expense' }
};

// ===========================================
// INTERFACES PRINCIPAIS
// ===========================================

// Conta a Pagar/Receber
export interface FinancialAccount {
  id: string;
  franchiseId: string;
  type: AccountType;
  category: FinancialCategory;
  description: string;
  referenceId?: string;      // ID do pedido, compra, etc.
  referenceType?: 'purchase' | 'sale' | 'commission' | 'other';
  
  // Entidade relacionada
  entityId?: string;         // ID do fornecedor ou cliente
  entityName: string;
  entityDocument?: string;   // CNPJ/CPF
  
  // Valores
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  
  // Datas
  issueDate: Date;
  dueDate: Date;
  paymentDate?: Date;
  
  // Pagamento
  paymentMethod?: PaymentMethod;
  installments: FinancialInstallment[];
  
  // Status e histórico
  status: AccountStatus;
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Parcela
export interface FinancialInstallment {
  id: string;
  accountId: string;
  number: number;
  amount: number;
  dueDate: Date;
  paidAmount: number;
  paymentDate?: Date;
  paymentMethod?: PaymentMethod;
  status: AccountStatus;
}

// Transação de Caixa
export interface CashTransaction {
  id: string;
  franchiseId: string;
  type: TransactionType;
  category: FinancialCategory;
  description: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceId?: string;
  referenceType?: string;
  transactionDate: Date;
  createdBy: string;
  createdAt: Date;
}

// Conciliação de Cartão
export interface CardReconciliation {
  id: string;
  franchiseId: string;
  saleId: string;
  nsu: string;                // Número Sequencial Único
  authorizationCode: string;
  cardBrand: string;
  cardType: 'credit' | 'debit';
  installments: number;
  grossAmount: number;
  netAmount: number;
  fee: number;
  feePercentage: number;
  transactionDate: Date;
  expectedPaymentDate: Date;
  actualPaymentDate?: Date;
  status: FinancialTransactionStatus;
  reconciledAt?: Date;
  reconciledBy?: string;
}

// Resumo Financeiro
export interface FinancialSummary {
  period: {
    start: Date;
    end: Date;
  };
  
  // Entradas
  totalIncome: number;
  incomeByCategory: Record<string, number>;
  
  // Saídas
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  
  // Resultados
  balance: number;
  margin: number;
  marginPercentage: number;
  
  // Pendências
  pendingReceivables: number;
  pendingPayables: number;
  overdueReceivables: number;
  overduePayables: number;
  
  // Comissões
  totalCommissions: number;
  pendingCommissions: number;
}

// Repasse (Comissão)
export interface Commission {
  id: string;
  franchiseId: string;
  recipientType: 'franchise' | 'salesperson' | 'partner';
  recipientId: string;
  recipientName: string;
  
  // Referência
  saleId: string;
  saleDate: Date;
  saleAmount: number;
  
  // Cálculo
  commissionRate: number;     // Percentual
  commissionAmount: number;
  
  // Status
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  approvedAt?: Date;
  approvedBy?: string;
  paidAt?: Date;
  paidBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Fluxo de Caixa Projetado
export interface CashFlowProjection {
  date: Date;
  openingBalance: number;
  expectedIncome: number;
  expectedExpenses: number;
  projectedBalance: number;
  receivables: FinancialAccount[];
  payables: FinancialAccount[];
}

// ===========================================
// FUNÇÕES AUXILIARES
// ===========================================

export const calculateAccountStatus = (account: FinancialAccount): AccountStatus => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (account.status === 'cancelled') return 'cancelled';
  if (account.remainingAmount === 0) return 'paid';
  if (account.paidAmount > 0 && account.remainingAmount > 0) return 'partial';
  if (new Date(account.dueDate) < today) return 'overdue';
  return 'pending';
};

export const calculateInstallments = (
  totalAmount: number,
  numInstallments: number,
  startDate: Date,
  intervalDays: number = 30
): Omit<FinancialInstallment, 'id' | 'accountId'>[] => {
  const installments: Omit<FinancialInstallment, 'id' | 'accountId'>[] = [];
  const installmentAmount = totalAmount / numInstallments;
  
  for (let i = 0; i < numInstallments; i++) {
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + (intervalDays * i));
    
    installments.push({
      number: i + 1,
      amount: installmentAmount,
      dueDate,
      paidAmount: 0,
      status: 'pending'
    });
  }
  
  return installments;
};

export const getOverdueAccounts = (accounts: FinancialAccount[]): FinancialAccount[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return accounts.filter(acc => 
    acc.status !== 'paid' && 
    acc.status !== 'cancelled' && 
    new Date(acc.dueDate) < today
  );
};

export const calculateFinancialSummary = (
  accounts: FinancialAccount[],
  transactions: CashTransaction[],
  commissions: Commission[],
  startDate: Date,
  endDate: Date
): FinancialSummary => {
  const receivables = accounts.filter(a => a.type === 'receivable');
  const payables = accounts.filter(a => a.type === 'payable');
  
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  const today = new Date();
  
  return {
    period: { start: startDate, end: endDate },
    totalIncome,
    incomeByCategory: {},
    totalExpenses,
    expensesByCategory: {},
    balance: totalIncome - totalExpenses,
    margin: totalIncome - totalExpenses,
    marginPercentage: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
    pendingReceivables: receivables.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.remainingAmount, 0),
    pendingPayables: payables.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.remainingAmount, 0),
    overdueReceivables: receivables.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.remainingAmount, 0),
    overduePayables: payables.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.remainingAmount, 0),
    totalCommissions: commissions.reduce((sum, c) => sum + c.commissionAmount, 0),
    pendingCommissions: commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0)
  };
};
