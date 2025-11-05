import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  Calendar,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import BalanceCard from "../components/dashboard/BalanceCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import GoalsProgress from "../components/dashboard/GoalsProgress";

export default function Dashboard() {
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-date'),
  });

  const { data: goals = [], isLoading: loadingGoals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list('-created_date'),
  });

  const { data: plannedTransactions = [] } = useQuery({
    queryKey: ['plannedTransactions'],
    queryFn: () => base44.entities.PlannedTransaction.list('due_date'),
  });

  // Calcular saldo total
  const totalBalance = transactions.reduce((sum, t) => {
    return t.type === 'receita' ? sum + t.value : sum - t.value;
  }, 0);

  // Receitas e despesas do mês atual
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date >= monthStart && date <= monthEnd;
  });

  const monthRevenue = currentMonthTransactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.value, 0);

  const monthExpenses = currentMonthTransactions
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + t.value, 0);

  // Gráfico de fluxo de caixa dos últimos 6 meses
  const getLast6MonthsData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const month = subMonths(new Date(), i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= monthStart && date <= monthEnd;
      });

      const revenue = monthTransactions
        .filter(t => t.type === 'receita')
        .reduce((sum, t) => sum + t.value, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'despesa')
        .reduce((sum, t) => sum + t.value, 0);

      data.push({
        month: format(month, 'MMM', { locale: ptBR }),
        receitas: revenue,
        despesas: expenses,
      });
    }
    return data;
  };

  const cashFlowData = getLast6MonthsData();

  // Contas próximas do vencimento (próximos 7 dias)
  const upcomingBills = plannedTransactions.filter(pt => {
    const dueDate = new Date(pt.due_date);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return pt.status === 'Pendente' && daysUntilDue >= 0 && daysUntilDue <= 7;
  });

  return (
    <div className="p-3 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>
          <Link to={createPageUrl("Transactions")} className="w-full md:w-auto">
            <Button className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Nova Movimentação
            </Button>
          </Link>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <BalanceCard
            title="Saldo Total"
            value={totalBalance}
            icon={Wallet}
            gradient="from-emerald-500 to-emerald-600"
            isCurrency
          />
          <BalanceCard
            title="Receitas do Mês"
            value={monthRevenue}
            icon={TrendingUp}
            gradient="from-green-500 to-green-600"
            isCurrency
            trend="+12%"
          />
          <BalanceCard
            title="Despesas do Mês"
            value={monthExpenses}
            icon={TrendingDown}
            gradient="from-red-500 to-red-600"
            isCurrency
            isNegative
          />
          <BalanceCard
            title="Metas Ativas"
            value={goals.filter(g => g.status === 'Ativa').length}
            icon={Target}
            gradient="from-blue-500 to-blue-600"
          />
        </div>

        {/* Alertas */}
        {upcomingBills.length > 0 && (
          <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3 px-4 md:px-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-orange-600 flex-shrink-0" />
                <CardTitle className="text-sm md:text-lg text-orange-900">
                  {upcomingBills.length} conta(s) próxima(s) do vencimento
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="space-y-2">
                {upcomingBills.slice(0, 3).map(bill => (
                  <div key={bill.id} className="flex justify-between items-center text-xs md:text-sm gap-2">
                    <span className="text-gray-700 truncate flex-1">{bill.description}</span>
                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                      <span className="text-gray-600">
                        {format(new Date(bill.due_date), "dd/MM")}
                      </span>
                      <span className="font-semibold text-gray-900">
                        R$ {bill.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Link to={createPageUrl("Planning")}>
                <Button variant="link" className="mt-2 p-0 h-auto text-orange-700 hover:text-orange-800 text-sm">
                  Ver todas →
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Gráfico e Ações Rápidas */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <Card className="lg:col-span-2 shadow-lg border-emerald-100/50">
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="flex items-center gap-2 text-base md:text-xl">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
                Fluxo de Caixa
              </CardTitle>
            </CardHeader>
            <CardContent className="px-2 md:px-6">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value) => `R$ ${value.toFixed(2)}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="receitas" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorReceitas)" 
                    name="Receitas"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesas" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorDespesas)" 
                    name="Despesas"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <QuickActions />
        </div>

        {/* Metas e Transações Recentes */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          <GoalsProgress goals={goals.filter(g => g.status === 'Ativa').slice(0, 3)} />
          <RecentTransactions transactions={transactions.slice(0, 5)} />
        </div>
      </div>
    </div>
  );
}