import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

export default function BalanceCard({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  isCurrency = false, 
  isNegative = false,
  trend 
}) {
  const displayValue = isCurrency 
    ? `R$ ${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value;

  return (
    <Card className="relative overflow-hidden border-emerald-100/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full transform translate-x-8 md:translate-x-12 -translate-y-8 md:-translate-y-12`} />
      <CardContent className="p-4 md:p-6">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
            <h3 className={`text-xl md:text-2xl font-bold truncate ${isNegative && value > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {isNegative && value > 0 && '-'}{displayValue}
            </h3>
          </div>
          <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md flex-shrink-0`}>
            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs md:text-sm">
            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
            <span className="text-green-600 font-medium">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}