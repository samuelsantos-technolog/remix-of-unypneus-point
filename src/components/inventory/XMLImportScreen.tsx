import { useState, useRef } from 'react';
import { Franchise, Operator } from '@/types/pdv';
import { ParsedXML, XMLProduct } from '@/types/inventory';
import { parseNFeXML, sampleNFeXML } from '@/utils/xmlParser';
import { formatCurrency, formatCNPJ } from '@/utils/formatters';
import { xmlImports } from '@/data/inventoryMockData';
import { ArrowLeft, Upload, FileText, Check, X, AlertTriangle, Plus, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface XMLImportScreenProps {
  franchise: Franchise;
  operator: Operator;
  onBack: () => void;
  onImportComplete: () => void;
}

export const XMLImportScreen = ({ franchise, operator, onBack, onImportComplete }: XMLImportScreenProps) => {
  const [parsedData, setParsedData] = useState<ParsedXML | null>(null);
  const [step, setStep] = useState<'upload' | 'review' | 'success'>('upload');
  const [selectedProducts, setSelectedProducts] = useState<Map<number, string>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.xml')) {
      setError('Por favor, selecione um arquivo XML válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      processXML(content);
    };
    reader.readAsText(file);
  };

  const processXML = (xmlContent: string) => {
    setError(null);
    const parsed = parseNFeXML(xmlContent);
    
    if (!parsed) {
      setError('Erro ao processar o XML. Verifique se é uma NF-e válida.');
      return;
    }

    // Check for duplicate import
    const existingImport = xmlImports.find(imp => imp.nfeKey === parsed.nfeKey);
    if (existingImport) {
      setError(`Esta NF-e já foi importada em ${new Date(existingImport.importedAt).toLocaleDateString('pt-BR')}.`);
      return;
    }

    setParsedData(parsed);
    setStep('review');
  };

  const loadSampleXML = () => {
    processXML(sampleNFeXML);
  };

  const handleProductMapping = (index: number, productId: string) => {
    const newMap = new Map(selectedProducts);
    if (productId) {
      newMap.set(index, productId);
    } else {
      newMap.delete(index);
    }
    setSelectedProducts(newMap);
  };

  const handleConfirmImport = () => {
    if (!parsedData) return;

    // Simulate import process
    toast({
      title: "Importação concluída!",
      description: `${parsedData.products.length} item(ns) adicionados ao estoque.`,
    });

    setStep('success');
    setTimeout(() => {
      onImportComplete();
    }, 2000);
  };

  const renderUploadStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-pdv p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-pdv-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="text-pdv-blue" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-pdv-gray-dark mb-2">Importar NF-e</h2>
          <p className="text-pdv-gray">Selecione o arquivo XML da Nota Fiscal eletrônica de compra</p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xml"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-6 border-2 border-dashed border-pdv-blue/30 rounded-xl hover:border-pdv-blue hover:bg-pdv-blue/5 transition-colors flex flex-col items-center gap-2"
        >
          <FileText className="text-pdv-blue" size={32} />
          <span className="text-pdv-gray-dark font-medium">Clique para selecionar o arquivo XML</span>
          <span className="text-sm text-pdv-gray">ou arraste e solte aqui</span>
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-pdv-border">
          <button
            onClick={loadSampleXML}
            className="w-full py-3 text-pdv-blue hover:bg-pdv-blue/5 rounded-xl transition-colors text-sm"
          >
            🧪 Carregar XML de exemplo para teste
          </button>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => {
    if (!parsedData) return null;

    const newProducts = parsedData.products.filter(p => p.isNew);
    const existingProducts = parsedData.products.filter(p => !p.isNew);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* NF-e Info */}
        <div className="bg-white rounded-2xl shadow-pdv p-6">
          <h3 className="text-lg font-semibold text-pdv-gray-dark mb-4">Dados da NF-e</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-pdv-gray">Número</p>
              <p className="font-medium text-pdv-gray-dark">{parsedData.nfeNumber}</p>
            </div>
            <div>
              <p className="text-sm text-pdv-gray">Fornecedor</p>
              <p className="font-medium text-pdv-gray-dark">{parsedData.supplier.tradeName}</p>
            </div>
            <div>
              <p className="text-sm text-pdv-gray">CNPJ</p>
              <p className="font-medium text-pdv-gray-dark">{formatCNPJ(parsedData.supplier.cnpj)}</p>
            </div>
            <div>
              <p className="text-sm text-pdv-gray">Valor Total</p>
              <p className="font-medium text-pdv-blue text-lg">{formatCurrency(parsedData.totalValue)}</p>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-pdv overflow-hidden">
          <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between">
            <h3 className="text-lg font-semibold text-pdv-gray-dark">Itens da Nota ({parsedData.products.length})</h3>
            {newProducts.length > 0 && (
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                {newProducts.length} produto(s) novo(s)
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-pdv-gray-light">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-pdv-gray uppercase">NCM</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-pdv-gray uppercase">Qtd</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-pdv-gray uppercase">Valor Unit.</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-pdv-gray uppercase">Total</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-pdv-gray uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pdv-border">
                {parsedData.products.map((product, index) => (
                  <tr key={index} className="hover:bg-pdv-gray-light/50">
                    <td className="px-6 py-4 text-sm text-pdv-gray-dark">{product.code}</td>
                    <td className="px-6 py-4 text-sm text-pdv-gray-dark">{product.description}</td>
                    <td className="px-6 py-4 text-sm text-pdv-gray">{product.ncm}</td>
                    <td className="px-6 py-4 text-sm text-pdv-gray-dark text-right">{product.quantity}</td>
                    <td className="px-6 py-4 text-sm text-pdv-gray-dark text-right">{formatCurrency(product.unitValue)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-pdv-gray-dark text-right">{formatCurrency(product.totalValue)}</td>
                    <td className="px-6 py-4 text-center">
                      {product.isNew ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                          <Plus size={12} />
                          Novo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          <Check size={12} />
                          Vinculado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setStep('upload');
              setParsedData(null);
            }}
            className="flex-1 py-4 bg-pdv-gray-light text-pdv-gray-dark font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmImport}
            className="flex-1 py-4 bg-pdv-blue text-white font-semibold rounded-xl hover:bg-pdv-blue-dark transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Confirmar Entrada no Estoque
          </button>
        </div>
      </div>
    );
  };

  const renderSuccessStep = () => (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-pdv p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
          <Check className="text-green-600" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-pdv-gray-dark mb-2">Importação Concluída!</h2>
        <p className="text-pdv-gray">Os produtos foram adicionados ao estoque com sucesso.</p>
      </div>
    </div>
  );

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
            <h1 className="text-xl font-bold text-pdv-blue">Importar XML</h1>
            <p className="text-sm text-pdv-gray">{franchise.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {step === 'upload' && renderUploadStep()}
        {step === 'review' && renderReviewStep()}
        {step === 'success' && renderSuccessStep()}
      </main>
    </div>
  );
};
