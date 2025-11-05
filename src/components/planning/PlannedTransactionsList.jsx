import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Edit, 
  Trash2, 
  Inbox,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function PlannedTransactionsList({ 
  transactions, 
  isLoading, 
  onEdit, 
  onDelete,
  onMarkAsPaid 
}) {
  if (isLoading) {
    return (
      <Card className="shadow-lg border-emerald-100/50">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-base md:text-xl">Carregando...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="shadow-lg border-emerald-100/50">
        <CardContent className="py-8 md:py-12 px-4 md:px-6">
          <div className="text-center text-gray-500">
            <Inbox className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base md:text-lg font-medium">Nenhum lançamento encontrado</p>
            <p className="text-xs md:text-sm mt-2">Adicione um novo lançamento para começar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusConfig = (transaction) => {
    const today = new Date();
    const dueDate = new Date(transaction.due_date);
    const daysUntilDue = differenceInDays(dueDate, today);

    if (transaction.status === 'Pago' || transaction.status === 'Recebido') {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
        badge: 'bg-green-100 text-green-700',
        label: transaction.status
      };
    }

    if (transaction.status === 'Atrasado') {
      return {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-50',
        badge: 'bg-red-100 text-red-700',
        label: 'Atrasado'
      };
    }

    if (daysUntilDue <= 3) {
      return {
        icon: AlertTriangle,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        badge: 'bg-orange-100 text-orange-700',
        label: `${daysUntilDue} dia(s)`
      };
    }

    return {
      icon: Clock,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      badge: 'bg-gray-100 text-gray-700',
      label: 'Pendente'
    };
  };

  return (
    <Card className="shadow-lg border-emerald-100/50">
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="text-base md:text-xl">
          Lançamentos ({transactions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const statusConfig = getStatusConfig(transaction);
            const StatusIcon = statusConfig.icon;
            const isPending = transaction.status === 'Pendente' || transaction.status === 'Atrasado';

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow ${statusConfig.bg}`}
              >
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                    {transaction.type === 'a_receber' ? (
                      <div className="p-1.5 rounded-lg bg-green-100 flex-shrink-0">
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="p-1.5 rounded-lg bg-orange-100 flex-shrink-0">
                        <ArrowDownRight className="w-4 h-4 text-orange-600" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
                        {transaction.description}
                      </p>
                      {transaction.contact_name && (
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.contact_name}
                        </p>
                      )}
                      {transaction.category && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {transaction.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-base md:text-lg ${
                      transaction.type === 'a_receber' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      R$ {transaction.value.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                      <span className="font-medium">
                        Venc: {format(new Date(transaction.due_date), "dd/MM/yyyy")}
                      </span>
                    </div>
                    <Badge className={statusConfig.badge}>
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <div className="flex gap-1 md:gap-2">
                    {isPending && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 h-8 px-2 md:px-3"
                        onClick={() => onMarkAsPaid(transaction)}
                      >
                        <CheckCircle className="w-3.5 h-3.5 md:mr-1" />
                        <span className="hidden md:inline">Pagar</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => onEdit(transaction)}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                      onClick={() => onDelete(transaction.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}