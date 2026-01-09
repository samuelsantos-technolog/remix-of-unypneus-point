import { useState } from 'react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Search,
  LogIn,
  LogOut,
  UserPlus,
  UserCog,
  UserMinus,
  Shield,
  Package,
  Truck,
  CreditCard,
  ShoppingCart,
  FileText
} from 'lucide-react';
import { AuditLog, AuditActionType } from '@/types/access-control';
import { auditLogs } from '@/data/accessControlMockData';

interface AuditLogsScreenProps {
  onBack: () => void;
}

const actionLabels: Record<AuditActionType, { label: string; icon: React.ReactNode; color: string }> = {
  login: { label: 'Login', icon: <LogIn className="h-4 w-4" />, color: 'bg-green-100 text-green-700' },
  logout: { label: 'Logout', icon: <LogOut className="h-4 w-4" />, color: 'bg-gray-100 text-gray-700' },
  permission_change: { label: 'Alteração de Permissão', icon: <Shield className="h-4 w-4" />, color: 'bg-purple-100 text-purple-700' },
  user_create: { label: 'Criação de Usuário', icon: <UserPlus className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
  user_update: { label: 'Atualização de Usuário', icon: <UserCog className="h-4 w-4" />, color: 'bg-amber-100 text-amber-700' },
  user_delete: { label: 'Exclusão de Usuário', icon: <UserMinus className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
  profile_create: { label: 'Criação de Perfil', icon: <Shield className="h-4 w-4" />, color: 'bg-blue-100 text-blue-700' },
  profile_update: { label: 'Atualização de Perfil', icon: <Shield className="h-4 w-4" />, color: 'bg-amber-100 text-amber-700' },
  profile_delete: { label: 'Exclusão de Perfil', icon: <Shield className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
  stock_adjustment: { label: 'Ajuste de Estoque', icon: <Package className="h-4 w-4" />, color: 'bg-emerald-100 text-emerald-700' },
  load_finalize: { label: 'Finalização de Carga', icon: <Truck className="h-4 w-4" />, color: 'bg-orange-100 text-orange-700' },
  cashier_close: { label: 'Fechamento de Caixa', icon: <CreditCard className="h-4 w-4" />, color: 'bg-indigo-100 text-indigo-700' },
  sale_cancel: { label: 'Cancelamento de Venda', icon: <FileText className="h-4 w-4" />, color: 'bg-red-100 text-red-700' },
  purchase_approve: { label: 'Aprovação de Compra', icon: <ShoppingCart className="h-4 w-4" />, color: 'bg-teal-100 text-teal-700' },
  order_approve: { label: 'Aprovação de Pedido', icon: <ShoppingCart className="h-4 w-4" />, color: 'bg-teal-100 text-teal-700' },
};

export const AuditLogsScreen = ({ onBack }: AuditLogsScreenProps) => {
  const [logs] = useState<AuditLog[]>(auditLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScreenHeader
        title="Logs de Auditoria"
        subtitle="Histórico de ações críticas no sistema"
        onBack={onBack}
      />

      <div className="flex-1 p-4 md:p-6 overflow-hidden">
        <Card className="h-full flex flex-col">
          <CardContent className="p-4 flex-1 flex flex-col">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por usuário ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Filtrar por ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as ações</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {actionLabels[action]?.label ?? action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tabela de logs */}
            <div className="border rounded-lg flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-320px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Data/Hora</TableHead>
                      <TableHead className="w-[150px]">Usuário</TableHead>
                      <TableHead className="w-[200px]">Ação</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Nenhum log encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map(log => {
                        const actionInfo = actionLabels[log.action];
                        return (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(log.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="font-medium">{log.userName}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="secondary" 
                                className={`${actionInfo?.color} flex items-center gap-1 w-fit`}
                              >
                                {actionInfo?.icon}
                                {actionInfo?.label ?? log.action}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p>{log.description}</p>
                                {log.details && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {JSON.stringify(log.details)}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>

            {/* Footer com contagem */}
            <div className="mt-4 text-sm text-muted-foreground">
              Exibindo {filteredLogs.length} de {logs.length} registros
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
