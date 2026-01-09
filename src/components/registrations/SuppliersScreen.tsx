import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
import { 
  Plus,
  Search,
  History,
  Pencil,
  RefreshCw,
} from 'lucide-react';
import { mockSuppliersRegistration } from '@/data/registrationsMockData';
import { RECORD_STATUS_CONFIG, ORIGIN_CONFIG } from '@/types/registrations';
import { AuditLogModal } from './AuditLogModal';
import { CnpjCpfSearchModal, CnpjData, CpfData } from './CnpjCpfSearchModal';
import { SupplierFormModal } from './SupplierFormModal';
import { format } from 'date-fns';

export const SuppliersScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<typeof mockSuppliersRegistration[0] | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<typeof mockSuppliersRegistration[0] | null>(null);
  const [prefilledData, setPrefilledData] = useState<CnpjData | null>(null);

  const handleSearchRegister = (data: CnpjData | CpfData) => {
    if (data.type === 'cnpj') {
      setPrefilledData(data);
      setEditingSupplier(null);
      setShowFormModal(true);
    }
  };

  const filteredSuppliers = mockSuppliersRegistration.filter(supplier => {
    const matchesSearch = supplier.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.corporateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.cnpj.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    const matchesOrigin = originFilter === 'all' || supplier.origin === originFilter;
    return matchesSearch && matchesStatus && matchesOrigin;
  });

  const handleViewAudit = (supplier: typeof mockSuppliersRegistration[0]) => {
    setSelectedSupplier(supplier);
    setShowAuditLog(true);
  };

  const handleEdit = (supplier: typeof mockSuppliersRegistration[0]) => {
    setEditingSupplier(supplier);
    setShowFormModal(true);
  };

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
              <SelectItem value="blocked">Bloqueado</SelectItem>
              <SelectItem value="sync_error">Erro de Sync</SelectItem>
            </SelectContent>
          </Select>
          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Origens</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="api">API</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSearchModal(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Integrar CNPJ
          </Button>
          <Button onClick={() => { setEditingSupplier(null); setPrefilledData(null); setShowFormModal(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Fornecedor
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome Fantasia</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum fornecedor encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => {
                  const statusConfig = RECORD_STATUS_CONFIG[supplier.status];
                  const originConfig = ORIGIN_CONFIG[supplier.origin];
                  return (
                    <TableRow key={supplier.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{supplier.tradeName}</p>
                          <p className="text-xs text-muted-foreground">{supplier.corporateName}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{supplier.cnpj}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{supplier.contactName}</p>
                          <p className="text-xs text-muted-foreground">{supplier.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={originConfig.color}>{originConfig.label}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(supplier.updatedAt, 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewAudit(supplier)}>
                            <History className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
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

      {/* Modals */}
      {showAuditLog && selectedSupplier && (
        <AuditLogModal
          open={showAuditLog}
          onClose={() => setShowAuditLog(false)}
          title={selectedSupplier.tradeName}
          recordId={selectedSupplier.id}
          origin={selectedSupplier.origin}
          createdAt={selectedSupplier.createdAt}
          createdBy={selectedSupplier.createdBy}
          updatedAt={selectedSupplier.updatedAt}
          lastSyncAt={selectedSupplier.lastSyncAt}
          logs={selectedSupplier.syncLogs}
        />
      )}

      {showSearchModal && (
        <CnpjCpfSearchModal
          open={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          entityType="suppliers"
          entityLabel="Fornecedores"
          onRegister={handleSearchRegister}
        />
      )}

      {showFormModal && (
        <SupplierFormModal
          open={showFormModal}
          onClose={() => { setShowFormModal(false); setPrefilledData(null); }}
          supplier={editingSupplier}
          prefilledData={prefilledData}
        />
      )}
    </div>
  );
};
