import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DREChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.month}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: R$ {entry.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg border-emerald-100/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base md:text-xl">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
          Evolução dos Resultados (Últimos 6 Meses)
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 md:px-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280" 
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280" 
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="receitaBruta" 
              name="Receita Bruta"
              fill="#10b981" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="lucroBruto" 
              name="Lucro Bruto"
              fill="#3b82f6" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="lucroLiquido" 
              name="Lucro Líquido"
              fill="#8b5cf6" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}