import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Target, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

export default function GoalsSummary({ goals }) {
  const activeGoals = goals.filter(g => g.status === 'Ativa');
  const completedGoals = goals.filter(g => g.status === 'Concluída');
  
  const onTrackGoals = activeGoals.filter(g => {
    const progress = (g.current_value / g.target_value) * 100;
    return progress >= 50;
  });

  const atRiskGoals = activeGoals.filter(g => {
    const progress = (g.current_value / g.target_value) * 100;
    return progress < 50;
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
        <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Total de Metas</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-600">
                {goals.length}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-xl bg-blue-500 flex-shrink-0">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
        <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Concluídas</p>
              <p className="text-2xl md:text-3xl font-bold text-green-600">
                {completedGoals.length}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-xl bg-green-500 flex-shrink-0">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
        <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1">No Caminho</p>
              <p className="text-2xl md:text-3xl font-bold text-emerald-600">
                {onTrackGoals.length}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-xl bg-emerald-500 flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-100">
        <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs md:text-sm text-gray-600 mb-1">Em Risco</p>
              <p className="text-2xl md:text-3xl font-bold text-orange-600">
                {atRiskGoals.length}
              </p>
            </div>
            <div className="p-2 md:p-3 rounded-xl bg-orange-500 flex-shrink-0">
              <AlertCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}