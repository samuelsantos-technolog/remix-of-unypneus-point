import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, History } from 'lucide-react';
import { mockTransfers } from '@/data/registrationsMockData';
import { TRANSFER_STATUS_CONFIG } from '@/types/registrations';
import { AuditLogModal } from './AuditLogModal';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const TransfersScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTransfer, setSelectedTransfer] = useState<typeof mockTransfers[0] | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);

  const filteredTransfers = mockTransfers.filter(transfer => {
    const matchesSearch = transfer.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.transferStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="approved">Aprovada</SelectItem>
              <SelectItem value="in_transit">Em Trânsito</SelectItem>
              <SelectItem value="received">Recebida</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => toast.info('Formulário de transferência')}><Plus className="h-4 w-4 mr-2" />Nova Transferência</Button>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Origem</TableHead><TableHead>Destino</TableHead><TableHead>Itens</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {filteredTransfers.map((transfer) => (
              <TableRow key={transfer.id}>
                <TableCell className="font-mono font-medium">{transfer.code}</TableCell>
                <TableCell>{transfer.originBranchName}</TableCell>
                <TableCell>{transfer.destinationBranchName}</TableCell>
                <TableCell>{transfer.totalItems}</TableCell>
                <TableCell><Badge className={TRANSFER_STATUS_CONFIG[transfer.transferStatus].color}>{TRANSFER_STATUS_CONFIG[transfer.transferStatus].label}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(transfer.requestedAt, 'dd/MM/yyyy')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedTransfer(transfer); setShowAuditLog(true); }}><History className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      {showAuditLog && selectedTransfer && <AuditLogModal open={showAuditLog} onClose={() => setShowAuditLog(false)} title={selectedTransfer.code} recordId={selectedTransfer.id} origin={selectedTransfer.origin} createdAt={selectedTransfer.createdAt} createdBy={selectedTransfer.createdBy} updatedAt={selectedTransfer.updatedAt} logs={selectedTransfer.syncLogs} />}
    </div>
  );
};
