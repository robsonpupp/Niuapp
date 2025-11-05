import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

import GoalForm from "../components/goals/GoalForm";
import GoalCard from "../components/goals/GoalCard";
import GoalsSummary from "../components/goals/GoalsSummary";

export default function GoalsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('all');

  const queryClient = useQueryClient();

  const { data: goals = [], isLoading: loadingGoals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => base44.entities.Goal.list('-created_date'),
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Goal.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowForm(false);
      setEditingGoal(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Goal.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setShowForm(false);
      setEditingGoal(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Goal.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });

  // Calcular valor atual das metas automaticamente
  const calculateGoalProgress = (goal) => {
    // Se for meta manual (Reserva de Caixa), usar o valor salvo
    if (goal.is_manual) {
      return goal.current_value || 0;
    }

    // Filtrar transações do período da meta
    let periodTransactions = [];
    
    if (goal.period_type === 'Mensal' && goal.month && goal.year) {
      const monthStart = startOfMonth(new Date(goal.year, goal.month - 1, 1));
      const monthEnd = endOfMonth(new Date(goal.year, goal.month - 1, 1));
      
      periodTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= monthStart && tDate <= monthEnd;
      });
    } else if (goal.period_type === 'Anual' && goal.year) {
      const yearStart = startOfYear(new Date(goal.year, 0, 1));
      const yearEnd = endOfYear(new Date(goal.year, 0, 1));
      
      periodTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate >= yearStart && tDate <= yearEnd;
      });
    }

    // Se tem categorias vinculadas, filtrar por elas
    if (goal.linked_categories && goal.linked_categories.length > 0) {
      periodTransactions = periodTransactions.filter(t => 
        goal.linked_categories.includes(t.category)
      );
    }

    // Calcular valor baseado no tipo
    if (goal.type === 'Faturamento') {
      // Somar todas as receitas
      return periodTransactions
        .filter(t => t.type === 'receita')
        .reduce((sum, t) => sum + t.value, 0);
    } else if (goal.type === 'Redução de Custos') {
      // Somar todas as despesas (objetivo é gastar MENOS que o target)
      return periodTransactions
        .filter(t => t.type === 'despesa')
        .reduce((sum, t) => sum + t.value, 0);
    }

    return goal.current_value || 0;
  };

  // Atualizar metas automaticamente quando as transações mudarem
  useEffect(() => {
    if (!loadingGoals && !loadingTransactions && goals.length > 0) {
      goals.forEach(goal => {
        if (!goal.is_manual) {
          const newValue = calculateGoalProgress(goal);
          if (newValue !== goal.current_value) {
            updateMutation.mutate({ 
              id: goal.id, 
              data: { ...goal, current_value: newValue }
            });
          }
        }
      });
    }
  }, [transactions, goals, loadingGoals, loadingTransactions]);

  const handleSubmit = (data) => {
    if (editingGoal) {
      updateMutation.mutate({ id: editingGoal.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleUpdateManualGoal = (goalId, newValue) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      updateMutation.mutate({
        id: goalId,
        data: { ...goal, current_value: newValue }
      });
    }
  };

  // Filtrar metas
  const filteredGoals = goals.filter(goal => {
    if (filterPeriod === 'all') return true;
    return goal.period_type === filterPeriod;
  });

  // Metas próximas de serem alcançadas (90%+)
  const nearCompletionGoals = goals.filter(goal => {
    const progress = (goal.current_value / goal.target_value) * 100;
    return goal.status === 'Ativa' && progress >= 90 && progress < 100;
  });

  // Metas com baixo progresso (<30% e já passado metade do período)
  const lowProgressGoals = goals.filter(goal => {
    if (goal.status !== 'Ativa') return false;
    
    const progress = (goal.current_value / goal.target_value) * 100;
    if (progress >= 30) return false;

    const today = new Date();
    
    if (goal.period_type === 'Mensal' && goal.month && goal.year) {
      const currentDay = today.getDate();
      const daysInMonth = new Date(goal.year, goal.month, 0).getDate();
      return currentDay > daysInMonth / 2; // Já passou metade do mês
    }
    
    if (goal.period_type === 'Anual' && goal.year) {
      const currentMonth = today.getMonth() + 1;
      return currentMonth > 6; // Já passou metade do ano
    }

    return false;
  });

  return (
    <div className="p-3 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Metas Financeiras
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Acompanhe seu progresso e atinja seus objetivos
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingGoal(null);
              setShowForm(!showForm);
            }}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        {/* Alertas */}
        {nearCompletionGoals.length > 0 && (
          <Alert className="border-green-200 bg-green-50">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              <strong>{nearCompletionGoals.length} meta(s)</strong> próxima(s) de serem concluídas! 🎉
            </AlertDescription>
          </Alert>
        )}

        {lowProgressGoals.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 text-sm">
              <strong>{lowProgressGoals.length} meta(s)</strong> com progresso abaixo do esperado para o período.
            </AlertDescription>
          </Alert>
        )}

        {/* Resumo */}
        <GoalsSummary goals={goals} />

        {/* Formulário */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GoalForm
                goal={editingGoal}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros */}
        <div className="flex gap-2">
          <Button
            variant={filterPeriod === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterPeriod('all')}
            className={filterPeriod === 'all' ? 'bg-gradient-to-r from-emerald-500 to-blue-600' : ''}
            size="sm"
          >
            Todas
          </Button>
          <Button
            variant={filterPeriod === 'Mensal' ? 'default' : 'outline'}
            onClick={() => setFilterPeriod('Mensal')}
            className={filterPeriod === 'Mensal' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            size="sm"
          >
            Mensais
          </Button>
          <Button
            variant={filterPeriod === 'Anual' ? 'default' : 'outline'}
            onClick={() => setFilterPeriod('Anual')}
            className={filterPeriod === 'Anual' ? 'bg-purple-600 hover:bg-purple-700' : ''}
            size="sm"
          >
            Anuais
          </Button>
        </div>

        {/* Lista de Metas */}
        {loadingGoals ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando metas...</p>
          </div>
        ) : filteredGoals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg mb-2">
              Nenhuma meta cadastrada ainda
            </p>
            <p className="text-gray-400 text-sm">
              Clique em "Nova Meta" para começar
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onUpdateManual={handleUpdateManualGoal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}