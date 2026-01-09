import { useState } from 'react';
import { Load, LoadItem, calculateLoadFreight, calculateTotalLoadedItems } from '@/types/loads';
import { formatCurrency } from '@/utils/formatters';
import { X, Check, AlertTriangle } from 'lucide-react';

interface LoadConferenceModalProps {
  load: Load;
  onConfirm: (load: Load) => void;
  onClose: () => void;
}

export const LoadConferenceModal = ({ load, onConfirm, onClose }: LoadConferenceModalProps) => {
  const [items, setItems] = useState<LoadItem[]>(load.items);

  const updateLoadedQuantity = (index: number, quantity: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], loadedQuantity: Math.max(0, Math.min(quantity, updated[index].orderedQuantity)) };
    setItems(updated);
  };

  const totalFreight = calculateLoadFreight(items);
  const totalLoaded = calculateTotalLoadedItems(items);
  const totalOrdered = items.reduce((sum, i) => sum + i.orderedQuantity, 0);
  const hasDiscrepancy = items.some(i => i.loadedQuantity !== i.orderedQuantity);

  const handleConfirm = () => {
    const updatedLoad: Load = {
      ...load,
      items,
      totalFreight,
      totalItems: totalLoaded,
      status: 'in_transit',
      nfeStatus: 'pending',
      finalizedAt: new Date(),
      updatedAt: new Date(),
    };
    onConfirm(updatedLoad);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between bg-pdv-gray-light">
          <div>
            <h2 className="text-xl font-bold text-pdv-gray-dark">Conferência de Carga</h2>
            <p className="text-sm text-pdv-gray">{load.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-pdv-gray rounded-lg transition-colors">
            <X size={20} className="text-pdv-gray-dark" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {hasDiscrepancy && (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertTriangle className="text-yellow-600" size={24} />
              <div>
                <p className="font-medium text-yellow-800">Atenção: Divergência na conferência</p>
                <p className="text-sm text-yellow-700">Alguns itens têm quantidade carregada diferente da pedida.</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-pdv-gray-dark">Itens a Carregar</h3>
            {items.map((item, index) => {
              const itemHasDiscrepancy = item.loadedQuantity !== item.orderedQuantity;
              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-xl ${itemHasDiscrepancy ? 'border-yellow-300 bg-yellow-50' : 'border-pdv-border bg-white'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-pdv-gray-dark">
                        {item.brand} {item.model}
                      </p>
                      <p className="text-sm text-pdv-gray">{item.dimension} | Pedido: {item.orderId}</p>
                    </div>
                    <div className="text-right text-sm text-pdv-gray">
                      Frete/pneu: {formatCurrency(item.freightPerTire)}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-pdv-gray">Qtd. Pedida</label>
                      <p className="text-lg font-semibold text-pdv-gray-dark">{item.orderedQuantity}</p>
                    </div>
                    <div>
                      <label className="text-xs text-pdv-gray block mb-1">Qtd. Carregada</label>
                      <input
                        type="number"
                        min="0"
                        max={item.orderedQuantity}
                        value={item.loadedQuantity}
                        onChange={(e) => updateLoadedQuantity(index, parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent text-center font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-pdv-gray">Frete Item</label>
                      <p className="text-lg font-semibold text-pdv-blue">
                        {formatCurrency(item.freightPerTire * item.loadedQuantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-pdv-blue/10 rounded-xl p-4">
            <h3 className="font-semibold text-pdv-gray-dark mb-3">Resumo da Carga</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-pdv-gray">Total Pedido</span>
                <p className="text-xl font-bold text-pdv-gray-dark">{totalOrdered} pneus</p>
              </div>
              <div>
                <span className="text-sm text-pdv-gray">Total Carregado</span>
                <p className={`text-xl font-bold ${totalLoaded === totalOrdered ? 'text-green-600' : 'text-yellow-600'}`}>
                  {totalLoaded} pneus
                </p>
              </div>
              <div>
                <span className="text-sm text-pdv-gray">Frete Total</span>
                <p className="text-xl font-bold text-pdv-blue">{formatCurrency(totalFreight)}</p>
              </div>
            </div>
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
            onClick={handleConfirm}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <Check size={18} />
            Efetivar Carga
          </button>
        </div>
      </div>
    </div>
  );
};
