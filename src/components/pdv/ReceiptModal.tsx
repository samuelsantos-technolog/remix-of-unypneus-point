import { Sale, Franchise } from '@/types/pdv';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { X, CheckCircle } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale;
  franchise: Franchise;
  onClose: () => void;
}

export const ReceiptModal = ({ sale, franchise, onClose }: ReceiptModalProps) => {
  const paymentLabel = sale.payment.type === 'credit' && sale.payment.installments
    ? `Crédito ${sale.payment.installments}×`
    : sale.payment.type === 'credit' ? 'Crédito à vista'
    : sale.payment.type === 'debit' ? 'Débito'
    : sale.payment.type === 'pix' ? 'PIX'
    : 'Dinheiro';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-pdv-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={24} />
            <h2 className="text-lg font-bold text-pdv-gray-dark">Venda Realizada</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-pdv-gray-light rounded-lg transition-colors">
            <X size={20} className="text-pdv-gray" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Franchise Info */}
          <div className="text-center border-b border-dashed border-pdv-border pb-4">
            <h3 className="text-xl font-bold text-pdv-blue">UnyPneus®</h3>
            <p className="text-sm text-pdv-gray-dark">{franchise.name}</p>
            <p className="text-xs text-pdv-gray">{franchise.cnpj}</p>
            <p className="text-xs text-pdv-gray">{franchise.address}</p>
          </div>

          {/* Sale Info */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-pdv-gray">Venda Nº</span>
              <span className="font-medium text-pdv-blue">{sale.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-pdv-gray">Data</span>
              <span className="text-pdv-gray-dark">{formatDate(sale.createdAt)}</span>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-pdv-gray-light rounded-xl p-4 space-y-1">
            <p className="text-xs text-pdv-gray uppercase font-medium">Cliente</p>
            <p className="text-sm font-medium text-pdv-gray-dark">{sale.customer.name}</p>
            <p className="text-xs text-pdv-gray">{sale.customer.document}</p>
            {sale.customer.plate && <p className="text-xs text-pdv-gray">Placa: {sale.customer.plate}</p>}
            {sale.customer.phone && <p className="text-xs text-pdv-gray">Tel: {sale.customer.phone}</p>}
          </div>

          {/* Items */}
          <div className="space-y-2">
            <p className="text-xs text-pdv-gray uppercase font-medium">Itens</p>
            {sale.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div>
                  <p className="text-pdv-gray-dark">{item.tire.brand} {item.tire.model}</p>
                  <p className="text-xs text-pdv-gray">{item.tire.size} × {item.quantity}</p>
                </div>
                <span className="font-medium text-pdv-gray-dark">{formatCurrency(item.tire.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="border-t border-dashed border-pdv-border pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-pdv-gray">Subtotal</span>
              <span className="text-pdv-gray-dark">{formatCurrency(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-pdv-gray">Desconto</span>
                <span className="text-green-600">-{formatCurrency(sale.discount)}</span>
              </div>
            )}
            {sale.interestRate > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-pdv-gray">Juros ({(sale.interestRate * 100).toFixed(0)}%)</span>
                <span className="text-red-500">+{formatCurrency(sale.subtotal * sale.interestRate)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-pdv-border">
              <span className="text-pdv-gray-dark">Total</span>
              <span className="text-pdv-blue">{formatCurrency(sale.total)}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-pdv-blue/10 rounded-xl p-4 text-center">
            <p className="text-xs text-pdv-gray uppercase font-medium mb-1">Forma de Pagamento</p>
            <p className="text-lg font-semibold text-pdv-blue">{paymentLabel}</p>
            {sale.payment.installments && sale.payment.installments > 1 && (
              <p className="text-sm text-pdv-gray">{sale.payment.installments}× de {formatCurrency(sale.total / sale.payment.installments)}</p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-dashed border-pdv-border">
            <p className="text-pdv-gray-dark font-medium">Obrigado por comprar na UnyPneus®</p>
            <p className="text-xs text-pdv-gray mt-1">Volte sempre!</p>
          </div>
        </div>

        {/* Action */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-pdv-border">
          <button
            onClick={onClose}
            className="w-full py-3 bg-pdv-blue text-white font-semibold rounded-xl hover:bg-pdv-blue-dark transition-colors"
          >
            Nova Venda
          </button>
        </div>
      </div>
    </div>
  );
};
