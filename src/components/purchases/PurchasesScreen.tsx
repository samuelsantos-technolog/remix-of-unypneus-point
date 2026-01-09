import { useState } from 'react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Eye, 
  Pencil, 
  FileDown, 
  Users, 
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  GitBranch
} from 'lucide-react';
import { StatusTimelineModal, purchaseOrderStepsToTimeline } from '@/components/ui/status-timeline-modal';
import { PURCHASE_ORDER_STATUS_CONFIG } from '@/types/statusFlows';
import { mockPurchases, mockSuppliers } from '@/data/purchasesMockData';
import { Purchase, PURCHASE_STATUS_CONFIG, PurchaseStatus } from '@/types/purchases';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { NewPurchaseModal } from './NewPurchaseModal';
import { ViewPurchaseModal } from './ViewPurchaseModal';
import { SuppliersModal } from './SuppliersModal';

interface PurchasesScreenProps {
  franchiseId: string;
  onBack: () => void;
}

export const PurchasesScreen = ({ franchiseId, onBack }: PurchasesScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | 'all'>('all');
  const [showNewPurchaseModal, setShowNewPurchaseModal] = useState(false);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [viewPurchaseId, setViewPurchaseId] = useState<string | null>(null);
  const [editPurchaseId, setEditPurchaseId] = useState<string | null>(null);

  const filteredPurchases = mockPurchases.filter(purchase => {
    const matchesSearch = 
      purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || purchase.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate summary metrics
  const totalPurchases = mockPurchases.length;
  const totalValue = mockPurchases.reduce((sum, p) => sum + p.totalCost, 0);
  const totalItems = mockPurchases.reduce((sum, p) => sum + p.totalQuantity, 0);
  const pendingPurchases = mockPurchases.filter(p => p.status === 'awaiting_delivery' || p.status === 'created').length;

  return (
    <div className="flex flex-col h-full w-full">
      <ScreenHeader
        title="Compras de Fornecedor"
        subtitle="Gerencie as compras de pneus junto aos fornecedores"
        onBack={onBack}
      />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Compras</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchases}</div>
              <p className="text-xs text-muted-foreground">registradas no sistema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
              <p className="text-xs text-muted-foreground">em compras realizadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pneus Comprados</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">unidades totais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPurchases}</div>
              <p className="text-xs text-muted-foreground">aguardando entrega</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por fornecedor, NF ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PurchaseStatus | 'all')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(PURCHASE_STATUS_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSuppliersModal(true)}>
              <Users className="h-4 w-4 mr-2" />
              Fornecedores
            </Button>
            <Button onClick={() => setShowNewPurchaseModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Compra
            </Button>
          </div>
        </div>

        {/* Purchases Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>NF</TableHead>
                  <TableHead className="text-center">Itens</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Nenhuma compra encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPurchases.map((purchase) => {
                    const statusConfig = PURCHASE_STATUS_CONFIG[purchase.status];
                    return (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono text-sm">{purchase.id}</TableCell>
                        <TableCell className="font-medium">{purchase.supplierName}</TableCell>
                        <TableCell>
                          {format(purchase.purchaseDate, 'dd/MM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell>{purchase.invoiceNumber || '-'}</TableCell>
                        <TableCell className="text-center">{purchase.totalQuantity}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(purchase.totalCost)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <StatusTimelineModal
                              title={`Timeline - Compra ${purchase.id}`}
                              subtitle={`Fornecedor: ${purchase.supplierName}`}
                              steps={purchaseOrderStepsToTimeline(PURCHASE_ORDER_STATUS_CONFIG)}
                              currentStatus={purchase.status}
                              trigger={
                                <Button variant="ghost" size="icon" title="Ver Timeline">
                                  <GitBranch className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewPurchaseId(purchase.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {purchase.status === 'created' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditPurchaseId(purchase.id)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showNewPurchaseModal && (
        <NewPurchaseModal
          franchiseId={franchiseId}
          onClose={() => setShowNewPurchaseModal(false)}
          onSave={() => {
            setShowNewPurchaseModal(false);
          }}
        />
      )}

      {viewPurchaseId && (
        <ViewPurchaseModal
          purchaseId={viewPurchaseId}
          onClose={() => setViewPurchaseId(null)}
          onConfirmStock={() => {
            setViewPurchaseId(null);
          }}
        />
      )}

      {editPurchaseId && (
        <NewPurchaseModal
          franchiseId={franchiseId}
          purchaseId={editPurchaseId}
          onClose={() => setEditPurchaseId(null)}
          onSave={() => {
            setEditPurchaseId(null);
          }}
        />
      )}

      {showSuppliersModal && (
        <SuppliersModal
          onClose={() => setShowSuppliersModal(false)}
        />
      )}
    </div>
  );
};
