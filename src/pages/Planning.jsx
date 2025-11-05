
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addDays, format } from "date-fns"; // Added 'format' here

import PlannedTransactionForm from "../components/planning/PlannedTransactionForm";
import PlannedTransactionsList from "../components/planning/PlannedTransactionsList";
import FutureBalance from "../components/planning/FutureBalance";
import UpcomingAlerts from "../components/planning/UpcomingAlerts";

export default function PlanningPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const queryClient = useQueryClient();

  const { data: plannedTransactions = [], isLoading } = useQuery({
    queryKey: ['plannedTransactions'],
    queryFn: () => base44.entities.PlannedTransaction.list('due_date'),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-date'),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('name'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PlannedTransaction.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannedTransactions'] });
      setShowForm(false);
      setEditingTransaction(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PlannedTransaction.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannedTransactions'] });
      setShowForm(false);
      setEditingTransaction(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.PlannedTransaction.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannedTransactions'] });
    },
  });

  // Verificar e atualizar status de atrasados
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    plannedTransactions.forEach(pt => {
      const dueDate = new Date(pt.due_date);
      dueDate.setHours(0, 0, 0, 0);
      
      if (pt.status === 'Pendente' && dueDate < today) {
        updateMutation.mutate({
          id: pt.id,
          data: { ...pt, status: 'Atrasado' }
        });
      }
    });
  }, [plannedTransactions, updateMutation]); // Added updateMutation to dependency array for correctness, though React ensures it's stable.

  const handleSubmit = async (data) => {
    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction.id, data });
    } else {
      // Se for recorrente, criar múltiplos lançamentos
      if (data.is_recurring && data.recurring_day && data.recurring_months) {
        const baseDate = new Date(data.due_date);
        const promises = [];
        
        for (let i = 0; i < data.recurring_months; i++) {
          const newDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, data.recurring_day);
          const newTransaction = {
            ...data,
            // Ensure recurring fields are not carried over to individual created transactions
            is_recurring: false, 
            recurring_day: undefined,
            recurring_months: undefined,
            due_date: format(newDate, 'yyyy-MM-dd'),
            description: `${data.description} (${i + 1}/${data.recurring_months})`
          };
          promises.push(base44.entities.PlannedTransaction.create(newTransaction));
        }
        
        await Promise.all(promises);
        queryClient.invalidateQueries({ queryKey: ['plannedTransactions'] });
        setShowForm(false);
        setEditingTransaction(null);
      } else {
        createMutation.mutate(data);
      }
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este lançamento?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleMarkAsPaid = async (plannedTransaction) => {
    // Criar transação real
    await base44.entities.Transaction.create({
      type: plannedTransaction.type === 'a_receber' ? 'receita' : 'despesa',
      value: plannedTransaction.value,
      category: plannedTransaction.category || (plannedTransaction.type === 'a_receber' ? 'Outras Receitas' : 'Outras Despesas'), // Default based on type
      payment_method: 'PIX', // Default payment method
      description: plannedTransaction.description,
      date: new Date().toISOString().split('T')[0],
      contact_id: plannedTransaction.contact_id,
      contact_name: plannedTransaction.contact_name,
    });

    // Atualizar status
    updateMutation.mutate({
      id: plannedTransaction.id,
      data: {
        ...plannedTransaction,
        status: plannedTransaction.type === 'a_receber' ? 'Recebido' : 'Pago',
        paid_date: new Date().toISOString().split('T')[0]
      }
    });

    queryClient.invalidateQueries({ queryKey: ['transactions'] });
  };

  // Filtrar transações
  const filteredTransactions = plannedTransactions.filter(pt => {
    if (filterType === 'all') return true;
    if (filterType === 'pending') return pt.status === 'Pendente';
    if (filterType === 'overdue') return pt.status === 'Atrasado';
    if (filterType === 'a_receber') return pt.type === 'a_receber';
    if (filterType === 'a_pagar') return pt.type === 'a_pagar';
    return true; // Should not be reached if filterType is always one of the above
  });

  // Contas próximas do vencimento (próximos 7 dias)
  const upcomingTransactions = plannedTransactions.filter(pt => {
    const dueDate = new Date(pt.due_date);
    const today = new Date();
    today.setHours(0,0,0,0); // Normalize today's date to start of day
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return pt.status === 'Pendente' && daysUntilDue >= 0 && daysUntilDue <= 7;
  });

  // Contas atrasadas
  const overdueTransactions = plannedTransactions.filter(pt => pt.status === 'Atrasado');

  return (
    <div className="p-3 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Planejamento Financeiro
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Gerencie contas a pagar e a receber
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(!showForm);
            }}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Lançamento
          </Button>
        </div>

        {/* Alertas */}
        <UpcomingAlerts 
          upcoming={upcomingTransactions} 
          overdue={overdueTransactions}
        />

        {/* Projeção de Saldo Futuro */}
        <FutureBalance 
          plannedTransactions={plannedTransactions}
          transactions={transactions}
        />

        {/* Formulário */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PlannedTransactionForm
                transaction={editingTransaction}
                contacts={contacts}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={filterType === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterType('all')}
            className={filterType === 'all' ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white' : ''}
            size="sm"
          >
            Todas
          </Button>
          <Button
            variant={filterType === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilterType('pending')}
            className={filterType === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}
            size="sm"
          >
            Pendentes
          </Button>
          <Button
            variant={filterType === 'overdue' ? 'default' : 'outline'}
            onClick={() => setFilterType('overdue')}
            className={filterType === 'overdue' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
            size="sm"
          >
            Atrasadas
          </Button>
          <Button
            variant={filterType === 'a_receber' ? 'default' : 'outline'}
            onClick={() => setFilterType('a_receber')}
            className={filterType === 'a_receber' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
            size="sm"
          >
            A Receber
          </Button>
          <Button
            variant={filterType === 'a_pagar' ? 'default' : 'outline'}
            onClick={() => setFilterType('a_pagar')}
            className={filterType === 'a_pagar' ? 'bg-orange-600 hover:bg-orange-700 text-white' : ''}
            size="sm"
          >
            A Pagar
          </Button>
        </div>

        {/* Lista de Lançamentos */}
        <PlannedTransactionsList
          transactions={filteredTransactions}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
    </div>
  );
}
