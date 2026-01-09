import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { 
  mockSuppliers, 
  getPurchaseById, 
  checkDuplicateNfeKey 
} from '@/data/purchasesMockData';
import { 
  Purchase, 
  PurchaseItem, 
  PURCHASE_PAYMENT_CONDITIONS,
  PurchasePaymentCondition,
  calculatePurchaseItemTotals,
  calculatePurchaseTotals
} from '@/types/purchases';
import { formatCurrency } from '@/utils/formatters';
import { PurchaseItemForm } from './PurchaseItemForm';

interface NewPurchaseModalProps {
  franchiseId: string;
  purchaseId?: string;
  onClose: () => void;
  onSave: (purchase: Purchase) => void;
}

export const NewPurchaseModal = ({ 
  franchiseId, 
  purchaseId, 
  onClose, 
  onSave 
}: NewPurchaseModalProps) => {
  const isEditing = !!purchaseId;
  const existingPurchase = purchaseId ? getPurchaseById(purchaseId) : null;

  const [supplierId, setSupplierId] = useState(existingPurchase?.supplierId || '');
  const [purchaseDate, setPurchaseDate] = useState(
    existingPurchase?.purchaseDate.toISOString().split('T')[0] || 
    new Date().toISOString().split('T')[0]
  );
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    existingPurchase?.expectedDeliveryDate.toISOString().split('T')[0] || ''
  );
  const [paymentCondition, setPaymentCondition] = useState<PurchasePaymentCondition>(
    existingPurchase?.paymentCondition || 'cash'
  );
  const [customPaymentDays, setCustomPaymentDays] = useState(
    existingPurchase?.customPaymentDays?.toString() || ''
  );
  const [invoiceNumber, setInvoiceNumber] = useState(existingPurchase?.invoiceNumber || '');
  const [nfeKey, setNfeKey] = useState(existingPurchase?.nfeKey || '');
  const [observations, setObservations] = useState(existingPurchase?.observations || '');
  const [items, setItems] = useState<PurchaseItem[]>(existingPurchase?.items || []);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PurchaseItem | null>(null);

  const selectedSupplier = mockSuppliers.find(s => s.id === supplierId);

  useEffect(() => {
    if (selectedSupplier && !isEditing) {
      setPaymentCondition(selectedSupplier.defaultPaymentCondition);
      if (selectedSupplier.customPaymentDays) {
        setCustomPaymentDays(selectedSupplier.customPaymentDays.toString());
      }
    }
  }, [selectedSupplier, isEditing]);

  const totals = calculatePurchaseTotals(items);

  const handleAddItem = (item: Omit<PurchaseItem, 'id' | 'totalUnitCost' | 'totalCost'>) => {
    const itemTotals = calculatePurchaseItemTotals({
      ...item,
      id: `item-${Date.now()}`
    });
    
    const newItem: PurchaseItem = {
      id: `item-${Date.now()}`,
      ...item,
      ...itemTotals
    };

    setItems([...items, newItem]);
    setShowItemForm(false);
    toast.success('Item adicionado');
  };

  const handleUpdateItem = (updatedItem: PurchaseItem) => {
    const itemTotals = calculatePurchaseItemTotals(updatedItem);
    const itemWithTotals = { ...updatedItem, ...itemTotals };
    
    setItems(items.map(item => 
      item.id === updatedItem.id ? itemWithTotals : item
    ));
    setEditingItem(null);
    toast.success('Item atualizado');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
    toast.success('Item removido');
  };

  const handleSave = () => {
    // Validations
    if (!supplierId) {
      toast.error('Selecione um fornecedor');
      return;
    }
    if (!purchaseDate) {
      toast.error('Informe a data da compra');
      return;
    }
    if (!expectedDeliveryDate) {
      toast.error('Informe a data prevista de entrega');
      return;
    }
    if (items.length === 0) {
      toast.error('Adicione pelo menos um item');
      return;
    }
    if (paymentCondition === 'custom' && !customPaymentDays) {
      toast.error('Informe os dias para pagamento customizado');
      return;
    }
    if (nfeKey && checkDuplicateNfeKey(nfeKey, purchaseId)) {
      toast.error('Esta chave de NF-e já foi utilizada em outra compra');
      return;
    }

    const purchase: Purchase = {
      id: purchaseId || `pur-${Date.now()}`,
      franchiseId,
      supplierId,
      supplierName: selectedSupplier?.tradeName || '',
      purchaseDate: new Date(purchaseDate),
      expectedDeliveryDate: new Date(expectedDeliveryDate),
      paymentCondition,
      customPaymentDays: paymentCondition === 'custom' ? parseInt(customPaymentDays) : undefined,
      invoiceNumber: invoiceNumber || undefined,
      nfeKey: nfeKey || undefined,
      observations,
      items,
      ...totals,
      status: 'created',
      createdAt: existingPurchase?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: 'Operador Atual', // Would come from auth context
    };

    onSave(purchase);
    toast.success(isEditing ? 'Compra atualizada com sucesso' : 'Compra criada com sucesso');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Compra' : 'Nova Compra de Fornecedor'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dados Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fornecedor *</Label>
                  <Select value={supplierId} onValueChange={setSupplierId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSuppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.tradeName} - {supplier.cnpj}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Condição de Pagamento *</Label>
                  <Select 
                    value={paymentCondition} 
                    onValueChange={(v) => setPaymentCondition(v as PurchasePaymentCondition)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PURCHASE_PAYMENT_CONDITIONS.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {paymentCondition === 'custom' && (
                  <div className="space-y-2">
                    <Label>Dias para Pagamento *</Label>
                    <Input
                      type="number"
                      value={customPaymentDays}
                      onChange={(e) => setCustomPaymentDays(e.target.value)}
                      placeholder="Ex: 30"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Data da Compra *</Label>
                  <Input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Data Prevista de Entrega *</Label>
                  <Input
                    type="date"
                    value={expectedDeliveryDate}
                    onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Número da NF</Label>
                  <Input
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="Ex: 12345"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Chave da NF-e</Label>
                  <Input
                    value={nfeKey}
                    onChange={(e) => setNfeKey(e.target.value)}
                    placeholder="44 dígitos da chave de acesso"
                    maxLength={44}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Observações sobre a compra..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Itens da Compra</CardTitle>
              <Button size="sm" onClick={() => setShowItemForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum item adicionado. Clique em "Adicionar Item" para começar.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Marca</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Dimensão</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Custo Un.</TableHead>
                      <TableHead className="text-right">Frete</TableHead>
                      <TableHead className="text-right">Custo Total Un.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.model}</TableCell>
                        <TableCell>{item.dimension}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.freightPerTire)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.totalUnitCost)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.totalCost)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingItem(item)}
                            >
                              <Calculator className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Totals */}
              {items.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total de Itens:</span>
                        <span className="font-medium">{totals.totalItems}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Quantidade Total:</span>
                        <span className="font-medium">{totals.totalQuantity} pneus</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Custo Médio por Pneu:</span>
                        <span className="font-medium">{formatCurrency(totals.averageCostPerTire)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total da Compra:</span>
                        <span className="text-primary">{formatCurrency(totals.totalCost)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {isEditing ? 'Salvar Alterações' : 'Criar Compra'}
          </Button>
        </DialogFooter>

        {/* Item Form Modal */}
        {(showItemForm || editingItem) && (
          <PurchaseItemForm
            item={editingItem || undefined}
            onSave={(item) => {
              if (editingItem) {
                handleUpdateItem({ ...editingItem, ...item } as PurchaseItem);
              } else {
                handleAddItem(item);
              }
            }}
            onClose={() => {
              setShowItemForm(false);
              setEditingItem(null);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
