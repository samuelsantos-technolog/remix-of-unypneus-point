import { useState } from 'react';
import { Load, LoadItem } from '@/types/loads';
import { Order } from '@/types/orders';
import { formatCurrency } from '@/utils/formatters';
import { X, Save, Plus, Trash2 } from 'lucide-react';

interface NewLoadModalProps {
  load?: Load | null;
  availableOrders: Order[];
  franchiseId: string;
  onSave: (load: Load) => void;
  onClose: () => void;
}

export const NewLoadModal = ({ load, availableOrders, franchiseId, onSave, onClose }: NewLoadModalProps) => {
  const [vehiclePlate, setVehiclePlate] = useState(load?.vehiclePlate || '');
  const [vehicleModel, setVehicleModel] = useState(load?.vehicleModel || '');
  const [trailerPlate, setTrailerPlate] = useState(load?.trailerPlate || '');
  const [trailerModel, setTrailerModel] = useState(load?.trailerModel || '');
  const [driverName, setDriverName] = useState(load?.driverName || '');
  const [driverDocument, setDriverDocument] = useState(load?.driverDocument || '');
  const [origin, setOrigin] = useState(load?.origin || '');
  const [loadDateTime, setLoadDateTime] = useState(
    load?.loadDateTime ? new Date(load.loadDateTime).toISOString().slice(0, 16) : ''
  );
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(load?.orderIds || []);

  const pendingOrders = availableOrders.filter(o => o.status === 'pending');

  const toggleOrder = (orderId: string) => {
    if (selectedOrderIds.includes(orderId)) {
      setSelectedOrderIds(selectedOrderIds.filter(id => id !== orderId));
    } else {
      setSelectedOrderIds([...selectedOrderIds, orderId]);
    }
  };

  const getLoadItems = (): LoadItem[] => {
    const items: LoadItem[] = [];
    selectedOrderIds.forEach(orderId => {
      const order = availableOrders.find(o => o.id === orderId);
      if (order) {
        order.items.forEach(item => {
          items.push({
            ...item,
            orderId: order.id,
            orderedQuantity: item.quantity,
            loadedQuantity: item.quantity,
          });
        });
      }
    });
    return items;
  };

  const totalItems = getLoadItems().reduce((sum, i) => sum + i.quantity, 0);

  const handleSave = () => {
    if (!vehiclePlate.trim() || !vehicleModel.trim() || !driverName.trim() || !origin.trim() || !loadDateTime || selectedOrderIds.length === 0) {
      alert('Preencha todos os campos obrigatórios e selecione pelo menos um pedido.');
      return;
    }

    const items = getLoadItems();
    const newLoad: Load = {
      id: load?.id || `CRG-${Date.now().toString().slice(-6)}`,
      franchiseId,
      vehiclePlate,
      vehicleModel,
      trailerPlate: trailerPlate || undefined,
      trailerModel: trailerModel || undefined,
      driverName,
      driverDocument,
      origin,
      loadDateTime: new Date(loadDateTime),
      orderIds: selectedOrderIds,
      items,
      totalFreight: 0,
      totalItems: items.reduce((sum, i) => sum + i.loadedQuantity, 0),
      status: load?.status || 'pending',
      nfeStatus: 'pending',
      createdAt: load?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(newLoad);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between bg-pdv-gray-light">
          <h2 className="text-xl font-bold text-pdv-gray-dark">
            {load ? 'Editar Carga' : 'Nova Carga'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-pdv-gray rounded-lg transition-colors">
            <X size={20} className="text-pdv-gray-dark" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Vehicle Info */}
          <div>
            <h3 className="text-lg font-semibold text-pdv-gray-dark mb-3">Dados do Veículo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Placa *</label>
                <input
                  type="text"
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent uppercase"
                  placeholder="ABC-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Modelo *</label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                  placeholder="VW Delivery"
                />
              </div>
            </div>
          </div>

          {/* Trailer Info */}
          <div>
            <h3 className="text-lg font-semibold text-pdv-gray-dark mb-3">Dados da Carreta (Opcional)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Placa</label>
                <input
                  type="text"
                  value={trailerPlate}
                  onChange={(e) => setTrailerPlate(e.target.value.toUpperCase())}
                  className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent uppercase"
                  placeholder="XYZ-5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Modelo</label>
                <input
                  type="text"
                  value={trailerModel}
                  onChange={(e) => setTrailerModel(e.target.value)}
                  className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                  placeholder="Randon SR"
                />
              </div>
            </div>
          </div>

          {/* Driver Info */}
          <div>
            <h3 className="text-lg font-semibold text-pdv-gray-dark mb-3">Dados do Motorista</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Nome *</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pdv-gray-dark mb-1">CPF/CNPJ</label>
                <input
                  type="text"
                  value={driverDocument}
                  onChange={(e) => setDriverDocument(e.target.value)}
                  className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
          </div>

          {/* Load Info */}
          <div>
            <h3 className="text-lg font-semibold text-pdv-gray-dark mb-3">Dados da Carga</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Origem *</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                  placeholder="CD São Paulo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Data/Hora *</label>
                <input
                  type="datetime-local"
                  value={loadDateTime}
                  onChange={(e) => setLoadDateTime(e.target.value)}
                  className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Select Orders */}
          <div>
            <h3 className="text-lg font-semibold text-pdv-gray-dark mb-3">Pedidos Vinculados *</h3>
            {pendingOrders.length === 0 ? (
              <div className="text-center py-6 text-pdv-gray bg-pdv-gray-light rounded-xl">
                Nenhum pedido pendente disponível.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {pendingOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const itemsCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
                  return (
                    <div
                      key={order.id}
                      onClick={() => toggleOrder(order.id)}
                      className={`p-3 border rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-pdv-blue bg-pdv-blue/10'
                          : 'border-pdv-border bg-white hover:bg-pdv-gray-light'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-pdv-gray-dark">{order.id} - {order.recipient}</p>
                          <p className="text-sm text-pdv-gray">
                            {itemsCount} pneu(s) | {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected ? 'bg-pdv-blue border-pdv-blue' : 'border-pdv-gray'
                        }`}>
                          {isSelected && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedOrderIds.length > 0 && (
              <div className="mt-3 p-3 bg-pdv-gray-light rounded-xl">
                <p className="text-sm text-pdv-gray">
                  <strong>{selectedOrderIds.length}</strong> pedido(s) selecionado(s) |{' '}
                  <strong>{totalItems}</strong> pneu(s) no total
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-pdv-border bg-pdv-gray-light flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-pdv-border rounded-lg text-pdv-gray-dark hover:bg-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-pdv-blue text-white rounded-lg hover:bg-pdv-blue-dark transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Salvar Carga
          </button>
        </div>
      </div>
    </div>
  );
};
