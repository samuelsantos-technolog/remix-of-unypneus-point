import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Search, Building2, Phone, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { mockSuppliers } from '@/data/purchasesMockData';
import { 
  Supplier, 
  PURCHASE_PAYMENT_CONDITIONS, 
  PurchasePaymentCondition 
} from '@/types/purchases';
import { validateCnpj } from '@/data/purchasesMockData';

interface SuppliersModalProps {
  onClose: () => void;
}

export const SuppliersModal = ({ onClose }: SuppliersModalProps) => {
  const [activeTab, setActiveTab] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form state
  const [corporateName, setCorporateName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [stateRegistration, setStateRegistration] = useState('');
  const [address, setAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [defaultPaymentCondition, setDefaultPaymentCondition] = useState<PurchasePaymentCondition>('28_days');
  const [customPaymentDays, setCustomPaymentDays] = useState('');

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.tradeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.corporateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.cnpj.includes(searchTerm)
  );

  const resetForm = () => {
    setCorporateName('');
    setTradeName('');
    setCnpj('');
    setStateRegistration('');
    setAddress('');
    setContactName('');
    setPhone('');
    setEmail('');
    setDefaultPaymentCondition('28_days');
    setCustomPaymentDays('');
    setEditingSupplier(null);
  };

  const loadSupplierForEdit = (supplier: Supplier) => {
    setCorporateName(supplier.corporateName);
    setTradeName(supplier.tradeName);
    setCnpj(supplier.cnpj);
    setStateRegistration(supplier.stateRegistration);
    setAddress(supplier.address);
    setContactName(supplier.contactName);
    setPhone(supplier.phone);
    setEmail(supplier.email);
    setDefaultPaymentCondition(supplier.defaultPaymentCondition);
    setCustomPaymentDays(supplier.customPaymentDays?.toString() || '');
    setEditingSupplier(supplier);
    setActiveTab('form');
  };

  const handleSave = () => {
    if (!corporateName.trim()) {
      toast.error('Informe a razão social');
      return;
    }
    if (!tradeName.trim()) {
      toast.error('Informe o nome fantasia');
      return;
    }
    if (!validateCnpj(cnpj)) {
      toast.error('CNPJ inválido');
      return;
    }
    if (!address.trim()) {
      toast.error('Informe o endereço');
      return;
    }
    if (defaultPaymentCondition === 'custom' && !customPaymentDays) {
      toast.error('Informe os dias para pagamento customizado');
      return;
    }

    toast.success(editingSupplier ? 'Fornecedor atualizado' : 'Fornecedor cadastrado');
    resetForm();
    setActiveTab('list');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fornecedores</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Lista de Fornecedores</TabsTrigger>
            <TabsTrigger value="form">
              {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => { resetForm(); setActiveTab('form'); }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Fornecedor
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome Fantasia</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Contato</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Condição Padrão</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Nenhum fornecedor encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSuppliers.map((supplier) => {
                        const paymentCondition = PURCHASE_PAYMENT_CONDITIONS.find(
                          c => c.value === supplier.defaultPaymentCondition
                        );
                        return (
                          <TableRow key={supplier.id}>
                            <TableCell className="font-medium">{supplier.tradeName}</TableCell>
                            <TableCell className="font-mono text-sm">{supplier.cnpj}</TableCell>
                            <TableCell>{supplier.contactName}</TableCell>
                            <TableCell>{supplier.phone}</TableCell>
                            <TableCell>
                              {paymentCondition?.label}
                              {supplier.customPaymentDays && ` (${supplier.customPaymentDays} dias)`}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => loadSupplierForEdit(supplier)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="form" className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-lg font-medium mb-4">
                  <Building2 className="h-5 w-5" />
                  Dados da Empresa
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Razão Social *</Label>
                    <Input
                      value={corporateName}
                      onChange={(e) => setCorporateName(e.target.value)}
                      placeholder="Nome completo da empresa"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nome Fantasia *</Label>
                    <Input
                      value={tradeName}
                      onChange={(e) => setTradeName(e.target.value)}
                      placeholder="Nome comercial"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CNPJ *</Label>
                    <Input
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Inscrição Estadual</Label>
                    <Input
                      value={stateRegistration}
                      onChange={(e) => setStateRegistration(e.target.value)}
                      placeholder="000.000.000.000"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Endereço *</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Endereço completo"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-lg font-medium mb-4">
                  <Phone className="h-5 w-5" />
                  Contato
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Contato</Label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Nome da pessoa de contato"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(00) 0000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@empresa.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-lg font-medium mb-4">
                  <Mail className="h-5 w-5" />
                  Condições Comerciais
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Condição Padrão de Pagamento</Label>
                    <Select 
                      value={defaultPaymentCondition}
                      onValueChange={(v) => setDefaultPaymentCondition(v as PurchasePaymentCondition)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PURCHASE_PAYMENT_CONDITIONS.map(condition => (
                          <SelectItem key={condition.value} value={condition.value}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {defaultPaymentCondition === 'custom' && (
                    <div className="space-y-2">
                      <Label>Dias para Pagamento *</Label>
                      <Input
                        type="number"
                        value={customPaymentDays}
                        onChange={(e) => setCustomPaymentDays(e.target.value)}
                        placeholder="Ex: 30"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { resetForm(); setActiveTab('list'); }}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingSupplier ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
