import { useState, useEffect } from 'react';
import { Order, OrderItem, PAYMENT_CONDITIONS, PaymentCondition, calculateOrderTotals } from '@/types/orders';
import { OrderItemForm } from './OrderItemForm';
import { formatCurrency } from '@/utils/formatters';
import { X, Save } from 'lucide-react';

interface NewOrderModalProps {
  order?: Order | null;
  franchiseId: string;
  onSave: (order: Order) => void;
  onClose: () => void;
}

export const NewOrderModal = ({ order, franchiseId, onSave, onClose }: NewOrderModalProps) => {
  const [recipient, setRecipient] = useState(order?.recipient || '');
  const [deliveryAddress, setDeliveryAddress] = useState(order?.deliveryAddress || '');
  const [paymentCondition, setPaymentCondition] = useState<PaymentCondition>(order?.paymentCondition || 'on_delivery');
  const [customPaymentDays, setCustomPaymentDays] = useState(order?.customPaymentDays || 30);
  const [observations, setObservations] = useState(order?.observations || '');
  const [items, setItems] = useState<OrderItem[]>(order?.items || []);

  const totals = calculateOrderTotals(items);

  const handleSave = () => {
    if (!recipient.trim() || !deliveryAddress.trim() || items.length === 0) {
      alert('Preencha todos os campos obrigatórios e adicione pelo menos um item.');
      return;
    }

    const newOrder: Order = {
      id: order?.id || `PED-${Date.now().toString().slice(-6)}`,
      franchiseId,
      recipient,
      deliveryAddress,
      paymentCondition,
      customPaymentDays: paymentCondition === 'custom' ? customPaymentDays : undefined,
      observations,
      items,
      totalAmount: totals.totalAmount,
      totalMargin: totals.totalMargin,
      marginPercentage: totals.marginPercentage,
      status: order?.status || 'pending',
      createdAt: order?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(newOrder);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between bg-pdv-gray-light">
          <h2 className="text-xl font-bold text-pdv-gray-dark">
            {order ? 'Editar Pedido' : 'Novo Pedido'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-pdv-gray rounded-lg transition-colors">
            <X size={20} className="text-pdv-gray-dark" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pdv-gray-dark mb-1">
                Destinatário *
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                placeholder="Nome do cliente/empresa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pdv-gray-dark mb-1">
                Condição de Pagamento *
              </label>
              <div className="flex gap-2">
                <select
                  value={paymentCondition}
                  onChange={(e) => setPaymentCondition(e.target.value as PaymentCondition)}
                  className="flex-1 px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                >
                  {PAYMENT_CONDITIONS.map((pc) => (
                    <option key={pc.value} value={pc.value}>{pc.label}</option>
                  ))}
                </select>
                {paymentCondition === 'custom' && (
                  <input
                    type="number"
                    min="1"
                    value={customPaymentDays}
                    onChange={(e) => setCustomPaymentDays(parseInt(e.target.value) || 30)}
                    className="w-24 px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                    placeholder="Dias"
                  />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-pdv-gray-dark mb-1">
              Endereço de Entrega *
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
              placeholder="Endereço completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-pdv-gray-dark mb-1">
              Observações
            </label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              className="w-full px-4 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent resize-none"
              rows={3}
              placeholder="Observações adicionais..."
            />
          </div>

          {/* Order Items */}
          <OrderItemForm items={items} onChange={setItems} />

          {/* Totals Summary */}
          {items.length > 0 && (
            <div className="bg-pdv-blue/10 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-pdv-gray-dark mb-3">Resumo do Pedido</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-pdv-gray">Total Geral</span>
                  <p className="text-xl font-bold text-pdv-blue">{formatCurrency(totals.totalAmount)}</p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Margem Total</span>
                  <p className={`text-xl font-bold ${totals.totalMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totals.totalMargin)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-pdv-gray">Margem %</span>
                  <p className={`text-xl font-bold ${totals.marginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {totals.marginPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          )}
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
            Salvar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};
