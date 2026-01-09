import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Phone, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { SupplierRegistration } from '@/types/registrations';
import { CnpjData } from './CnpjCpfSearchModal';

interface SupplierFormModalProps {
  open: boolean;
  onClose: () => void;
  supplier?: SupplierRegistration | null;
  prefilledData?: CnpjData | null;
}

export const SupplierFormModal = ({ open, onClose, supplier, prefilledData }: SupplierFormModalProps) => {
  const [corporateName, setCorporateName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [stateRegistration, setStateRegistration] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [defaultPaymentCondition, setDefaultPaymentCondition] = useState('28_days');

  useEffect(() => {
    if (prefilledData) {
      setCorporateName(prefilledData.razaoSocial);
      setTradeName(prefilledData.nomeFantasia || prefilledData.razaoSocial);
      setCnpj(prefilledData.cnpj);
      setAddress(`${prefilledData.logradouro}, ${prefilledData.numero}${prefilledData.complemento ? ` - ${prefilledData.complemento}` : ''}`);
      setCity(prefilledData.municipio);
      setState(prefilledData.uf);
      setZipCode(prefilledData.cep);
      setPhone(prefilledData.telefone);
      setEmail(prefilledData.email);
    } else if (supplier) {
      setCorporateName(supplier.corporateName);
      setTradeName(supplier.tradeName);
      setCnpj(supplier.cnpj);
      setStateRegistration(supplier.stateRegistration);
      setAddress(supplier.address);
      setCity(supplier.city);
      setState(supplier.state);
      setZipCode(supplier.zipCode);
      setContactName(supplier.contactName);
      setPhone(supplier.phone);
      setEmail(supplier.email);
      setDefaultPaymentCondition(supplier.defaultPaymentCondition);
    } else {
      setCorporateName('');
      setTradeName('');
      setCnpj('');
      setStateRegistration('');
      setAddress('');
      setCity('');
      setState('');
      setZipCode('');
      setContactName('');
      setPhone('');
      setEmail('');
      setDefaultPaymentCondition('28_days');
    }
  }, [supplier, prefilledData]);

  const handleSave = () => {
    if (!corporateName.trim() || !tradeName.trim() || !cnpj.trim()) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    toast.success(supplier ? 'Fornecedor atualizado' : 'Fornecedor cadastrado');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
            {prefilledData && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Via CNPJ
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-base font-medium mb-2">
                <Building2 className="h-4 w-4" />
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
                  <Label>Endereço</Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número, complemento"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>UF</Label>
                    <Input
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="SP"
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CEP</Label>
                    <Input
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-base font-medium mb-2">
                <Phone className="h-4 w-4" />
                Contato
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Contato</Label>
                  <Input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nome"
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
              <div className="flex items-center gap-2 text-base font-medium mb-2">
                <CreditCard className="h-4 w-4" />
                Condições Comerciais
              </div>
              
              <div className="space-y-2">
                <Label>Condição Padrão de Pagamento</Label>
                <Select value={defaultPaymentCondition} onValueChange={setDefaultPaymentCondition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">À Vista</SelectItem>
                    <SelectItem value="7_days">7 Dias</SelectItem>
                    <SelectItem value="14_days">14 Dias</SelectItem>
                    <SelectItem value="21_days">21 Dias</SelectItem>
                    <SelectItem value="28_days">28 Dias</SelectItem>
                    <SelectItem value="custom">Customizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {supplier ? 'Salvar Alterações' : 'Cadastrar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
