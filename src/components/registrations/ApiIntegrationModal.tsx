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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cloud, Link2, CheckCircle, AlertCircle, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ApiIntegrationModalProps {
  open: boolean;
  onClose: () => void;
  entityType: 'suppliers' | 'customers' | 'products' | 'branches';
  entityLabel: string;
}

const API_ENDPOINTS = {
  suppliers: {
    import: '/api/v1/suppliers/import',
    update: '/api/v1/suppliers/:id',
    get: '/api/v1/suppliers',
    status: '/api/v1/suppliers/sync-status',
    webhook: '/api/v1/webhooks/suppliers',
  },
  customers: {
    import: '/api/v1/customers/import',
    update: '/api/v1/customers/:id',
    get: '/api/v1/customers',
    status: '/api/v1/customers/sync-status',
    webhook: '/api/v1/webhooks/customers',
  },
  products: {
    import: '/api/v1/products/import',
    update: '/api/v1/products/:id',
    get: '/api/v1/products',
    status: '/api/v1/products/sync-status',
    webhook: '/api/v1/webhooks/products',
  },
  branches: {
    import: '/api/v1/branches/import',
    update: '/api/v1/branches/:id',
    get: '/api/v1/branches',
    status: '/api/v1/branches/sync-status',
    webhook: '/api/v1/webhooks/branches',
  },
};

export const ApiIntegrationModal = ({
  open,
  onClose,
  entityType,
  entityLabel,
}: ApiIntegrationModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const endpoints = API_ENDPOINTS[entityType];
  const baseUrl = 'https://api.unypneus.com.br';

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  const testConnection = async () => {
    setIsTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsTesting(false);
    toast.success('Conexão testada com sucesso');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Integração via API - {entityLabel}
          </DialogTitle>
          <DialogDescription>
            Configure a integração para importar e sincronizar dados automaticamente
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status da Integração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Conexão API</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Conectado
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Última Sincronização</span>
                  <span className="text-sm text-muted-foreground">05/12/2024 14:30</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Registros Sincronizados</span>
                  <span className="text-sm font-medium">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Erros Pendentes</span>
                  <Badge variant="outline" className="text-orange-700 border-orange-300">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    2
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={testConnection} disabled={isTesting}>
                  {isTesting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4 mr-2" />
                  )}
                  Testar Conexão
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Agora
                </Button>
                <Button variant="outline" className="w-full justify-start text-orange-600 hover:text-orange-700">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Ver Erros de Sincronização
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Endpoints Disponíveis</CardTitle>
                <CardDescription>Use estes endpoints para integrar com o sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Importação (POST)', endpoint: endpoints.import, method: 'POST' },
                  { label: 'Atualização (PUT)', endpoint: endpoints.update, method: 'PUT' },
                  { label: 'Consulta (GET)', endpoint: endpoints.get, method: 'GET' },
                  { label: 'Status de Sync (GET)', endpoint: endpoints.status, method: 'GET' },
                  { label: 'Webhook (POST)', endpoint: endpoints.webhook, method: 'POST' },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{item.label}</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                        {baseUrl}{item.endpoint}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(`${baseUrl}${item.endpoint}`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documentação</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Acessar Documentação da API
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="config" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Chave de API</CardTitle>
                <CardDescription>
                  Configure a chave de autenticação para a integração
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk_live_xxxxxxxxxxxxx"
                  />
                </div>
                <Button>Salvar Chave</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Webhook de Atualização</CardTitle>
                <CardDescription>
                  Receba notificações quando dados forem alterados externamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>URL do Webhook</Label>
                  <Input
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://seu-sistema.com/webhook"
                  />
                </div>
                <div className="flex gap-2">
                  <Button>Configurar Webhook</Button>
                  <Button variant="outline">Testar Webhook</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Sincronização Automática</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sincronização Ativa</p>
                    <p className="text-xs text-muted-foreground">
                      Sincronizar automaticamente a cada 1 hora
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
