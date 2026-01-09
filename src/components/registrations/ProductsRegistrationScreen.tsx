import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, History, Pencil, RefreshCw } from 'lucide-react';
import { mockProductsRegistration } from '@/data/registrationsMockData';
import { RECORD_STATUS_CONFIG, ORIGIN_CONFIG } from '@/types/registrations';
import { AuditLogModal } from './AuditLogModal';
import { ProductSearchModal, ExternalProduct } from './ProductSearchModal';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

export const ProductsRegistrationScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProductsRegistration[0] | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleImportProduct = (product: ExternalProduct) => {
    // Here you would open a form with prefilled data from the external product
    toast.success(`Produto "${product.description}" importado! Preencha os dados adicionais.`);
  };

  const filteredProducts = mockProductsRegistration.filter(product => {
    const matchesSearch = product.description.toLowerCase().includes(searchTerm.toLowerCase()) || product.code.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por código ou descrição..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSearchModal(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Integrar Produtos
          </Button>
          <Button onClick={() => toast.info('Formulário de produto')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Descrição</TableHead><TableHead>Marca</TableHead><TableHead>Preço</TableHead><TableHead>Status</TableHead><TableHead>Origem</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-mono">{product.code}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{formatCurrency(product.price)}</TableCell>
                <TableCell><Badge className={RECORD_STATUS_CONFIG[product.status].color}>{RECORD_STATUS_CONFIG[product.status].label}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={ORIGIN_CONFIG[product.origin].color}>{ORIGIN_CONFIG[product.origin].label}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedProduct(product); setShowAuditLog(true); }}><History className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      {showAuditLog && selectedProduct && (
        <AuditLogModal 
          open={showAuditLog} 
          onClose={() => setShowAuditLog(false)} 
          title={selectedProduct.description} 
          recordId={selectedProduct.id} 
          origin={selectedProduct.origin} 
          createdAt={selectedProduct.createdAt} 
          createdBy={selectedProduct.createdBy} 
          updatedAt={selectedProduct.updatedAt} 
          lastSyncAt={selectedProduct.lastSyncAt} 
          logs={selectedProduct.syncLogs} 
        />
      )}
      
      {showSearchModal && (
        <ProductSearchModal 
          open={showSearchModal} 
          onClose={() => setShowSearchModal(false)} 
          onRegister={handleImportProduct} 
        />
      )}
    </div>
  );
};
