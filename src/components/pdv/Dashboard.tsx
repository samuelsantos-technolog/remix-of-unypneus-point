import { Franchise, Operator, Sale, DashboardStats, PendingSale } from '@/types/pdv';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { mockSales } from '@/data/mockData';
import { TrendingUp, Package, DollarSign } from 'lucide-react';

interface DashboardProps {
  franchise: Franchise;
  operator: Operator;
  sales: Sale[];
  pendingSales: PendingSale[];
}

export const Dashboard = ({ 
  franchise, 
  operator, 
  sales, 
  pendingSales,
}: DashboardProps) => {
  const allSales = [...mockSales, ...sales];
  
  const pendingPaymentCount = pendingSales.filter(s => s.status === 'pending_payment').length;
  const readyForPickupCount = pendingSales.filter(s => s.status === 'paid').length;
  
  const stats: DashboardStats = {
    totalSales: allSales.reduce((sum, sale) => sum + sale.total, 0),
    tiresCount: allSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    ),
    averageTicket: allSales.length > 0 
      ? allSales.reduce((sum, sale) => sum + sale.total, 0) / allSales.length 
      : 0
  };

  return (
    <div className="flex-1 bg-muted/30 flex flex-col">
      <div className="flex-1 p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Bem-vindo, {operator.name}
          </h1>
          <p className="text-muted-foreground">{franchise.name}</p>
        </div>

        {/* Quick Stats Row */}
        {(pendingPaymentCount > 0 || readyForPickupCount > 0) && (
          <div className="flex flex-wrap gap-4 mb-8">
            {pendingPaymentCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-lg">
                <span className="font-semibold">{pendingPaymentCount}</span>
                <span className="text-sm">pagamento(s) pendente(s)</span>
              </div>
            )}
            {readyForPickupCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-lg">
                <span className="font-semibold">{readyForPickupCount}</span>
                <span className="text-sm">pronto(s) para retirada</span>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <DollarSign className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Vendido Hoje</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalSales)}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Package className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pneus Vendidos</p>
                <p className="text-2xl font-bold text-foreground">{stats.tiresCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(stats.averageTicket)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Últimas Vendas</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Itens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Pagamento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {allSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-primary">{sale.id}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{sale.customer.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {sale.items.reduce((sum, item) => sum + item.quantity, 0)} pneu(s)
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{formatCurrency(sale.total)}</td>
                    <td className="px-6 py-4 text-sm text-foreground capitalize">
                      {sale.payment.type === 'credit' && sale.payment.installments 
                        ? `Crédito ${sale.payment.installments}×` 
                        : sale.payment.type === 'credit' ? 'Crédito à vista'
                        : sale.payment.type === 'debit' ? 'Débito'
                        : sale.payment.type === 'pix' ? 'PIX'
                        : 'Dinheiro'}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(sale.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        sale.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                      }`}>
                        {sale.status === 'completed' ? 'Concluída' : 'Cancelada'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
