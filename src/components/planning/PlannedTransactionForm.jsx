
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Save, X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

export default function PlannedTransactionForm({ 
  transaction, 
  contacts, 
  onSubmit, 
  onCancel,
  isSubmitting 
}) {
  const [formData, setFormData] = useState({
    type: 'a_pagar',
    value: '',
    category: '',
    description: '',
    due_date: format(new Date(), 'yyyy-MM-dd'),
    contact_id: '',
    contact_name: '',
    status: 'Pendente',
    is_recurring: false,
    recurring_day: '',
    recurring_months: 12,
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'a_pagar',
        value: transaction.value || '',
        category: transaction.category || '',
        description: transaction.description || '',
        due_date: transaction.due_date || format(new Date(), 'yyyy-MM-dd'),
        contact_id: transaction.contact_id || '',
        contact_name: transaction.contact_name || '',
        status: transaction.status || 'Pendente',
        is_recurring: transaction.is_recurring || false,
        recurring_day: transaction.recurring_day || '',
        recurring_months: transaction.recurring_months || 12,
      });
    }
  }, [transaction]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    setFormData(prev => ({
      ...prev,
      contact_id: contactId,
      contact_name: contact ? contact.name : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      value: parseFloat(formData.value)
    };
    
    // Clean up data based on is_recurring
    if (!submitData.is_recurring) {
      delete submitData.recurring_day;
      delete submitData.recurring_months;
    } else {
      submitData.recurring_day = parseInt(submitData.recurring_day);
      submitData.recurring_months = parseInt(submitData.recurring_months);
    }
    
    onSubmit(submitData);
  };

  return (
    <Card className="border-emerald-100/50 shadow-lg">
      <CardHeader className={`border-b ${formData.type === 'a_receber' ? 'bg-green-50' : 'bg-orange-50'}`}>
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          {formData.type === 'a_receber' ? (
            <>
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              <span className="text-green-700 text-sm md:text-base">
                {transaction ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
              </span>
            </>
          ) : (
            <>
              <ArrowDownRight className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
              <span className="text-orange-700 text-sm md:text-base">
                {transaction ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
              </span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 md:pt-6 p-3 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <Button
              type="button"
              variant={formData.type === 'a_receber' ? 'default' : 'outline'}
              className={`${formData.type === 'a_receber' ? 'bg-green-600 hover:bg-green-700' : ''} text-xs md:text-sm`}
              onClick={() => handleChange('type', 'a_receber')}
            >
              <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              A Receber
            </Button>
            <Button
              type="button"
              variant={formData.type === 'a_pagar' ? 'default' : 'outline'}
              className={`${formData.type === 'a_pagar' ? 'bg-orange-600 hover:bg-orange-700' : ''} text-xs md:text-sm`}
              onClick={() => handleChange('type', 'a_pagar')}
            >
              <ArrowDownRight className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              A Pagar
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm">Valor *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                required
                className="text-base md:text-lg font-semibold"
              />
            </div>

            {/* Data de Vencimento */}
            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm">Vencimento *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange('due_date', e.target.value)}
                required
                className="text-sm"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Descrição *</Label>
            <Input
              id="description"
              placeholder="Ex: Aluguel, Fornecedor X..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              required
              className="text-sm"
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm">Categoria (opcional)</Label>
            <Input
              id="category"
              placeholder="Ex: Aluguel, Vendas..."
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="text-sm"
            />
          </div>

          {/* Recorrência */}
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_recurring"
                checked={formData.is_recurring}
                onChange={(e) => handleChange('is_recurring', e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <Label htmlFor="is_recurring" className="text-sm font-medium cursor-pointer">
                🔄 Lançamento Recorrente
              </Label>
            </div>

            {formData.is_recurring && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="space-y-2">
                  <Label htmlFor="recurring_day" className="text-xs">Dia do mês *</Label>
                  <Input
                    id="recurring_day"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="Ex: 10"
                    value={formData.recurring_day}
                    onChange={(e) => handleChange('recurring_day', e.target.value)}
                    required={formData.is_recurring}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recurring_months" className="text-xs">Repetir por (meses) *</Label>
                  <Input
                    id="recurring_months"
                    type="number"
                    min="1"
                    max="60"
                    placeholder="Ex: 12"
                    value={formData.recurring_months}
                    onChange={(e) => handleChange('recurring_months', e.target.value)}
                    required={formData.is_recurring}
                    className="text-sm"
                  />
                </div>
              </div>
            )}
            
            {formData.is_recurring && (
              <p className="text-xs text-gray-600 mt-2">
                💡 Serão criados {formData.recurring_months || 0} lançamentos automaticamente
              </p>
            )}
          </div>

          {/* Contato (opcional) */}
          {contacts.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm">
                {formData.type === 'a_receber' ? 'Cliente' : 'Fornecedor'} (opcional)
              </Label>
              <Select value={formData.contact_id} onValueChange={handleContactChange}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Selecione um contato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Nenhum</SelectItem>
                  {contacts
                    .filter(c => 
                      c.type === (formData.type === 'a_receber' ? 'Cliente' : 'Fornecedor') || 
                      c.type === 'Ambos'
                    )
                    .map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-2 md:gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="text-xs md:text-sm"
            >
              <X className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`text-xs md:text-sm ${formData.type === 'a_receber' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
