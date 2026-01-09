import { useState } from 'react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  FileText, 
  Settings,
  ChevronRight,
  UserCheck,
  Lock
} from 'lucide-react';
import { ProfilesScreen } from './ProfilesScreen';
import { UsersScreen } from './UsersScreen';
import { AuditLogsScreen } from './AuditLogsScreen';
import { systemProfiles, systemUsers, auditLogs } from '@/data/accessControlMockData';

type AdminScreen = 'dashboard' | 'profiles' | 'users' | 'logs';

interface AdminDashboardProps {
  currentUserId: string;
  onBack: () => void;
}

export const AdminDashboard = ({ currentUserId, onBack }: AdminDashboardProps) => {
  const [currentScreen, setCurrentScreen] = useState<AdminScreen>('dashboard');

  const activeUsersCount = systemUsers.filter(u => u.active).length;
  const recentLogsCount = auditLogs.filter(l => 
    l.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  if (currentScreen === 'profiles') {
    return (
      <ProfilesScreen 
        currentUserId={currentUserId} 
        onBack={() => setCurrentScreen('dashboard')} 
      />
    );
  }

  if (currentScreen === 'users') {
    return (
      <UsersScreen 
        currentUserId={currentUserId} 
        onBack={() => setCurrentScreen('dashboard')} 
      />
    );
  }

  if (currentScreen === 'logs') {
    return (
      <AuditLogsScreen 
        onBack={() => setCurrentScreen('dashboard')} 
      />
    );
  }

  const menuItems = [
    {
      id: 'profiles',
      title: 'Perfis e Permissões',
      description: 'Gerencie os perfis de acesso e defina permissões por módulo',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600',
      stats: `${systemProfiles.length} perfis`,
    },
    {
      id: 'users',
      title: 'Gestão de Usuários',
      description: 'Cadastre e gerencie os usuários do sistema',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      stats: `${activeUsersCount} ativos`,
    },
    {
      id: 'logs',
      title: 'Logs de Auditoria',
      description: 'Visualize o histórico de ações críticas no sistema',
      icon: FileText,
      color: 'bg-amber-100 text-amber-600',
      stats: `${recentLogsCount} hoje`,
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScreenHeader
        title="Administração"
        subtitle="Controle de acesso e configurações do sistema"
        onBack={onBack}
      />

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-100">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{systemProfiles.length}</p>
                <p className="text-sm text-muted-foreground">Perfis de Acesso</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <UserCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeUsersCount}</p>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-100">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
                <p className="text-sm text-muted-foreground">Registros de Auditoria</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu de navegação */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <Card 
              key={item.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setCurrentScreen(item.id as AdminScreen)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">{item.stats}</Badge>
                </div>
                <CardTitle className="text-lg mt-3">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="ghost" className="w-full justify-between group">
                  Acessar
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
