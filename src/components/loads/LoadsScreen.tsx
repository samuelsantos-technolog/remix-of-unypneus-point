import { useState } from 'react';
import { Load, calculateLoadFreight, calculateTotalLoadedItems } from '@/types/loads';
import { Order } from '@/types/orders';
import { mockLoads, mockOrders } from '@/data/ordersMockData';
import { NewLoadModal } from './NewLoadModal';
import { LoadConferenceModal } from './LoadConferenceModal';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Plus, Eye, CheckCircle, Truck, Package, DollarSign, Search, FileText, GitBranch } from 'lucide-react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { StatusTimelineModal, loadStepsToTimeline } from '@/components/ui/status-timeline-modal';
import { LOAD_STATUS_CONFIG } from '@/types/statusFlows';
interface LoadsScreenProps {
  franchiseId: string;
  onBack: () => void;
}

export const LoadsScreen = ({ franchiseId, onBack }: LoadsScreenProps) => {
  const [loads, setLoads] = useState<Load[]>(mockLoads);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [showModal, setShowModal] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);
  const [conferenceLoad, setConferenceLoad] = useState<Load | null>(null);
  const [viewingLoad, setViewingLoad] = useState<Load | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLoads = loads.filter(load => {
    const matchesSearch = load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          load.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          load.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || load.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: loads.length,
    pending: loads.filter(l => l.status === 'pending' || l.status === 'loading').length,
    inTransit: loads.filter(l => l.status === 'in_transit').length,
    totalFreight: loads.reduce((sum, l) => sum + l.totalFreight, 0),
  };

  const handleSaveLoad = (load: Load) => {
    if (editingLoad) {
      setLoads(loads.map(l => l.id === load.id ? load : l));
    } else {
      setLoads([load, ...loads]);
      setOrders(orders.map(o => 
        load.orderIds.includes(o.id) ? { ...o, status: 'in_load' as const } : o
      ));
    }
    setShowModal(false);
    setEditingLoad(null);
  };

  const handleConfirmLoad = (load: Load) => {
    setLoads(loads.map(l => l.id === load.id ? load : l));
    setConferenceLoad(null);
    console.log('NFe emission triggered for load:', load.id);
    alert(`Carga ${load.id} efetivada com sucesso!\nNFe em processamento...`);
  };

  // Map load status to flow status
  const mapLoadStatusToFlow = (status: Load['status']): string => {
    const mapping: Record<Load['status'], string> = {
      pending: 'load_created',
      loading: 'loading',
      in_transit: 'in_transit',
      delivered: 'delivered',
      cancelled: 'cancelled'
    };
    return mapping[status];
  };

  const getStatusBadge = (status: Load['status']) => {
    const styles = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
      loading: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400',
      in_transit: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400',
      delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
    };
    const labels = {
      pending: 'Pendente',
      loading: 'Carregando',
      in_transit: 'Em Trânsito',
      delivered: 'Entregue',
      cancelled: 'Cancelada',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getNfeBadge = (status: Load['nfeStatus']) => {
    const styles = {
      pending: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-400',
      emitted: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
      error: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
    };
    const labels = {
      pending: 'Pendente',
      emitted: 'Emitida',
      error: 'Erro',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="flex-1 bg-muted/30 flex flex-col">
      <ScreenHeader 
        title="Cargas" 
        subtitle="Módulo Logística"
        onBack={onBack}
      />

      <main className="flex-1 px-6 py-6 space-y-6 w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-pdv p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="text-pdv-blue" size={20} />
              </div>
              <div>
                <p className="text-xs text-pdv-gray">Total Cargas</p>
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-pdv-gray">Em Trânsito</p>
                <p className="text-xl font-bold text-pdv-gray-dark">{stats.inTransit}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-pdv p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-pdv-gray">Frete Total</p>
                <p className="text-lg font-bold text-pdv-gray-dark">{formatCurrency(stats.totalFreight)}</p>
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
                placeholder="Buscar carga..."
                className="w-full pl-10 pr-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
            >
              <option value="all">Todas</option>
              <option value="pending">Pendentes</option>
              <option value="loading">Carregando</option>
              <option value="in_transit">Em Trânsito</option>
              <option value="delivered">Entregues</option>
            </select>
          </div>
          <button
            onClick={() => {
              setEditingLoad(null);
              setShowModal(true);
            }}
            className="w-full md:w-auto px-4 py-2 bg-pdv-blue text-white rounded-lg hover:bg-pdv-blue-dark transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Nova Carga
          </button>
        </div>

        {/* Loads Table */}
        <div className="bg-white rounded-xl shadow-pdv overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-pdv-gray-light">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Veículo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Motorista</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Pedidos</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Itens</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Frete</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">NFe</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Data</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-pdv-gray uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pdv-border">
                {filteredLoads.map((load) => (
                  <tr key={load.id} className="hover:bg-pdv-gray-light/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-pdv-blue">{load.id}</td>
                    <td className="px-4 py-3 text-sm text-pdv-gray-dark">
                      {load.vehiclePlate}
                      <br />
                      <span className="text-xs text-pdv-gray">{load.vehicleModel}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-pdv-gray-dark">{load.driverName}</td>
                    <td className="px-4 py-3 text-sm text-pdv-gray-dark">{load.orderIds.length}</td>
                    <td className="px-4 py-3 text-sm text-pdv-gray-dark">{load.totalItems} pneu(s)</td>
                    <td className="px-4 py-3 text-sm font-medium text-pdv-gray-dark">
                      {formatCurrency(load.totalFreight)}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(load.status)}</td>
                    <td className="px-4 py-3">{getNfeBadge(load.nfeStatus)}</td>
                    <td className="px-4 py-3 text-sm text-pdv-gray">{formatDate(load.loadDateTime)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <StatusTimelineModal
                          title={`Fluxo de Status - ${load.id}`}
                          subtitle="Acompanhe cada etapa do processo de carga"
                          steps={loadStepsToTimeline(LOAD_STATUS_CONFIG)}
                          currentStatus={mapLoadStatusToFlow(load.status)}
                          trigger={
                            <button
                              className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                              title="Ver fluxo de status"
                            >
                              <GitBranch size={16} className="text-orange-600" />
                            </button>
                          }
                        />
                        <button
                          onClick={() => setViewingLoad(load)}
                          className="p-2 hover:bg-pdv-gray-light rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye size={16} className="text-pdv-gray" />
                        </button>
                        {(load.status === 'pending' || load.status === 'loading') && (
                          <button
                            onClick={() => setConferenceLoad(load)}
                            className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                            title="Conferir e Efetivar"
                          >
                            <CheckCircle size={16} className="text-green-600" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLoads.length === 0 && (
            <div className="text-center py-12 text-pdv-gray">
              Nenhuma carga encontrada.
            </div>
          )}
        </div>
      </main>

      {/* New/Edit Load Modal */}
      {showModal && (
        <NewLoadModal
          load={editingLoad}
          availableOrders={orders}
          franchiseId={franchiseId}
          onSave={handleSaveLoad}
          onClose={() => {
            setShowModal(false);
            setEditingLoad(null);
          }}
        />
      )}

      {/* Conference Modal */}
      {conferenceLoad && (
        <LoadConferenceModal
          load={conferenceLoad}
          onConfirm={handleConfirmLoad}
          onClose={() => setConferenceLoad(null)}
        />
      )}

      {/* View Load Modal */}
      {viewingLoad && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-pdv-gray-dark">Carga {viewingLoad.id}</h2>
              <button onClick={() => setViewingLoad(null)} className="p-2 hover:bg-pdv-gray-light rounded-lg">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-pdv-gray">Veículo</span>
                  <p className="font-medium">{viewingLoad.vehiclePlate} - {viewingLoad.vehicleModel}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Status</span>
                  <p>{getStatusBadge(viewingLoad.status)}</p>
                </div>
                {viewingLoad.trailerPlate && (
                  <div>
                    <span className="text-sm text-pdv-gray">Carreta</span>
                    <p className="font-medium">{viewingLoad.trailerPlate} - {viewingLoad.trailerModel}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-pdv-gray">Motorista</span>
                  <p className="font-medium">{viewingLoad.driverName}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Origem</span>
                  <p className="font-medium">{viewingLoad.origin}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Data/Hora</span>
                  <p className="font-medium">{formatDate(viewingLoad.loadDateTime)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pedidos: {viewingLoad.orderIds.join(', ')}</h3>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Itens ({viewingLoad.totalItems} pneus)</h3>
                <div className="space-y-2">
                  {viewingLoad.items.map((item, idx) => (
                    <div key={idx} className="p-3 bg-pdv-gray-light rounded-lg text-sm">
                      <p className="font-medium">{item.brand} {item.model} - {item.dimension}</p>
                      <p className="text-pdv-gray">
                        Pedido: {item.orderedQuantity} | Carregado: {item.loadedQuantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-pdv-border grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-pdv-gray">Total Itens</span>
                  <p className="text-xl font-bold text-pdv-blue">{viewingLoad.totalItems}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Frete Total</span>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(viewingLoad.totalFreight)}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">NFe</span>
                  <p>{getNfeBadge(viewingLoad.nfeStatus)}</p>
                  {viewingLoad.nfeNumber && (
                    <p className="text-sm text-pdv-gray">Nº {viewingLoad.nfeNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
