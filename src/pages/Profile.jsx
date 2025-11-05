
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Building2,
  Settings,
  HelpCircle,
  Save,
  Lock,
  Bell,
  Calendar,
  DollarSign,
  ExternalLink,
  MessageCircle,
  BookOpen,
  LogOut
} from "lucide-react";
import { differenceInMonths } from "date-fns";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: 'Serviço',
    opening_date: '',
    currency: 'BRL',
    date_format: 'dd/mm/yyyy',
    notifications_enabled: true,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(userData => {
      setUser(userData);
      setFormData({
        business_name: userData.business_name || '',
        business_type: userData.business_type || 'Serviço',
        opening_date: userData.opening_date || '',
        currency: userData.currency || 'BRL',
        date_format: userData.date_format || 'dd/mm/yyyy',
        notifications_enabled: userData.notifications_enabled !== false,
      });
    });
  }, []);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      alert('Perfil atualizado com sucesso!');
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      base44.auth.logout();
    }
  };

  // Calcular tempo de empresa
  const getBusinessAge = () => {
    if (!formData.opening_date) return null;
    const openingDate = new Date(formData.opening_date);
    const today = new Date();
    const months = differenceInMonths(today, openingDate);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0) {
      return `${years} ano${years > 1 ? 's' : ''} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
    }
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  };

  return (
    <div className="p-3 md:p-8 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Gerencie suas informações e configurações
          </p>
        </div>

        {/* Informações do Usuário */}
        <Card className="shadow-lg border-emerald-100/50">
          <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-base md:text-xl">
              <User className="w-5 h-5 text-emerald-600" />
              Informações da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 p-4 md:p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl md:text-3xl">
                  {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <p className="font-bold text-lg md:text-xl text-gray-900">
                  {user?.full_name || 'Usuário'}
                </p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <Badge className="mt-1 bg-emerald-100 text-emerald-700 border-0">
                  {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meu Negócio */}
        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg border-emerald-100/50">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardTitle className="flex items-center gap-2 text-base md:text-xl">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Meu Negócio
              </CardTitle>
          </CardHeader>
            <CardContent className="pt-6 p-4 md:p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business_name" className="text-sm">Nome do MEI/Negócio</Label>
                  <Input
                    id="business_name"
                    placeholder="Ex: Maria Costuras MEI"
                    value={formData.business_name}
                    onChange={(e) => handleChange('business_name', e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_type" className="text-sm">Ramo de Atividade</Label>
                    <Select value={formData.business_type} onValueChange={(value) => handleChange('business_type', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Serviço">Serviço</SelectItem>
                        <SelectItem value="Comércio">Comércio</SelectItem>
                        <SelectItem value="Indústria">Indústria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="opening_date" className="text-sm">Data de Abertura</Label>
                    <Input
                      id="opening_date"
                      type="date"
                      value={formData.opening_date}
                      onChange={(e) => handleChange('opening_date', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                {formData.opening_date && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      🎉 Seu negócio tem <strong>{getBusinessAge()}</strong> de atividade!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card className="shadow-lg border-emerald-100/50 mt-4">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
              <CardTitle className="flex items-center gap-2 text-base md:text-xl">
                <Settings className="w-5 h-5 text-emerald-600" />
                Configurações
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 p-4 md:p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      Moeda Padrão
                    </Label>
                    <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="USD">Dólar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_format" className="text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Formato de Data
                    </Label>
                    <Select value={formData.date_format} onValueChange={(value) => handleChange('date_format', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">dd/mm/aaaa</SelectItem>
                        <SelectItem value="mm/dd/yyyy">mm/dd/aaaa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">Notificações</p>
                      <p className="text-xs text-gray-500">Alertas de metas, DAS e vencimentos</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifications_enabled}
                    onChange={(e) => handleChange('notifications_enabled', e.target.checked)}
                    className="w-5 h-5 text-emerald-600 rounded"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>

        {/* Acesso Rápido */}
        <Card className="shadow-lg border-emerald-100/50">
          <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-base md:text-xl">
              <Lock className="w-5 h-5 text-emerald-600" />
              Acesso e Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4 md:p-6">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm" disabled>
                <Lock className="w-4 h-4 mr-2" />
                Alterar Senha/PIN
                <span className="ml-auto text-xs text-gray-500">Em breve</span>
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" disabled>
                <User className="w-4 h-4 mr-2" />
                Biometria/Facial ID
                <span className="ml-auto text-xs text-gray-500">Em breve</span>
              </Button>
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Sincronização ativa - Última sinc: Agora
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suporte */}
        <Card className="shadow-lg border-emerald-100/50">
          <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-blue-50">
            <CardTitle className="flex items-center gap-2 text-base md:text-xl">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              Suporte e Ajuda
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4 md:p-6">
            <Button
              variant="outline"
              className="w-full h-auto flex flex-col items-center gap-3 py-6 hover:bg-blue-50 hover:border-blue-300"
              asChild
            >
              <a href="mailto:niuapp@gmail.com" className="flex flex-col items-center gap-3 w-full">
                <MessageCircle className="w-8 h-8 text-blue-600" />
                <div className="text-center">
                  <span className="text-base font-medium text-gray-900">Email</span>
                  <span className="block text-sm text-gray-600 mt-1">niuapp@gmail.com</span>
                </div>
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Sair */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </div>
  );
}
