import { useState } from 'react';
import { Franchise, Operator } from '@/types/pdv';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { 
  ArrowLeft,
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar,
  TrendingUp,
  DollarSign,
  Building2
} from 'lucide-react';

interface RepasseScreenProps {
  franchise: Franchise;
  operator: Operator;
  onBack: () => void;
}

interface SaleDetail {
  id: string;
  date: Date;
  paymentMethod: string;
  grossValue: number;
  rate: number;
  spreadValue: number;
  netValue: number;
}

// Mock data for demonstration
const generateMockSales = (franchiseId: string): SaleDetail[] => {
  const sales: SaleDetail[] = [];
  const paymentMethods = ['Crédito 1x', 'Crédito 2x', 'Crédito 3x', 'Débito', 'PIX'];
  const baseRate = 1.5;
  
  for (let i = 1; i <= 15; i++) {
    const grossValue = Math.random() * 2000 + 500;
    const methodIndex = Math.floor(Math.random() * paymentMethods.length);
    const appliedRate = baseRate + (methodIndex < 3 ? (methodIndex + 1) * 0.5 : 0);
    const spreadValue = (grossValue * (appliedRate - baseRate)) / 100;
    
    sales.push({
      id: `V${franchiseId.slice(-3)}${String(i).padStart(4, '0')}`,
      date: new Date(2024, new Date().getMonth(), Math.floor(Math.random() * 28) + 1),
      paymentMethod: paymentMethods[methodIndex],
      grossValue,
      rate: appliedRate,
      spreadValue,
      netValue: grossValue - spreadValue
    });
  }
  
  return sales.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const RepasseScreen = ({ franchise, operator, onBack }: RepasseScreenProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const sales = generateMockSales(franchise.id);
  
  const totalSold = sales.reduce((sum, s) => sum + s.grossValue, 0);
  const totalSpread = sales.reduce((sum, s) => sum + s.spreadValue, 0);
  const totalTransferred = totalSpread;
  const totalNet = totalSold - totalTransferred;
  
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const exportCSV = () => {
    const headers = ['ID Venda', 'Data/Hora', 'Forma Pagamento', 'Valor Bruto', 'Taxa %', 'Spread', 'Valor Líquido'];
    const rows = sales.map(s => [
      s.id,
      formatDate(s.date),
      s.paymentMethod,
      s.grossValue.toFixed(2),
      s.rate.toFixed(2),
      s.spreadValue.toFixed(2),
      s.netValue.toFixed(2)
    ]);
    
    const csvContent = [
      `Relatório de Repasse Mensal - ${franchise.name}`,
      `Período: ${months[selectedMonth]}/${selectedYear}`,
      '',
      headers.join(';'),
      ...rows.map(r => r.join(';')),
      '',
      `Total Vendido;${totalSold.toFixed(2)}`,
      `Total Spread;${totalSpread.toFixed(2)}`,
      `Total Repassado UnyPneus;${totalTransferred.toFixed(2)}`,
      `Total Líquido Loja;${totalNet.toFixed(2)}`
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `repasse_${franchise.id}_${selectedMonth + 1}_${selectedYear}.csv`;
    link.click();
  };

  const exportExcel = () => {
    const headers = ['ID Venda', 'Data/Hora', 'Forma Pagamento', 'Valor Bruto', 'Taxa %', 'Spread', 'Valor Líquido'];
    const rows = sales.map(s => [
      s.id,
      formatDate(s.date),
      s.paymentMethod,
      s.grossValue.toFixed(2),
      s.rate.toFixed(2),
      s.spreadValue.toFixed(2),
      s.netValue.toFixed(2)
    ]);
    
    const content = [
      `Relatório de Repasse Mensal - ${franchise.name}`,
      `Período: ${months[selectedMonth]}/${selectedYear}`,
      '',
      headers.join('\t'),
      ...rows.map(r => r.join('\t')),
      '',
      `Total Vendido\t${totalSold.toFixed(2)}`,
      `Total Spread\t${totalSpread.toFixed(2)}`,
      `Total Repassado UnyPneus\t${totalTransferred.toFixed(2)}`,
      `Total Líquido Loja\t${totalNet.toFixed(2)}`
    ].join('\n');
    
    const blob = new Blob([content], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `repasse_${franchise.id}_${selectedMonth + 1}_${selectedYear}.xls`;
    link.click();
  };

  const exportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Relatório de Repasse - ${franchise.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1e40af; padding-bottom: 20px; }
          .header h1 { color: #1e40af; margin: 0; font-size: 24px; }
          .header p { color: #666; margin: 5px 0; }
          .summary { display: flex; gap: 20px; margin-bottom: 30px; }
          .summary-card { flex: 1; background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af; }
          .summary-card h3 { margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; }
          .summary-card p { margin: 0; font-size: 20px; font-weight: bold; color: #1e40af; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #1e40af; color: white; padding: 12px 8px; text-align: left; font-size: 12px; }
          td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          tr:hover { background: #f8fafc; }
          .totals { margin-top: 30px; background: #f8fafc; padding: 20px; border-radius: 8px; }
          .totals h3 { margin: 0 0 15px 0; color: #1e40af; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .total-row:last-child { border-bottom: none; font-weight: bold; font-size: 16px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 11px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>UnyPneus® - Relatório de Repasse Mensal</h1>
          <p><strong>${franchise.name}</strong></p>
          <p>CNPJ: ${franchise.cnpj}</p>
          <p>Período: ${months[selectedMonth]} de ${selectedYear}</p>
        </div>
        
        <div class="summary">
          <div class="summary-card">
            <h3>Total Vendido</h3>
            <p>${formatCurrency(totalSold)}</p>
          </div>
          <div class="summary-card">
            <h3>Total Spread</h3>
            <p>${formatCurrency(totalSpread)}</p>
          </div>
          <div class="summary-card">
            <h3>Repassado UnyPneus</h3>
            <p>${formatCurrency(totalTransferred)}</p>
          </div>
          <div class="summary-card">
            <h3>Líquido Loja</h3>
            <p>${formatCurrency(totalNet)}</p>
          </div>
        </div>
        
        <h3>Extrato Detalhado de Vendas</h3>
        <table>
          <thead>
            <tr>
              <th>ID Venda</th>
              <th>Data/Hora</th>
              <th>Forma Pagamento</th>
              <th>Valor Bruto</th>
              <th>Taxa %</th>
              <th>Spread</th>
              <th>Valor Líquido</th>
            </tr>
          </thead>
          <tbody>
            ${sales.map(s => `
              <tr>
                <td>${s.id}</td>
                <td>${formatDate(s.date)}</td>
                <td>${s.paymentMethod}</td>
                <td>${formatCurrency(s.grossValue)}</td>
                <td>${s.rate.toFixed(2)}%</td>
                <td>${formatCurrency(s.spreadValue)}</td>
                <td>${formatCurrency(s.netValue)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <h3>Resumo Financeiro</h3>
          <div class="total-row">
            <span>Total Vendido no Período:</span>
            <span>${formatCurrency(totalSold)}</span>
          </div>
          <div class="total-row">
            <span>Total de Spread Gerado:</span>
            <span>${formatCurrency(totalSpread)}</span>
          </div>
          <div class="total-row">
            <span>Total Repassado à UnyPneus®:</span>
            <span>${formatCurrency(totalTransferred)}</span>
          </div>
          <div class="total-row">
            <span>Total Líquido para a Loja:</span>
            <span>${formatCurrency(totalNet)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
          <p>UnyPneus® - Sistema de Gestão de Franquias</p>
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="flex-1 bg-muted/30 flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-sm">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-primary-foreground/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Relatório de Repasse Mensal</h1>
            <p className="text-sm text-primary-foreground/70">{franchise.name}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-card rounded-xl p-4 border border-border">
          <div className="flex gap-4 items-center">
            <Calendar className="text-muted-foreground" size={18} />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {months.map((month, idx) => (
                <option key={idx} value={idx}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              CSV
            </button>
            <button
              onClick={exportExcel}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              Excel
            </button>
            <button
              onClick={exportPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <FileText size={16} />
              PDF
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
              <DollarSign size={18} />
              <span className="text-xs font-medium uppercase">Total Vendido</span>
            </div>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(totalSold)}</p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
              <TrendingUp size={18} />
              <span className="text-xs font-medium uppercase">Total Spread</span>
            </div>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-300">{formatCurrency(totalSpread)}</p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
              <Building2 size={18} />
              <span className="text-xs font-medium uppercase">Repasse UnyPneus</span>
            </div>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{formatCurrency(totalTransferred)}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <DollarSign size={18} />
              <span className="text-xs font-medium uppercase">Líquido Loja</span>
            </div>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">{formatCurrency(totalNet)}</p>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">Extrato Detalhado de Vendas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID Venda</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data/Hora</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Forma Pagamento</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Valor Bruto</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Taxa %</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Spread</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Valor Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-primary">{sale.id}</td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(sale.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.paymentMethod.includes('Crédito') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                        sale.paymentMethod === 'Débito' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                      }`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{formatCurrency(sale.grossValue)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{sale.rate.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{formatCurrency(sale.spreadValue)}</td>
                    <td className="px-4 py-3 text-right font-medium text-green-600 dark:text-green-400">{formatCurrency(sale.netValue)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/50 font-medium">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-foreground">TOTAIS:</td>
                  <td className="px-4 py-3 text-right text-primary">{formatCurrency(totalSold)}</td>
                  <td className="px-4 py-3 text-right text-muted-foreground">-</td>
                  <td className="px-4 py-3 text-right text-amber-600 dark:text-amber-400">{formatCurrency(totalSpread)}</td>
                  <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">{formatCurrency(totalNet)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
