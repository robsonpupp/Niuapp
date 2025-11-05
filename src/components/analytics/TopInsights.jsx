import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react';

export default function TopInsights({ transactions }) {
  // Principais fontes de receita
  const revenueByCategory = {};
  transactions
    .filter(t => t.type === 'receita')
    .forEach(t => {
      revenueByCategory[t.category] = (revenueByCategory[t.category] || 0) + t.value;
    });
  
  const topRevenues = Object.entries(revenueByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Maiores gastos
  const expenseByCategory = {};
  transactions
    .filter(t => t.type === 'despesa')
    .forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.value;
    });
  
  const topExpenses = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
      {/* Principais Fontes de Receita */}
      <Card className="shadow-lg border-green-100/50 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="pb-3 px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
            Principais Fontes de Receita
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {topRevenues.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhuma receita no período
            </p>
          ) : (
            <div className="space-y-3">
              {topRevenues.map(([category, value], index) => (
                <div key={category} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      'bg-orange-600'
                    }`}>
                      <span className="text-white font-bold text-xs md:text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900 text-xs md:text-sm truncate">
                      {category}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-green-600 text-sm md:text-base">
                      R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Maiores Gastos */}
      <Card className="shadow-lg border-red-100/50 bg-gradient-to-br from-red-50 to-white">
        <CardHeader className="pb-3 px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            Maiores Gastos
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {topExpenses.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhuma despesa no período
            </p>
          ) : (
            <div className="space-y-3">
              {topExpenses.map(([category, value], index) => (
                <div key={category} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === 0 ? 'bg-red-600' :
                      index === 1 ? 'bg-red-500' :
                      'bg-red-400'
                    }`}>
                      <span className="text-white font-bold text-xs md:text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium text-gray-900 text-xs md:text-sm truncate">
                      {category}
                    </span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-red-600 text-sm md:text-base">
                      R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}