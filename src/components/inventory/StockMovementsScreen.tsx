import { useState } from 'react';
import { Franchise, Operator } from '@/types/pdv';
import { StockMovement, MovementType } from '@/types/inventory';
import { stockMovements, getProductById } from '@/data/inventoryMockData';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { ArrowLeft, ArrowDownCircle, ArrowUpCircle, RefreshCw, ShoppingCart, Filter, Search } from 'lucide-react';

interface StockMovementsScreenProps {
  franchise: Franchise;
  operator: Operator;
  onBack: () => void;
}

const movementTypeConfig: Record<MovementType, { label: string; icon: React.ReactNode; color: string }> = {
  entry: { label: 'Entrada', icon: <ArrowDownCircle size={16} />, color: 'text-green-600 bg-green-100' },
  exit: { label: 'Saída', icon: <ArrowUpCircle size={16} />, color: 'text-red-600 bg-red-100' },
  adjustment: { label: 'Ajuste', icon: <RefreshCw size={16} />, color: 'text-amber-600 bg-amber-100' },
  sale: { label: 'Venda', icon: <ShoppingCart size={16} />, color: 'text-blue-600 bg-blue-100' },
};

export const StockMovementsScreen = ({ franchise, operator, onBack }: StockMovementsScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<MovementType | 'all'>('all');

  const filteredMovements = stockMovements.filter(movement => {
    const product = getProductById(movement.productId);
    const matchesSearch = product?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || movement.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="min-h-screen bg-pdv-gray-light">
      {/* Header */}
      <header className="bg-white shadow-pdv-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-pdv-gray-light rounded-lg transition-colors"
          >
            <ArrowLeft className="text-pdv-gray-dark" size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-pdv-blue">Movimentações de Estoque</h1>
            <p className="text-sm text-pdv-gray">{franchise.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-pdv p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pdv-gray" size={20} />
              <input
                type="text"
                placeholder="Buscar por produto ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-pdv-border rounded-xl focus:outline-none focus:border-pdv-blue"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-pdv-gray" size={20} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as MovementType | 'all')}
                className="px-4 py-3 border border-pdv-border rounded-xl focus:outline-none focus:border-pdv-blue"
              >
                <option value="all">Todos os tipos</option>
                <option value="entry">Entradas</option>
                <option value="exit">Saídas</option>
                <option value="adjustment">Ajustes</option>
                <option value="sale">Vendas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Movements List */}
        <div className="bg-white rounded-2xl shadow-pdv overflow-hidden">
          <div className="px-6 py-4 border-b border-pdv-border">
            <h2 className="text-lg font-semibold text-pdv-gray-dark">
              Histórico de Movimentações ({filteredMovements.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-pdv-gray-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Produto</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-pdv-gray uppercase">Quantidade</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-pdv-gray uppercase">Estoque Anterior</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-pdv-gray uppercase">Estoque Novo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Motivo/Ref.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pdv-border">
                {filteredMovements.map((movement) => {
                  const product = getProductById(movement.productId);
                  const config = movementTypeConfig[movement.type];
                  return (
                    <tr key={movement.id} className="hover:bg-pdv-gray-light/50">
                      <td className="px-6 py-4 text-sm font-medium text-pdv-blue">{movement.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                          {config.icon}
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-pdv-gray-dark">{product?.description || '-'}</td>
                      <td className="px-6 py-4 text-sm font-medium text-right">
                        <span className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-pdv-gray text-center">{movement.previousQuantity}</td>
                      <td className="px-6 py-4 text-sm text-pdv-gray-dark text-center font-medium">{movement.newQuantity}</td>
                      <td className="px-6 py-4 text-sm text-pdv-gray max-w-[200px] truncate">
                        {movement.reason || movement.referenceId || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-pdv-gray-dark">{movement.userName}</td>
                      <td className="px-6 py-4 text-sm text-pdv-gray">{formatDate(movement.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredMovements.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-pdv-gray">Nenhuma movimentação encontrada.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
