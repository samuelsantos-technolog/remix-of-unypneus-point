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
import { Search, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';
import { mockCommissions } from '@/data/financialMockData';
import { Commission } from '@/types/financial';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface CommissionsScreenProps {
  franchiseId: string;
}

const COMMISSION_STATUS_CONFIG: Record<Commission['status'], { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprovado', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Pago', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
};

export const CommissionsScreen = ({ franchiseId }: CommissionsScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Commission['status'] | 'all'>('all');

  const filteredCommissions = mockCommissions.filter(comm => {
    const matchesSearch = 
      comm.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.saleId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comm.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Summary
  const pendingCommissions = mockCommissions.filter(c => c.status === 'pending');
  const approvedCommissions = mockCommissions.filter(c => c.status === 'approved');
  const paidCommissions = mockCommissions.filter(c => c.status === 'paid');
  
  const totalPending = pendingCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalApproved = approvedCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);
  const totalPaid = paidCommissions.reduce((sum, c) => sum + c.commissionAmount, 0);

  const handleApprove = (id: string) => {
    toast.success('Comissão aprovada!');
  };

  const handlePay = (id: string) => {
    toast.success('Pagamento de comissão registrado!');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Pendentes de Aprovação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingCommissions.length} comissões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600" />
              Aprovadas (a pagar)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalApproved)}
            </div>
            <p className="text-xs text-muted-foreground">
              {approvedCommissions.length} comissões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              Pagas no Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
            <p className="text-xs text-muted-foreground">
              {paidCommissions.length} comissões
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Beneficiários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockCommissions.map(c => c.recipientId)).size}
            </div>
            <p className="text-xs text-muted-foreground">vendedores ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por vendedor ou venda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as Commission['status'] | 'all')}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(COMMISSION_STATUS_CONFIG).map(([key, config]) => (
              <SelectItem key={key} value={key}>{config.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beneficiário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Venda</TableHead>
                <TableHead>Data Venda</TableHead>
                <TableHead className="text-right">Valor Venda</TableHead>
                <TableHead className="text-center">Taxa</TableHead>
                <TableHead className="text-right">Comissão</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma comissão encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredCommissions.map((comm) => {
                  const statusConfig = COMMISSION_STATUS_CONFIG[comm.status];
                  return (
                    <TableRow key={comm.id}>
                      <TableCell className="font-medium">{comm.recipientName}</TableCell>
                      <TableCell>
                        {comm.recipientType === 'salesperson' ? 'Vendedor' : 
                         comm.recipientType === 'franchise' ? 'Franquia' : 'Parceiro'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{comm.saleId}</TableCell>
                      <TableCell>
                        {format(comm.saleDate, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(comm.saleAmount)}
                      </TableCell>
                      <TableCell className="text-center">{comm.commissionRate}%</TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {formatCurrency(comm.commissionAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {comm.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApprove(comm.id)}
                            >
                              Aprovar
                            </Button>
                          )}
                          {comm.status === 'approved' && (
                            <Button 
                              size="sm"
                              onClick={() => handlePay(comm.id)}
                            >
                              Pagar
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
