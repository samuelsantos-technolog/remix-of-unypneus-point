import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
import { Plus, Search, Eye, CheckCircle, GitBranch } from 'lucide-react';
import { mockReceivables } from '@/data/financialMockData';
import { ACCOUNT_STATUS_CONFIG, AccountStatus } from '@/types/financial';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { StatusTimelineModal, financialStepsToTimeline } from '@/components/ui/status-timeline-modal';
import { FINANCIAL_STATUS_CONFIG } from '@/types/statusFlows';

interface ReceivablesScreenProps {
  franchiseId: string;
}

export const ReceivablesScreen = ({ franchiseId }: ReceivablesScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AccountStatus | 'all'>('all');

  const filteredReceivables = mockReceivables.filter(account => {
    const matchesSearch = 
      account.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleReceivePayment = (accountId: string) => {
    toast.success('Recebimento registrado com sucesso!');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-4 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AccountStatus | 'all')}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(ACCOUNT_STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Recebido</TableHead>
                <TableHead className="text-right">A Receber</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceivables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhuma conta encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceivables.map((account) => {
                  const statusConfig = ACCOUNT_STATUS_CONFIG[account.status];
                  return (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.entityName}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{account.description}</TableCell>
                      <TableCell>
                        {format(account.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(account.totalAmount)}</TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(account.paidAmount)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-blue-600">
                        {formatCurrency(account.remainingAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <StatusTimelineModal
                            title={`Timeline - Conta ${account.id}`}
                            subtitle={`Cliente: ${account.entityName}`}
                            steps={financialStepsToTimeline(FINANCIAL_STATUS_CONFIG)}
                            currentStatus={account.status}
                            trigger={
                              <Button variant="ghost" size="icon" title="Ver Timeline">
                                <GitBranch className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {account.status !== 'paid' && account.status !== 'cancelled' && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleReceivePayment(account.id)}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
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
  );
};
