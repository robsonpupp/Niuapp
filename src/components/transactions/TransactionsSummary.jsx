import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export default function TransactionsSummary({ transactions }) {
  const totalReceitas = transactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.value, 0);

  const totalDespesas = transactions
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + t.value, 0);

  const saldo = totalReceitas - totalDespesas;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
      <Card className="shadow-lg border-green-100/50 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Total de Receitas</p>
              <p className="text-xl md:text-2xl font-bold text-green-600 truncate">
                R$ {totalReceitas.toFixed(2)}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-xl bg-green-500 shadow-md flex-shrink-0 ml-2">
              <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-red-100/50 bg-gradient-to-br from-red-50 to-white">
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Total de Despesas</p>
              <p className="text-xl md:text-2xl font-bold text-red-600 truncate">
                R$ {totalDespesas.toFixed(2)}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-xl bg-red-500 shadow-md flex-shrink-0 ml-2">
              <ArrowDownRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`shadow-lg border-${saldo >= 0 ? 'blue' : 'orange'}-100/50 bg-gradient-to-br from-${saldo >= 0 ? 'blue' : 'orange'}-50 to-white`}>
        <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">Saldo Líquido</p>
              <p className={`text-xl md:text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'} truncate`}>
                R$ {Math.abs(saldo).toFixed(2)}
              </p>
            </div>
            <div className={`p-2 md:p-3 rounded-xl bg-${saldo >= 0 ? 'blue' : 'orange'}-500 shadow-md flex-shrink-0 ml-2`}>
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}