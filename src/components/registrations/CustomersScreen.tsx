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
import { Plus, Search, History, Pencil, RefreshCw } from 'lucide-react';
import { mockCustomers } from '@/data/registrationsMockData';
import { RECORD_STATUS_CONFIG, ORIGIN_CONFIG } from '@/types/registrations';
import { AuditLogModal } from './AuditLogModal';
import { CnpjCpfSearchModal, CnpjData, CpfData } from './CnpjCpfSearchModal';
import { toast } from 'sonner';

export const CustomersScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchRegister = (data: CnpjData | CpfData) => {
    // Here you would open a form with prefilled data
    toast.success(`Dados de ${data.type === 'cnpj' ? 'empresa' : 'pessoa'} carregados para cadastro!`);
  };

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.document.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou documento..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="inactive">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSearchModal(true)}><RefreshCw className="h-4 w-4 mr-2" />Integrar CNPJ/CPF</Button>
          <Button onClick={() => toast.info('Formulário de cliente')}><Plus className="h-4 w-4 mr-2" />Novo Cliente</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Cidade/UF</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell><p className="font-medium">{customer.name}</p><p className="text-xs text-muted-foreground">{customer.email}</p></TableCell>
                  <TableCell className="font-mono text-sm">{customer.document}</TableCell>
                  <TableCell>{customer.city}/{customer.state}</TableCell>
                  <TableCell><Badge className={RECORD_STATUS_CONFIG[customer.status].color}>{RECORD_STATUS_CONFIG[customer.status].label}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={ORIGIN_CONFIG[customer.origin].color}>{ORIGIN_CONFIG[customer.origin].label}</Badge></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedCustomer(customer); setShowAuditLog(true); }}><History className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showAuditLog && selectedCustomer && (
        <AuditLogModal open={showAuditLog} onClose={() => setShowAuditLog(false)} title={selectedCustomer.name} recordId={selectedCustomer.id} origin={selectedCustomer.origin} createdAt={selectedCustomer.createdAt} createdBy={selectedCustomer.createdBy} updatedAt={selectedCustomer.updatedAt} lastSyncAt={selectedCustomer.lastSyncAt} logs={selectedCustomer.syncLogs} />
      )}
      {showSearchModal && (
        <CnpjCpfSearchModal open={showSearchModal} onClose={() => setShowSearchModal(false)} entityType="customers" entityLabel="Clientes" onRegister={handleSearchRegister} />
      )}
    </div>
  );
};
