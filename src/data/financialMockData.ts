import { 
  FinancialAccount, 
  CashTransaction, 
  CardReconciliation, 
  Commission,
  AccountStatus
} from '@/types/financial';
import { addDays, subDays } from 'date-fns';

const today = new Date();

// ===========================================
// CONTAS A PAGAR (Fornecedores)
// ===========================================

export const mockPayables: FinancialAccount[] = [
  {
    id: 'pay-001',
    franchiseId: 'franchise-1',
    type: 'payable',
    category: 'product_purchase',
    description: 'Compra de pneus - NF 12345',
    referenceId: 'pur-001',
    referenceType: 'purchase',
    entityId: 'sup-001',
    entityName: 'PneusBrasil',
    entityDocument: '12.345.678/0001-90',
    totalAmount: 15750.00,
    paidAmount: 0,
    remainingAmount: 15750.00,
    issueDate: subDays(today, 15),
    dueDate: addDays(today, 13),
    status: 'pending',
    installments: [
      {
        id: 'inst-001',
        accountId: 'pay-001',
        number: 1,
        amount: 15750.00,
        dueDate: addDays(today, 13),
        paidAmount: 0,
        status: 'pending'
      }
    ],
    createdAt: subDays(today, 15),
    updatedAt: subDays(today, 15),
    createdBy: 'João Operador'
  },
  {
    id: 'pay-002',
    franchiseId: 'franchise-1',
    type: 'payable',
    category: 'product_purchase',
    description: 'Compra de pneus premium - NF 54321',
    referenceId: 'pur-002',
    referenceType: 'purchase',
    entityId: 'sup-002',
    entityName: 'Continental Express',
    entityDocument: '98.765.432/0001-10',
    totalAmount: 10120.00,
    paidAmount: 0,
    remainingAmount: 10120.00,
    issueDate: subDays(today, 5),
    dueDate: addDays(today, 16),
    status: 'pending',
    installments: [
      {
        id: 'inst-002',
        accountId: 'pay-002',
        number: 1,
        amount: 10120.00,
        dueDate: addDays(today, 16),
        paidAmount: 0,
        status: 'pending'
      }
    ],
    createdAt: subDays(today, 5),
    updatedAt: subDays(today, 5),
    createdBy: 'Maria Supervisora'
  },
  {
    id: 'pay-003',
    franchiseId: 'franchise-1',
    type: 'payable',
    category: 'freight',
    description: 'Frete transportadora XYZ',
    entityName: 'Transportadora XYZ',
    entityDocument: '11.222.333/0001-44',
    totalAmount: 850.00,
    paidAmount: 850.00,
    remainingAmount: 0,
    issueDate: subDays(today, 20),
    dueDate: subDays(today, 5),
    paymentDate: subDays(today, 5),
    paymentMethod: 'bank_transfer',
    status: 'paid',
    installments: [
      {
        id: 'inst-003',
        accountId: 'pay-003',
        number: 1,
        amount: 850.00,
        dueDate: subDays(today, 5),
        paidAmount: 850.00,
        paymentDate: subDays(today, 5),
        paymentMethod: 'bank_transfer',
        status: 'paid'
      }
    ],
    createdAt: subDays(today, 20),
    updatedAt: subDays(today, 5),
    createdBy: 'João Operador'
  },
  {
    id: 'pay-004',
    franchiseId: 'franchise-1',
    type: 'payable',
    category: 'operational',
    description: 'Aluguel do mês',
    entityName: 'Imobiliária Centro',
    totalAmount: 3500.00,
    paidAmount: 0,
    remainingAmount: 3500.00,
    issueDate: subDays(today, 10),
    dueDate: subDays(today, 2),
    status: 'overdue',
    installments: [
      {
        id: 'inst-004',
        accountId: 'pay-004',
        number: 1,
        amount: 3500.00,
        dueDate: subDays(today, 2),
        paidAmount: 0,
        status: 'overdue'
      }
    ],
    createdAt: subDays(today, 10),
    updatedAt: subDays(today, 10),
    createdBy: 'João Operador'
  }
];

// ===========================================
// CONTAS A RECEBER (Clientes)
// ===========================================

export const mockReceivables: FinancialAccount[] = [
  {
    id: 'rec-001',
    franchiseId: 'franchise-1',
    type: 'receivable',
    category: 'product_sale',
    description: 'Venda de pneus - Pedido #V001',
    referenceId: 'sale-001',
    referenceType: 'sale',
    entityName: 'Auto Mecânica Silva',
    entityDocument: '12.345.678/0001-99',
    totalAmount: 2400.00,
    paidAmount: 2400.00,
    remainingAmount: 0,
    issueDate: subDays(today, 10),
    dueDate: subDays(today, 3),
    paymentDate: subDays(today, 3),
    paymentMethod: 'credit_card',
    status: 'paid',
    installments: [
      {
        id: 'inst-r001',
        accountId: 'rec-001',
        number: 1,
        amount: 2400.00,
        dueDate: subDays(today, 3),
        paidAmount: 2400.00,
        paymentDate: subDays(today, 3),
        paymentMethod: 'credit_card',
        status: 'paid'
      }
    ],
    createdAt: subDays(today, 10),
    updatedAt: subDays(today, 3),
    createdBy: 'Maria Vendedora'
  },
  {
    id: 'rec-002',
    franchiseId: 'franchise-1',
    type: 'receivable',
    category: 'product_sale',
    description: 'Venda de pneus - Pedido #V002',
    referenceId: 'sale-002',
    referenceType: 'sale',
    entityName: 'João da Silva',
    entityDocument: '123.456.789-00',
    totalAmount: 1800.00,
    paidAmount: 600.00,
    remainingAmount: 1200.00,
    issueDate: subDays(today, 15),
    dueDate: addDays(today, 15),
    status: 'partial',
    installments: [
      {
        id: 'inst-r002a',
        accountId: 'rec-002',
        number: 1,
        amount: 600.00,
        dueDate: subDays(today, 15),
        paidAmount: 600.00,
        paymentDate: subDays(today, 15),
        paymentMethod: 'pix',
        status: 'paid'
      },
      {
        id: 'inst-r002b',
        accountId: 'rec-002',
        number: 2,
        amount: 600.00,
        dueDate: today,
        paidAmount: 0,
        status: 'pending'
      },
      {
        id: 'inst-r002c',
        accountId: 'rec-002',
        number: 3,
        amount: 600.00,
        dueDate: addDays(today, 15),
        paidAmount: 0,
        status: 'pending'
      }
    ],
    createdAt: subDays(today, 15),
    updatedAt: subDays(today, 15),
    createdBy: 'Carlos Vendedor'
  },
  {
    id: 'rec-003',
    franchiseId: 'franchise-1',
    type: 'receivable',
    category: 'product_sale',
    description: 'Venda de pneus - Pedido #V003',
    referenceId: 'sale-003',
    referenceType: 'sale',
    entityName: 'Frota ABC Transportes',
    entityDocument: '55.666.777/0001-88',
    totalAmount: 8500.00,
    paidAmount: 0,
    remainingAmount: 8500.00,
    issueDate: subDays(today, 5),
    dueDate: addDays(today, 9),
    status: 'pending',
    installments: [
      {
        id: 'inst-r003',
        accountId: 'rec-003',
        number: 1,
        amount: 8500.00,
        dueDate: addDays(today, 9),
        paidAmount: 0,
        status: 'pending'
      }
    ],
    createdAt: subDays(today, 5),
    updatedAt: subDays(today, 5),
    createdBy: 'Maria Vendedora'
  }
];

// ===========================================
// TRANSAÇÕES DE CAIXA
// ===========================================

export const mockCashTransactions: CashTransaction[] = [
  {
    id: 'tx-001',
    franchiseId: 'franchise-1',
    type: 'income',
    category: 'product_sale',
    description: 'Venda à vista - Cliente João',
    amount: 850.00,
    paymentMethod: 'pix',
    referenceId: 'sale-004',
    transactionDate: subDays(today, 1),
    createdBy: 'Maria Vendedora',
    createdAt: subDays(today, 1)
  },
  {
    id: 'tx-002',
    franchiseId: 'franchise-1',
    type: 'income',
    category: 'product_sale',
    description: 'Venda cartão débito - Cliente Pedro',
    amount: 1200.00,
    paymentMethod: 'debit_card',
    referenceId: 'sale-005',
    transactionDate: subDays(today, 1),
    createdBy: 'Carlos Vendedor',
    createdAt: subDays(today, 1)
  },
  {
    id: 'tx-003',
    franchiseId: 'franchise-1',
    type: 'expense',
    category: 'operational',
    description: 'Pagamento conta de luz',
    amount: 450.00,
    paymentMethod: 'bank_transfer',
    transactionDate: subDays(today, 2),
    createdBy: 'João Operador',
    createdAt: subDays(today, 2)
  },
  {
    id: 'tx-004',
    franchiseId: 'franchise-1',
    type: 'income',
    category: 'product_sale',
    description: 'Venda dinheiro - Cliente Maria',
    amount: 680.00,
    paymentMethod: 'cash',
    referenceId: 'sale-006',
    transactionDate: today,
    createdBy: 'Maria Vendedora',
    createdAt: today
  }
];

// ===========================================
// CONCILIAÇÃO DE CARTÕES
// ===========================================

export const mockCardReconciliations: CardReconciliation[] = [
  {
    id: 'conc-001',
    franchiseId: 'franchise-1',
    saleId: 'sale-001',
    nsu: '123456789',
    authorizationCode: 'ABC123',
    cardBrand: 'Visa',
    cardType: 'credit',
    installments: 3,
    grossAmount: 2400.00,
    netAmount: 2328.00,
    fee: 72.00,
    feePercentage: 3.0,
    transactionDate: subDays(today, 10),
    expectedPaymentDate: addDays(today, 20),
    status: 'reconciled',
    reconciledAt: subDays(today, 9),
    reconciledBy: 'Sistema'
  },
  {
    id: 'conc-002',
    franchiseId: 'franchise-1',
    saleId: 'sale-007',
    nsu: '987654321',
    authorizationCode: 'XYZ789',
    cardBrand: 'Mastercard',
    cardType: 'debit',
    installments: 1,
    grossAmount: 1200.00,
    netAmount: 1176.00,
    fee: 24.00,
    feePercentage: 2.0,
    transactionDate: subDays(today, 1),
    expectedPaymentDate: addDays(today, 1),
    status: 'receivable'
  },
  {
    id: 'conc-003',
    franchiseId: 'franchise-1',
    saleId: 'sale-008',
    nsu: '456789123',
    authorizationCode: 'DEF456',
    cardBrand: 'Elo',
    cardType: 'credit',
    installments: 2,
    grossAmount: 1500.00,
    netAmount: 1455.00,
    fee: 45.00,
    feePercentage: 3.0,
    transactionDate: today,
    expectedPaymentDate: addDays(today, 30),
    status: 'pending_reconciliation'
  }
];

// ===========================================
// COMISSÕES / REPASSES
// ===========================================

export const mockCommissions: Commission[] = [
  {
    id: 'com-001',
    franchiseId: 'franchise-1',
    recipientType: 'salesperson',
    recipientId: 'user-001',
    recipientName: 'Maria Vendedora',
    saleId: 'sale-001',
    saleDate: subDays(today, 10),
    saleAmount: 2400.00,
    commissionRate: 5,
    commissionAmount: 120.00,
    status: 'paid',
    approvedAt: subDays(today, 5),
    approvedBy: 'Gerente',
    paidAt: subDays(today, 3),
    paidBy: 'Financeiro',
    createdAt: subDays(today, 10),
    updatedAt: subDays(today, 3)
  },
  {
    id: 'com-002',
    franchiseId: 'franchise-1',
    recipientType: 'salesperson',
    recipientId: 'user-002',
    recipientName: 'Carlos Vendedor',
    saleId: 'sale-002',
    saleDate: subDays(today, 15),
    saleAmount: 1800.00,
    commissionRate: 5,
    commissionAmount: 90.00,
    status: 'approved',
    approvedAt: subDays(today, 10),
    approvedBy: 'Gerente',
    createdAt: subDays(today, 15),
    updatedAt: subDays(today, 10)
  },
  {
    id: 'com-003',
    franchiseId: 'franchise-1',
    recipientType: 'salesperson',
    recipientId: 'user-001',
    recipientName: 'Maria Vendedora',
    saleId: 'sale-003',
    saleDate: subDays(today, 5),
    saleAmount: 8500.00,
    commissionRate: 5,
    commissionAmount: 425.00,
    status: 'pending',
    createdAt: subDays(today, 5),
    updatedAt: subDays(today, 5)
  }
];

// ===========================================
// HELPERS
// ===========================================

export const getAllAccounts = (): FinancialAccount[] => {
  return [...mockPayables, ...mockReceivables];
};

export const getAccountById = (id: string): FinancialAccount | undefined => {
  return getAllAccounts().find(acc => acc.id === id);
};

export const getAccountsByStatus = (status: AccountStatus): FinancialAccount[] => {
  return getAllAccounts().filter(acc => acc.status === status);
};

export const getOverduePayables = (): FinancialAccount[] => {
  return mockPayables.filter(acc => acc.status === 'overdue');
};

export const getOverdueReceivables = (): FinancialAccount[] => {
  return mockReceivables.filter(acc => acc.status === 'overdue');
};

export const getTotalPendingPayables = (): number => {
  return mockPayables
    .filter(acc => acc.status === 'pending' || acc.status === 'overdue')
    .reduce((sum, acc) => sum + acc.remainingAmount, 0);
};

export const getTotalPendingReceivables = (): number => {
  return mockReceivables
    .filter(acc => acc.status === 'pending' || acc.status === 'overdue')
    .reduce((sum, acc) => sum + acc.remainingAmount, 0);
};
