import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function UpcomingAlerts({ upcoming, overdue }) {
  if (upcoming.length === 0 && overdue.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Contas Atrasadas */}
      {overdue.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-600 flex-shrink-0" />
          <AlertDescription className="text-red-800 text-sm md:text-base">
            <div className="flex flex-col gap-2">
              <p className="font-bold">
                {overdue.length} conta(s) atrasada(s)!
              </p>
              <div className="space-y-1">
                {overdue.slice(0, 3).map(bill => (
                  <div key={bill.id} className="flex justify-between items-center text-xs md:text-sm gap-2">
                    <span className="truncate flex-1">{bill.description}</span>
                    <span className="font-semibold flex-shrink-0">
                      R$ {bill.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Próximas do Vencimento */}
      {upcoming.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Clock className="h-4 w-4 md:h-5 md:w-5 text-orange-600 flex-shrink-0" />
          <AlertDescription className="text-orange-800 text-sm md:text-base">
            <div className="flex flex-col gap-2">
              <p className="font-bold">
                {upcoming.length} conta(s) vencendo nos próximos 7 dias
              </p>
              <div className="space-y-1">
                {upcoming.slice(0, 3).map(bill => (
                  <div key={bill.id} className="flex justify-between items-center text-xs md:text-sm gap-2">
                    <span className="truncate flex-1">{bill.description}</span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs">
                        {format(new Date(bill.due_date), "dd/MM")}
                      </span>
                      <span className="font-semibold">
                        R$ {bill.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}