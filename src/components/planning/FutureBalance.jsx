import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { addDays } from 'date-fns';

export default function FutureBalance({ plannedTransactions, transactions }) {
  // Calcular saldo atual
  const currentBalance = transactions.reduce((sum, t) => {
    return t.type === 'receita' ? sum + t.value : sum - t.value;
  }, 0);

  // Filtrar apenas pendentes
  const pendingTransactions = plannedTransactions.filter(
    pt => pt.status === 'Pendente' || pt.status === 'Atrasado'
  );

  // Calcular totais
  const totalReceivable = pendingTransactions
    .filter(pt => pt.type === 'a_receber')
    .reduce((sum, pt) => sum + pt.value, 0);

  const totalPayable = pendingTransactions
    .filter(pt => pt.type === 'a_pagar')
    .reduce((sum, pt) => sum + pt.value, 0);

  // Projeção de saldo
  const projectedBalance = currentBalance + totalReceivable - totalPayable;

  // Próximos 7 dias
  const next7Days = pendingTransactions.filter(pt => {
    const dueDate = new Date(pt.due_date);
    const today = new Date();
    const days = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 7;
  });

  const next7DaysReceivable = next7Days
    .filter(pt => pt.type === 'a_receber')
    .reduce((sum, pt) => sum + pt.value, 0);

  const next7DaysPayable = next7Days
    .filter(pt => pt.type === 'a_pagar')
    .reduce((sum, pt) => sum + pt.value, 0);

  const next7DaysBalance = currentBalance + next7DaysReceivable - next7DaysPayable;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
      <Card className="shadow-lg border-blue-100/50 bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="pt-3 md:pt-4 lg:pt-6 p-2 md:p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-2">
            <div className="w-full">
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 text-center lg:text-left">Saldo Atual</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-blue-600 break-words text-center lg:text-left">
                R$ {currentBalance.toFixed(2)}
              </p>
            </div>
            <div className="p-2 md:p-2 lg:p-3 rounded-xl bg-blue-500 flex-shrink-0">
              <Wallet className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-green-100/50 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="pt-3 md:pt-4 lg:pt-6 p-2 md:p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-2">
            <div className="w-full">
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 text-center lg:text-left">A Receber</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-green-600 break-words text-center lg:text-left">
                +R$ {totalReceivable.toFixed(2)}
              </p>
            </div>
            <div className="p-2 md:p-2 lg:p-3 rounded-xl bg-green-500 flex-shrink-0">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-orange-100/50 bg-gradient-to-br from-orange-50 to-white">
        <CardContent className="pt-3 md:pt-4 lg:pt-6 p-2 md:p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-2">
            <div className="w-full">
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 text-center lg:text-left">A Pagar</p>
              <p className="text-base md:text-xl lg:text-2xl font-bold text-orange-600 break-words text-center lg:text-left">
                -R$ {totalPayable.toFixed(2)}
              </p>
            </div>
            <div className="p-2 md:p-2 lg:p-3 rounded-xl bg-orange-500 flex-shrink-0">
              <TrendingDown className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`shadow-lg border-2 ${
        projectedBalance >= currentBalance 
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white' 
          : 'border-red-200 bg-gradient-to-br from-red-50 to-white'
      }`}>
        <CardContent className="pt-3 md:pt-4 lg:pt-6 p-2 md:p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-2">
            <div className="w-full">
              <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 text-center lg:text-left">Saldo Projetado</p>
              <p className={`text-base md:text-xl lg:text-2xl font-bold break-words text-center lg:text-left ${
                projectedBalance >= currentBalance ? 'text-emerald-600' : 'text-red-600'
              }`}>
                R$ {projectedBalance.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1 text-center lg:text-left">
                Próx. 7 dias: R$ {next7DaysBalance.toFixed(2)}
              </p>
            </div>
            <div className={`p-2 md:p-2 lg:p-3 rounded-xl flex-shrink-0 ${
              projectedBalance >= currentBalance ? 'bg-emerald-500' : 'bg-red-500'
            }`}>
              {projectedBalance >= currentBalance ? (
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
              ) : (
                <TrendingDown className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}