import { useState } from 'react';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Shield, 
  Users,
  Save,
  X
} from 'lucide-react';
import { Profile, Permission, ModuleId, ActionType } from '@/types/access-control';
import { systemProfiles, systemModules, availableActions, addAuditLog } from '@/data/accessControlMockData';

interface ProfilesScreenProps {
  currentUserId: string;
  onBack: () => void;
}

export const ProfilesScreen = ({ currentUserId, onBack }: ProfilesScreenProps) => {
  const [profiles, setProfiles] = useState<Profile[]>(systemProfiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editedPermissions, setEditedPermissions] = useState<Permission[]>([]);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDescription, setNewProfileDescription] = useState('');

  // Módulos principais (sem parent)
  const mainModules = systemModules.filter(m => !m.parentId);

  const handleSelectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setEditedPermissions([...profile.permissions]);
    setIsEditing(false);
  };

  const handleToggleAction = (moduleId: ModuleId, action: ActionType) => {
    setEditedPermissions(prev => {
      const existingPermission = prev.find(p => p.moduleId === moduleId);
      
      if (existingPermission) {
        const hasAction = existingPermission.actions.includes(action);
        if (hasAction) {
          // Remove action
          const newActions = existingPermission.actions.filter(a => a !== action);
          if (newActions.length === 0) {
            return prev.filter(p => p.moduleId !== moduleId);
          }
          return prev.map(p => 
            p.moduleId === moduleId 
              ? { ...p, actions: newActions }
              : p
          );
        } else {
          // Add action
          return prev.map(p => 
            p.moduleId === moduleId 
              ? { ...p, actions: [...p.actions, action] }
              : p
          );
        }
      } else {
        // Create new permission
        return [...prev, { moduleId, actions: [action] }];
      }
    });
  };

  const hasAction = (moduleId: ModuleId, action: ActionType): boolean => {
    const permission = editedPermissions.find(p => p.moduleId === moduleId);
    return permission?.actions.includes(action) ?? false;
  };

  const handleSavePermissions = () => {
    if (!selectedProfile) return;

    setProfiles(prev => prev.map(p => 
      p.id === selectedProfile.id 
        ? { ...p, permissions: editedPermissions, updatedAt: new Date() }
        : p
    ));

    addAuditLog({
      userId: currentUserId,
      userName: 'Administrador',
      action: 'permission_change',
      description: `Permissões do perfil "${selectedProfile.name}" alteradas`,
    });

    toast.success('Permissões salvas com sucesso!');
    setIsEditing(false);
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      toast.error('Nome do perfil é obrigatório');
      return;
    }

    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name: newProfileName,
      description: newProfileDescription,
      isSystem: false,
      permissions: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProfiles(prev => [...prev, newProfile]);
    
    addAuditLog({
      userId: currentUserId,
      userName: 'Administrador',
      action: 'profile_create',
      description: `Perfil "${newProfileName}" criado`,
    });

    toast.success('Perfil criado com sucesso!');
    setIsCreating(false);
    setNewProfileName('');
    setNewProfileDescription('');
    handleSelectProfile(newProfile);
  };

  const handleDeleteProfile = (profile: Profile) => {
    if (profile.isSystem) {
      toast.error('Perfis do sistema não podem ser excluídos');
      return;
    }

    setProfiles(prev => prev.filter(p => p.id !== profile.id));
    
    addAuditLog({
      userId: currentUserId,
      userName: 'Administrador',
      action: 'profile_delete',
      description: `Perfil "${profile.name}" excluído`,
    });

    if (selectedProfile?.id === profile.id) {
      setSelectedProfile(null);
    }

    toast.success('Perfil excluído com sucesso!');
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <ScreenHeader
        title="Perfis e Permissões"
        subtitle="Gerencie os perfis de acesso e suas permissões"
        onBack={onBack}
      />

      <div className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Lista de Perfis */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Perfis
                </CardTitle>
                <Button size="sm" onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Novo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-320px)]">
                <div className="space-y-1 p-4 pt-0">
                  {profiles.map(profile => (
                    <div
                      key={profile.id}
                      onClick={() => handleSelectProfile(profile)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedProfile?.id === profile.id
                          ? 'bg-primary/10 border border-primary'
                          : 'hover:bg-muted border border-transparent'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{profile.name}</span>
                            {profile.isSystem && (
                              <Badge variant="secondary" className="text-xs">Sistema</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {profile.description}
                          </p>
                        </div>
                        {!profile.isSystem && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProfile(profile);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Editor de Permissões */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {selectedProfile 
                    ? `Permissões: ${selectedProfile.name}`
                    : 'Selecione um perfil'
                  }
                </CardTitle>
                {selectedProfile && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditedPermissions([...selectedProfile.permissions]);
                          setIsEditing(false);
                        }}>
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                        <Button size="sm" onClick={handleSavePermissions}>
                          <Save className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => setIsEditing(true)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedProfile ? (
                <ScrollArea className="h-[calc(100vh-320px)]">
                  <Accordion type="multiple" className="w-full" defaultValue={mainModules.map(m => m.id)}>
                    {mainModules.map(module => {
                      const subModules = systemModules.filter(m => m.parentId === module.id);
                      const modulesToShow = subModules.length > 0 ? subModules : [module];

                      return (
                        <AccordionItem key={module.id} value={module.id}>
                          <AccordionTrigger className="text-base font-medium">
                            {module.name}
                          </AccordionTrigger>
                          <AccordionContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[200px]">Módulo</TableHead>
                                  {availableActions.map(action => (
                                    <TableHead key={action.id} className="text-center w-[100px]">
                                      {action.label}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {modulesToShow.map(mod => (
                                  <TableRow key={mod.id}>
                                    <TableCell className="font-medium">
                                      {mod.parentId ? mod.name : mod.name}
                                    </TableCell>
                                    {availableActions.map(action => (
                                      <TableCell key={action.id} className="text-center">
                                        <Checkbox
                                          checked={hasAction(mod.id, action.id)}
                                          disabled={!isEditing}
                                          onCheckedChange={() => handleToggleAction(mod.id, action.id)}
                                        />
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </ScrollArea>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecione um perfil para visualizar e editar suas permissões</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Novo Perfil */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Nome do Perfil</Label>
              <Input
                id="profile-name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Ex: Supervisor de Vendas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-description">Descrição</Label>
              <Textarea
                id="profile-description"
                value={newProfileDescription}
                onChange={(e) => setNewProfileDescription(e.target.value)}
                placeholder="Descreva as responsabilidades deste perfil"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateProfile}>
              Criar Perfil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
