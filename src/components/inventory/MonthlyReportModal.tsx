import { useState } from 'react';
import { Franchise } from '@/types/pdv';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar,
  TrendingUp,
  DollarSign,
  Building2
} from 'lucide-react';

interface MonthlyReportModalProps {
  franchise: Franchise;
  onClose: () => void;
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
  const baseRate = 1.5; // Taxa base acordada
  
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

export const MonthlyReportModal = ({ franchise, onClose }: MonthlyReportModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const sales = generateMockSales(franchise.id);
  
  const totalSold = sales.reduce((sum, s) => sum + s.grossValue, 0);
  const totalSpread = sales.reduce((sum, s) => sum + s.spreadValue, 0);
  const totalTransferred = totalSpread; // Valor repassado à UnyPneus
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
    // For Excel, we use CSV with .xls extension (basic compatibility)
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
    // Generate a printable HTML version
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-pdv-border flex items-center justify-between bg-pdv-blue text-white">
          <div>
            <h2 className="text-xl font-bold">Relatório de Repasse Mensal</h2>
            <p className="text-sm text-blue-200">{franchise.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-pdv-border bg-pdv-gray-light flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-pdv-gray" size={18} />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-pdv-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pdv-blue"
              >
                {months.map((month, idx) => (
                  <option key={idx} value={idx}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-pdv-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pdv-blue"
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
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
        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <DollarSign size={18} />
              <span className="text-xs font-medium uppercase">Total Vendido</span>
            </div>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(totalSold)}</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <TrendingUp size={18} />
              <span className="text-xs font-medium uppercase">Total Spread</span>
            </div>
            <p className="text-xl font-bold text-purple-700">{formatCurrency(totalSpread)}</p>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Building2 size={18} />
              <span className="text-xs font-medium uppercase">Repasse UnyPneus</span>
            </div>
            <p className="text-xl font-bold text-amber-700">{formatCurrency(totalTransferred)}</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <DollarSign size={18} />
              <span className="text-xs font-medium uppercase">Líquido Loja</span>
            </div>
            <p className="text-xl font-bold text-green-700">{formatCurrency(totalNet)}</p>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <h3 className="font-semibold text-pdv-gray-dark mb-3">Extrato Detalhado de Vendas</h3>
          <div className="border border-pdv-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-pdv-gray-light">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-pdv-gray-dark">ID Venda</th>
                  <th className="px-4 py-3 text-left font-medium text-pdv-gray-dark">Data/Hora</th>
                  <th className="px-4 py-3 text-left font-medium text-pdv-gray-dark">Forma Pagamento</th>
                  <th className="px-4 py-3 text-right font-medium text-pdv-gray-dark">Valor Bruto</th>
                  <th className="px-4 py-3 text-right font-medium text-pdv-gray-dark">Taxa %</th>
                  <th className="px-4 py-3 text-right font-medium text-pdv-gray-dark">Spread</th>
                  <th className="px-4 py-3 text-right font-medium text-pdv-gray-dark">Valor Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pdv-border bg-white">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-pdv-gray-light/50">
                    <td className="px-4 py-3 font-mono text-pdv-blue">{sale.id}</td>
                    <td className="px-4 py-3 text-pdv-gray">{formatDate(sale.date)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sale.paymentMethod.includes('Crédito') ? 'bg-blue-100 text-blue-700' :
                        sale.paymentMethod === 'Débito' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(sale.grossValue)}</td>
                    <td className="px-4 py-3 text-right text-pdv-gray">{sale.rate.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(sale.spreadValue)}</td>
                    <td className="px-4 py-3 text-right font-medium text-green-600">{formatCurrency(sale.netValue)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-pdv-gray-light font-medium">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right">TOTAIS:</td>
                  <td className="px-4 py-3 text-right text-pdv-blue">{formatCurrency(totalSold)}</td>
                  <td className="px-4 py-3 text-right">-</td>
                  <td className="px-4 py-3 text-right text-amber-600">{formatCurrency(totalSpread)}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatCurrency(totalNet)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
