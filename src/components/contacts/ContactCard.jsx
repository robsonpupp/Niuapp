import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Edit, 
  Trash2, 
  Receipt,
  Building2
} from 'lucide-react';

export default function ContactCard({ contact, transactionCount, onEdit, onDelete }) {
  const typeConfig = {
    'Cliente': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200'
    },
    'Fornecedor': {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-200'
    },
    'Ambos': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200'
    }
  };

  const config = typeConfig[contact.type] || typeConfig['Cliente'];

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-gray-200 overflow-hidden">
      {/* Header com tipo */}
      <div className={`${config.bg} ${config.border} border-b px-4 py-2`}>
        <Badge className={`${config.bg} ${config.text} border-0`}>
          {contact.type}
        </Badge>
      </div>

      <CardContent className="p-4">
        {/* Nome e Avatar */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">
              {contact.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-base truncate">
              {contact.name}
            </h3>
            {transactionCount > 0 && (
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <Receipt className="w-3 h-3" />
                <span>{transactionCount} movimentaç{transactionCount === 1 ? 'ão' : 'ões'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate">{contact.phone}</span>
          </div>
          
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          
          {contact.document && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{contact.document}</span>
            </div>
          )}

          {contact.notes && (
            <div className="flex items-start gap-2 text-sm text-gray-600 mt-3 pt-3 border-t">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs line-clamp-2">{contact.notes}</p>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant="outline"
            className="flex-1 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
            onClick={() => onEdit(contact)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            onClick={() => onDelete(contact.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}