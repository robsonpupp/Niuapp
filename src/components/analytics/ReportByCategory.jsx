import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Layers } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16'];

export default function ReportByCategory({ transactions }) {
  // Agrupar por categoria
  const categoryData = {};
  
  transactions.forEach(t => {
    if (!categoryData[t.category]) {
      categoryData[t.category] = {
        receitas: 0,
        despesas: 0,
        total: 0
      };
    }
    
    if (t.type === 'receita') {
      categoryData[t.category].receitas += t.value;
      categoryData[t.category].total += t.value;
    } else if (t.type === 'despesa') {
      categoryData[t.category].despesas += t.value;
      categoryData[t.category].total += t.value;
    }
  });

  // Dados para o gráfico (top 8 categorias)
  const chartData = Object.entries(categoryData)
    .map(([name, values]) => ({
      name,
      value: values.total
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Dados para a tabela
  const tableData = Object.entries(categoryData)
    .map(([category, values]) => ({
      category,
      ...values
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <Card className="shadow-lg border-emerald-100/50">
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-xl">
          <Layers className="w-5 h-5 text-emerald-600" />
          Relatório por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Nenhuma movimentação no período selecionado
          </p>
        ) : (
          <div className="space-y-6">
            {/* Gráfico */}
            <div className="h-48 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Tabela - Mobile */}
            <div className="md:hidden space-y-2">
              {tableData.map((row, index) => (
                <div key={row.category} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{row.category}</Badge>
                    <span className="font-bold text-gray-900 text-sm">
                      R$ {row.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {row.receitas > 0 && (
                      <div>
                        <span className="text-gray-500">Receitas:</span>
                        <span className="text-green-600 font-semibold ml-1">
                          R$ {row.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                    {row.despesas > 0 && (
                      <div>
                        <span className="text-gray-500">Despesas:</span>
                        <span className="text-red-600 font-semibold ml-1">
                          R$ {row.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tabela - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">
                      Categoria
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                      Receitas
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                      Despesas
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={row.category} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge variant="outline">{row.category}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-green-600 font-semibold">
                        {row.receitas > 0 && `R$ ${row.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="py-3 px-4 text-right text-red-600 font-semibold">
                        {row.despesas > 0 && `R$ ${row.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">
                        R$ {row.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}