import { useState, useEffect } from 'react';
import { Franchise, Operator, PendingSale, Sale, PaymentType } from '@/types/pdv';
import { installmentRates, getInterestRate } from '@/data/mockData';
import { formatCurrency, formatDate, generateSaleId } from '@/utils/formatters';
import { CreditCard, Wifi, WifiOff, CheckCircle, Clock, ShoppingCart, Trash2 } from 'lucide-react';
import { PaymentProcessing } from './PaymentProcessing';
import { ReceiptModal } from './ReceiptModal';
import { toast } from 'sonner';
import { ScreenHeader } from '@/components/ui/screen-header';

interface CashierScreenProps {
  franchise: Franchise;
  operator: Operator;
  pendingSales: PendingSale[];
  onBack: () => void;
  onPaymentComplete: (sale: Sale, pendingSaleId: string) => void;
  onCancelSale: (pendingSaleId: string) => void;
}

export const CashierScreen = ({ 
  franchise, 
  operator, 
  pendingSales, 
  onBack, 
  onPaymentComplete,
  onCancelSale 
}: CashierScreenProps) => {
  const [pinpadConnected, setPinpadConnected] = useState(false);
  const [checkingPinpad, setCheckingPinpad] = useState(true);
  const [selectedSale, setSelectedSale] = useState<PendingSale | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>('debit');
  const [installments, setInstallments] = useState(1);
  const [showProcessing, setShowProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // Filter only pending_payment sales
  const salesQueue = pendingSales.filter(s => s.status === 'pending_payment');

  // Simulate pinpad check on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setPinpadConnected(true);
      setCheckingPinpad(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const interestRate = paymentType === 'credit' && installments > 1 ? getInterestRate(installments) : 0;
  const interest = selectedSale ? selectedSale.total * interestRate : 0;
  const finalTotal = selectedSale ? selectedSale.total + interest : 0;
  const installmentValue = installments > 0 ? finalTotal / installments : finalTotal;

  const handleProcessPayment = () => {
    if (!selectedSale) return;
    if (!pinpadConnected && paymentType !== 'cash') {
      toast.error('Pinpad não conectado. Use dinheiro ou reconecte o dispositivo.');
      return;
    }
    setShowProcessing(true);
  };

  const handlePaymentComplete = () => {
    if (!selectedSale) return;

    const sale: Sale = {
      id: generateSaleId(),
      franchiseId: franchise.id,
      operatorId: operator.id,
      customer: selectedSale.customer,
      items: selectedSale.items,
      subtotal: selectedSale.subtotal,
      discount: selectedSale.discount,
      interestRate,
      total: finalTotal,
      payment: { type: paymentType, installments: paymentType === 'credit' ? installments : undefined },
      createdAt: new Date(),
      status: 'completed',
      pendingSaleId: selectedSale.id
    };

    setCompletedSale(sale);
    setShowProcessing(false);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    if (completedSale && selectedSale) {
      onPaymentComplete(completedSale, selectedSale.id);
    }
    setShowReceipt(false);
    setSelectedSale(null);
    setPaymentType('debit');
    setInstallments(1);
    setCompletedSale(null);
  };

  const handleCancelSale = (saleId: string) => {
    if (confirm('Tem certeza que deseja cancelar este pedido?')) {
      onCancelSale(saleId);
      if (selectedSale?.id === saleId) {
        setSelectedSale(null);
      }
      toast.success('Pedido cancelado');
    }
  };

  const pinpadStatus = (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
      checkingPinpad ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
      pinpadConnected ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 
      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
    }`}>
      {checkingPinpad ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Verificando Pinpad...</span>
        </>
      ) : pinpadConnected ? (
        <>
          <Wifi size={18} />
          <span className="text-sm font-medium">Pinpad Conectado</span>
        </>
      ) : (
        <>
          <WifiOff size={18} />
          <span className="text-sm font-medium">Pinpad Desconectado</span>
        </>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-muted/30 flex flex-col">
      <ScreenHeader 
        title="Frente de Caixa" 
        subtitle={`${franchise.name} • ${operator.name}`}
        onBack={onBack}
        rightContent={pinpadStatus}
      />

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Sales Queue */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Fila de Pagamentos</h2>
                <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                  {salesQueue.length}
                </span>
              </div>

              {salesQueue.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Nenhum pedido aguardando pagamento</p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {salesQueue.map((sale) => (
                    <div
                      key={sale.id}
                      onClick={() => setSelectedSale(sale)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedSale?.id === sale.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${selectedSale?.id === sale.id ? 'text-primary-foreground' : 'text-primary'}`}>
                          #{sale.id}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCancelSale(sale.id); }}
                          className={`p-1 rounded hover:bg-destructive/10 ${selectedSale?.id === sale.id ? 'hover:bg-destructive/20' : ''}`}
                        >
                          <Trash2 size={14} className={selectedSale?.id === sale.id ? 'text-primary-foreground' : 'text-destructive'} />
                        </button>
                      </div>
                      <p className={`text-sm font-medium ${selectedSale?.id === sale.id ? 'text-primary-foreground' : 'text-foreground'}`}>
                        {sale.customer.name}
                      </p>
                      <p className={`text-xs ${selectedSale?.id === sale.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {sale.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) • {formatCurrency(sale.total)}
                      </p>
                      <p className={`text-xs mt-1 ${selectedSale?.id === sale.id ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                        {formatDate(sale.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Selected Sale & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {selectedSale ? (
              <>
                {/* Cart Details */}
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingCart size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Pedido #{selectedSale.id}
                    </h2>
                  </div>

                  <div className="mb-4 p-3 bg-muted/50 rounded-xl">
                    <p className="text-sm font-medium text-foreground">{selectedSale.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedSale.customer.document}</p>
                    {selectedSale.customer.plate && (
                      <p className="text-xs text-muted-foreground">Placa: {selectedSale.customer.plate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    {selectedSale.items.map((item) => (
                      <div key={item.tire.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.tire.brand} {item.tire.model}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.tire.size}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {item.quantity}× {formatCurrency(item.tire.price)}
                          </p>
                          <p className="text-xs text-primary font-medium">
                            {formatCurrency(item.quantity * item.tire.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Section */}
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">Pagamento</h2>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-foreground mb-2">Forma de Pagamento</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {(['credit', 'debit', 'pix', 'cash'] as PaymentType[]).map((type) => (
                        <button
                          key={type}
                          onClick={() => { setPaymentType(type); if (type !== 'credit') setInstallments(1); }}
                          disabled={!pinpadConnected && type !== 'cash'}
                          className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                            paymentType === type
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted/50 text-foreground hover:bg-muted'
                          } ${!pinpadConnected && type !== 'cash' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {type === 'credit' ? 'Crédito' : type === 'debit' ? 'Débito' : type === 'pix' ? 'PIX' : 'Dinheiro'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Installments */}
                  {paymentType === 'credit' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-foreground mb-2">Parcelas</label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {installmentRates.map((option) => (
                          <option key={option.installments} value={option.installments}>
                            {option.label} - {formatCurrency((selectedSale.total * (1 + option.rate)) / option.installments)}/mês
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Summary */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">{formatCurrency(selectedSale.subtotal)}</span>
                    </div>
                    {selectedSale.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Desconto</span>
                        <span className="text-green-600 dark:text-green-400">-{formatCurrency(selectedSale.discount)}</span>
                      </div>
                    )}
                    {interest > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Juros ({(interestRate * 100).toFixed(0)}%)</span>
                        <span className="text-destructive">+{formatCurrency(interest)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xl font-bold pt-2 border-t border-border">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">{formatCurrency(finalTotal)}</span>
                    </div>
                    {paymentType === 'credit' && installments > 1 && (
                      <p className="text-sm text-muted-foreground text-center">
                        {installments}× de {formatCurrency(installmentValue)}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleProcessPayment}
                    className="w-full mt-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-lg"
                  >
                    <CheckCircle size={24} />
                    Efetuar Pagamento
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-card rounded-2xl shadow-sm border border-border p-12 text-center">
                <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">Selecione um pedido</h3>
                <p className="text-sm text-muted-foreground">Escolha um pedido da fila para processar o pagamento</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showProcessing && selectedSale && (
        <PaymentProcessing
          paymentType={paymentType}
          total={finalTotal}
          installments={installments}
          onComplete={handlePaymentComplete}
        />
      )}

      {showReceipt && completedSale && (
        <ReceiptModal sale={completedSale} franchise={franchise} onClose={handleCloseReceipt} />
      )}
    </div>
  );
};
