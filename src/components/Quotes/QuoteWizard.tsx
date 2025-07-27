import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Calculator, FileText, User, Building2, Mail, Phone } from 'lucide-react';
import { Quote, QuoteItem } from '../../hooks/useQuotes';

interface QuoteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quoteData: Partial<Quote>) => void;
  initialData?: Quote;
  isEditing?: boolean;
}

const QuoteWizard: React.FC<QuoteWizardProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState<Partial<Quote>>({
    title: initialData?.title || '',
    client: initialData?.client || { name: '', email: '' },
    contact: initialData?.contact || { name: '', email: '' },
    items: initialData?.items || [{ id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }],
    validUntil: initialData?.validUntil || '',
    assignedTo: initialData?.assignedTo || 'Sophie Martin',
    notes: initialData?.notes || '',
    terms: initialData?.terms || 'Conditions générales de vente applicables.'
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClientChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      client: {
        ...prev.client!,
        [field]: value
      }
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact: {
        ...prev.contact!,
        [field]: value
      }
    }));
  };

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Recalculate total for this item
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].total = newItems[index].quantity * newItems[index].unitPrice;
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };

    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || []
    }));
  };

  const calculateTotals = () => {
    const subtotal = (formData.items || []).reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.2; // 20% TVA
    const total = subtotal + tax;
    const marginPercent = 30; // Simulation

    return { subtotal, tax, total, marginPercent };
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.client?.name) newErrors.clientName = 'Le nom du client est requis';
    if (!formData.client?.email) newErrors.clientEmail = 'L\'email du client est requis';
    if (!formData.contact?.name) newErrors.contactName = 'Le nom du contact est requis';
    if (!formData.validUntil) newErrors.validUntil = 'La date de validité est requise';

    // Validate items
    const hasValidItems = formData.items?.some(item => 
      item.description && item.quantity > 0 && item.unitPrice > 0
    );
    if (!hasValidItems) {
      newErrors.items = 'Au moins un article valide est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const totals = calculateTotals();
      const quoteData = {
        ...formData,
        ...totals,
        expiryDate: formData.validUntil
      };

      onSave(quoteData);
    }
  };

  if (!isOpen) return null;

  const totals = calculateTotals();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? 'Modifier le Devis' : 'Nouveau Devis'}
                </h1>
                <p className="text-white/80">Créez un devis professionnel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Titre du Devis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Ex: Projet CRM Enterprise"
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Valide jusqu'au <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validUntil || ''}
                  onChange={(e) => handleChange('validUntil', e.target.value)}
                  className={`w-full px-3 py-2 border ${errors.validUntil ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.validUntil && <p className="mt-1 text-sm text-red-500">{errors.validUntil}</p>}
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                Informations Client
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.client?.name || ''}
                    onChange={(e) => handleClientChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border ${errors.clientName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="TechCorp Solutions"
                  />
                  {errors.clientName && <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.client?.email || ''}
                      onChange={(e) => handleClientChange('email', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.clientEmail ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="contact@techcorp.com"
                    />
                  </div>
                  {errors.clientEmail && <p className="mt-1 text-sm text-red-500">{errors.clientEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom du contact <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.contact?.name || ''}
                      onChange={(e) => handleContactChange('name', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 border ${errors.contactName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  {errors.contactName && <p className="mt-1 text-sm text-red-500">{errors.contactName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email du contact
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.contact?.email || ''}
                      onChange={(e) => handleContactChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="j.dupont@techcorp.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-slate-900 flex items-center">
                  <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                  Articles du Devis
                </h3>
                <button
                  onClick={addItem}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter
                </button>
              </div>

              {errors.items && <p className="mb-4 text-sm text-red-500">{errors.items}</p>}

              <div className="space-y-3">
                {formData.items?.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-slate-50 rounded-lg">
                    <div className="col-span-5">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Description du service"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Quantité</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Prix unitaire</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Total</label>
                      <div className="px-2 py-1 bg-slate-200 rounded text-sm font-medium">
                        €{item.total.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1 text-red-500 hover:text-red-700 transition-colors"
                        disabled={formData.items?.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-6 bg-slate-100 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>€{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA (20%):</span>
                    <span>€{totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-slate-300 pt-2">
                    <span>Total TTC:</span>
                    <span>€{totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes and Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notes internes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Conditions</label>
                <textarea
                  value={formData.terms || ''}
                  onChange={(e) => handleChange('terms', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Conditions générales..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Mettre à jour' : 'Créer le Devis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteWizard;