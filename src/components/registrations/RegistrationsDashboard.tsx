import { useState } from 'react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Building2, 
  Users, 
  Package, 
  Store, 
  ArrowRightLeft,
  Plus,
  Search,
  Cloud,
  FileText,
  History,
  Filter,
} from 'lucide-react';
import { SuppliersScreen } from './SuppliersScreen';
import { CustomersScreen } from './CustomersScreen';
import { ProductsRegistrationScreen } from './ProductsRegistrationScreen';
import { BranchesScreen } from './BranchesScreen';
import { TransfersScreen } from './TransfersScreen';

interface RegistrationsDashboardProps {
  franchiseId: string;
  onBack: () => void;
}

export const RegistrationsDashboard = ({ franchiseId, onBack }: RegistrationsDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Fornecedores', value: 3, icon: Building2, color: 'bg-blue-500' },
    { label: 'Clientes', value: 4, icon: Users, color: 'bg-green-500' },
    { label: 'Produtos', value: 4, icon: Package, color: 'bg-purple-500' },
    { label: 'Filiais', value: 4, icon: Store, color: 'bg-orange-500' },
    { label: 'Transferências', value: 3, icon: ArrowRightLeft, color: 'bg-cyan-500' },
  ];

  const recentActivity = [
    { type: 'Cliente', action: 'Criado', name: 'Auto Center Silva', time: '2 horas atrás', origin: 'Manual' },
    { type: 'Produto', action: 'Sincronizado', name: 'Michelin Primacy 4', time: '4 horas atrás', origin: 'API' },
    { type: 'Fornecedor', action: 'Atualizado', name: 'PneusBrasil', time: '1 dia atrás', origin: 'Manual' },
    { type: 'Filial', action: 'Criada', name: 'Filial Campinas', time: '2 dias atrás', origin: 'API' },
    { type: 'Transferência', action: 'Recebida', name: 'TRF-2024-001', time: '3 dias atrás', origin: 'Manual' },
  ];

  return (
    <div className="flex flex-col h-full">
      <ScreenHeader
        title="Cadastros"
        subtitle="Gerencie fornecedores, clientes, produtos e filiais"
        onBack={onBack}
      />

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="suppliers">Fornecedores</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="branches">Filiais</TabsTrigger>
            <TabsTrigger value="transfers">Transferências</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.map((stat) => (
                <Card 
                  key={stat.label} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    const tabMap: Record<string, string> = {
                      'Fornecedores': 'suppliers',
                      'Clientes': 'customers',
                      'Produtos': 'products',
                      'Filiais': 'branches',
                      'Transferências': 'transfers',
                    };
                    setActiveTab(tabMap[stat.label] || 'overview');
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('suppliers')}>
                    <Building2 className="h-5 w-5" />
                    <span className="text-xs">Novo Fornecedor</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('customers')}>
                    <Users className="h-5 w-5" />
                    <span className="text-xs">Novo Cliente</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('products')}>
                    <Package className="h-5 w-5" />
                    <span className="text-xs">Novo Produto</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => setActiveTab('transfers')}>
                    <ArrowRightLeft className="h-5 w-5" />
                    <span className="text-xs">Nova Transferência</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Ação</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Origem</TableHead>
                      <TableHead>Quando</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentActivity.map((activity, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{activity.type}</TableCell>
                        <TableCell>{activity.action}</TableCell>
                        <TableCell>{activity.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={activity.origin === 'API' ? 'text-purple-700 border-purple-300' : ''}>
                            {activity.origin}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{activity.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Status das Integrações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Fornecedores', 'Clientes', 'Produtos', 'Filiais'].map((entity) => (
                    <div key={entity} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{entity}</span>
                        <Badge className="bg-green-100 text-green-800 text-xs">Conectado</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Última sync: 2h atrás</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <SuppliersScreen />
          </TabsContent>

          <TabsContent value="customers">
            <CustomersScreen />
          </TabsContent>

          <TabsContent value="products">
            <ProductsRegistrationScreen />
          </TabsContent>

          <TabsContent value="branches">
            <BranchesScreen />
          </TabsContent>

          <TabsContent value="transfers">
            <TransfersScreen />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
