import { useState } from 'react';
import { Franchise, Operator } from '@/types/pdv';
import { products, stockItems, getStockForProduct, getLowStockItems } from '@/data/inventoryMockData';
import { formatCurrency } from '@/utils/formatters';
import { ArrowLeft, Search, Filter, AlertTriangle, Package, TrendingDown } from 'lucide-react';

interface ProductsListScreenProps {
  franchise: Franchise;
  operator: Operator;
  onBack: () => void;
  onAdjustStock: (productId: string) => void;
}

export const ProductsListScreen = ({ franchise, operator, onBack, onAdjustStock }: ProductsListScreenProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  const categories = [...new Set(products.map(p => p.category))];
  const lowStockItems = getLowStockItems(franchise.id);

  const filteredProducts = products.filter(product => {
    const stock = getStockForProduct(product.id, franchise.id);
    const matchesSearch = product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesLowStock = !showLowStockOnly || (stock && stock.quantity < stock.minStock);
    return matchesSearch && matchesCategory && matchesLowStock;
  });

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
            <h1 className="text-xl font-bold text-pdv-blue">Estoque de Produtos</h1>
            <p className="text-sm text-pdv-gray">{franchise.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="font-semibold text-amber-800">Atenção: Estoque Baixo</h3>
              <p className="text-amber-700 text-sm">
                {lowStockItems.length} produto(s) estão abaixo do estoque mínimo.
              </p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-pdv p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="text-pdv-blue" size={24} />
            </div>
            <div>
              <p className="text-sm text-pdv-gray">Total de Produtos</p>
              <p className="text-2xl font-bold text-pdv-gray-dark">{products.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-pdv p-4 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Package className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-pdv-gray">Unidades em Estoque</p>
              <p className="text-2xl font-bold text-pdv-gray-dark">
                {stockItems.reduce((sum, s) => sum + s.quantity, 0)}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-pdv p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <TrendingDown className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-pdv-gray">Estoque Baixo</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockItems.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-pdv p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pdv-gray" size={20} />
              <input
                type="text"
                placeholder="Buscar por código, descrição ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-pdv-border rounded-xl focus:outline-none focus:border-pdv-blue"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-pdv-gray" size={20} />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-pdv-border rounded-xl focus:outline-none focus:border-pdv-blue"
                >
                  <option value="all">Todas categorias</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLowStockOnly}
                  onChange={(e) => setShowLowStockOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-pdv-border text-pdv-blue focus:ring-pdv-blue"
                />
                <span className="text-sm text-pdv-gray-dark">Apenas estoque baixo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => {
            const stock = getStockForProduct(product.id, franchise.id);
            const isLowStock = stock && stock.quantity < stock.minStock;
            
            return (
              <div 
                key={product.id} 
                className={`bg-white rounded-2xl shadow-pdv p-5 ${isLowStock ? 'ring-2 ring-amber-400' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-pdv-gray">{product.code}</p>
                    <h3 className="font-semibold text-pdv-gray-dark">{product.brand} {product.model}</h3>
                    <p className="text-sm text-pdv-gray">{product.size}</p>
                  </div>
                  {isLowStock && (
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium flex items-center gap-1">
                      <AlertTriangle size={12} />
                      Baixo
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 py-3 border-y border-pdv-border">
                  <div>
                    <p className="text-xs text-pdv-gray">NCM</p>
                    <p className="text-sm text-pdv-gray-dark">{product.ncm}</p>
                  </div>
                  <div>
                    <p className="text-xs text-pdv-gray">Categoria</p>
                    <p className="text-sm text-pdv-gray-dark">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-pdv-gray">Preço Venda</p>
                    <p className="text-sm font-medium text-pdv-blue">{formatCurrency(product.price)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-pdv-gray">Custo</p>
                    <p className="text-sm text-pdv-gray-dark">{formatCurrency(product.cost)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-pdv-gray">Estoque Atual</p>
                    <p className={`text-2xl font-bold ${isLowStock ? 'text-amber-600' : 'text-pdv-gray-dark'}`}>
                      {stock?.quantity || 0}
                    </p>
                    <p className="text-xs text-pdv-gray">Mínimo: {stock?.minStock || 0}</p>
                  </div>
                  <button
                    onClick={() => onAdjustStock(product.id)}
                    className="px-4 py-2 text-sm bg-pdv-gray-light text-pdv-gray-dark rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ajustar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-2xl shadow-pdv p-12 text-center">
            <Package className="text-pdv-gray mx-auto mb-4" size={48} />
            <p className="text-pdv-gray">Nenhum produto encontrado.</p>
          </div>
        )}
      </main>
    </div>
  );
};
