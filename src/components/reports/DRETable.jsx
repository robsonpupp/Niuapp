import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileBarChart } from 'lucide-react';

const MONTHS = ['', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function DRETable({ dre, selectedMonth, selectedYear }) {
  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const rows = [
    { 
      label: '1. Receita Bruta', 
      value: dre.receitaBruta, 
      type: 'primary',
      description: 'Total de vendas e prestação de serviços'
    },
    { 
      label: '(-) Deduções', 
      value: -dre.deducoes, 
      type: 'deduction',
      description: 'Devoluções, descontos concedidos, taxas'
    },
    { 
      label: '= Receita Líquida', 
      value: dre.receitaLiquida, 
      type: 'result',
      bold: true 
    },
    { 
      label: '(-) Custos Variáveis', 
      value: -dre.custosVariaveis, 
      type: 'deduction',
      description: 'Mercadorias, insumos, fretes, comissões'
    },
    { 
      label: '= Lucro Bruto', 
      value: dre.lucroBruto, 
      type: 'result',
      bold: true,
      percentage: `${dre.margemBruta.toFixed(1)}%`
    },
    { 
      label: '(-) Despesas Fixas', 
      value: -dre.despesasFixas, 
      type: 'deduction',
      description: 'Aluguel, energia, internet, contador, salários'
    },
    { 
      label: '= Lucro Operacional', 
      value: dre.lucroOperacional, 
      type: 'result',
      bold: true 
    },
    { 
      label: '(-) Impostos e Contribuições', 
      value: -dre.impostos, 
      type: 'deduction',
      description: 'DAS e outros tributos'
    },
    { 
      label: '= Lucro Líquido', 
      value: dre.lucroLiquido, 
      type: 'final',
      bold: true,
      percentage: `${dre.margemLiquida.toFixed(1)}%`
    },
  ];

  return (
    <Card className="shadow-lg border-emerald-100/50">
      <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <FileBarChart className="w-5 h-5 text-emerald-600" />
          <span>DRE - {MONTHS[selectedMonth]}/{selectedYear}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="text-left py-3 px-4 md:px-6 font-semibold text-sm text-gray-700">
                  Descrição
                </th>
                <th className="text-right py-3 px-4 md:px-6 font-semibold text-sm text-gray-700">
                  Valor (R$)
                </th>
                <th className="text-right py-3 px-4 md:px-6 font-semibold text-sm text-gray-700">
                  Margem
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const isNegative = row.value < 0;
                const isPositive = row.value > 0;
                
                let bgColor = '';
                let textColor = 'text-gray-900';
                
                if (row.type === 'result') {
                  bgColor = 'bg-blue-50';
                  textColor = isNegative ? 'text-red-700' : 'text-blue-700';
                } else if (row.type === 'final') {
                  bgColor = isNegative ? 'bg-red-100' : 'bg-green-100';
                  textColor = isNegative ? 'text-red-700' : 'text-green-700';
                } else if (row.type === 'deduction') {
                  textColor = 'text-gray-600';
                }

                return (
                  <React.Fragment key={index}>
                    {/* Desktop View */}
                    <tr className={`border-b hover:bg-gray-50 transition-colors hidden md:table-row ${bgColor}`}>
                      <td className={`py-3 md:py-4 px-4 md:px-6 ${row.bold ? 'font-bold' : ''}`}>
                        <div>
                          <span className={textColor}>{row.label}</span>
                          {row.description && (
                            <p className="text-xs text-gray-500 mt-1">{row.description}</p>
                          )}
                        </div>
                      </td>
                      <td className={`py-3 md:py-4 px-4 md:px-6 text-right ${row.bold ? 'font-bold' : ''} ${textColor}`}>
                        R$ {formatCurrency(Math.abs(row.value))}
                      </td>
                      <td className={`py-3 md:py-4 px-4 md:px-6 text-right ${row.bold ? 'font-bold' : ''} text-gray-600`}>
                        {row.percentage || '-'}
                      </td>
                    </tr>

                    {/* Mobile View */}
                    <tr className={`border-b md:hidden ${bgColor}`}>
                      <td colSpan="3" className="p-3">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <span className={`${row.bold ? 'font-bold' : ''} ${textColor}`}>
                                {row.label}
                              </span>
                              {row.description && (
                                <p className="text-xs text-gray-500 mt-1">{row.description}</p>
                              )}
                            </div>
                            <span className={`${row.bold ? 'font-bold text-lg' : ''} ${textColor} flex-shrink-0`}>
                              R$ {formatCurrency(Math.abs(row.value))}
                            </span>
                          </div>
                          {row.percentage && (
                            <div className="text-xs text-gray-600">
                              Margem: {row.percentage}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}