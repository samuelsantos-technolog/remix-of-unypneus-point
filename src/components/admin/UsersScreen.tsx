import { useState } from 'react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatCPF } from '@/utils/formatters';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  MoreHorizontal,
  Search,
  UserCheck,
  UserX,
  Key
} from 'lucide-react';
import { SystemUser } from '@/types/access-control';
import { systemUsers, systemProfiles, addAuditLog } from '@/data/accessControlMockData';
import { franchises } from '@/data/mockData';

interface UsersScreenProps {
  currentUserId: string;
  onBack: () => void;
}

export const UsersScreen = ({ currentUserId, onBack }: UsersScreenProps) => {
  const [users, setUsers] = useState<SystemUser[]>(systemUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    password: '',
    profileId: '',
    franchiseId: '',
    active: true,
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm)
  );

  const getProfileName = (profileId: string) => {
    return systemProfiles.find(p => p.id === profileId)?.name ?? 'Desconhecido';
  };

  const getFranchiseName = (franchiseId: string | null) => {
    if (!franchiseId) return 'Todas';
    return franchises.find(f => f.id === franchiseId)?.name ?? 'Desconhecida';
  };

  const handleOpenModal = (user?: SystemUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        password: '',
        profileId: user.profileId,
        franchiseId: user.franchiseId ?? '',
        active: user.active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        cpf: '',
        password: '1234',
        profileId: '',
        franchiseId: '',
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      cpf: '',
      password: '',
      profileId: '',
      franchiseId: '',
      active: true,
    });
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }));
  };

  const handleSaveUser = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.cpf.trim() || !formData.profileId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (editingUser) {
      // Atualizar usuário existente
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              cpf: formData.cpf,
              password: formData.password || u.password,
              profileId: formData.profileId,
              franchiseId: formData.franchiseId || null,
              active: formData.active,
              updatedAt: new Date(),
            }
          : u
      ));

      addAuditLog({
        userId: currentUserId,
        userName: 'Administrador',
        action: 'user_update',
        description: `Usuário "${formData.name}" atualizado`,
      });

      toast.success('Usuário atualizado com sucesso!');
    } else {
      // Criar novo usuário
      const newUser: SystemUser = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        password: formData.password || '1234',
        profileId: formData.profileId,
        franchiseId: formData.franchiseId || null,
        active: formData.active,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUsers(prev => [...prev, newUser]);

      addAuditLog({
        userId: currentUserId,
        userName: 'Administrador',
        action: 'user_create',
        description: `Usuário "${formData.name}" criado`,
        details: { profile: getProfileName(formData.profileId) },
      });

      toast.success('Usuário criado com sucesso!');
    }

    handleCloseModal();
  };

  const handleToggleActive = (user: SystemUser) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, active: !u.active, updatedAt: new Date() }
        : u
    ));

    addAuditLog({
      userId: currentUserId,
      userName: 'Administrador',
      action: 'user_update',
      description: `Usuário "${user.name}" ${user.active ? 'desativado' : 'ativado'}`,
    });

    toast.success(`Usuário ${user.active ? 'desativado' : 'ativado'} com sucesso!`);
  };

  const handleDeleteUser = (user: SystemUser) => {
    if (user.id === currentUserId) {
      toast.error('Você não pode excluir seu próprio usuário');
      return;
    }

    setUsers(prev => prev.filter(u => u.id !== user.id));

    addAuditLog({
      userId: currentUserId,
      userName: 'Administrador',
      action: 'user_delete',
      description: `Usuário "${user.name}" excluído`,
    });

    toast.success('Usuário excluído com sucesso!');
  };

  const handleResetPassword = (user: SystemUser) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, password: '1234', updatedAt: new Date() }
        : u
    ));

    toast.success(`Senha do usuário "${user.name}" redefinida para 1234`);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScreenHeader
        title="Gestão de Usuários"
        subtitle="Cadastre e gerencie os usuários do sistema"
        onBack={onBack}
      />

      <div className="flex-1 p-4 md:p-6 overflow-auto">
        <Card>
          <CardContent className="p-4">
            {/* Header com busca e botão novo */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => handleOpenModal()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </div>

            {/* Tabela de usuários */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Filial</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.cpf}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getProfileName(user.profileId)}</Badge>
                        </TableCell>
                        <TableCell>{getFranchiseName(user.franchiseId)}</TableCell>
                        <TableCell>
                          {user.active ? (
                            <Badge variant="default" className="bg-green-500">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <UserX className="h-3 w-3 mr-1" />
                              Inativo
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleOpenModal(user)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                                {user.active ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-2" />
                                    Desativar
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Ativar
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                <Key className="h-4 w-4 mr-2" />
                                Redefinir Senha
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user)}
                                className="text-destructive"
                                disabled={user.id === currentUserId}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Usuário */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">Nome *</Label>
              <Input
                id="user-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email">Email *</Label>
              <Input
                id="user-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-cpf">CPF *</Label>
              <Input
                id="user-cpf"
                value={formData.cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-password">
                {editingUser ? 'Nova Senha (deixe vazio para manter)' : 'Senha *'}
              </Label>
              <Input
                id="user-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder={editingUser ? '••••' : 'Senha inicial'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-profile">Perfil *</Label>
              <Select 
                value={formData.profileId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, profileId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  {systemProfiles.map(profile => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-franchise">Filial</Label>
              <Select 
                value={formData.franchiseId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, franchiseId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as filiais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as filiais</SelectItem>
                  {franchises.map(franchise => (
                    <SelectItem key={franchise.id} value={franchise.id}>
                      {franchise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="user-active">Usuário ativo</Label>
              <Switch
                id="user-active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button onClick={handleSaveUser}>
              {editingUser ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
