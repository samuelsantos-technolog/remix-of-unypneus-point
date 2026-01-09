import { Franchise, Operator } from '@/types/pdv';
import { products, stockItems, getLowStockItems, stockMovements, xmlImports } from '@/data/inventoryMockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { 
  Upload, 
  List, 
  Package, 
  Settings, 
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  FileText
} from 'lucide-react';
import { ScreenHeader } from '@/components/ui/screen-header';

interface InventoryDashboardProps {
  franchise: Franchise;
  operator: Operator;
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export const InventoryDashboard = ({ franchise, operator, onBack, onNavigate }: InventoryDashboardProps) => {
  const lowStockItems = getLowStockItems(franchise.id);
  const totalStock = stockItems.reduce((sum, s) => sum + s.quantity, 0);
  const recentMovements = stockMovements.slice(0, 5);
  const recentImports = xmlImports.slice(0, 3);

  return (
    <div className="flex-1 bg-muted/30 flex flex-col">
      <ScreenHeader 
        title="Controle de Estoque" 
        subtitle={franchise.name}
        onBack={onBack}
      />

      <main className="flex-1 px-6 py-8 w-full">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => onNavigate('xml-import')}
            className="bg-white rounded-2xl shadow-pdv p-6 hover:shadow-pdv-hover transition-shadow text-left"
          >
            <div className="p-3 bg-green-100 rounded-xl w-fit mb-3">
              <Upload className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-pdv-gray-dark">Importar XML</h3>
            <p className="text-sm text-pdv-gray">Entrada via NF-e</p>
          </button>

          <button
            onClick={() => onNavigate('movements')}
            className="bg-white rounded-2xl shadow-pdv p-6 hover:shadow-pdv-hover transition-shadow text-left"
          >
            <div className="p-3 bg-blue-100 rounded-xl w-fit mb-3">
              <List className="text-pdv-blue" size={24} />
            </div>
            <h3 className="font-semibold text-pdv-gray-dark">Movimentações</h3>
            <p className="text-sm text-pdv-gray">Entradas e saídas</p>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="bg-white rounded-2xl shadow-pdv p-6 hover:shadow-pdv-hover transition-shadow text-left"
          >
            <div className="p-3 bg-purple-100 rounded-xl w-fit mb-3">
              <Package className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-pdv-gray-dark">Produtos</h3>
            <p className="text-sm text-pdv-gray">Estoque atual</p>
          </button>

          <button
            onClick={() => onNavigate('products')}
            className="bg-white rounded-2xl shadow-pdv p-6 hover:shadow-pdv-hover transition-shadow text-left"
          >
            <div className="p-3 bg-amber-100 rounded-xl w-fit mb-3">
              <Settings className="text-amber-600" size={24} />
            </div>
            <h3 className="font-semibold text-pdv-gray-dark">Ajustes</h3>
            <p className="text-sm text-pdv-gray">Correções manuais</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Column */}
          <div className="space-y-6">
            {/* Stock Stats */}
            <div className="bg-white rounded-2xl shadow-pdv p-6">
              <h3 className="font-semibold text-pdv-gray-dark mb-4">Resumo do Estoque</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-pdv-gray">Total de Produtos</span>
                  <span className="font-bold text-pdv-gray-dark">{products.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pdv-gray">Unidades em Estoque</span>
                  <span className="font-bold text-pdv-gray-dark">{totalStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pdv-gray">Valor Estimado</span>
                  <span className="font-bold text-pdv-blue">
                    {formatCurrency(products.reduce((sum, p) => {
                      const stock = stockItems.find(s => s.productId === p.id);
                      return sum + (p.price * (stock?.quantity || 0));
                    }, 0))}
                  </span>
                </div>
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="text-amber-600" size={20} />
                  <h3 className="font-semibold text-amber-800">Estoque Baixo</h3>
                </div>
                <p className="text-sm text-amber-700 mb-3">
                  {lowStockItems.length} produto(s) abaixo do mínimo
                </p>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-sm text-amber-800 font-medium hover:underline"
                >
                  Ver produtos →
                </button>
              </div>
            )}
          </div>

          {/* Recent Movements */}
          <div className="bg-white rounded-2xl shadow-pdv overflow-hidden">
            <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between">
              <h3 className="font-semibold text-pdv-gray-dark">Últimas Movimentações</h3>
              <button
                onClick={() => onNavigate('movements')}
                className="text-sm text-pdv-blue hover:underline"
              >
                Ver todas
              </button>
            </div>
            <div className="divide-y divide-pdv-border">
              {recentMovements.map(mov => (
                <div key={mov.id} className="px-6 py-3 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    mov.type === 'entry' ? 'bg-green-100' :
                    mov.type === 'sale' ? 'bg-blue-100' :
                    mov.type === 'exit' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    {mov.type === 'entry' ? <ArrowDownCircle className="text-green-600" size={16} /> :
                     mov.type === 'sale' ? <Package className="text-blue-600" size={16} /> :
                     <ArrowUpCircle className="text-red-600" size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-pdv-gray-dark truncate">{mov.id}</p>
                    <p className="text-xs text-pdv-gray">{formatDate(mov.createdAt)}</p>
                  </div>
                  <span className={`text-sm font-medium ${mov.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Imports */}
          <div className="bg-white rounded-2xl shadow-pdv overflow-hidden">
            <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between">
              <h3 className="font-semibold text-pdv-gray-dark">Últimas Importações</h3>
              <button
                onClick={() => onNavigate('xml-import')}
                className="text-sm text-pdv-blue hover:underline"
              >
                Nova importação
              </button>
            </div>
            <div className="divide-y divide-pdv-border">
              {recentImports.map(imp => (
                <div key={imp.id} className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pdv-gray-light rounded-lg">
                      <FileText className="text-pdv-gray" size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-pdv-gray-dark">NF-e {imp.nfeNumber}</p>
                      <p className="text-xs text-pdv-gray">{imp.supplierName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-pdv-blue">{formatCurrency(imp.totalValue)}</p>
                      <p className="text-xs text-pdv-gray">{imp.itemsCount} itens</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
