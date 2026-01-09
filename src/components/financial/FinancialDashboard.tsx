import { useState } from 'react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Receipt,
  Users,
  Clock
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { 
  mockPayables, 
  mockReceivables, 
  mockCashTransactions,
  mockCommissions,
  getTotalPendingPayables,
  getTotalPendingReceivables,
  getOverduePayables,
  getOverdueReceivables
} from '@/data/financialMockData';
import { PayablesScreen } from './PayablesScreen';
import { ReceivablesScreen } from './ReceivablesScreen';
import { CashFlowScreen } from './CashFlowScreen';
import { ReconciliationScreen } from './ReconciliationScreen';
import { CommissionsScreen } from './CommissionsScreen';
import { 
  StatusTimelineModal, 
  purchaseOrderStepsToTimeline, 
  salesOrderStepsToTimeline, 
  financialStepsToTimeline 
} from '@/components/ui/status-timeline-modal';
import { 
  PURCHASE_ORDER_STATUS_CONFIG, 
  SALES_ORDER_STATUS_CONFIG, 
  FINANCIAL_STATUS_CONFIG 
} from '@/types/statusFlows';

interface FinancialDashboardProps {
  franchiseId: string;
  onBack: () => void;
}

export const FinancialDashboard = ({ franchiseId, onBack }: FinancialDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate summary data
  const totalPayables = getTotalPendingPayables();
  const totalReceivables = getTotalPendingReceivables();
  const overduePayables = getOverduePayables();
  const overdueReceivables = getOverdueReceivables();
  
  const todayIncome = mockCashTransactions
    .filter(t => t.type === 'income' && new Date(t.transactionDate).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);
  
  const todayExpenses = mockCashTransactions
    .filter(t => t.type === 'expense' && new Date(t.transactionDate).toDateString() === new Date().toDateString())
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCommissions = mockCommissions
    .filter(c => c.status === 'pending' || c.status === 'approved')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const balance = totalReceivables - totalPayables;

  return (
    <div className="flex flex-col h-full w-full">
      <ScreenHeader
        title="Financeiro"
        subtitle="Gestão financeira completa: contas, conciliação e repasses"
        onBack={onBack}
      />

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="payables">Contas a Pagar</TabsTrigger>
            <TabsTrigger value="receivables">Contas a Receber</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
            <TabsTrigger value="reconciliation">Conciliação</TabsTrigger>
            <TabsTrigger value="commissions">Repasses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">A Receber</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalReceivables)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockReceivables.filter(r => r.status === 'pending').length} contas pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">A Pagar</CardTitle>
                  <ArrowDownRight className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalPayables)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockPayables.filter(p => p.status === 'pending').length} contas pendentes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo Projetado</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(balance)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    recebíveis - pagáveis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Repasses Pendentes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(pendingCommissions)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {mockCommissions.filter(c => c.status === 'pending').length} comissões pendentes
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            {(overduePayables.length > 0 || overdueReceivables.length > 0) && (
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-5 w-5" />
                    Alertas Financeiros
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {overduePayables.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium text-red-800">
                            {overduePayables.length} conta(s) a pagar vencida(s)
                          </p>
                          <p className="text-sm text-red-600">
                            Total: {formatCurrency(overduePayables.reduce((sum, p) => sum + p.remainingAmount, 0))}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-red-300 text-red-700"
                        onClick={() => setActiveTab('payables')}
                      >
                        Ver
                      </Button>
                    </div>
                  )}
                  {overdueReceivables.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-orange-800">
                            {overdueReceivables.length} conta(s) a receber vencida(s)
                          </p>
                          <p className="text-sm text-orange-600">
                            Total: {formatCurrency(overdueReceivables.reduce((sum, r) => sum + r.remainingAmount, 0))}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-orange-300 text-orange-700"
                        onClick={() => setActiveTab('receivables')}
                      >
                        Ver
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Today's Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Entradas de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    {formatCurrency(todayIncome)}
                  </div>
                  <div className="space-y-2">
                    {mockCashTransactions
                      .filter(t => t.type === 'income' && new Date(t.transactionDate).toDateString() === new Date().toDateString())
                      .slice(0, 3)
                      .map(t => (
                        <div key={t.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t.description}</span>
                          <span className="font-medium">{formatCurrency(t.amount)}</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    Saídas de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600 mb-4">
                    {formatCurrency(todayExpenses)}
                  </div>
                  <div className="space-y-2">
                    {mockCashTransactions
                      .filter(t => t.type === 'expense' && new Date(t.transactionDate).toDateString() === new Date().toDateString())
                      .slice(0, 3)
                      .map(t => (
                        <div key={t.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t.description}</span>
                          <span className="font-medium">{formatCurrency(t.amount)}</span>
                        </div>
                      ))}
                    {todayExpenses === 0 && (
                      <p className="text-sm text-muted-foreground">Nenhuma saída registrada hoje</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4 gap-2"
                    onClick={() => setActiveTab('payables')}
                  >
                    <Receipt className="h-6 w-6" />
                    <span>Nova Conta a Pagar</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4 gap-2"
                    onClick={() => setActiveTab('receivables')}
                  >
                    <DollarSign className="h-6 w-6" />
                    <span>Nova Conta a Receber</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4 gap-2"
                    onClick={() => setActiveTab('reconciliation')}
                  >
                    <CreditCard className="h-6 w-6" />
                    <span>Conciliar Cartões</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex-col py-4 gap-2"
                    onClick={() => setActiveTab('commissions')}
                  >
                    <Users className="h-6 w-6" />
                    <span>Ver Repasses</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Flow Timelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Fluxos de Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatusTimelineModal
                    title="Fluxo de Compra"
                    subtitle="Ciclo completo de compra com fornecedor (Inbound)"
                    steps={purchaseOrderStepsToTimeline(PURCHASE_ORDER_STATUS_CONFIG)}
                    trigger={
                      <Button variant="outline" className="h-auto flex-col py-4 gap-2 w-full">
                        <TrendingDown className="h-6 w-6 text-orange-600" />
                        <span className="font-medium">Compras (Inbound)</span>
                        <span className="text-xs text-muted-foreground">Ver linha do tempo</span>
                      </Button>
                    }
                  />
                  <StatusTimelineModal
                    title="Fluxo de Venda"
                    subtitle="Ciclo completo de venda para cliente (Outbound)"
                    steps={salesOrderStepsToTimeline(SALES_ORDER_STATUS_CONFIG)}
                    trigger={
                      <Button variant="outline" className="h-auto flex-col py-4 gap-2 w-full">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                        <span className="font-medium">Vendas (Outbound)</span>
                        <span className="text-xs text-muted-foreground">Ver linha do tempo</span>
                      </Button>
                    }
                  />
                  <StatusTimelineModal
                    title="Fluxo Financeiro"
                    subtitle="Ciclo de conciliação e fechamento financeiro"
                    steps={financialStepsToTimeline(FINANCIAL_STATUS_CONFIG)}
                    trigger={
                      <Button variant="outline" className="h-auto flex-col py-4 gap-2 w-full">
                        <Wallet className="h-6 w-6 text-purple-600" />
                        <span className="font-medium">Financeiro</span>
                        <span className="text-xs text-muted-foreground">Ver linha do tempo</span>
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payables">
            <PayablesScreen franchiseId={franchiseId} />
          </TabsContent>

          <TabsContent value="receivables">
            <ReceivablesScreen franchiseId={franchiseId} />
          </TabsContent>

          <TabsContent value="cashflow">
            <CashFlowScreen franchiseId={franchiseId} />
          </TabsContent>

          <TabsContent value="reconciliation">
            <ReconciliationScreen franchiseId={franchiseId} />
          </TabsContent>

          <TabsContent value="commissions">
            <CommissionsScreen franchiseId={franchiseId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
