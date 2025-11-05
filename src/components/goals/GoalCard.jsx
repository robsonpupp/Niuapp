import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Edit, 
  Trash2, 
  Calendar,
  Target,
  Plus,
  Minus,
  Check
} from 'lucide-react';

const MONTHS = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function GoalCard({ goal, onEdit, onDelete, onUpdateManual }) {
  const [showManualUpdate, setShowManualUpdate] = useState(false);
  const [manualValue, setManualValue] = useState('');

  const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
  const remaining = Math.max(goal.target_value - goal.current_value, 0);
  
  // Para redução de custos, o progresso é invertido (gastar menos é melhor)
  const isReduction = goal.type === 'Redução de Custos';
  const effectiveProgress = isReduction 
    ? Math.max(100 - progress, 0) 
    : progress;

  // Cores do progresso
  let progressColor = 'bg-red-500';
  let statusColor = 'text-red-600';
  let borderColor = 'border-red-200';
  let bgGradient = 'from-red-50';

  if (effectiveProgress >= 100) {
    progressColor = 'bg-green-500';
    statusColor = 'text-green-600';
    borderColor = 'border-green-200';
    bgGradient = 'from-green-50';
  } else if (effectiveProgress >= 70) {
    progressColor = 'bg-yellow-500';
    statusColor = 'text-yellow-600';
    borderColor = 'border-yellow-200';
    bgGradient = 'from-yellow-50';
  }

  const typeConfig = {
    'Faturamento': {
      icon: TrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    'Redução de Custos': {
      icon: TrendingDown,
      color: 'text-red-600',
      bg: 'bg-red-100'
    },
    'Reserva de Caixa': {
      icon: PiggyBank,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    }
  };

  const config = typeConfig[goal.type];
  const TypeIcon = config.icon;

  const handleAddToReserve = () => {
    if (manualValue && parseFloat(manualValue) > 0) {
      const newValue = goal.current_value + parseFloat(manualValue);
      onUpdateManual(goal.id, newValue);
      setManualValue('');
      setShowManualUpdate(false);
    }
  };

  const handleSubtractFromReserve = () => {
    if (manualValue && parseFloat(manualValue) > 0) {
      const newValue = Math.max(goal.current_value - parseFloat(manualValue), 0);
      onUpdateManual(goal.id, newValue);
      setManualValue('');
      setShowManualUpdate(false);
    }
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 border-2 ${borderColor} bg-gradient-to-br ${bgGradient} to-white`}>
      <CardHeader className="pb-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className={`p-2 rounded-lg ${config.bg} flex-shrink-0`}>
              <TypeIcon className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-base truncate">
                {goal.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {goal.type}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {goal.period_type === 'Mensal' 
                    ? `${MONTHS[goal.month]}/${goal.year}`
                    : goal.year
                  }
                </div>
              </div>
            </div>
          </div>
          <Badge 
            variant={goal.status === 'Ativa' ? 'default' : 'secondary'}
            className={goal.status === 'Ativa' ? 'bg-emerald-600' : ''}
          >
            {goal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        {/* Progresso */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              {isReduction ? 'Economia:' : 'Progresso:'}
            </span>
            <span className={`text-2xl font-bold ${statusColor}`}>
              {effectiveProgress.toFixed(0)}%
            </span>
          </div>
          
          <Progress 
            value={effectiveProgress} 
            className="h-2 mb-2"
          />

          <div className="flex justify-between items-center text-sm gap-2">
            <div>
              <p className="text-gray-600">
                R$ {goal.current_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500">
                de R$ {goal.target_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            {remaining > 0 && (
              <div className="text-right">
                <p className={`font-semibold ${statusColor}`}>
                  Falta: R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Categorias vinculadas */}
        {goal.linked_categories && goal.linked_categories.length > 0 && (
          <div className="mb-3 pb-3 border-b">
            <p className="text-xs text-gray-500 mb-1">Categorias vinculadas:</p>
            <div className="flex flex-wrap gap-1">
              {goal.linked_categories.map(cat => (
                <Badge key={cat} variant="secondary" className="text-xs">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Controles manuais para Reserva de Caixa */}
        {goal.is_manual && goal.status === 'Ativa' && (
          <div className="mb-3 pb-3 border-b">
            {!showManualUpdate ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowManualUpdate(true)}
              >
                <Target className="w-4 h-4 mr-2" />
                Atualizar Reserva
              </Button>
            ) : (
              <div className="space-y-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Valor"
                  value={manualValue}
                  onChange={(e) => setManualValue(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddToReserve}
                    className="hover:bg-green-50 hover:text-green-600"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSubtractFromReserve}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowManualUpdate(false);
                      setManualValue('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
            onClick={() => onEdit(goal)}
            size="sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            onClick={() => onDelete(goal.id)}
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}