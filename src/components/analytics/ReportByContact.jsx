import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function ReportByContact({ transactions, contacts }) {
  // Agrupar por contato
  const contactData = {};
  
  transactions.forEach(t => {
    if (t.contact_id && t.contact_name) {
      if (!contactData[t.contact_id]) {
        contactData[t.contact_id] = {
          name: t.contact_name,
          receitas: 0,
          despesas: 0,
          total: 0,
          count: 0
        };
      }
      
      contactData[t.contact_id].count++;
      
      if (t.type === 'receita') {
        contactData[t.contact_id].receitas += t.value;
        contactData[t.contact_id].total += t.value;
      } else if (t.type === 'despesa') {
        contactData[t.contact_id].despesas += t.value;
        contactData[t.contact_id].total += t.value;
      }
    }
  });

  const tableData = Object.values(contactData)
    .sort((a, b) => b.total - a.total);

  // Separar clientes e fornecedores
  const clientData = tableData.filter(c => c.receitas > 0);
  const supplierData = tableData.filter(c => c.despesas > 0 && c.receitas === 0);

  return (
    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
      {/* Relatório por Cliente */}
      <Card className="shadow-lg border-emerald-100/50">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Top Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {clientData.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">
              Nenhuma receita vinculada a cliente
            </p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {clientData.slice(0, 5).map((contact, index) => (
                <div key={contact.name} className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow gap-2">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs md:text-sm">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm md:text-base">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {contact.count} transaç{contact.count === 1 ? 'ão' : 'ões'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-green-600 text-xs md:text-sm">
                      R$ {contact.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Relatório por Fornecedor */}
      <Card className="shadow-lg border-emerald-100/50">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <TrendingDown className="w-5 h-5 text-red-600" />
            Top Fornecedores
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          {supplierData.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm">
              Nenhuma despesa vinculada a fornecedor
            </p>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {supplierData.slice(0, 5).map((contact, index) => (
                <div key={contact.name} className="flex items-center justify-between p-2 md:p-3 rounded-lg border border-gray-100 hover:shadow-md transition-shadow gap-2">
                  <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs md:text-sm">
                        {contact.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate text-sm md:text-base">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {contact.count} transaç{contact.count === 1 ? 'ão' : 'ões'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-red-600 text-xs md:text-sm">
                      R$ {contact.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}