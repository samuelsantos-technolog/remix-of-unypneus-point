import { Franchise, Operator, Tire, Sale, InstallmentOption } from '@/types/pdv';

export const franchises: Franchise[] = [
  { id: '1', name: 'UnyPneus Centro', cnpj: '12.345.678/0001-90', address: 'Av. Principal, 1000 - Centro' },
  { id: '2', name: 'UnyPneus Shopping', cnpj: '12.345.678/0002-71', address: 'Shopping Center, Loja 45' },
  { id: '3', name: 'UnyPneus Zona Sul', cnpj: '12.345.678/0003-52', address: 'Rua das Flores, 500 - Zona Sul' },
];

export const operators: Operator[] = [
  { id: '1', name: 'João Silva', cpf: '123.456.789-00', password: '1234', franchiseId: '1' },
  { id: '2', name: 'Maria Santos', cpf: '987.654.321-00', password: '1234', franchiseId: '1' },
  { id: '3', name: 'Pedro Oliveira', cpf: '456.789.123-00', password: '1234', franchiseId: '2' },
];

export const tires: Tire[] = [
  { id: '1', brand: 'Pirelli', model: 'Cinturato P1', size: '185/65 R15', price: 350, stock: 24 },
  { id: '2', brand: 'Michelin', model: 'Primacy 4', size: '205/55 R16', price: 520, stock: 18 },
  { id: '3', brand: 'Goodyear', model: 'Assurance', size: '195/60 R15', price: 410, stock: 32 },
  { id: '4', brand: 'Bridgestone', model: 'Turanza', size: '225/45 R17', price: 630, stock: 12 },
  { id: '5', brand: 'Continental', model: 'PowerContact 2', size: '175/70 R14', price: 290, stock: 45 },
  { id: '6', brand: 'Firestone', model: 'F-600', size: '185/70 R14', price: 320, stock: 28 },
  { id: '7', brand: 'Dunlop', model: 'SP Sport', size: '215/50 R17', price: 580, stock: 15 },
  { id: '8', brand: 'Yokohama', model: 'BluEarth', size: '195/55 R16', price: 480, stock: 20 },
];

export const installmentRates: InstallmentOption[] = [
  { installments: 1, rate: 0, label: '1× sem juros' },
  { installments: 2, rate: 0.02, label: '2× com 2%' },
  { installments: 3, rate: 0.02, label: '3× com 2%' },
  { installments: 4, rate: 0.04, label: '4× com 4%' },
  { installments: 5, rate: 0.04, label: '5× com 4%' },
  { installments: 6, rate: 0.04, label: '6× com 4%' },
  { installments: 7, rate: 0.08, label: '7× com 8%' },
  { installments: 8, rate: 0.08, label: '8× com 8%' },
  { installments: 9, rate: 0.08, label: '9× com 8%' },
  { installments: 10, rate: 0.08, label: '10× com 8%' },
  { installments: 11, rate: 0.08, label: '11× com 8%' },
  { installments: 12, rate: 0.08, label: '12× com 8%' },
];

export const mockSales: Sale[] = [
  {
    id: 'VND-001',
    franchiseId: '1',
    operatorId: '1',
    customer: { document: '123.456.789-00', name: 'Carlos Ferreira', plate: 'ABC-1234', phone: '(11) 99999-0001' },
    items: [{ tire: tires[0], quantity: 4 }],
    subtotal: 1400,
    discount: 0,
    interestRate: 0,
    total: 1400,
    payment: { type: 'debit' },
    createdAt: new Date(),
    status: 'completed'
  },
  {
    id: 'VND-002',
    franchiseId: '1',
    operatorId: '1',
    customer: { document: '987.654.321-00', name: 'Ana Paula', plate: 'XYZ-9876', phone: '(11) 99999-0002' },
    items: [{ tire: tires[1], quantity: 2 }],
    subtotal: 1040,
    discount: 50,
    interestRate: 0.04,
    total: 1029.60,
    payment: { type: 'credit', installments: 4 },
    createdAt: new Date(),
    status: 'completed'
  },
];

export const getInterestRate = (installments: number): number => {
  const option = installmentRates.find(r => r.installments === installments);
  return option?.rate || 0;
};
