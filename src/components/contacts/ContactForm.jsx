import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Save, X } from 'lucide-react';

export default function ContactForm({ 
  contact, 
  onSubmit, 
  onCancel,
  isSubmitting 
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    document: '',
    type: 'Cliente',
    notes: '',
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        name: contact.name || '',
        phone: contact.phone || '',
        email: contact.email || '',
        document: contact.document || '',
        type: contact.type || 'Cliente',
        notes: contact.notes || '',
      });
    }
  }, [contact]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="border-emerald-100/50 shadow-lg">
      <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <User className="w-5 h-5 text-emerald-600" />
          <span className="text-gray-900">
            {contact ? 'Editar Contato' : 'Novo Contato'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de Contato */}
          <div className="space-y-2">
            <Label>Tipo de Contato *</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={formData.type === 'Cliente' ? 'default' : 'outline'}
                className={formData.type === 'Cliente' ? 'bg-green-600 hover:bg-green-700' : ''}
                onClick={() => handleChange('type', 'Cliente')}
              >
                Cliente
              </Button>
              <Button
                type="button"
                variant={formData.type === 'Fornecedor' ? 'default' : 'outline'}
                className={formData.type === 'Fornecedor' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                onClick={() => handleChange('type', 'Fornecedor')}
              >
                Fornecedor
              </Button>
              <Button
                type="button"
                variant={formData.type === 'Ambos' ? 'default' : 'outline'}
                className={formData.type === 'Ambos' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => handleChange('type', 'Ambos')}
              >
                Ambos
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                placeholder="Nome completo ou razão social"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* E-mail */}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            {/* CPF/CNPJ */}
            <div className="space-y-2">
              <Label htmlFor="document">CPF ou CNPJ (opcional)</Label>
              <Input
                id="document"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                value={formData.document}
                onChange={(e) => handleChange('document', e.target.value)}
              />
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais sobre o contato..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
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
              className="bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Salvando...' : 'Salvar Contato'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}