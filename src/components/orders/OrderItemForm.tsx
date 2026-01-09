import { useState } from 'react';
import { OrderItem, calculateItemMargin } from '@/types/orders';
import { formatCurrency } from '@/utils/formatters';
import { Trash2, Plus } from 'lucide-react';

interface OrderItemFormProps {
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
}

export const OrderItemForm = ({ items, onChange }: OrderItemFormProps) => {
  const generateId = () => `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addItem = () => {
    const newItem: OrderItem = {
      id: generateId(),
      brand: '',
      model: '',
      dimension: '',
      quantity: 1,
      purchaseCost: 0,
      freightPerTire: 0,
      salePrice: 0,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-pdv-gray-dark">Itens do Pedido</h3>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 px-3 py-2 bg-pdv-blue text-white rounded-lg hover:bg-pdv-blue-dark transition-colors text-sm"
        >
          <Plus size={16} />
          Adicionar Item
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-pdv-gray">
          Nenhum item adicionado. Clique em "Adicionar Item" para começar.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => {
            const calcs = calculateItemMargin(item);
            return (
              <div key={item.id} className="border border-pdv-border rounded-xl p-4 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-pdv-gray">Item #{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Marca</label>
                    <input
                      type="text"
                      value={item.brand}
                      onChange={(e) => updateItem(index, 'brand', e.target.value)}
                      className="w-full px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                      placeholder="Ex: Pirelli"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Modelo</label>
                    <input
                      type="text"
                      value={item.model}
                      onChange={(e) => updateItem(index, 'model', e.target.value)}
                      className="w-full px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                      placeholder="Ex: Cinturato P7"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Dimensão</label>
                    <input
                      type="text"
                      value={item.dimension}
                      onChange={(e) => updateItem(index, 'dimension', e.target.value)}
                      className="w-full px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                      placeholder="Ex: 205/55R16"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Quantidade</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Custo Compra</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.purchaseCost}
                      onChange={(e) => updateItem(index, 'purchaseCost', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Frete/Pneu</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.freightPerTire}
                      onChange={(e) => updateItem(index, 'freightPerTire', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-pdv-gray-dark mb-1">Preço Venda</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.salePrice}
                      onChange={(e) => updateItem(index, 'salePrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-pdv-border rounded-lg focus:ring-2 focus:ring-pdv-blue focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Calculated Values */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-pdv-border bg-pdv-gray-light/50 -mx-4 -mb-4 px-4 pb-4 rounded-b-xl">
                  <div>
                    <span className="text-xs text-pdv-gray">Total Item</span>
                    <p className="text-sm font-semibold text-pdv-gray-dark">{formatCurrency(calcs.itemTotal)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-pdv-gray">Margem/Pneu</span>
                    <p className={`text-sm font-semibold ${calcs.marginPerTire >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(calcs.marginPerTire)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-pdv-gray">Margem Total</span>
                    <p className={`text-sm font-semibold ${calcs.totalMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(calcs.totalMargin)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-pdv-gray">Margem %</span>
                    <p className={`text-sm font-semibold ${calcs.marginPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calcs.marginPercentage.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
