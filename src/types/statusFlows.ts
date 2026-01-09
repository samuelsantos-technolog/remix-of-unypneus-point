// ===========================================
// FLUXOS DE STATUS - PADRÃO MARKETPLACE
// ===========================================

// 1️⃣ FLUXO DE COMPRA COM FORNECEDOR (INBOUND)
// ===========================================

export type PurchaseOrderStatus = 
  | 'order_created'           // Pedido criado
  | 'order_sent'              // Pedido enviado ao fornecedor
  | 'order_under_review'      // Pedido em análise pelo fornecedor
  | 'order_approved'          // Pedido aprovado
  | 'order_invoiced'          // Pedido faturado (NF-e emitida)
  | 'order_released'          // Pedido liberado para expedição
  | 'order_in_transit'        // Pedido em transporte
  | 'order_received'          // Pedido recebido na matriz
  | 'order_stocked'           // Pedido lançado em estoque
  | 'order_completed'         // Pedido finalizado
  | 'order_cancelled';        // Pedido cancelado

export const PURCHASE_ORDER_STATUS_CONFIG: Record<PurchaseOrderStatus, {
  label: string;
  description: string;
  color: string;
  category: 'commercial' | 'fiscal' | 'logistics' | 'stock';
}> = {
  order_created: {
    label: 'Pedido Criado',
    description: 'Pedido registrado no sistema aguardando envio',
    color: 'bg-slate-100 text-slate-800',
    category: 'commercial'
  },
  order_sent: {
    label: 'Enviado ao Fornecedor',
    description: 'Pedido enviado e aguardando resposta do fornecedor',
    color: 'bg-blue-100 text-blue-800',
    category: 'commercial'
  },
  order_under_review: {
    label: 'Em Análise',
    description: 'Fornecedor está analisando disponibilidade e condições',
    color: 'bg-yellow-100 text-yellow-800',
    category: 'commercial'
  },
  order_approved: {
    label: 'Aprovado',
    description: 'Fornecedor aprovou o pedido e confirmou condições',
    color: 'bg-green-100 text-green-800',
    category: 'commercial'
  },
  order_invoiced: {
    label: 'Faturado',
    description: 'NF-e emitida pelo fornecedor',
    color: 'bg-purple-100 text-purple-800',
    category: 'fiscal'
  },
  order_released: {
    label: 'Liberado para Expedição',
    description: 'Mercadoria liberada para despacho',
    color: 'bg-indigo-100 text-indigo-800',
    category: 'logistics'
  },
  order_in_transit: {
    label: 'Em Transporte',
    description: 'Mercadoria em trânsito para o destino',
    color: 'bg-orange-100 text-orange-800',
    category: 'logistics'
  },
  order_received: {
    label: 'Recebido',
    description: 'Mercadoria recebida na unidade de destino',
    color: 'bg-teal-100 text-teal-800',
    category: 'logistics'
  },
  order_stocked: {
    label: 'Lançado no Estoque',
    description: 'Entrada de estoque confirmada no sistema',
    color: 'bg-emerald-100 text-emerald-800',
    category: 'stock'
  },
  order_completed: {
    label: 'Finalizado',
    description: 'Processo de compra concluído com sucesso',
    color: 'bg-green-100 text-green-800',
    category: 'stock'
  },
  order_cancelled: {
    label: 'Cancelado',
    description: 'Pedido cancelado',
    color: 'bg-red-100 text-red-800',
    category: 'commercial'
  }
};

// Eventos de auditoria para compras
export type PurchaseAuditEvent = 
  | 'PURCHASE_CREATED'
  | 'PURCHASE_SENT_TO_SUPPLIER'
  | 'SUPPLIER_REVIEW_STARTED'
  | 'SUPPLIER_APPROVED'
  | 'SUPPLIER_REJECTED'
  | 'INVOICE_RECEIVED'
  | 'INVOICE_VALIDATED'
  | 'SHIPMENT_RELEASED'
  | 'TRACKING_UPDATED'
  | 'GOODS_RECEIVED'
  | 'STOCK_ENTRY_CONFIRMED'
  | 'PURCHASE_COMPLETED'
  | 'PURCHASE_CANCELLED';

// 2️⃣ FLUXO DE VENDA PARA CLIENTE (OUTBOUND)
// ===========================================

export type SalesOrderStatus =
  | 'sale_created'            // Cliente cria pedido
  | 'sale_registered'         // Pedido registrado no sistema
  | 'sale_under_review'       // Pedido em análise
  | 'payment_approved'        // Pagamento aprovado
  | 'invoice_issued'          // Nota fiscal emitida
  | 'ready_for_picking'       // Liberado para separação
  | 'picked'                  // Pedido separado no estoque
  | 'in_transit'              // Em transporte ou aguardando retirada
  | 'delivered'               // Entregue ao cliente
  | 'completed'               // Pedido concluído
  | 'cancelled'               // Pedido cancelado
  | 'returned';               // Devolução

export const SALES_ORDER_STATUS_CONFIG: Record<SalesOrderStatus, {
  label: string;
  description: string;
  color: string;
  category: 'commercial' | 'fiscal' | 'logistics';
}> = {
  sale_created: {
    label: 'Pedido Criado',
    description: 'Cliente iniciou o pedido',
    color: 'bg-slate-100 text-slate-800',
    category: 'commercial'
  },
  sale_registered: {
    label: 'Registrado',
    description: 'Pedido registrado no sistema',
    color: 'bg-blue-100 text-blue-800',
    category: 'commercial'
  },
  sale_under_review: {
    label: 'Em Análise',
    description: 'Verificando disponibilidade e dados do pedido',
    color: 'bg-yellow-100 text-yellow-800',
    category: 'commercial'
  },
  payment_approved: {
    label: 'Pagamento Aprovado',
    description: 'Pagamento confirmado e liberado',
    color: 'bg-green-100 text-green-800',
    category: 'commercial'
  },
  invoice_issued: {
    label: 'NF Emitida',
    description: 'Nota fiscal emitida para o cliente',
    color: 'bg-purple-100 text-purple-800',
    category: 'fiscal'
  },
  ready_for_picking: {
    label: 'Liberado para Separação',
    description: 'Aguardando separação no estoque',
    color: 'bg-indigo-100 text-indigo-800',
    category: 'logistics'
  },
  picked: {
    label: 'Separado',
    description: 'Itens separados e prontos para envio',
    color: 'bg-cyan-100 text-cyan-800',
    category: 'logistics'
  },
  in_transit: {
    label: 'Em Transporte',
    description: 'Em rota de entrega ou aguardando retirada',
    color: 'bg-orange-100 text-orange-800',
    category: 'logistics'
  },
  delivered: {
    label: 'Entregue',
    description: 'Entrega confirmada ao cliente',
    color: 'bg-teal-100 text-teal-800',
    category: 'logistics'
  },
  completed: {
    label: 'Concluído',
    description: 'Venda finalizada com sucesso',
    color: 'bg-green-100 text-green-800',
    category: 'logistics'
  },
  cancelled: {
    label: 'Cancelado',
    description: 'Pedido cancelado',
    color: 'bg-red-100 text-red-800',
    category: 'commercial'
  },
  returned: {
    label: 'Devolvido',
    description: 'Mercadoria devolvida pelo cliente',
    color: 'bg-red-100 text-red-800',
    category: 'logistics'
  }
};

// Eventos de auditoria para vendas
export type SalesAuditEvent =
  | 'SALE_CREATED'
  | 'SALE_REGISTERED'
  | 'REVIEW_STARTED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_APPROVED'
  | 'PAYMENT_REJECTED'
  | 'INVOICE_ISSUED'
  | 'PICKING_STARTED'
  | 'PICKING_COMPLETED'
  | 'SHIPMENT_CREATED'
  | 'DELIVERY_CONFIRMED'
  | 'SALE_COMPLETED'
  | 'SALE_CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURN_COMPLETED';

// 3️⃣ FLUXO FINANCEIRO E CONCILIAÇÃO
// ===========================================

export type FinancialTransactionStatus =
  | 'sale_recorded'           // Venda registrada
  | 'pending_reconciliation'  // Aguardando conciliação
  | 'reconciled'              // Transação conciliada (NSU, bandeira, valor)
  | 'receivable'              // Valores a receber
  | 'received'                // Recebimento confirmado
  | 'commission_calculated'   // Repasse calculado
  | 'closed';                 // Resultado financeiro fechado

export const FINANCIAL_STATUS_CONFIG: Record<FinancialTransactionStatus, {
  label: string;
  description: string;
  color: string;
  impact: ('cash' | 'schedule' | 'margin' | 'commission')[];
}> = {
  sale_recorded: {
    label: 'Venda Registrada',
    description: 'Transação de venda registrada no sistema',
    color: 'bg-blue-100 text-blue-800',
    impact: ['schedule']
  },
  pending_reconciliation: {
    label: 'Aguardando Conciliação',
    description: 'Transação aguardando confirmação da operadora',
    color: 'bg-yellow-100 text-yellow-800',
    impact: ['schedule']
  },
  reconciled: {
    label: 'Conciliado',
    description: 'NSU, bandeira e valor confirmados',
    color: 'bg-green-100 text-green-800',
    impact: ['schedule']
  },
  receivable: {
    label: 'A Receber',
    description: 'Valor confirmado aguardando liquidação',
    color: 'bg-purple-100 text-purple-800',
    impact: ['schedule', 'margin']
  },
  received: {
    label: 'Recebido',
    description: 'Valor creditado na conta',
    color: 'bg-emerald-100 text-emerald-800',
    impact: ['cash', 'margin']
  },
  commission_calculated: {
    label: 'Repasse Calculado',
    description: 'Comissões e repasses calculados',
    color: 'bg-indigo-100 text-indigo-800',
    impact: ['commission', 'margin']
  },
  closed: {
    label: 'Fechado',
    description: 'Resultado financeiro consolidado',
    color: 'bg-slate-100 text-slate-800',
    impact: ['cash', 'margin', 'commission']
  }
};

// Eventos de auditoria financeira
export type FinancialAuditEvent =
  | 'TRANSACTION_RECORDED'
  | 'RECONCILIATION_PENDING'
  | 'RECONCILIATION_MATCHED'
  | 'RECONCILIATION_FAILED'
  | 'RECEIVABLE_CREATED'
  | 'PAYMENT_RECEIVED'
  | 'COMMISSION_CALCULATED'
  | 'PERIOD_CLOSED';

// 4️⃣ FLUXO DE CARGA (LOGÍSTICA)
// ===========================================

export type LoadStatus =
  | 'load_created'             // Carga criada
  | 'orders_linked'            // Pedidos vinculados
  | 'loading'                  // Em carregamento
  | 'conference_pending'       // Aguardando conferência
  | 'conference_completed'     // Conferência concluída
  | 'nfe_pending'              // Aguardando emissão NFe
  | 'nfe_issued'               // NFe emitida
  | 'in_transit'               // Em trânsito
  | 'delivered'                // Entregue
  | 'completed'                // Finalizada
  | 'cancelled';               // Cancelada

export const LOAD_STATUS_CONFIG: Record<LoadStatus, {
  label: string;
  description: string;
  color: string;
  category: 'preparation' | 'conference' | 'fiscal' | 'delivery';
}> = {
  load_created: {
    label: 'Carga Criada',
    description: 'Carga registrada no sistema',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
    category: 'preparation'
  },
  orders_linked: {
    label: 'Pedidos Vinculados',
    description: 'Pedidos associados à carga',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    category: 'preparation'
  },
  loading: {
    label: 'Em Carregamento',
    description: 'Mercadoria sendo carregada no veículo',
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    category: 'preparation'
  },
  conference_pending: {
    label: 'Aguardando Conferência',
    description: 'Carga pronta para conferência',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    category: 'conference'
  },
  conference_completed: {
    label: 'Conferência Concluída',
    description: 'Todos os itens conferidos e validados',
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    category: 'conference'
  },
  nfe_pending: {
    label: 'Aguardando NFe',
    description: 'Nota fiscal em processamento',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    category: 'fiscal'
  },
  nfe_issued: {
    label: 'NFe Emitida',
    description: 'Nota fiscal emitida e validada',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    category: 'fiscal'
  },
  in_transit: {
    label: 'Em Trânsito',
    description: 'Veículo em rota de entrega',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    category: 'delivery'
  },
  delivered: {
    label: 'Entregue',
    description: 'Carga entregue ao destino',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    category: 'delivery'
  },
  completed: {
    label: 'Finalizada',
    description: 'Processo de entrega concluído',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    category: 'delivery'
  },
  cancelled: {
    label: 'Cancelada',
    description: 'Carga cancelada',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    category: 'preparation'
  }
};

// Eventos de auditoria para cargas
export type LoadAuditEvent =
  | 'LOAD_CREATED'
  | 'ORDERS_LINKED'
  | 'LOADING_STARTED'
  | 'LOADING_COMPLETED'
  | 'CONFERENCE_STARTED'
  | 'ITEM_CHECKED'
  | 'CONFERENCE_COMPLETED'
  | 'NFE_REQUESTED'
  | 'NFE_ISSUED'
  | 'NFE_ERROR'
  | 'DEPARTURE_CONFIRMED'
  | 'DELIVERY_CONFIRMED'
  | 'LOAD_COMPLETED'
  | 'LOAD_CANCELLED';
