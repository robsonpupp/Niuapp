import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileBarChart, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar
} from "lucide-react";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import DRETable from "../components/reports/DRETable";
import DREChart from "../components/reports/DREChart";
import DREHealthIndicator from "../components/reports/DREHealthIndicator";
import PeriodSelector from "../components/reports/PeriodSelector";

export default function ReportsPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [viewType, setViewType] = useState('month'); // 'month' ou 'quarter'

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-date'),
  });

  // Calcular DRE para um período específico
  const calculateDRE = (month, year) => {
    const monthStart = startOfMonth(new Date(year, month - 1, 1));
    const monthEnd = endOfMonth(new Date(year, month - 1, 1));
    
    const periodTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= monthStart && tDate <= monthEnd;
    });

    // 1. Receita Bruta
    const receitaBruta = periodTransactions
      .filter(t => t.type === 'receita')
      .reduce((sum, t) => sum + t.value, 0);

    // 2. Deduções
    const deducoes = periodTransactions
      .filter(t => t.type === 'deducao')
      .reduce((sum, t) => sum + t.value, 0);

    // 3. Receita Líquida
    const receitaLiquida = receitaBruta - deducoes;

    // 4. Custos Variáveis
    const custosVariaveis = periodTransactions
      .filter(t => t.type === 'despesa' && t.expense_type === 'Variável')
      .reduce((sum, t) => sum + t.value, 0);

    // 5. Lucro Bruto
    const lucroBruto = receitaLiquida - custosVariaveis;

    // 6. Despesas Fixas (excluindo impostos)
    const despesasFixas = periodTransactions
      .filter(t => 
        t.type === 'despesa' && 
        t.expense_type === 'Fixa' && 
        t.category !== 'Impostos Fixos (DAS)'
      )
      .reduce((sum, t) => sum + t.value, 0);

    // 7. Lucro Operacional
    const lucroOperacional = lucroBruto - despesasFixas;

    // 8. Impostos
    const impostos = periodTransactions
      .filter(t => t.category === 'Impostos Fixos (DAS)')
      .reduce((sum, t) => sum + t.value, 0);

    // 9. Lucro Líquido
    const lucroLiquido = lucroOperacional - impostos;

    return {
      receitaBruta,
      deducoes,
      receitaLiquida,
      custosVariaveis,
      lucroBruto,
      despesasFixas,
      lucroOperacional,
      impostos,
      lucroLiquido,
      margemBruta: receitaBruta > 0 ? (lucroBruto / receitaBruta) * 100 : 0,
      margemLiquida: receitaBruta > 0 ? (lucroLiquido / receitaBruta) * 100 : 0,
    };
  };

  // DRE do período atual
  const currentDRE = calculateDRE(selectedMonth, selectedYear);

  // DRE do mês anterior para comparação
  const previousDate = subMonths(new Date(selectedYear, selectedMonth - 1, 1), 1);
  const previousDRE = calculateDRE(previousDate.getMonth() + 1, previousDate.getFullYear());

  // Variação percentual
  const variation = previousDRE.lucroLiquido !== 0
    ? ((currentDRE.lucroLiquido - previousDRE.lucroLiquido) / Math.abs(previousDRE.lucroLiquido)) * 100
    : 0;

  // Dados para o gráfico (últimos 6 meses)
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(selectedYear, selectedMonth - 1, 1), i);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dre = calculateDRE(month, year);
    
    chartData.push({
      month: format(date, 'MMM/yy', { locale: ptBR }),
      lucroLiquido: dre.lucroLiquido,
      receitaBruta: dre.receitaBruta,
      lucroBruto: dre.lucroBruto,
    });
  }

  // Determinar saúde financeira
  const getHealthStatus = () => {
    if (currentDRE.lucroLiquido < 0) return 'critical';
    if (currentDRE.margemLiquida < 10) return 'warning';
    return 'healthy';
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="p-3 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Relatórios Financeiros
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              DRE - Demonstrativo de Resultados do Exercício
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto border-emerald-600 text-emerald-600 hover:bg-emerald-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        {/* Seletor de Período */}
        <PeriodSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />

        {/* Indicador de Saúde e Comparação */}
        <div className="grid md:grid-cols-2 gap-4">
          <DREHealthIndicator 
            status={healthStatus}
            lucroLiquido={currentDRE.lucroLiquido}
            margemLiquida={currentDRE.margemLiquida}
          />

          <Card className="shadow-lg border-emerald-100/50">
            <CardContent className="pt-6 p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Comparação com Mês Anterior</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    R$ {previousDRE.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} → 
                    R$ {currentDRE.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${variation >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                  {variation >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-white" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolução */}
        <DREChart data={chartData} />

        {/* Tabela DRE */}
        <DRETable 
          dre={currentDRE}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}