import { useState } from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PurchaseItem, calculatePurchaseItemTotals } from '@/types/purchases';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface PurchaseItemFormProps {
  item?: PurchaseItem;
  onSave: (item: Omit<PurchaseItem, 'id' | 'totalUnitCost' | 'totalCost'>) => void;
  onClose: () => void;
}

export const PurchaseItemForm = ({ item, onSave, onClose }: PurchaseItemFormProps) => {
  const [brand, setBrand] = useState(item?.brand || '');
  const [model, setModel] = useState(item?.model || '');
  const [dimension, setDimension] = useState(item?.dimension || '');
  const [quantity, setQuantity] = useState(item?.quantity?.toString() || '');
  const [unitCost, setUnitCost] = useState(item?.unitCost?.toString() || '');
  const [freightPerTire, setFreightPerTire] = useState(item?.freightPerTire?.toString() || '');

  const quantityNum = parseInt(quantity) || 0;
  const unitCostNum = parseFloat(unitCost) || 0;
  const freightNum = parseFloat(freightPerTire) || 0;

  const totals = calculatePurchaseItemTotals({
    id: '',
    brand,
    model,
    dimension,
    quantity: quantityNum,
    unitCost: unitCostNum,
    freightPerTire: freightNum,
  });

  const handleSave = () => {
    if (!brand.trim()) {
      toast.error('Informe a marca');
      return;
    }
    if (!model.trim()) {
      toast.error('Informe o modelo');
      return;
    }
    if (!dimension.trim()) {
      toast.error('Informe a dimensão');
      return;
    }
    if (quantityNum <= 0) {
      toast.error('Informe uma quantidade válida');
      return;
    }
    if (unitCostNum <= 0) {
      toast.error('Informe um custo unitário válido');
      return;
    }

    onSave({
      brand: brand.trim(),
      model: model.trim(),
      dimension: dimension.trim(),
      quantity: quantityNum,
      unitCost: unitCostNum,
      freightPerTire: freightNum,
    });
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Editar Item' : 'Adicionar Item'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Marca *</Label>
            <Input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ex: Pirelli, Michelin, Continental..."
            />
          </div>

          <div className="space-y-2">
            <Label>Modelo *</Label>
            <Input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Ex: Cinturato P1, Primacy 4..."
            />
          </div>

          <div className="space-y-2">
            <Label>Dimensão *</Label>
            <Input
              value={dimension}
              onChange={(e) => setDimension(e.target.value)}
              placeholder="Ex: 195/65R15, 205/55R16..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Quantidade *</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Custo Unitário *</Label>
              <Input
                type="number"
                step="0.01"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Frete por Pneu</Label>
              <Input
                type="number"
                step="0.01"
                value={freightPerTire}
                onChange={(e) => setFreightPerTire(e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          {/* Calculated Values */}
          <Card className="bg-muted/50">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Custo Unitário:</span>
                <span>{formatCurrency(unitCostNum)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Frete por Pneu:</span>
                <span>{formatCurrency(freightNum)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>Custo Total Unitário:</span>
                <span>{formatCurrency(totals.totalUnitCost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantidade:</span>
                <span>× {quantityNum}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total do Item:</span>
                <span className="text-primary">{formatCurrency(totals.totalCost)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            {item ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
