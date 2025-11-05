import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ptBR } from "date-fns/locale";

import PeriodSelector from "../components/reports/PeriodSelector";
import ReportByCategory from "../components/analytics/ReportByCategory";
import ReportByContact from "../components/analytics/ReportByContact";
import TopInsights from "../components/analytics/TopInsights";

export default function AnalyticsPage() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-date'),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('name'),
  });

  // Filtrar transações do período selecionado
  const monthStart = startOfMonth(new Date(selectedYear, selectedMonth - 1, 1));
  const monthEnd = endOfMonth(new Date(selectedYear, selectedMonth - 1, 1));
  
  const periodTransactions = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate >= monthStart && tDate <= monthEnd;
  });

  const handleExportPDF = () => {
    alert('Exportação PDF em desenvolvimento...');
  };

  const handleExportExcel = () => {
    alert('Exportação Excel em desenvolvimento...');
  };

  return (
    <div className="p-3 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Relatórios e Análises
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Análises detalhadas por categoria, cliente e fornecedor
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="flex-1 md:flex-none border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleExportExcel}
              className="flex-1 md:flex-none border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              <FileText className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>

        {/* Seletor de Período */}
        <PeriodSelector
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
        />

        {/* Insights Principais */}
        <TopInsights transactions={periodTransactions} />

        {/* Relatórios por Categoria */}
        <ReportByCategory transactions={periodTransactions} />

        {/* Relatórios por Contato */}
        <ReportByContact transactions={periodTransactions} contacts={contacts} />
      </div>
    </div>
  );
}