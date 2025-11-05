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
import { ArrowUpRight, ArrowDownRight, Save, X, MinusCircle } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES_RECEITA = [
  "Vendas de Produtos",
  "Prestação de Serviços",
  "Outras Receitas"
];

const CATEGORIES_DESPESA_VARIAVEL = [
  "Compra de Mercadorias",
  "Compra de Insumos",
  "Fretes e Entregas",
  "Comissões",
  "Taxas de Cartão",
  "Embalagens"
];

const CATEGORIES_DESPESA_FIXA = [
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

const CATEGORIES_DEDUCAO = [
  "Devoluções",
  "Descontos Concedidos",
  "Outras Despesas"
];

const PAYMENT_METHODS = ["Dinheiro", "PIX", "Débito", "Crédito", "Boleto", "Transferência"];

export default function TransactionForm({ 
  transaction, 
  contacts, 
  onSubmit, 
  onCancel,
  isSubmitting 
}) {
  const [formData, setFormData] = useState({
    type: 'receita',
    value: '',
    category: '',
    expense_type: 'Variável',
    payment_method: 'PIX',
    description: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    contact_id: '',
    contact_name: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'receita',
        value: transaction.value || '',
        category: transaction.category || '',
        expense_type: transaction.expense_type || 'Variável',
        payment_method: transaction.payment_method || 'PIX',
        description: transaction.description || '',
        date: transaction.date || format(new Date(), 'yyyy-MM-dd'),
        contact_id: transaction.contact_id || '',
        contact_name: transaction.contact_name || '',
      });
    }
  }, [transaction]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset category when type changes
    if (field === 'type') {
      setFormData(prev => ({ 
        ...prev, 
        category: '',
        expense_type: value === 'despesa' ? 'Variável' : prev.expense_type
      }));
    }
    
    // Reset category when expense_type changes
    if (field === 'expense_type') {
      setFormData(prev => ({ ...prev, category: '' }));
    }
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
    
    // Only include expense_type if it's a despesa
    if (formData.type !== 'despesa') {
      delete submitData.expense_type;
    }
    
    onSubmit(submitData);
  };

  // Get available categories based on type and expense_type
  const getAvailableCategories = () => {
    if (formData.type === 'receita') {
      return CATEGORIES_RECEITA;
    } else if (formData.type === 'deducao') {
      return CATEGORIES_DEDUCAO;
    } else if (formData.type === 'despesa') {
      return formData.expense_type === 'Variável' 
        ? CATEGORIES_DESPESA_VARIAVEL 
        : CATEGORIES_DESPESA_FIXA;
    }
    return [];
  };

  const categories = getAvailableCategories();

  // Get card styling based on type
  const getTypeStyle = () => {
    if (formData.type === 'receita') return { bg: 'bg-green-50', text: 'text-green-700' };
    if (formData.type === 'deducao') return { bg: 'bg-orange-50', text: 'text-orange-700' };
    return { bg: 'bg-red-50', text: 'text-red-700' };
  };

  const typeStyle = getTypeStyle();

  return (
    <Card className="border-emerald-100/50 shadow-lg">
      <CardHeader className={`border-b ${typeStyle.bg}`}>
        <CardTitle className="flex items-center gap-2">
          {formData.type === 'receita' ? (
            <>
              <ArrowUpRight className="w-5 h-5 text-green-600" />
              <span className="text-green-700">
                {transaction ? 'Editar Receita' : 'Nova Receita'}
              </span>
            </>
          ) : formData.type === 'deducao' ? (
            <>
              <MinusCircle className="w-5 h-5 text-orange-600" />
              <span className="text-orange-700">
                {transaction ? 'Editar Dedução' : 'Nova Dedução'}
              </span>
            </>
          ) : (
            <>
              <ArrowDownRight className="w-5 h-5 text-red-600" />
              <span className="text-red-700">
                {transaction ? 'Editar Despesa' : 'Nova Despesa'}
              </span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant={formData.type === 'receita' ? 'default' : 'outline'}
              className={formData.type === 'receita' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={() => handleChange('type', 'receita')}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Receita
            </Button>
            <Button
              type="button"
              variant={formData.type === 'despesa' ? 'default' : 'outline'}
              className={formData.type === 'despesa' ? 'bg-red-600 hover:bg-red-700' : ''}
              onClick={() => handleChange('type', 'despesa')}
            >
              <ArrowDownRight className="w-4 h-4 mr-2" />
              Despesa
            </Button>
            <Button
              type="button"
              variant={formData.type === 'deducao' ? 'default' : 'outline'}
              className={formData.type === 'deducao' ? 'bg-orange-600 hover:bg-orange-700' : ''}
              onClick={() => handleChange('type', 'deducao')}
            >
              <MinusCircle className="w-4 h-4 mr-2" />
              Dedução
            </Button>
          </div>

          {/* Tipo de Despesa (apenas para despesas) */}
          {formData.type === 'despesa' && (
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
              <Button
                type="button"
                variant={formData.expense_type === 'Variável' ? 'default' : 'outline'}
                className={formData.expense_type === 'Variável' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => handleChange('expense_type', 'Variável')}
              >
                Despesa Variável
              </Button>
              <Button
                type="button"
                variant={formData.expense_type === 'Fixa' ? 'default' : 'outline'}
                className={formData.expense_type === 'Fixa' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => handleChange('expense_type', 'Fixa')}
              >
                Despesa Fixa
              </Button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {/* Valor */}
            <div className="space-y-2">
              <Label htmlFor="value">Valor *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                required
                className="text-lg font-semibold"
              />
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Categoria */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Forma de Pagamento */}
            <div className="space-y-2">
              <Label htmlFor="payment_method">Forma de Pagamento *</Label>
              <Select value={formData.payment_method} onValueChange={(value) => handleChange('payment_method', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contato (opcional) */}
          {contacts.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="contact">
                {formData.type === 'receita' ? 'Cliente' : 'Fornecedor'} (opcional)
              </Label>
              <Select value={formData.contact_id} onValueChange={handleContactChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um contato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Nenhum</SelectItem>
                  {contacts
                    .filter(c => c.type === (formData.type === 'receita' ? 'Cliente' : 'Fornecedor') || c.type === 'Ambos')
                    .map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Ex: Venda de produto X, Compra de insumo Y..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

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
              className={
                formData.type === 'receita' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : formData.type === 'deducao'
                  ? 'bg-orange-600 hover:bg-orange-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}