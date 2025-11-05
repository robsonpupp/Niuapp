import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  TrendingUp,
  Calendar,
  DollarSign
} from "lucide-react";
import { startOfYear, endOfYear } from "date-fns";

export default function MEIPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  const LIMITE_ANUAL = 81000;
  const VALOR_DAS_BASE = 66.60; // Valor aproximado do DAS

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-date'),
  });

  // Calcular faturamento anual
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 0, 1));
  
  const faturamentoAnual = transactions
    .filter(t => {
      const tDate = new Date(t.date);
      return t.type === 'receita' && tDate >= yearStart && tDate <= yearEnd;
    })
    .reduce((sum, t) => sum + t.value, 0);

  const percentualUsado = (faturamentoAnual / LIMITE_ANUAL) * 100;
  const faltaParaLimite = LIMITE_ANUAL - faturamentoAnual;
  
  // Status do limite
  let statusLimite = 'safe';
  if (percentualUsado >= 100) statusLimite = 'exceeded';
  else if (percentualUsado >= 80) statusLimite = 'warning';
  else if (percentualUsado >= 60) statusLimite = 'attention';

  const statusConfig = {
    safe: {
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: CheckCircle,
      title: 'Dentro do Limite',
      message: 'Você está seguro! Ainda tem espaço para faturar.'
    },
    attention: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: AlertTriangle,
      title: 'Atenção',
      message: 'Você já utilizou mais de 60% do limite anual.'
    },
    warning: {
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      icon: AlertTriangle,
      title: 'Cuidado!',
      message: 'Você está próximo do limite! Planeje seus próximos passos.'
    },
    exceeded: {
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: AlertTriangle,
      title: 'Limite Ultrapassado',
      message: 'Você ultrapassou o limite MEI! Consulte seu contador urgentemente.'
    }
  };

  const config = statusConfig[statusLimite];
  const StatusIcon = config.icon;

  // Calcular média mensal
  const mediaMensal = faturamentoAnual / currentMonth;
  const projecaoAnual = mediaMensal * 12;

  return (
    <div className="p-3 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Área MEI
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Controle seu limite de faturamento e DAS
          </p>
        </div>

        {/* Alerta de Status */}
        <Alert className={`${config.borderColor} ${config.bgColor} border-2`}>
          <StatusIcon className={`h-5 w-5 ${config.color}`} />
          <AlertDescription className={config.color}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <p className="font-bold text-base md:text-lg">{config.title}</p>
                <p className="text-sm mt-1">{config.message}</p>
              </div>
              {statusLimite === 'exceeded' && (
                <Button 
                  variant="outline" 
                  className={`${config.borderColor} ${config.color} hover:${config.bgColor}`}
                >
                  Falar com Contador
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>

        {/* Limite de Faturamento */}
        <Card className="shadow-lg border-emerald-100/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-xl">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Limite de Faturamento Anual {currentYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Barra de Progresso */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  Faturamento até agora
                </span>
                <span className={`text-2xl font-bold ${config.color}`}>
                  {percentualUsado.toFixed(1)}%
                </span>
              </div>
              
              <Progress 
                value={Math.min(percentualUsado, 100)} 
                className="h-4"
              />
              
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="font-bold text-gray-900">
                  R$ {faturamentoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-gray-600">
                  de R$ {LIMITE_ANUAL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Cards de Informações */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-100 bg-blue-50">
                <CardContent className="pt-4 p-4">
                  <p className="text-xs text-gray-600 mb-1">Falta para o limite</p>
                  <p className={`text-xl font-bold ${faltaParaLimite > 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    R$ {faltaParaLimite.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-100 bg-purple-50">
                <CardContent className="pt-4 p-4">
                  <p className="text-xs text-gray-600 mb-1">Média mensal</p>
                  <p className="text-xl font-bold text-purple-600">
                    R$ {mediaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-100 bg-orange-50">
                <CardContent className="pt-4 p-4">
                  <p className="text-xs text-gray-600 mb-1">Projeção anual</p>
                  <p className={`text-xl font-bold ${projecaoAnual > LIMITE_ANUAL ? 'text-red-600' : 'text-orange-600'}`}>
                    R$ {projecaoAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Aviso de Projeção */}
            {projecaoAnual > LIMITE_ANUAL && statusLimite !== 'exceeded' && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 text-sm">
                  <strong>Atenção:</strong> Com base no seu faturamento atual, você pode ultrapassar o limite até o fim do ano!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* DAS - Documento de Arrecadação do Simples Nacional */}
        <Card className="shadow-lg border-emerald-100/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-xl">
              <FileText className="w-5 h-5 text-emerald-600" />
              DAS - Imposto MEI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-500">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Valor aproximado do DAS</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {VALOR_DAS_BASE.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    * Valor pode variar conforme a atividade
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700"
                asChild
              >
                <a 
                  href="https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Emitir DAS
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>

            {/* Calendário de Pagamento */}
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Calendário de Pagamento
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => {
                  const isPast = month < currentMonth;
                  const isCurrent = month === currentMonth;
                  
                  return (
                    <div 
                      key={month}
                      className={`p-3 rounded-lg text-center border-2 transition-all ${
                        isPast ? 'bg-gray-50 border-gray-200 opacity-60' :
                        isCurrent ? 'bg-emerald-50 border-emerald-500 shadow-md' :
                        'bg-white border-gray-200 hover:border-emerald-300'
                      }`}
                    >
                      <p className={`text-xs font-medium ${
                        isCurrent ? 'text-emerald-700' : 'text-gray-600'
                      }`}>
                        {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][month - 1]}
                      </p>
                      <p className={`text-xs mt-1 ${
                        isPast ? 'text-gray-400' :
                        isCurrent ? 'text-emerald-600 font-bold' :
                        'text-gray-500'
                      }`}>
                        Venc: 20/{month.toString().padStart(2, '0')}
                      </p>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💡 O DAS vence sempre no dia 20 do mês seguinte
              </p>
            </div>

            {/* Links Úteis */}
            <div className="grid md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                asChild
              >
                <a 
                  href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Portal do Empreendedor
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start"
                asChild
              >
                <a 
                  href="https://www8.receita.fazenda.gov.br/SimplesNacional/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Portal Simples Nacional
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}