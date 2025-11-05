import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function RecentTransactions({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="shadow-lg border-emerald-100/50">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-xl">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
            Movimentações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="text-center py-6 md:py-8 text-gray-500">
            <Clock className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm md:text-base">Nenhuma movimentação ainda</p>
            <Link to={createPageUrl("Transactions")}>
              <Button variant="link" className="mt-2 text-sm md:text-base">
                Adicionar primeira movimentação →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-emerald-100/50">
      <CardHeader className="flex flex-row items-center justify-between px-4 md:px-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-xl">
          <Clock className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
          Recentes
        </CardTitle>
        <Link to={createPageUrl("Transactions")}>
          <Button variant="link" className="text-emerald-600 hover:text-emerald-700 text-sm md:text-base p-0">
            Ver todas →
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="space-y-2 md:space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-100 gap-2"
            >
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <div className={`p-1.5 md:p-2 rounded-lg flex-shrink-0 ${
                  transaction.type === 'receita' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {transaction.type === 'receita' ? (
                    <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-xs md:text-sm truncate">
                    {transaction.description || transaction.category}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(transaction.date), "dd 'de' MMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`font-bold text-xs md:text-sm ${
                  transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.value.toFixed(2)}
                </p>
                <Badge variant="outline" className="text-xs mt-1 hidden md:inline-flex">
                  {transaction.payment_method}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}