import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function DREHealthIndicator({ status, lucroLiquido, margemLiquida }) {
  const statusConfig = {
    healthy: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'Saudável',
      description: 'Lucro positivo acima da meta',
      iconBg: 'bg-green-500'
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Atenção',
      description: 'Margem de lucro abaixo de 10%',
      iconBg: 'bg-yellow-500'
    },
    critical: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      title: 'Crítico',
      description: 'Prejuízo no período',
      iconBg: 'bg-red-500'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={`shadow-lg border-2 ${config.borderColor} ${config.bgColor}`}>
      <CardContent className="pt-6 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${config.iconBg}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Status Financeiro</p>
              <p className={`text-xl md:text-2xl font-bold ${config.color}`}>
                {config.title}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Lucro Líquido:</span>
            <span className={`font-bold text-lg ${config.color}`}>
              R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Margem Líquida:</span>
            <span className={`font-bold ${config.color}`}>
              {margemLiquida.toFixed(1)}%
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3 pt-3 border-t">
          {config.description}
        </p>
      </CardContent>
    </Card>
  );
}