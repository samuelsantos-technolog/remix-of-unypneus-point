import { useState } from 'react';
import { Operator } from '@/types/pdv';
import { getProductById, getStockForProduct } from '@/data/inventoryMockData';
import { X, Plus, Minus, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StockAdjustmentModalProps {
  productId: string;
  franchiseId: string;
  operator: Operator;
  onClose: () => void;
  onConfirm: () => void;
}

const adjustmentReasons = [
  'Inventário - divergência encontrada',
  'Perda - produto danificado',
  'Perda - produto vencido',
  'Troca - defeito de fábrica',
  'Transferência entre lojas',
  'Erro de lançamento anterior',
  'Outro'
];

export const StockAdjustmentModal = ({ 
  productId, 
  franchiseId, 
  operator, 
  onClose, 
  onConfirm 
}: StockAdjustmentModalProps) => {
  const product = getProductById(productId);
  const stock = getStockForProduct(productId, franchiseId);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const { toast } = useToast();

  if (!product || !stock) return null;

  const newQuantity = adjustmentType === 'add' 
    ? stock.quantity + quantity 
    : Math.max(0, stock.quantity - quantity);

  const handleConfirm = () => {
    if (!reason) {
      toast({
        title: "Motivo obrigatório",
        description: "Selecione um motivo para o ajuste.",
        variant: "destructive"
      });
      return;
    }

    if (reason === 'Outro' && !customReason.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Informe a descrição do motivo.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ajuste realizado!",
      description: `Estoque de ${product.description} atualizado para ${newQuantity} unidades.`,
    });

    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-pdv-gray-dark">Ajuste Manual de Estoque</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-pdv-gray-light rounded-lg transition-colors"
          >
            <X className="text-pdv-gray" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Product Info */}
          <div className="bg-pdv-gray-light rounded-xl p-4">
            <p className="text-xs text-pdv-gray">{product.code}</p>
            <p className="font-semibold text-pdv-gray-dark">{product.description}</p>
            <p className="text-sm text-pdv-gray mt-1">Estoque atual: <span className="font-medium text-pdv-gray-dark">{stock.quantity}</span> unidades</p>
          </div>

          {/* Adjustment Type */}
          <div>
            <label className="block text-sm font-medium text-pdv-gray-dark mb-2">Tipo de Ajuste</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAdjustmentType('add')}
                className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-colors ${
                  adjustmentType === 'add' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-pdv-border hover:border-pdv-gray'
                }`}
              >
                <Plus size={20} />
                Adicionar
              </button>
              <button
                onClick={() => setAdjustmentType('remove')}
                className={`p-3 rounded-xl border-2 flex items-center justify-center gap-2 transition-colors ${
                  adjustmentType === 'remove' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-pdv-border hover:border-pdv-gray'
                }`}
              >
                <Minus size={20} />
                Remover
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-pdv-gray-dark mb-2">Quantidade</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 bg-pdv-gray-light rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Minus size={20} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center text-2xl font-bold py-2 border border-pdv-border rounded-xl focus:outline-none focus:border-pdv-blue"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 bg-pdv-gray-light rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* New Stock Preview */}
          <div className={`p-4 rounded-xl ${adjustmentType === 'add' ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-pdv-gray">Novo estoque:</span>
              <span className={`text-2xl font-bold ${adjustmentType === 'add' ? 'text-green-700' : 'text-red-700'}`}>
                {newQuantity} unidades
              </span>
            </div>
            {newQuantity < stock.minStock && (
              <div className="flex items-center gap-2 mt-2 text-amber-700 text-sm">
                <AlertTriangle size={16} />
                Abaixo do estoque mínimo ({stock.minStock})
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-pdv-gray-dark mb-2">Motivo do Ajuste *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 border border-pdv-border rounded-xl focus:outline-none focus:border-pdv-blue"
            >
              <option value="">Selecione o motivo</option>
              {adjustmentReasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {reason === 'Outro' && (
            <div>
              <label className="block text-sm font-medium text-pdv-gray-dark mb-2">Descrição *</label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Descreva o motivo do ajuste..."
                rows={3}
                className="w-full px-4 py-3 border border-pdv-border rounded-xl focus:outline-none focus:border-pdv-blue resize-none"
              />
            </div>
          )}

          {/* Operator Info */}
          <div className="text-sm text-pdv-gray">
            Responsável: <span className="text-pdv-gray-dark font-medium">{operator.name}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-pdv-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-pdv-gray-light text-pdv-gray-dark font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-pdv-blue text-white font-semibold rounded-xl hover:bg-pdv-blue-dark transition-colors"
          >
            Confirmar Ajuste
          </button>
        </div>
      </div>
    </div>
  );
};
