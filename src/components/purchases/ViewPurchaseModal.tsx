import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Package, 
  Truck, 
  Calendar, 
  FileText, 
  User,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { getPurchaseById, getSupplierById } from '@/data/purchasesMockData';
import { PURCHASE_STATUS_CONFIG, calculateDueDate } from '@/types/purchases';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface ViewPurchaseModalProps {
  purchaseId: string;
  onClose: () => void;
  onConfirmStock: () => void;
}

export const ViewPurchaseModal = ({ purchaseId, onClose, onConfirmStock }: ViewPurchaseModalProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const purchase = getPurchaseById(purchaseId);
  const supplier = purchase ? getSupplierById(purchase.supplierId) : null;

  if (!purchase) {
    return null;
  }

  const statusConfig = PURCHASE_STATUS_CONFIG[purchase.status];
  const dueDate = calculateDueDate(
    purchase.purchaseDate, 
    purchase.paymentCondition, 
    purchase.customPaymentDays
  );

  const handleConfirmStock = () => {
    toast.success('Estoque confirmado com sucesso! Entrada registrada.');
    setShowConfirmDialog(false);
    onConfirmStock();
  };

  const handleCancel = () => {
    toast.success('Compra cancelada');
    setShowCancelDialog(false);
    onClose();
  };

  const canConfirmStock = purchase.status === 'created' || purchase.status === 'awaiting_delivery';
  const canCancel = purchase.status === 'created';

  return (
    <>
      <Dialog open onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">
                Compra {purchase.id}
              </DialogTitle>
              <Badge className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Supplier Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Fornecedor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Razão Social:</span>
                    <p className="font-medium">{supplier?.corporateName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nome Fantasia:</span>
                    <p className="font-medium">{purchase.supplierName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CNPJ:</span>
                    <p className="font-medium">{supplier?.cnpj}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Contato:</span>
                    <p className="font-medium">{supplier?.contactName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Telefone:</span>
                    <p className="font-medium">{supplier?.phone}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">E-mail:</span>
                    <p className="font-medium">{supplier?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Dados da Compra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data da Compra:</span>
                    <p className="font-medium">
                      {format(purchase.purchaseDate, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Previsão Entrega:</span>
                    <p className="font-medium">
                      {format(purchase.expectedDeliveryDate, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">NF:</span>
                    <p className="font-medium">{purchase.invoiceNumber || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vencimento:</span>
                    <p className="font-medium">
                      {format(dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                </div>
                {purchase.nfeKey && (
                  <div className="mt-4">
                    <span className="text-muted-foreground text-sm">Chave NF-e:</span>
                    <p className="font-mono text-xs bg-muted p-2 rounded mt-1">{purchase.nfeKey}</p>
                  </div>
                )}
                {purchase.observations && (
                  <div className="mt-4">
                    <span className="text-muted-foreground text-sm">Observações:</span>
                    <p className="text-sm mt-1">{purchase.observations}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Itens ({purchase.totalQuantity} pneus)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Marca</TableHead>
                      <TableHead>Modelo</TableHead>
                      <TableHead>Dimensão</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Custo Un.</TableHead>
                      <TableHead className="text-right">Frete</TableHead>
                      <TableHead className="text-right">Total Un.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchase.items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.model}</TableCell>
                        <TableCell>{item.dimension}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitCost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.freightPerTire)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.totalUnitCost)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.totalCost)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Criado em {format(purchase.createdAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      Por {purchase.createdBy}
                    </div>
                    {purchase.confirmedAt && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        Confirmado em {format(purchase.confirmedAt, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        {purchase.confirmedBy && ` por ${purchase.confirmedBy}`}
                      </div>
                    )}
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Itens: </span>
                      <span className="font-medium">{purchase.totalItems}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Quantidade: </span>
                      <span className="font-medium">{purchase.totalQuantity} pneus</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Custo Médio: </span>
                      <span className="font-medium">{formatCurrency(purchase.averageCostPerTire)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="text-xl font-bold text-primary">
                      {formatCurrency(purchase.totalCost)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-2">
            {canCancel && (
              <Button variant="destructive" onClick={() => setShowCancelDialog(true)}>
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar Compra
              </Button>
            )}
            {canConfirmStock && (
              <Button onClick={() => setShowConfirmDialog(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar Entrada no Estoque
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Stock Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Entrada no Estoque</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação irá registrar a entrada de {purchase.totalQuantity} pneus no estoque.
              Após a confirmação, o status da compra será atualizado para "Recebida".
              <br /><br />
              <strong>Esta ação não pode ser desfeita.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmStock}>
              Confirmar Entrada
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Compra</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta compra?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
