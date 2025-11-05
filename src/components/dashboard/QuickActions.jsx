import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Target, Calendar, FileText, Users } from 'lucide-react';

const actions = [
  {
    title: "Nova Entrada/Saída",
    icon: Plus,
    to: "Transactions",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    title: "Criar Meta",
    icon: Target,
    to: "Goals",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Planejar Pagamento",
    icon: Calendar,
    to: "Planning",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    title: "Adicionar Contato",
    icon: Users,
    to: "Contacts",
    gradient: "from-orange-500 to-red-600",
  },
];

export default function QuickActions() {
  return (
    <Card className="shadow-lg border-emerald-100/50">
      <CardHeader className="px-4 md:px-6">
        <CardTitle className="flex items-center gap-2 text-base md:text-xl">
          <Plus className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {actions.map((action) => (
            <Link key={action.to} to={createPageUrl(action.to)}>
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 hover:shadow-md transition-all duration-200 border-gray-200 hover:border-emerald-300"
              >
                <div className={`p-2 md:p-3 rounded-lg bg-gradient-to-br ${action.gradient}`}>
                  <action.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <span className="text-xs md:text-sm font-medium text-center text-gray-700 leading-tight">
                  {action.title}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}