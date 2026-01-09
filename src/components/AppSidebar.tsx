import { 
  Plus, 
  CreditCard, 
  PackageCheck, 
  Warehouse, 
  ShoppingCart, 
  Truck, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Landmark,
  ClipboardList,
  Settings
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PendingSale } from '@/types/pdv';
import { Permission, ModuleId } from '@/types/access-control';

type Screen = 'dashboard' | 'new-sale' | 'cashier' | 'withdrawals' | 'inventory' | 'orders' | 'loads' | 'repasse' | 'purchases' | 'financial' | 'registrations' | 'admin';

interface AppSidebarProps {
  currentScreen: string;
  pendingSales: PendingSale[];
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  franchiseName?: string;
  operatorName?: string;
  profileName?: string;
  userPermissions?: Permission[];
}

// Mapeamento de screens para moduleIds
const screenToModuleMap: Record<string, ModuleId> = {
  'registrations': 'registrations',
  'new-sale': 'new-sale',
  'cashier': 'cashier',
  'withdrawals': 'withdrawals',
  'inventory': 'inventory',
  'purchases': 'purchases',
  'orders': 'orders',
  'loads': 'loads',
  'financial': 'financial',
  'admin': 'admin',
};

export function AppSidebar({ 
  currentScreen, 
  pendingSales, 
  onNavigate, 
  onLogout,
  franchiseName,
  operatorName,
  profileName,
  userPermissions = []
}: AppSidebarProps) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  const pendingPaymentCount = pendingSales.filter(s => s.status === 'pending_payment').length;
  const readyForPickupCount = pendingSales.filter(s => s.status === 'paid').length;

  // Função para verificar se o usuário pode ver um módulo
  const canViewModule = (moduleId: ModuleId): boolean => {
    // Se não há permissões definidas, mostrar todos (fallback)
    if (userPermissions.length === 0) return true;
    
    const permission = userPermissions.find(p => p.moduleId === moduleId);
    return permission?.actions.includes('view') ?? false;
  };

  // Define module colors for hover states
  const moduleColors: Record<string, { hover: string; active: string }> = {
    registrations: { 
      hover: 'hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300', 
      active: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100' 
    },
    'new-sale': { 
      hover: 'hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400', 
      active: 'bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-300' 
    },
    cashier: { 
      hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-400', 
      active: 'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' 
    },
    withdrawals: { 
      hover: 'hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400', 
      active: 'bg-teal-200 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300' 
    },
    inventory: { 
      hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400', 
      active: 'bg-emerald-200 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300' 
    },
    purchases: { 
      hover: 'hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-400', 
      active: 'bg-violet-200 dark:bg-violet-900/50 text-violet-800 dark:text-violet-300' 
    },
    orders: { 
      hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400', 
      active: 'bg-blue-200 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' 
    },
    loads: { 
      hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:text-orange-700 dark:hover:text-orange-400', 
      active: 'bg-orange-200 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300' 
    },
    financial: { 
      hover: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-400', 
      active: 'bg-indigo-200 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300' 
    },
    admin: { 
      hover: 'hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-700 dark:hover:text-rose-400', 
      active: 'bg-rose-200 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300' 
    },
  };

  const allMenuItems = [
    { 
      id: 'registrations', 
      label: 'Cadastros', 
      icon: ClipboardList, 
      badge: null 
    },
    { 
      id: 'new-sale', 
      label: 'Nova Venda', 
      icon: Plus, 
      badge: null
    },
    { 
      id: 'cashier', 
      label: 'Caixa', 
      icon: CreditCard, 
      badge: pendingPaymentCount > 0 ? pendingPaymentCount : null 
    },
    { 
      id: 'withdrawals', 
      label: 'Retiradas', 
      icon: PackageCheck, 
      badge: readyForPickupCount > 0 ? readyForPickupCount : null 
    },
    { 
      id: 'inventory', 
      label: 'Controle de Estoque', 
      icon: Warehouse, 
      badge: null 
    },
    { 
      id: 'purchases', 
      label: 'Compras', 
      icon: ShoppingBag, 
      badge: null 
    },
    { 
      id: 'orders', 
      label: 'Pedidos', 
      icon: ShoppingCart, 
      badge: null 
    },
    { 
      id: 'loads', 
      label: 'Cargas', 
      icon: Truck, 
      badge: null 
    },
    { 
      id: 'financial', 
      label: 'Financeiro', 
      icon: Landmark, 
      badge: null 
    },
  ];

  // Filtrar itens de menu baseado nas permissões
  const menuItems = allMenuItems.filter(item => {
    const moduleId = screenToModuleMap[item.id];
    return moduleId ? canViewModule(moduleId) : true;
  });

  const adminMenuItems = [
    { 
      id: 'admin', 
      label: 'Administração', 
      icon: Settings, 
      badge: null 
    },
  ];

  // Mostrar admin apenas para quem tem permissão
  const showAdmin = canViewModule('admin');

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-lg">U</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-lg text-primary truncate">UnyPneus®</span>
              {franchiseName && (
                <span className="text-xs text-muted-foreground truncate">{franchiseName}</span>
              )}
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
            {menuItems.map((item) => {
                const isActive = currentScreen === item.id || 
                  (item.id === 'inventory' && ['xml-import', 'movements', 'products'].includes(currentScreen));
                const Icon = item.icon;
                const colors = moduleColors[item.id];

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onNavigate(item.id as Screen)}
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "relative h-11 transition-all duration-200",
                        !isActive && colors?.hover,
                        isActive && colors?.active,
                        isActive && "font-medium"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                      {item.badge && (
                        <span className={cn(
                          "absolute flex items-center justify-center text-xs font-bold rounded-full bg-destructive text-destructive-foreground",
                          isCollapsed ? "top-0 right-0 w-4 h-4" : "right-2 w-5 h-5"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Group - Somente se tiver permissão */}
        {showAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs text-muted-foreground">
              {!isCollapsed && 'Administração'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {adminMenuItems.map((item) => {
                  const isActive = currentScreen === item.id;
                  const Icon = item.icon;
                  const colors = moduleColors[item.id];

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onNavigate(item.id as Screen)}
                        isActive={isActive}
                        tooltip={item.label}
                        className={cn(
                          "relative h-11 transition-all duration-200",
                          !isActive && colors?.hover,
                          isActive && colors?.active,
                          isActive && "font-medium"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarSeparator className="mb-2" />
        
        {!isCollapsed && operatorName && (
          <div className="px-2 py-2 mb-2">
            <p className="text-sm font-medium text-foreground truncate">{operatorName}</p>
            {profileName && (
              <Badge variant="outline" className="text-xs mt-1">{profileName}</Badge>
            )}
          </div>
        )}

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              tooltip="Sair"
              className="h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>Sair</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={isCollapsed ? "Expandir" : "Recolher"}
              className="h-10 text-muted-foreground"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5 flex-shrink-0" />
                  <span>Recolher</span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
