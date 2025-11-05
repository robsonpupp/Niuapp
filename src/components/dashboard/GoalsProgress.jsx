import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Target, TrendingUp } from 'lucide-react';

export default function GoalsProgress({ goals }) {
  if (!goals || goals.length === 0) {
    return (
      <Card className="shadow-lg border-emerald-100/50">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-xl">
            <Target className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
            Metas em Progresso
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <div className="text-center py-6 md:py-8 text-gray-500">
            <Target className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm md:text-base">Nenhuma meta criada ainda</p>
            <Link to={createPageUrl("Goals")}>
              <Button variant="link" className="mt-2 text-sm md:text-base">
                Criar primeira meta →
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
          <Target className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
          Metas
        </CardTitle>
        <Link to={createPageUrl("Goals")}>
          <Button variant="link" className="text-emerald-600 hover:text-emerald-700 text-sm md:text-base p-0">
            Ver todas →
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="space-y-3 md:space-y-4">
          {goals.map((goal) => {
            const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
            const remaining = Math.max(goal.target_value - goal.current_value, 0);
            
            let statusColor = 'text-red-600';
            let progressColor = 'bg-red-500';
            
            if (progress >= 100) {
              statusColor = 'text-green-600';
              progressColor = 'bg-green-500';
            } else if (progress >= 70) {
              statusColor = 'text-yellow-600';
              progressColor = 'bg-yellow-500';
            }

            return (
              <div key={goal.id} className="p-3 md:p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{goal.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{goal.type}</p>
                  </div>
                  <div className={`text-right ${statusColor} flex-shrink-0`}>
                    <p className="text-lg md:text-2xl font-bold">{progress.toFixed(0)}%</p>
                  </div>
                </div>
                
                <Progress value={progress} className="h-2 mb-2" />
                
                <div className="flex justify-between items-center text-xs md:text-sm gap-2">
                  <span className="text-gray-600 truncate">
                    R$ {goal.current_value.toFixed(2)}
                  </span>
                  {remaining > 0 && (
                    <span className="text-gray-500 flex-shrink-0">
                      Falta: R$ {remaining.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}