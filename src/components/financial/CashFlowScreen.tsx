import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { mockPayables, mockReceivables, mockCashTransactions } from '@/data/financialMockData';
import { format, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';

interface CashFlowScreenProps {
  franchiseId: string;
}

export const CashFlowScreen = ({ franchiseId }: CashFlowScreenProps) => {
  const [period, setPeriod] = useState<'7' | '15' | '30'>('15');
  
  const today = startOfDay(new Date());
  const days = parseInt(period);
  
  // Generate projection data
  const projectionData = [];
  let runningBalance = 5000; // Starting balance (mock)
  
  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Get receivables due on this date
    const dayReceivables = mockReceivables
      .filter(r => r.status !== 'paid' && r.status !== 'cancelled')
      .flatMap(r => r.installments)
      .filter(inst => 
        inst.status !== 'paid' && 
        format(inst.dueDate, 'yyyy-MM-dd') === dateStr
      );
    
    // Get payables due on this date
    const dayPayables = mockPayables
      .filter(p => p.status !== 'paid' && p.status !== 'cancelled')
      .flatMap(p => p.installments)
      .filter(inst => 
        inst.status !== 'paid' && 
        format(inst.dueDate, 'yyyy-MM-dd') === dateStr
      );
    
    const expectedIncome = dayReceivables.reduce((sum, r) => sum + (r.amount - r.paidAmount), 0);
    const expectedExpenses = dayPayables.reduce((sum, p) => sum + (p.amount - p.paidAmount), 0);
    
    runningBalance = runningBalance + expectedIncome - expectedExpenses;
    
    projectionData.push({
      date,
      expectedIncome,
      expectedExpenses,
      balance: runningBalance,
      receivablesCount: dayReceivables.length,
      payablesCount: dayPayables.length
    });
  }

  // Summary calculations
  const totalExpectedIncome = projectionData.reduce((sum, d) => sum + d.expectedIncome, 0);
  const totalExpectedExpenses = projectionData.reduce((sum, d) => sum + d.expectedExpenses, 0);
  const finalBalance = projectionData[projectionData.length - 1]?.balance || 0;
  const minBalance = Math.min(...projectionData.map(d => d.balance));

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex gap-2">
        <Button 
          variant={period === '7' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('7')}
        >
          7 dias
        </Button>
        <Button 
          variant={period === '15' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('15')}
        >
          15 dias
        </Button>
        <Button 
          variant={period === '30' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('30')}
        >
          30 dias
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Entradas Previstas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalExpectedIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              próximos {period} dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              Saídas Previstas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpectedExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              próximos {period} dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              Saldo Final Projetado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${finalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(finalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              em {format(addDays(today, days - 1), 'dd/MM', { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        <Card className={minBalance < 0 ? 'border-red-300' : ''}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Saldo Mínimo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${minBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(minBalance)}
            </div>
            {minBalance < 0 && (
              <p className="text-xs text-red-600 font-medium">
                Atenção: saldo negativo previsto!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Projection Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projeção Diária</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">A Receber</TableHead>
                <TableHead className="text-center">A Pagar</TableHead>
                <TableHead className="text-right">Entradas</TableHead>
                <TableHead className="text-right">Saídas</TableHead>
                <TableHead className="text-right">Saldo Projetado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectionData.map((day, index) => {
                const isToday = index === 0;
                const hasMovement = day.expectedIncome > 0 || day.expectedExpenses > 0;
                
                return (
                  <TableRow 
                    key={index} 
                    className={isToday ? 'bg-muted/50' : hasMovement ? '' : 'opacity-60'}
                  >
                    <TableCell className="font-medium">
                      {format(day.date, "EEE, dd/MM", { locale: ptBR })}
                      {isToday && <span className="ml-2 text-xs text-primary">(Hoje)</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      {day.receivablesCount > 0 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs bg-green-100 text-green-800 rounded-full">
                          {day.receivablesCount}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {day.payablesCount > 0 && (
                        <span className="inline-flex items-center justify-center w-6 h-6 text-xs bg-red-100 text-red-800 rounded-full">
                          {day.payablesCount}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {day.expectedIncome > 0 ? formatCurrency(day.expectedIncome) : '-'}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {day.expectedExpenses > 0 ? formatCurrency(day.expectedExpenses) : '-'}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${day.balance >= 0 ? 'text-foreground' : 'text-red-600'}`}>
                      {formatCurrency(day.balance)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
