import { useState } from 'react';
import { Franchise, Operator, Tire, CartItem, Customer, PendingSale } from '@/types/pdv';
import { tires } from '@/data/mockData';
import { formatCurrency, formatDocument, formatPhone, formatPlate, generateSaleId } from '@/utils/formatters';
import { Plus, Minus, Trash2, ShoppingCart, Send } from 'lucide-react';
import { toast } from 'sonner';
import { ScreenHeader } from '@/components/ui/screen-header';

interface SalesScreenProps {
  franchise: Franchise;
  operator: Operator;
  onBack: () => void;
  onSendToCashier: (pendingSale: PendingSale) => void;
}

export const SalesScreen = ({ franchise, operator, onBack, onSendToCashier }: SalesScreenProps) => {
  const [customer, setCustomer] = useState<Customer>({ document: '', name: '', plate: '', phone: '' });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountType, setDiscountType] = useState<'percent' | 'value'>('value');
  const [discountValue, setDiscountValue] = useState(0);

  const subtotal = cart.reduce((sum, item) => sum + item.tire.price * item.quantity, 0);
  const discount = discountType === 'percent' ? (subtotal * discountValue / 100) : discountValue;
  const total = subtotal - discount;

  const addToCart = (tire: Tire) => {
    const existing = cart.find(item => item.tire.id === tire.id);
    if (existing) {
      if (existing.quantity < tire.stock) {
        setCart(cart.map(item =>
          item.tire.id === tire.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      }
    } else {
      setCart([...cart, { tire, quantity: 1 }]);
    }
  };

  const updateQuantity = (tireId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.tire.id === tireId) {
        const newQty = Math.max(1, Math.min(item.tire.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (tireId: string) => {
    setCart(cart.filter(item => item.tire.id !== tireId));
  };

  const handleSendToCashier = () => {
    if (!customer.name || !customer.document) {
      toast.error('Preencha CPF e nome do cliente');
      return;
    }
    if (cart.length === 0) {
      toast.error('Adicione itens ao carrinho');
      return;
    }

    const pendingSale: PendingSale = {
      id: generateSaleId(),
      franchiseId: franchise.id,
      operatorId: operator.id,
      customer,
      items: cart,
      subtotal,
      discount,
      discountType,
      discountValue,
      total,
      status: 'pending_payment',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSendToCashier(pendingSale);
    toast.success('Pedido enviado para o caixa!');
    
    // Reset form
    setCustomer({ document: '', name: '', plate: '', phone: '' });
    setCart([]);
    setDiscountValue(0);
  };

  return (
    <div className="flex-1 bg-muted/30 flex flex-col">
      <ScreenHeader 
        title="Nova Venda" 
        subtitle={`${franchise.name} • ${operator.name}`}
        onBack={onBack}
      />

      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Customer & Catalog */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Identificação do Cliente</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">CPF/CNPJ *</label>
                  <input
                    type="text"
                    value={customer.document}
                    onChange={(e) => setCustomer({ ...customer, document: formatDocument(e.target.value) })}
                    placeholder="000.000.000-00"
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nome *</label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Nome completo"
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Placa do Veículo</label>
                  <input
                    type="text"
                    value={customer.plate}
                    onChange={(e) => setCustomer({ ...customer, plate: formatPlate(e.target.value) })}
                    placeholder="ABC-1234"
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Telefone</label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: formatPhone(e.target.value) })}
                    placeholder="(00) 00000-0000"
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Tire Catalog */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Catálogo de Pneus</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Marca</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Modelo</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Medida</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Estoque</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Preço</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tires.map((tire) => (
                      <tr key={tire.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">{tire.brand}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{tire.model}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{tire.size}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{tire.stock}</td>
                        <td className="px-4 py-3 text-sm font-medium text-primary">{formatCurrency(tire.price)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => addToCart(tire)}
                            disabled={tire.stock === 0}
                            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Cart */}
          <div className="space-y-6">
            {/* Cart */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={20} className="text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Carrinho</h2>
              </div>
              
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Carrinho vazio</p>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.tire.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{item.tire.brand} {item.tire.model}</p>
                        <p className="text-xs text-muted-foreground">{item.tire.size}</p>
                        <p className="text-xs text-primary font-medium">{formatCurrency(item.tire.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.tire.id, -1)}
                          className="p-1 hover:bg-background rounded transition-colors"
                        >
                          <Minus size={14} className="text-foreground" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.tire.id, 1)}
                          className="p-1 hover:bg-background rounded transition-colors"
                        >
                          <Plus size={14} className="text-foreground" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.tire.id)}
                          className="p-1 hover:bg-destructive/10 rounded transition-colors ml-2"
                        >
                          <Trash2 size={14} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Discount & Summary */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Resumo</h2>
              
              {/* Discount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">Desconto</label>
                <div className="flex gap-2">
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percent' | 'value')}
                    className="px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="value">R$</option>
                    <option value="percent">%</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="flex-1 px-3 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Desconto</span>
                    <span className="text-green-600 dark:text-green-400">-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSendToCashier}
                disabled={cart.length === 0}
                className="w-full mt-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Enviar para Caixa
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
