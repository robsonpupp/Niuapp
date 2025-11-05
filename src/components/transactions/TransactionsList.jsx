import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, Edit, Trash2, Inbox, MinusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function TransactionsList({ transactions, isLoading, onEdit, onDelete }) {
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
            <p className="text-base md:text-lg font-medium">Nenhuma movimentação encontrada</p>
            <p className="text-xs md:text-sm mt-2">Adicione uma nova movimentação para começar</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-emerald-100/50">
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="text-base md:text-xl">
          Todas as Movimentações ({transactions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {/* Mobile: Card Layout */}
        <div className="md:hidden space-y-3">
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {transaction.type === 'receita' ? (
                    <div className="p-1.5 rounded-lg bg-green-100 flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    </div>
                  ) : transaction.type === 'deducao' ? (
                    <div className="p-1.5 rounded-lg bg-orange-100 flex-shrink-0">
                      <MinusCircle className="w-4 h-4 text-orange-600" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-lg bg-red-100 flex-shrink-0">
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {transaction.description || transaction.category}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(transaction.date), "dd/MM/yyyy")}
                    </p>
                  </div>
                </div>
                <p className={`font-bold text-sm flex-shrink-0 ml-2 ${
                  transaction.type === 'receita' ? 'text-green-600' : 
                  transaction.type === 'deducao' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.value.toFixed(2)}
                </p>
              </div>
              
              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {transaction.category}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {transaction.payment_method}
                  </Badge>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(transaction)}
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Data</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Descrição</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Categoria</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Pagamento</th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Valor</th>
                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-sm">
                    {format(new Date(transaction.date), "dd/MM/yyyy")}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'receita' ? (
                        <>
                          <div className="p-1.5 rounded-lg bg-green-100">
                            <ArrowUpRight className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-green-700 font-medium text-sm">Receita</span>
                        </>
                      ) : transaction.type === 'deducao' ? (
                        <>
                          <div className="p-1.5 rounded-lg bg-orange-100">
                            <MinusCircle className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="text-orange-700 font-medium text-sm">Dedução</span>
                        </>
                      ) : (
                        <>
                          <div className="p-1.5 rounded-lg bg-red-100">
                            <ArrowDownRight className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="text-red-700 font-medium text-sm">Despesa</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {transaction.description || '-'}
                      </p>
                      {transaction.contact_name && (
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.contact_name}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-xs">
                      {transaction.category}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="text-xs">
                      {transaction.payment_method}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-bold text-base ${
                      transaction.type === 'receita' ? 'text-green-600' : 
                      transaction.type === 'deducao' ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'}R$ {transaction.value.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(transaction)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(transaction.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}