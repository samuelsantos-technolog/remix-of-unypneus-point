import { useState } from 'react';
import { LoginScreen } from '@/components/pdv/LoginScreen';
import { Dashboard } from '@/components/pdv/Dashboard';
import { SalesScreen } from '@/components/pdv/SalesScreen';
import { CashierScreen } from '@/components/pdv/CashierScreen';
import { WithdrawalsScreen } from '@/components/pdv/WithdrawalsScreen';
import { RepasseScreen } from '@/components/pdv/RepasseScreen';
import { InventoryDashboard } from '@/components/inventory/InventoryDashboard';
import { XMLImportScreen } from '@/components/inventory/XMLImportScreen';
import { StockMovementsScreen } from '@/components/inventory/StockMovementsScreen';
import { ProductsListScreen } from '@/components/inventory/ProductsListScreen';
import { StockAdjustmentModal } from '@/components/inventory/StockAdjustmentModal';
import { OrdersScreen } from '@/components/orders/OrdersScreen';
import { LoadsScreen } from '@/components/loads/LoadsScreen';
import { PurchasesScreen } from '@/components/purchases/PurchasesScreen';
import { FinancialDashboard } from '@/components/financial/FinancialDashboard';
import { RegistrationsDashboard } from '@/components/registrations/RegistrationsDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AppSidebar } from '@/components/AppSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { Franchise, Operator, Sale, PendingSale } from '@/types/pdv';
import { SystemUser, Profile, ModuleId } from '@/types/access-control';
import { addAuditLog } from '@/data/accessControlMockData';
import { toast } from 'sonner';

type Screen = 'login' | 'dashboard' | 'new-sale' | 'cashier' | 'withdrawals' | 'inventory' | 'xml-import' | 'movements' | 'products' | 'orders' | 'loads' | 'repasse' | 'purchases' | 'financial' | 'registrations' | 'admin';

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

const Index = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const [franchise, setFranchise] = useState<Franchise | null>(null);
  const [currentUser, setCurrentUser] = useState<SystemUser | null>(null);
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [pendingSales, setPendingSales] = useState<PendingSale[]>([]);
  const [adjustProductId, setAdjustProductId] = useState<string | null>(null);

  // Criar um operador compatível com os componentes existentes
  const operator: Operator | null = currentUser ? {
    id: currentUser.id,
    name: currentUser.name,
    cpf: currentUser.cpf,
    password: currentUser.password,
    franchiseId: currentUser.franchiseId ?? '1',
  } : null;

  // Função para verificar se o usuário pode acessar um módulo
  const canAccessModule = (moduleId: ModuleId): boolean => {
    if (!currentProfile) return false;
    const permission = currentProfile.permissions.find(p => p.moduleId === moduleId);
    return permission?.actions.includes('view') ?? false;
  };

  const handleLogin = (user: SystemUser, profile: Profile, f: Franchise) => {
    setCurrentUser(user);
    setCurrentProfile(profile);
    setFranchise(f);
    setScreen('dashboard');
  };

  const handleLogout = () => {
    if (currentUser) {
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'logout',
        description: 'Logout realizado',
      });
    }
    setFranchise(null);
    setCurrentUser(null);
    setCurrentProfile(null);
    setSales([]);
    setPendingSales([]);
    setScreen('login');
  };

  const handleSendToCashier = (pendingSale: PendingSale) => {
    setPendingSales([pendingSale, ...pendingSales]);
  };

  const handlePaymentComplete = (sale: Sale, pendingSaleId: string) => {
    setSales([sale, ...sales]);
    setPendingSales(pendingSales.map(ps => 
      ps.id === pendingSaleId ? { ...ps, status: 'paid' as const, updatedAt: new Date() } : ps
    ));
  };

  const handleCancelSale = (pendingSaleId: string) => {
    setPendingSales(pendingSales.map(ps => 
      ps.id === pendingSaleId ? { ...ps, status: 'cancelled' as const, updatedAt: new Date() } : ps
    ));
  };

  const handleConfirmWithdrawal = (pendingSaleId: string) => {
    setPendingSales(pendingSales.map(ps => 
      ps.id === pendingSaleId ? { ...ps, status: 'completed' as const, updatedAt: new Date() } : ps
    ));
  };

  const handleInventoryNavigate = (inventoryScreen: string) => {
    if (inventoryScreen === 'xml-import') setScreen('xml-import');
    else if (inventoryScreen === 'movements') setScreen('movements');
    else if (inventoryScreen === 'products') setScreen('products');
  };

  const handleNavigate = (targetScreen: Screen) => {
    // Verificar permissão antes de navegar
    const moduleId = screenToModuleMap[targetScreen];
    if (moduleId && !canAccessModule(moduleId)) {
      toast.error('Você não tem permissão para acessar este módulo');
      return;
    }
    setScreen(targetScreen);
  };

  // Get paid sales for withdrawals screen
  const paidSalesForWithdrawal = pendingSales
    .filter(ps => ps.status === 'paid')
    .map(ps => ({
      pendingSale: ps,
      sale: sales.find(s => s.pendingSaleId === ps.id)!
    }))
    .filter(item => item.sale);

  if (screen === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!franchise || !operator || !currentUser || !currentProfile) return null;

  const renderContent = () => {
    switch (screen) {
      case 'new-sale':
        return (
          <SalesScreen
            franchise={franchise}
            operator={operator}
            onBack={() => setScreen('dashboard')}
            onSendToCashier={handleSendToCashier}
          />
        );
      case 'cashier':
        return (
          <CashierScreen
            franchise={franchise}
            operator={operator}
            pendingSales={pendingSales}
            onBack={() => setScreen('dashboard')}
            onPaymentComplete={handlePaymentComplete}
            onCancelSale={handleCancelSale}
          />
        );
      case 'withdrawals':
        return (
          <WithdrawalsScreen
            franchise={franchise}
            operator={operator}
            paidSales={paidSalesForWithdrawal}
            onBack={() => setScreen('dashboard')}
            onConfirmWithdrawal={handleConfirmWithdrawal}
          />
        );
      case 'repasse':
        return (
          <RepasseScreen
            franchise={franchise}
            operator={operator}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'inventory':
        return (
          <InventoryDashboard
            franchise={franchise}
            operator={operator}
            onBack={() => setScreen('dashboard')}
            onNavigate={handleInventoryNavigate}
          />
        );
      case 'xml-import':
        return (
          <XMLImportScreen
            franchise={franchise}
            operator={operator}
            onBack={() => setScreen('inventory')}
            onImportComplete={() => setScreen('inventory')}
          />
        );
      case 'movements':
        return (
          <StockMovementsScreen
            franchise={franchise}
            operator={operator}
            onBack={() => setScreen('inventory')}
          />
        );
      case 'products':
        return (
          <>
            <ProductsListScreen
              franchise={franchise}
              operator={operator}
              onBack={() => setScreen('inventory')}
              onAdjustStock={(productId) => setAdjustProductId(productId)}
            />
            {adjustProductId && (
              <StockAdjustmentModal
                productId={adjustProductId}
                franchiseId={franchise.id}
                operator={operator}
                onClose={() => setAdjustProductId(null)}
                onConfirm={() => setAdjustProductId(null)}
              />
            )}
          </>
        );
      case 'orders':
        return (
          <OrdersScreen
            franchiseId={franchise.id}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'loads':
        return (
          <LoadsScreen
            franchiseId={franchise.id}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'purchases':
        return (
          <PurchasesScreen
            franchiseId={franchise.id}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'financial':
        return (
          <FinancialDashboard
            franchiseId={franchise.id}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'registrations':
        return (
          <RegistrationsDashboard
            franchiseId={franchise.id}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'admin':
        return (
          <AdminDashboard
            currentUserId={currentUser.id}
            onBack={() => setScreen('dashboard')}
          />
        );
      default:
        return (
          <Dashboard
            franchise={franchise}
            operator={operator}
            sales={sales}
            pendingSales={pendingSales}
          />
        );
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-muted/30">
        <AppSidebar
          currentScreen={screen}
          pendingSales={pendingSales}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          franchiseName={franchise.name}
          operatorName={currentUser.name}
          profileName={currentProfile.name}
          userPermissions={currentProfile.permissions}
        />
        <SidebarInset className="flex-1 flex flex-col w-full overflow-hidden">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
            <SidebarTrigger />
            <span className="font-semibold text-primary">UnyPneus®</span>
          </header>
          <main className="flex-1 flex flex-col w-full">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
