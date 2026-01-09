import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { mockCardReconciliations } from '@/data/financialMockData';
import { FINANCIAL_STATUS_CONFIG, FinancialTransactionStatus } from '@/types/statusFlows';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface ReconciliationScreenProps {
  franchiseId: string;
}

export const ReconciliationScreen = ({ franchiseId }: ReconciliationScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FinancialTransactionStatus | 'all'>('all');

  const filteredReconciliations = mockCardReconciliations.filter(rec => {
    const matchesSearch = 
      rec.nsu.includes(searchTerm) ||
      rec.authorizationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.cardBrand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary
  const pendingCount = mockCardReconciliations.filter(r => r.status === 'pending_reconciliation').length;
  const reconciledCount = mockCardReconciliations.filter(r => r.status === 'reconciled').length;
  const totalGross = mockCardReconciliations.reduce((sum, r) => sum + r.grossAmount, 0);
  const totalFees = mockCardReconciliations.reduce((sum, r) => sum + r.fee, 0);

  const handleReconcile = (id: string) => {
    toast.success('Transação conciliada com sucesso!');
  };

  const getStatusBadge = (status: FinancialTransactionStatus) => {
    const config = FINANCIAL_STATUS_CONFIG[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Aguardando Conciliação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Conciliadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reconciledCount}</div>
            <p className="text-xs text-muted-foreground">transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Bruto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalGross)}</div>
            <p className="text-xs text-muted-foreground">em transações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalFees)}</div>
            <p className="text-xs text-muted-foreground">descontadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por NSU, autorização ou bandeira..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as FinancialTransactionStatus | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pending_reconciliation">Aguardando</SelectItem>
            <SelectItem value="reconciled">Conciliado</SelectItem>
            <SelectItem value="receivable">A Receber</SelectItem>
            <SelectItem value="received">Recebido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NSU</TableHead>
                <TableHead>Bandeira</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Parcelas</TableHead>
                <TableHead className="text-right">Valor Bruto</TableHead>
                <TableHead className="text-right">Taxa</TableHead>
                <TableHead className="text-right">Valor Líquido</TableHead>
                <TableHead>Previsão</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReconciliations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredReconciliations.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-mono text-sm">{rec.nsu}</TableCell>
                    <TableCell>{rec.cardBrand}</TableCell>
                    <TableCell>
                      {rec.cardType === 'credit' ? 'Crédito' : 'Débito'}
                    </TableCell>
                    <TableCell className="text-center">{rec.installments}x</TableCell>
                    <TableCell className="text-right">{formatCurrency(rec.grossAmount)}</TableCell>
                    <TableCell className="text-right text-red-600">
                      -{formatCurrency(rec.fee)} ({rec.feePercentage}%)
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(rec.netAmount)}
                    </TableCell>
                    <TableCell>
                      {format(rec.expectedPaymentDate, 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(rec.status)}
                    </TableCell>
                    <TableCell>
                      {rec.status === 'pending_reconciliation' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReconcile(rec.id)}
                        >
                          Conciliar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
