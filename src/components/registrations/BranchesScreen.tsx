import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, History, Pencil, RefreshCw } from 'lucide-react';
import { mockBranches } from '@/data/registrationsMockData';
import { RECORD_STATUS_CONFIG, ORIGIN_CONFIG } from '@/types/registrations';
import { AuditLogModal } from './AuditLogModal';
import { CnpjCpfSearchModal, CnpjData, CpfData } from './CnpjCpfSearchModal';
import { toast } from 'sonner';

export const BranchesScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<typeof mockBranches[0] | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const handleSearchRegister = (data: CnpjData | CpfData) => {
    if (data.type === 'cnpj') {
      toast.success('Dados da filial carregados para cadastro!');
    }
  };

  const filteredBranches = mockBranches.filter(branch => branch.name.toLowerCase().includes(searchTerm.toLowerCase()) || branch.code.includes(searchTerm));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar por nome ou código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowSearchModal(true)}><RefreshCw className="h-4 w-4 mr-2" />Integrar CNPJ</Button>
          <Button onClick={() => toast.info('Formulário de filial')}><Plus className="h-4 w-4 mr-2" />Nova Filial</Button>
        </div>
      </div>

      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Código</TableHead><TableHead>Nome</TableHead><TableHead>Cidade/UF</TableHead><TableHead>CD</TableHead><TableHead>Status</TableHead><TableHead>Origem</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {filteredBranches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-mono">{branch.code}</TableCell>
                <TableCell className="font-medium">{branch.name}</TableCell>
                <TableCell>{branch.city}/{branch.state}</TableCell>
                <TableCell>{branch.isDistributionCenter ? <Badge>CD</Badge> : '-'}</TableCell>
                <TableCell><Badge className={RECORD_STATUS_CONFIG[branch.status].color}>{RECORD_STATUS_CONFIG[branch.status].label}</Badge></TableCell>
                <TableCell><Badge variant="outline" className={ORIGIN_CONFIG[branch.origin].color}>{ORIGIN_CONFIG[branch.origin].label}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelectedBranch(branch); setShowAuditLog(true); }}><History className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>

      {showAuditLog && selectedBranch && <AuditLogModal open={showAuditLog} onClose={() => setShowAuditLog(false)} title={selectedBranch.name} recordId={selectedBranch.id} origin={selectedBranch.origin} createdAt={selectedBranch.createdAt} createdBy={selectedBranch.createdBy} updatedAt={selectedBranch.updatedAt} lastSyncAt={selectedBranch.lastSyncAt} logs={selectedBranch.syncLogs} />}
      {showSearchModal && <CnpjCpfSearchModal open={showSearchModal} onClose={() => setShowSearchModal(false)} entityType="branches" entityLabel="Filiais" onRegister={handleSearchRegister} />}
    </div>
  );
};
