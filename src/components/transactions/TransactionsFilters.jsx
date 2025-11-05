import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from 'lucide-react';

export default function TransactionsFilters({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-lg border-emerald-100/50">
      <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {/* Busca */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={filters.search}
                onChange={(e) => handleChange('search', e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          {/* Período */}
          <Select value={filters.period} onValueChange={(value) => handleChange('period', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mês</SelectItem>
              <SelectItem value="quarter">3 meses</SelectItem>
              <SelectItem value="year">Ano</SelectItem>
            </SelectContent>
          </Select>

          {/* Tipo */}
          <Select value={filters.type} onValueChange={(value) => handleChange('type', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="receita">Receitas</SelectItem>
              <SelectItem value="despesa">Despesas</SelectItem>
              <SelectItem value="deducao">Deduções</SelectItem>
            </SelectContent>
          </Select>

          {/* Forma de Pagamento */}
          <Select value={filters.payment_method} onValueChange={(value) => handleChange('payment_method', value)}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Dinheiro">Dinheiro</SelectItem>
              <SelectItem value="PIX">PIX</SelectItem>
              <SelectItem value="Débito">Débito</SelectItem>
              <SelectItem value="Crédito">Crédito</SelectItem>
              <SelectItem value="Boleto">Boleto</SelectItem>
              <SelectItem value="Transferência">Transferência</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}