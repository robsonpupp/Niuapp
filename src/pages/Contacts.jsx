import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ContactForm from "../components/contacts/ContactForm";
import ContactCard from "../components/contacts/ContactCard";

export default function ContactsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const queryClient = useQueryClient();

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => base44.entities.Contact.list('name'),
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Contact.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setShowForm(false);
      setEditingContact(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Contact.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      setShowForm(false);
      setEditingContact(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Contact.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });

  const handleSubmit = (data) => {
    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  // Filtrar contatos
  const filteredContacts = contacts.filter(contact => {
    // Filtro de tipo
    if (filterType !== 'all' && contact.type !== filterType) return false;

    // Filtro de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.phone?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  // Contar movimentações por contato
  const getContactTransactions = (contactId) => {
    return transactions.filter(t => t.contact_id === contactId);
  };

  return (
    <div className="p-3 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Contatos
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              Gerencie seus clientes e fornecedores
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingContact(null);
              setShowForm(!showForm);
            }}
            className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Contato
          </Button>
        </div>

        {/* Formulário */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ContactForm
                contact={editingContact}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={createMutation.isPending || updateMutation.isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Busca e Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, telefone ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterType('all')}
              className={filterType === 'all' ? 'bg-gradient-to-r from-emerald-500 to-blue-600' : ''}
            >
              Todos
            </Button>
            <Button
              variant={filterType === 'Cliente' ? 'default' : 'outline'}
              onClick={() => setFilterType('Cliente')}
              className={filterType === 'Cliente' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Clientes
            </Button>
            <Button
              variant={filterType === 'Fornecedor' ? 'default' : 'outline'}
              onClick={() => setFilterType('Fornecedor')}
              className={filterType === 'Fornecedor' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              Fornecedores
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 text-center">
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              {contacts.length}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Total</p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-3 md:p-4 text-center">
            <p className="text-2xl md:text-3xl font-bold text-green-700">
              {contacts.filter(c => c.type === 'Cliente' || c.type === 'Ambos').length}
            </p>
            <p className="text-xs md:text-sm text-green-600 mt-1">Clientes</p>
          </div>
          <div className="bg-orange-50 rounded-lg border border-orange-200 p-3 md:p-4 text-center">
            <p className="text-2xl md:text-3xl font-bold text-orange-700">
              {contacts.filter(c => c.type === 'Fornecedor' || c.type === 'Ambos').length}
            </p>
            <p className="text-xs md:text-sm text-orange-600 mt-1">Fornecedores</p>
          </div>
        </div>

        {/* Lista de Contatos */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando contatos...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg mb-2">
              {searchTerm || filterType !== 'all' 
                ? 'Nenhum contato encontrado' 
                : 'Nenhum contato cadastrado ainda'}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm || filterType !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Clique em "Novo Contato" para começar'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                transactionCount={getContactTransactions(contact.id).length}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}