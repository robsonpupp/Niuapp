import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Save, X, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

const MONTHS = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const CATEGORIES_RECEITA = [
  "Vendas de Produtos",
  "Prestação de Serviços",
  "Outras Receitas"
];

const CATEGORIES_DESPESA = [
  "Compra de Mercadorias",
  "Compra de Insumos",
  "Fretes e Entregas",
  "Comissões",
  "Taxas de Cartão",
  "Embalagens",
  "Aluguel",
  "Energia",
  "Água",
  "Internet/Telefone",
  "Contador",
  "Salários",
  "Marketing",
  "Impostos Fixos (DAS)",
  "Seguros",
  "Manutenção"
];

export default function GoalForm({ goal, onSubmit, onCancel, isSubmitting }) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [formData, setFormData] = useState({
    title: '',
    type: 'Faturamento',
    period_type: 'Mensal',
    target_value: '',
    month: currentMonth,
    year: currentYear,
    status: 'Ativa',
    linked_categories: [],
    is_manual: false,
    current_value: 0,
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        type: goal.type || 'Faturamento',
        period_type: goal.period_type || 'Mensal',
        target_value: goal.target_value || '',
        month: goal.month || currentMonth,
        year: goal.year || currentYear,
        status: goal.status || 'Ativa',
        linked_categories: goal.linked_categories || [],
        is_manual: goal.is_manual || false,
        current_value: goal.current_value || 0,
      });
    }
  }, [goal]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Atualizar is_manual quando mudar o tipo
    if (field === 'type') {
      setFormData(prev => ({ 
        ...prev, 
        is_manual: value === 'Reserva de Caixa',
        linked_categories: []
      }));
    }
  };

  const handleCategoryToggle = (category) => {
    setFormData(prev => {
      const current = prev.linked_categories || [];
      const isSelected = current.includes(category);
      
      return {
        ...prev,
        linked_categories: isSelected
          ? current.filter(c => c !== category)
          : [...current, category]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      target_value: parseFloat(formData.target_value),
      current_value: formData.is_manual ? parseFloat(formData.current_value) : 0,
    };

    // Se for anual, não enviar month
    if (submitData.period_type === 'Anual') {
      delete submitData.month;
    }

    onSubmit(submitData);
  };

  const availableCategories = formData.type === 'Faturamento' 
    ? CATEGORIES_RECEITA 
    : CATEGORIES_DESPESA;

  const typeIcons = {
    'Faturamento': TrendingUp,
    'Redução de Custos': TrendingDown,
    'Reserva de Caixa': PiggyBank,
  };

  const TypeIcon = typeIcons[formData.type];

  return (
    <Card className="border-emerald-100/50 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Target className="w-5 h-5 text-emerald-600" />
          <span className="text-gray-900">
            {goal ? 'Editar Meta' : 'Nova Meta'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Meta */}
          <div className="space-y-2">
            <Label>Tipo de Meta *</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={formData.type === 'Faturamento' ? 'default' : 'outline'}
                className={formData.type === 'Faturamento' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={() => handleChange('type', 'Faturamento')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Faturamento
              </Button>
              <Button
                type="button"
                variant={formData.type === 'Redução de Custos' ? 'default' : 'outline'}
                className={formData.type === 'Redução de Custos' ? 'bg-red-600 hover:bg-red-700' : ''}
                onClick={() => handleChange('type', 'Redução de Custos')}
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Custos
              </Button>
              <Button
                type="button"
                variant={formData.type === 'Reserva de Caixa' ? 'default' : 'outline'}
                className={formData.type === 'Reserva de Caixa' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => handleChange('type', 'Reserva de Caixa')}
              >
                <PiggyBank className="w-4 h-4 mr-2" />
                Reserva
              </Button>
            </div>
          </div>

          {/* Período */}
          <div className="space-y-2">
            <Label>Período *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={formData.period_type === 'Mensal' ? 'default' : 'outline'}
                className={formData.period_type === 'Mensal' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => handleChange('period_type', 'Mensal')}
              >
                Mensal
              </Button>
              <Button
                type="button"
                variant={formData.period_type === 'Anual' ? 'default' : 'outline'}
                className={formData.period_type === 'Anual' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                onClick={() => handleChange('period_type', 'Anual')}
              >
                Anual
              </Button>
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título da Meta *</Label>
            <Input
              id="title"
              placeholder="Ex: Faturamento de Junho"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Valor Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="target_value">Valor Objetivo *</Label>
              <Input
                id="target_value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.target_value}
                onChange={(e) => handleChange('target_value', e.target.value)}
                required
              />
            </div>

            {/* Ano */}
            <div className="space-y-2">
              <Label htmlFor="year">Ano *</Label>
              <Select value={String(formData.year)} onValueChange={(value) => handleChange('year', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano" />
                </SelectTrigger>
                <SelectContent>
                  {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mês (apenas para metas mensais) */}
          {formData.period_type === 'Mensal' && (
            <div className="space-y-2">
              <Label htmlFor="month">Mês *</Label>
              <Select value={String(formData.month)} onValueChange={(value) => handleChange('month', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map(month => (
                    <SelectItem key={month.value} value={String(month.value)}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Categorias Vinculadas (não disponível para Reserva de Caixa) */}
          {formData.type !== 'Reserva de Caixa' && (
            <div className="space-y-2">
              <Label>Categorias Vinculadas (opcional)</Label>
              <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                {availableCategories.map(category => (
                  <div key={category} className="flex items-center gap-2">
                    <Checkbox
                      id={category}
                      checked={formData.linked_categories?.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={category} className="text-sm cursor-pointer flex-1">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Se deixar em branco, serão consideradas todas as categorias de {formData.type === 'Faturamento' ? 'receita' : 'despesa'}
              </p>
            </div>
          )}

          {/* Valor Inicial (apenas para Reserva de Caixa ao criar) */}
          {formData.type === 'Reserva de Caixa' && !goal && (
            <div className="space-y-2">
              <Label htmlFor="current_value">Valor Inicial (opcional)</Label>
              <Input
                id="current_value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.current_value}
                onChange={(e) => handleChange('current_value', e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Valor já guardado para esta reserva
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar Meta'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}