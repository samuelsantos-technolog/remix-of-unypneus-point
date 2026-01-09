import { useEffect, useState } from 'react';
import { CreditCard, Wifi, CheckCircle, Loader2 } from 'lucide-react';
import { PaymentType } from '@/types/pdv';
import { formatCurrency } from '@/utils/formatters';

interface PaymentProcessingProps {
  paymentType: PaymentType;
  total: number;
  installments: number;
  onComplete: () => void;
}

const paymentLabels: Record<PaymentType, string> = {
  credit: 'Crédito',
  debit: 'Débito',
  pix: 'PIX',
  cash: 'Dinheiro'
};

const processingSteps = [
  'Conectando ao TEF...',
  'Aguardando autorização...',
  'Comunicando com a operadora...',
  'Processando transação...',
  'Finalizando...'
];

export const PaymentProcessing = ({ paymentType, total, installments, onComplete }: PaymentProcessingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const stepDuration = paymentType === 'cash' ? 300 : 800;
    const totalSteps = paymentType === 'cash' ? 2 : processingSteps.length;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < totalSteps - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        setIsComplete(true);
        setTimeout(onComplete, 1200);
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(interval);
  }, [paymentType, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pdv-blue to-pdv-blue-dark p-6 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            {paymentType === 'pix' ? (
              <Wifi size={32} />
            ) : paymentType === 'cash' ? (
              <span className="text-3xl">💵</span>
            ) : (
              <CreditCard size={32} />
            )}
          </div>
          <h2 className="text-xl font-bold">
            {isComplete ? 'Pagamento Aprovado!' : `Pagamento via ${paymentLabels[paymentType]}`}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {paymentType === 'credit' && installments > 1 
              ? `${installments}× de ${formatCurrency(total / installments)}`
              : formatCurrency(total)}
          </p>
        </div>

        {/* Processing Animation */}
        <div className="p-8">
          {!isComplete ? (
            <div className="space-y-4">
              {/* Terminal Animation */}
              <div className="relative h-32 bg-pdv-gray-light rounded-2xl flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                <div className="text-center z-10">
                  <Loader2 size={40} className="text-pdv-blue animate-spin mx-auto mb-2" />
                  <p className="text-sm font-medium text-pdv-gray-dark">
                    {paymentType === 'cash' ? 'Registrando pagamento...' : processingSteps[currentStep]}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              {paymentType !== 'cash' && (
                <div className="flex justify-center gap-2">
                  {processingSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index <= currentStep ? 'bg-pdv-blue scale-110' : 'bg-pdv-border'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* TEF Info */}
              {paymentType !== 'cash' && (
                <div className="bg-pdv-gray-light/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-pdv-gray">
                    Cielo Conecta • TEF Integrado
                  </p>
                  <p className="text-xs text-pdv-gray mt-1">
                    NSU: {Math.floor(Math.random() * 900000 + 100000)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                <CheckCircle size={48} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-pdv-gray-dark mb-2">
                Transação Aprovada
              </h3>
              <p className="text-pdv-gray text-sm">
                Gerando comprovante...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
