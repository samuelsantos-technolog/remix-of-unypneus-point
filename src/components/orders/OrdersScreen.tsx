import { useState } from 'react';
import { Order, PAYMENT_CONDITIONS, calculateOrderTotals } from '@/types/orders';
import { mockOrders } from '@/data/ordersMockData';
import { NewOrderModal } from './NewOrderModal';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Plus, Eye, Edit, Package, TrendingUp, DollarSign, Search, GitBranch } from 'lucide-react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StatusTimelineModal, salesOrderStepsToTimeline } from '@/components/ui/status-timeline-modal';
import { SALES_ORDER_STATUS_CONFIG } from '@/types/statusFlows';
import { Button } from '@/components/ui/button';

interface OrdersScreenProps {
  franchiseId: string;
  onBack: () => void;
}

export const OrdersScreen = ({ franchiseId, onBack }: OrdersScreenProps) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    totalMargin: orders.reduce((sum, o) => sum + o.totalMargin, 0),
  };

  const handleSaveOrder = (order: Order) => {
    if (editingOrder) {
      setOrders(orders.map(o => o.id === order.id ? order : o));
    } else {
      setOrders([order, ...orders]);
    }
    setShowModal(false);
    setEditingOrder(null);
  };

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      in_load: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
      delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
    };
    const labels = {
      pending: 'Pendente',
      in_load: 'Em Carga',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPaymentLabel = (order: Order) => {
    const condition = PAYMENT_CONDITIONS.find(pc => pc.value === order.paymentCondition);
    if (order.paymentCondition === 'custom' && order.customPaymentDays) {
      return `${order.customPaymentDays} dias`;
    }
    return condition?.label || order.paymentCondition;
  };

  return (
    <div className="flex-1 bg-muted/30 flex flex-col">
      <ScreenHeader 
        title="Pedidos" 
        subtitle="Módulo Comercial"
        onBack={onBack}
      />

      <main className="flex-1 px-6 py-6 space-y-6 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-pdv p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="text-pdv-blue" size={20} />
              </div>
              <div>
                <p className="text-xs text-pdv-gray">Total Pedidos</p>
                <p className="text-xl font-bold text-pdv-gray-dark">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-pdv p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Package className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-pdv-gray">Pendentes</p>
                <p className="text-xl font-bold text-pdv-gray-dark">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-pdv p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-pdv-gray">Valor Total</p>
                <p className="text-lg font-bold text-pdv-gray-dark">{formatCurrency(stats.totalValue)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-pdv p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-pdv-gray">Margem Total</p>
                <p className="text-lg font-bold text-green-600">{formatCurrency(stats.totalMargin)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-pdv-gray" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar pedido..."
                className="w-full pl-10 pr-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendentes</option>
              <option value="in_load">Em Carga</option>
              <option value="delivered">Entregues</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
          <button
            onClick={() => {
              setEditingOrder(null);
              setShowModal(true);
            }}
            className="w-full md:w-auto px-4 py-2 bg-pdv-blue text-white rounded-lg hover:bg-pdv-blue-dark transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Novo Pedido
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-pdv overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-pdv-gray-light">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Destinatário</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Itens</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Margem</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Pagamento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Data</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-pdv-gray uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pdv-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-pdv-gray-light/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-pdv-blue">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-pdv-gray-dark">{order.recipient}</td>
                    <td className="px-4 py-3 text-sm text-pdv-gray-dark">
                      {order.items.reduce((sum, i) => sum + i.quantity, 0)} pneu(s)
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-pdv-gray-dark">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">
                      {formatCurrency(order.totalMargin)} ({order.marginPercentage.toFixed(1)}%)
                    </td>
                    <td className="px-4 py-3 text-sm text-pdv-gray-dark">{getPaymentLabel(order)}</td>
                    <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                    <td className="px-4 py-3 text-sm text-pdv-gray">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <StatusTimelineModal
                          title={`Timeline - Pedido ${order.id}`}
                          subtitle={`Cliente: ${order.recipient}`}
                          steps={salesOrderStepsToTimeline(SALES_ORDER_STATUS_CONFIG)}
                          currentStatus={order.status}
                          trigger={
                            <Button variant="ghost" size="icon" title="Ver Timeline">
                              <GitBranch size={16} />
                            </Button>
                          }
                        />
                        <button
                          onClick={() => setViewingOrder(order)}
                          className="p-2 hover:bg-pdv-gray-light rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={16} className="text-pdv-gray" />
                        </button>
                        {order.status === 'pending' && (
                          <button
                            onClick={() => {
                              setEditingOrder(order);
                              setShowModal(true);
                            }}
                            className="p-2 hover:bg-pdv-gray-light rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} className="text-pdv-blue" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-pdv-gray">
              Nenhum pedido encontrado.
            </div>
          )}
        </div>
      </main>

      {/* New/Edit Order Modal */}
      {showModal && (
        <NewOrderModal
          order={editingOrder}
          franchiseId={franchiseId}
          onSave={handleSaveOrder}
          onClose={() => {
            setShowModal(false);
            setEditingOrder(null);
          }}
        />
      )}

      {/* View Order Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-pdv-gray-dark">Pedido {viewingOrder.id}</h2>
              <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-pdv-gray-light rounded-lg">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-pdv-gray">Destinatário</span>
                  <p className="font-medium">{viewingOrder.recipient}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Status</span>
                  <p>{getStatusBadge(viewingOrder.status)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-pdv-gray">Endereço</span>
                  <p className="font-medium">{viewingOrder.deliveryAddress}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Pagamento</span>
                  <p className="font-medium">{getPaymentLabel(viewingOrder)}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Data</span>
                  <p className="font-medium">{formatDate(viewingOrder.createdAt)}</p>
                </div>
              </div>
              {viewingOrder.observations && (
                <div>
                  <span className="text-sm text-pdv-gray">Observações</span>
                  <p>{viewingOrder.observations}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold mb-2">Itens</h3>
                <div className="space-y-2">
                  {viewingOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-pdv-gray-light rounded-lg text-sm">
                      <p className="font-medium">{item.brand} {item.model} - {item.dimension}</p>
                      <p className="text-pdv-gray">Qtd: {item.quantity} | Venda: {formatCurrency(item.salePrice)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-pdv-border grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-pdv-gray">Total</span>
                  <p className="text-xl font-bold text-pdv-blue">{formatCurrency(viewingOrder.totalAmount)}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Margem</span>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(viewingOrder.totalMargin)}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Margem %</span>
                  <p className="text-xl font-bold text-green-600">{viewingOrder.marginPercentage.toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
