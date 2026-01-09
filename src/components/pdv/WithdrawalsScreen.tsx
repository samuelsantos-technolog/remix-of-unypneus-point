import { useState } from 'react';
import { Franchise, Operator, PendingSale, Sale } from '@/types/pdv';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Package, CheckCircle, Search, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { ScreenHeader } from '@/components/ui/screen-header';

interface WithdrawalsScreenProps {
  franchise: Franchise;
  operator: Operator;
  paidSales: { pendingSale: PendingSale; sale: Sale }[];
  onBack: () => void;
  onConfirmWithdrawal: (pendingSaleId: string) => void;
}

export const WithdrawalsScreen = ({
  franchise,
  operator,
  paidSales,
  onBack,
  onConfirmWithdrawal
}: WithdrawalsScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<{ pendingSale: PendingSale; sale: Sale } | null>(null);

  const filteredSales = paidSales.filter(({ pendingSale, sale }) =>
    pendingSale.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pendingSale.customer.document.includes(searchTerm) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmWithdrawal = (pendingSaleId: string) => {
    onConfirmWithdrawal(pendingSaleId);
    setSelectedSale(null);
    toast.success('Retirada confirmada! Produtos entregues ao cliente.');
  };

  return (
    <div className="flex-1 bg-muted/30 flex flex-col">
      <ScreenHeader 
        title="Retiradas" 
        subtitle={`${franchise.name} • Pagamentos Aprovados`}
        onBack={onBack}
      />

      <main className="flex-1 p-6">
        {/* Search */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-4 mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou número da venda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Withdrawals List */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package size={20} className="text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-semibold text-foreground">Prontos para Retirada</h2>
              <span className="ml-auto bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {filteredSales.length}
              </span>
            </div>

            {filteredSales.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma retirada pendente</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {filteredSales.map(({ pendingSale, sale }) => (
                  <div
                    key={sale.id}
                    onClick={() => setSelectedSale({ pendingSale, sale })}
                    className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      selectedSale?.sale.id === sale.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-transparent bg-muted/50 hover:border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-primary">#{sale.id}</span>
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                        <CheckCircle size={12} />
                        Pago
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{pendingSale.customer.name}</p>
                    <p className="text-xs text-muted-foreground">{pendingSale.customer.document}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        {pendingSale.items.reduce((sum, item) => sum + item.quantity, 0)} pneu(s)
                      </p>
                      <p className="text-sm font-bold text-primary">{formatCurrency(sale.total)}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(sale.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Sale Details */}
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            {selectedSale ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Eye size={20} className="text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    Detalhes da Venda #{selectedSale.sale.id}
                  </h2>
                </div>

                {/* Customer Info */}
                <div className="mb-4 p-4 bg-muted/50 rounded-xl">
                  <h3 className="text-sm font-medium text-foreground mb-2">Cliente</h3>
                  <p className="text-sm text-foreground">{selectedSale.pendingSale.customer.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedSale.pendingSale.customer.document}</p>
                  {selectedSale.pendingSale.customer.phone && (
                    <p className="text-xs text-muted-foreground">{selectedSale.pendingSale.customer.phone}</p>
                  )}
                  {selectedSale.pendingSale.customer.plate && (
                    <p className="text-xs text-muted-foreground">Placa: {selectedSale.pendingSale.customer.plate}</p>
                  )}
                </div>

                {/* Items */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-foreground mb-2">Itens para Retirada</h3>
                  <div className="space-y-2">
                    {selectedSale.pendingSale.items.map((item) => (
                      <div key={item.tire.id} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-amber-600 dark:text-amber-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {item.tire.brand} {item.tire.model}
                            </p>
                            <p className="text-xs text-muted-foreground">{item.tire.size}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{item.quantity}×</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Info */}
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Pagamento Confirmado</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedSale.sale.payment.type === 'credit'
                      ? `Crédito ${selectedSale.sale.payment.installments}×`
                      : selectedSale.sale.payment.type === 'debit'
                      ? 'Débito'
                      : selectedSale.sale.payment.type === 'pix'
                      ? 'PIX'
                      : 'Dinheiro'}
                  </p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-400 mt-1">
                    {formatCurrency(selectedSale.sale.total)}
                  </p>
                </div>

                <button
                  onClick={() => handleConfirmWithdrawal(selectedSale.pendingSale.id)}
                  className="w-full py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <CheckCircle size={24} />
                  Confirmar Retirada
                </button>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-12">
                <Package size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">Selecione uma venda</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Escolha uma venda paga para visualizar os itens e confirmar a retirada
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
