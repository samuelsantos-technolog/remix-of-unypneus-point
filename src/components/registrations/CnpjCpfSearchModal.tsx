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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Building2, User, Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface CnpjCpfSearchModalProps {
  open: boolean;
  onClose: () => void;
  entityType: 'suppliers' | 'customers' | 'products' | 'branches';
  entityLabel: string;
  onRegister: (data: CnpjData | CpfData) => void;
}

interface CnpjData {
  type: 'cnpj';
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone: string;
  email: string;
  situacao: string;
  dataAbertura: string;
}

interface CpfData {
  type: 'cpf';
  cpf: string;
  nome: string;
  dataNascimento?: string;
}

// Simulated API response for demo
const mockCnpjSearch = async (cnpj: string): Promise<CnpjData | null> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const cleanCnpj = cnpj.replace(/\D/g, '');
  if (cleanCnpj.length !== 14) return null;
  
  // Mock data for demonstration
  return {
    type: 'cnpj',
    cnpj: cleanCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5'),
    razaoSocial: 'Empresa Exemplo Ltda',
    nomeFantasia: 'Empresa Exemplo',
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: 'Sala 101',
    bairro: 'Centro',
    municipio: 'São Paulo',
    uf: 'SP',
    cep: '01310-100',
    telefone: '(11) 3456-7890',
    email: 'contato@empresa.com.br',
    situacao: 'ATIVA',
    dataAbertura: '2020-01-15',
  };
};

const mockCpfSearch = async (cpf: string): Promise<CpfData | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length !== 11) return null;
  
  return {
    type: 'cpf',
    cpf: cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
    nome: 'João da Silva Santos',
    dataNascimento: '1985-06-20',
  };
};

export const CnpjCpfSearchModal = ({
  open,
  onClose,
  entityType,
  entityLabel,
  onRegister,
}: CnpjCpfSearchModalProps) => {
  const [activeTab, setActiveTab] = useState<'cnpj' | 'cpf'>('cnpj');
  const [searchValue, setSearchValue] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<CnpjData | CpfData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [integrationProgress, setIntegrationProgress] = useState(0);
  const [integrationStep, setIntegrationStep] = useState('');

  const formatCnpj = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  const formatCpf = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1-$2')
      .slice(0, 14);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setSearchResult(null);
    setSearchError(null);

    try {
      if (activeTab === 'cnpj') {
        const result = await mockCnpjSearch(searchValue);
        if (result) {
          setSearchResult(result);
        } else {
          setSearchError('CNPJ não encontrado ou inválido');
        }
      } else {
        const result = await mockCpfSearch(searchValue);
        if (result) {
          setSearchResult(result);
        } else {
          setSearchError('CPF não encontrado ou inválido');
        }
      }
    } catch (error) {
      setSearchError('Erro ao consultar. Tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async () => {
    if (searchResult) {
      setIsIntegrating(true);
      setIntegrationProgress(0);
      
      // Simulate integration steps
      const steps = [
        { progress: 20, step: 'Conectando à API...' },
        { progress: 40, step: 'Validando dados...' },
        { progress: 60, step: 'Verificando duplicidade...' },
        { progress: 80, step: 'Preparando cadastro...' },
        { progress: 100, step: 'Finalizando integração...' },
      ];
      
      for (const { progress, step } of steps) {
        await new Promise(resolve => setTimeout(resolve, 600));
        setIntegrationProgress(progress);
        setIntegrationStep(step);
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setIsIntegrating(false);
      onRegister(searchResult);
      toast.success('Dados integrados com sucesso!');
      onClose();
    }
  };

  const handleReset = () => {
    setSearchValue('');
    setSearchResult(null);
    setSearchError(null);
  };

  return (
    <Dialog open={open} onOpenChange={isIntegrating ? undefined : onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Integrar CNPJ/CPF
          </DialogTitle>
          <DialogDescription>
            Digite o documento para buscar e integrar os dados automaticamente
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as 'cnpj' | 'cpf'); handleReset(); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cnpj" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              CNPJ
            </TabsTrigger>
            <TabsTrigger value="cpf" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              CPF
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cnpj" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="00.000.000/0001-00"
                  value={searchValue}
                  onChange={(e) => setSearchValue(formatCnpj(e.target.value))}
                  maxLength={18}
                />
                <Button onClick={handleSearch} disabled={isSearching || searchValue.length < 18}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cpf" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>CPF</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="000.000.000-00"
                  value={searchValue}
                  onChange={(e) => setSearchValue(formatCpf(e.target.value))}
                  maxLength={14}
                />
                <Button onClick={handleSearch} disabled={isSearching || searchValue.length < 14}>
                  {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Error State */}
        {searchError && (
          <Card className="border-destructive">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <span>{searchError}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Result */}
        {searchResult && (
          <Card className="border-green-500">
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Dados encontrados!</span>
              </div>

              {searchResult.type === 'cnpj' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">CNPJ</p>
                      <p className="font-mono font-medium">{searchResult.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Situação</p>
                      <Badge className={searchResult.situacao === 'ATIVA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {searchResult.situacao}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground">Razão Social</p>
                    <p className="font-medium">{searchResult.razaoSocial}</p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground">Nome Fantasia</p>
                    <p className="font-medium">{searchResult.nomeFantasia || '-'}</p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground">Endereço</p>
                    <p className="font-medium">
                      {searchResult.logradouro}, {searchResult.numero} {searchResult.complemento && `- ${searchResult.complemento}`}
                    </p>
                    <p className="text-muted-foreground">
                      {searchResult.bairro} - {searchResult.municipio}/{searchResult.uf} - CEP {searchResult.cep}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Telefone</p>
                      <p className="font-medium">{searchResult.telefone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">E-mail</p>
                      <p className="font-medium">{searchResult.email || '-'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-sm">
                    <p className="text-muted-foreground">CPF</p>
                    <p className="font-mono font-medium">{searchResult.cpf}</p>
                  </div>
                  
                  <div className="text-sm">
                    <p className="text-muted-foreground">Nome</p>
                    <p className="font-medium">{searchResult.nome}</p>
                  </div>
                  
                  {searchResult.dataNascimento && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Data de Nascimento</p>
                      <p className="font-medium">{new Date(searchResult.dataNascimento).toLocaleDateString('pt-BR')}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t">
                {isIntegrating ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm font-medium">{integrationStep}</span>
                    </div>
                    <Progress value={integrationProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Integrando dados no sistema... {integrationProgress}%
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-3">Deseja integrar com estes dados?</p>
                    <div className="flex gap-2">
                      <Button onClick={handleRegister} className="flex-1">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Integrar no Sistema
                      </Button>
                      <Button variant="outline" onClick={handleReset}>
                        Nova Busca
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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

export type { CnpjData, CpfData };
