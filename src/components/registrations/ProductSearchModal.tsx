import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Package, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/formatters';

interface ProductSearchModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (product: ExternalProduct) => void;
}

export interface ExternalProduct {
  code: string;
  barcode?: string;
  description: string;
  brand: string;
  model: string;
  size: string;
  ncm: string;
  price: number;
  cost: number;
  category: string;
}

// Simulated external product database
const mockExternalProducts: ExternalProduct[] = [
  {
    code: 'EXT-001',
    barcode: '7891234567890',
    description: 'Pneu Pirelli Scorpion ATR 265/70R16',
    brand: 'Pirelli',
    model: 'Scorpion ATR',
    size: '265/70R16',
    ncm: '40111000',
    price: 890.00,
    cost: 650.00,
    category: 'Pneus SUV/Caminhonete',
  },
  {
    code: 'EXT-002',
    barcode: '7891234567891',
    description: 'Pneu Michelin LTX Force 255/60R18',
    brand: 'Michelin',
    model: 'LTX Force',
    size: '255/60R18',
    ncm: '40111000',
    price: 1150.00,
    cost: 850.00,
    category: 'Pneus SUV/Caminhonete',
  },
  {
    code: 'EXT-003',
    barcode: '7891234567892',
    description: 'Pneu Continental PowerContact 2 185/65R15',
    brand: 'Continental',
    model: 'PowerContact 2',
    size: '185/65R15',
    ncm: '40111000',
    price: 420.00,
    cost: 310.00,
    category: 'Pneus de Passeio',
  },
  {
    code: 'EXT-004',
    barcode: '7891234567893',
    description: 'Pneu Bridgestone Dueler H/T 684 II 245/70R16',
    brand: 'Bridgestone',
    model: 'Dueler H/T 684 II',
    size: '245/70R16',
    ncm: '40111000',
    price: 780.00,
    cost: 580.00,
    category: 'Pneus SUV/Caminhonete',
  },
  {
    code: 'EXT-005',
    barcode: '7891234567894',
    description: 'Pneu Goodyear EfficientGrip Performance 205/55R16',
    brand: 'Goodyear',
    model: 'EfficientGrip Performance',
    size: '205/55R16',
    ncm: '40111000',
    price: 520.00,
    cost: 380.00,
    category: 'Pneus de Passeio',
  },
  {
    code: 'EXT-006',
    barcode: '7891234567895',
    description: 'Pneu Yokohama Geolandar A/T G015 31x10.5R15',
    brand: 'Yokohama',
    model: 'Geolandar A/T G015',
    size: '31x10.5R15',
    ncm: '40111000',
    price: 950.00,
    cost: 720.00,
    category: 'Pneus Off-Road',
  },
];

const searchProducts = async (query: string): Promise<ExternalProduct[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return mockExternalProducts.filter(product => 
    product.description.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.model.toLowerCase().includes(lowerQuery) ||
    product.size.toLowerCase().includes(lowerQuery) ||
    product.code.toLowerCase().includes(lowerQuery) ||
    product.barcode?.includes(query)
  );
};

export const ProductSearchModal = ({
  open,
  onClose,
  onRegister,
}: ProductSearchModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ExternalProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExternalProduct | null>(null);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [integrationProgress, setIntegrationProgress] = useState(0);
  const [integrationStep, setIntegrationStep] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Digite um termo para buscar');
      return;
    }
    
    setIsSearching(true);
    setHasSearched(true);
    setSelectedProduct(null);
    
    try {
      const found = await searchProducts(searchTerm);
      setResults(found);
    } catch (error) {
      toast.error('Erro ao buscar produtos');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRegister = async () => {
    if (selectedProduct) {
      setIsIntegrating(true);
      setIntegrationProgress(0);
      
      // Simulate integration steps
      const steps = [
        { progress: 15, step: 'Conectando à base de dados...' },
        { progress: 30, step: 'Requisitando dados do produto...' },
        { progress: 50, step: 'Validando informações...' },
        { progress: 70, step: 'Verificando estoque...' },
        { progress: 85, step: 'Cadastrando produto...' },
        { progress: 100, step: 'Finalizando integração...' },
      ];
      
      for (const { progress, step } of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setIntegrationProgress(progress);
        setIntegrationStep(step);
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setIsIntegrating(false);
      onRegister(selectedProduct);
      toast.success('Produto integrado com sucesso!');
      onClose();
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setResults([]);
    setHasSearched(false);
    setSelectedProduct(null);
  };

  return (
    <Dialog open={open} onOpenChange={isIntegrating ? undefined : onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Integrar Produtos
          </DialogTitle>
          <DialogDescription>
            Busque produtos na base externa e integre automaticamente ao sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label>Buscar por código, barras, marca, modelo ou medida</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ex: Pirelli, 205/55R16, 7891234567890..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Results */}
          {hasSearched && !isSearching && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {results.length} produto(s) encontrado(s)
                </p>
                {results.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    Nova busca
                  </Button>
                )}
              </div>

              {results.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center">
                    <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Nenhum produto encontrado</p>
                    <p className="text-sm text-muted-foreground">Tente outro termo de busca</p>
                  </CardContent>
                </Card>
              ) : (
                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {results.map((product) => (
                      <Card 
                        key={product.code}
                        className={`cursor-pointer transition-all hover:border-primary ${
                          selectedProduct?.code === product.code ? 'border-primary ring-1 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-muted-foreground">{product.code}</span>
                                {product.barcode && (
                                  <Badge variant="outline" className="text-xs">
                                    {product.barcode}
                                  </Badge>
                                )}
                              </div>
                              <p className="font-medium">{product.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <span>{product.brand}</span>
                                <span>{product.model}</span>
                                <span className="font-medium">{product.size}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">{formatCurrency(product.price)}</p>
                              <p className="text-xs text-muted-foreground">Custo: {formatCurrency(product.cost)}</p>
                            </div>
                          </div>
                          {selectedProduct?.code === product.code && (
                            <div className="mt-3 pt-3 border-t flex items-center justify-between">
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Selecionado</span>
                              </div>
                              <Badge>{product.category}</Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}

          {/* Selected Product Confirmation */}
          {selectedProduct && (
            <Card className="border-green-500 bg-green-50/50">
              <CardContent className="pt-4">
                {isIntegrating ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm font-medium">{integrationStep}</span>
                    </div>
                    <Progress value={integrationProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Integrando produto no sistema... {integrationProgress}%
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">Deseja integrar este produto?</p>
                    <div className="flex gap-2">
                      <Button onClick={handleRegister} className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Integrar Produto
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {!isIntegrating && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
