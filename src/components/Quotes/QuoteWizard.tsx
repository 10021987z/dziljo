import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Save, AlertTriangle, CheckCircle, TrendingUp, Target, DollarSign, Zap, Plus, Trash2 } from 'lucide-react';
import { useQuoteTemplates } from '../../hooks/useQuotes';

interface QuoteWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quoteData: any) => void;
  initialData?: any;
}

const QuoteWizard: React.FC<QuoteWizardProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const { templates } = useQuoteTemplates({ minWinRate: 70 });

  const [quoteData, setQuoteData] = useState({
    // Étape 1: Client
    client: {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      industry: '',
      siret: '',
      vatNumber: ''
    },
    contact: {
      name: '',
      email: '',
      phone: '',
      position: ''
    },
    // Étape 2: Lignes
    title: '',
    templateId: null,
    lines: [{
      id: '1',
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0,
      margin: 0,
      marginPercent: 0,
      category: 'Service',
      isOptional: false
    }],
    // Étape 3: Remises
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 20,
    // Étape 4: Conditions
    conditions: {
      paymentTerms: '30 jours',
      deliveryTerms: 'Selon planning convenu',
      warranty: '12 mois',
      penalties: 'Selon CGV',
      additionalTerms: []
    },
    validityDays: 30,
    notes: '',
    internalNotes: ''
  });

  const [insights, setInsights] = useState({
    signatureProbability: 0,
    marginAlert: false,
    discountAlert: false,
    recommendations: []
  });

  const steps = [
    { id: 1, title: 'Client & Contact', icon: 'user' },
    { id: 2, title: 'Lignes de Devis', icon: 'list' },
    { id: 3, title: 'Remises & Taxes', icon: 'percent' },
    { id: 4, title: 'Conditions & Finalisation', icon: 'check' }
  ];

  // Calculate totals and insights
  useEffect(() => {
    calculateTotals();
    updateInsights();
  }, [quoteData.lines, quoteData.discountType, quoteData.discountValue, quoteData.taxRate]);

  const calculateTotals = () => {
    const subtotal = quoteData.lines.reduce((sum, line) => {
      const lineTotal = line.quantity * line.unitPrice * (1 - line.discount / 100);
      return sum + lineTotal;
    }, 0);

    const discountAmount = quoteData.discountType === 'percentage' 
      ? subtotal * (quoteData.discountValue / 100)
      : quoteData.discountValue;

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (quoteData.taxRate / 100);
    const total = afterDiscount + taxAmount;

    // Update lines totals
    const updatedLines = quoteData.lines.map(line => {
      const lineTotal = line.quantity * line.unitPrice * (1 - line.discount / 100);
      const margin = lineTotal * 0.4; // Exemple: 40% de marge
      const marginPercent = lineTotal > 0 ? (margin / lineTotal) * 100 : 0;
      
      return {
        ...line,
        total: lineTotal,
        margin,
        marginPercent
      };
    });

    setQuoteData(prev => ({
      ...prev,
      lines: updatedLines,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }));
  };

  const updateInsights = () => {
    const totalMargin = quoteData.lines.reduce((sum, line) => sum + line.margin, 0);
    const totalValue = quoteData.lines.reduce((sum, line) => sum + line.total, 0);
    const overallMarginPercent = totalValue > 0 ? (totalMargin / totalValue) * 100 : 0;

    const newInsights = {
      signatureProbability: Math.min(95, 60 + (overallMarginPercent > 25 ? 20 : 0) + (quoteData.discountValue < 10 ? 15 : 0)),
      marginAlert: overallMarginPercent < 20,
      discountAlert: quoteData.discountValue > 15,
      recommendations: []
    };

    if (newInsights.marginAlert) {
      newInsights.recommendations.push('⚠️ Marge faible détectée - Vérifiez vos prix');
    }
    if (newInsights.discountAlert) {
      newInsights.recommendations.push('🚨 Remise élevée - Approbation manager requise');
    }
    if (overallMarginPercent > 35) {
      newInsights.recommendations.push('✅ Excellente marge - Devis optimisé');
    }

    setInsights(newInsights);
  };

  const addLine = () => {
    const newLine = {
      id: Date.now().toString(),
      productName: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0,
      margin: 0,
      marginPercent: 0,
      category: 'Service',
      isOptional: false
    };
    setQuoteData(prev => ({
      ...prev,
      lines: [...prev.lines, newLine]
    }));
  };

  const removeLine = (id: string) => {
    setQuoteData(prev => ({
      ...prev,
      lines: prev.lines.filter(line => line.id !== id)
    }));
  };

  const updateLine = (id: string, field: string, value: any) => {
    setQuoteData(prev => ({
      ...prev,
      lines: prev.lines.map(line => 
        line.id === id ? { ...line, [field]: value } : line
      )
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return quoteData.client.name && quoteData.client.email && quoteData.contact.name;
      case 2:
        return quoteData.title && quoteData.lines.length > 0 && quoteData.lines.every(line => line.productName && line.unitPrice > 0);
      case 3:
        return true; // Remises et taxes sont optionnelles
      case 4:
        return true; // Conditions ont des valeurs par défaut
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        setTimeout(() => {
          onSave(quoteData);
          setShowSuccessMessage(false);
          onClose();
        }, 1500);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Assistant Devis Intelligent</h1>
              <p className="text-white/80">Créez un devis optimisé en 4 étapes</p>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    currentStep === step.id ? 'bg-white text-blue-600' : 
                    currentStep > step.id ? 'bg-green-500 text-white' : 'bg-white/30 text-white'
                  }`}>
                    {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  <span className="text-sm text-white/80 text-center">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-white/30 mt-2 rounded-full">
              <div className="h-full bg-white transition-all duration-300" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
            {showSuccessMessage ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Devis Créé avec Succès !</h2>
                <p className="text-slate-600">Votre devis intelligent a été généré et est prêt à être envoyé.</p>
              </div>
            ) : isSubmitting ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Génération en cours...</h2>
                <p className="text-slate-600">Nous créons votre devis intelligent</p>
              </div>
            ) : (
              <>
                {/* Étape 1: Client & Contact */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900">Informations Client & Contact</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">Informations Client</h3>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nom de l'entreprise <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={quoteData.client.name}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              client: { ...prev.client, name: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: TechCorp Solutions"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={quoteData.client.email}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              client: { ...prev.client, email: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="contact@techcorp.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                          <input
                            type="tel"
                            value={quoteData.client.phone}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              client: { ...prev.client, phone: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+33 1 23 45 67 89"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Secteur d'activité</label>
                          <select
                            value={quoteData.client.industry}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              client: { ...prev.client, industry: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Sélectionner un secteur</option>
                            <option value="Technologie">Technologie</option>
                            <option value="Finance">Finance</option>
                            <option value="Santé">Santé</option>
                            <option value="Commerce">Commerce</option>
                            <option value="Industrie">Industrie</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">Contact Principal</h3>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nom du contact <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={quoteData.contact.name}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              contact: { ...prev.contact, name: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Jean Dupont"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Email du contact</label>
                          <input
                            type="email"
                            value={quoteData.contact.email}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              contact: { ...prev.contact, email: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="j.dupont@techcorp.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Poste</label>
                          <input
                            type="text"
                            value={quoteData.contact.position}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              contact: { ...prev.contact, position: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Directeur IT"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone du contact</label>
                          <input
                            type="tel"
                            value={quoteData.contact.phone}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              contact: { ...prev.contact, phone: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="+33 1 23 45 67 89"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 2: Lignes de Devis */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-slate-900">Lignes de Devis</h2>
                      <button
                        onClick={addLine}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une ligne
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Titre du devis <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={quoteData.title}
                        onChange={(e) => setQuoteData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Projet CRM Enterprise"
                      />
                    </div>

                    <div className="space-y-4">
                      {quoteData.lines.map((line, index) => (
                        <div key={line.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-slate-900">Ligne {index + 1}</h4>
                            {quoteData.lines.length > 1 && (
                              <button
                                onClick={() => removeLine(line.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Produit/Service <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={line.productName}
                                onChange={(e) => updateLine(line.id, 'productName', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nom du produit"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Quantité</label>
                              <input
                                type="number"
                                value={line.quantity}
                                onChange={(e) => updateLine(line.id, 'quantity', parseFloat(e.target.value) || 1)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="1"
                                step="1"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Prix unitaire (€) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                value={line.unitPrice}
                                onChange={(e) => updateLine(line.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                step="0.01"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Remise (%)</label>
                              <input
                                type="number"
                                value={line.discount}
                                onChange={(e) => updateLine(line.id, 'discount', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                min="0"
                                max="100"
                                step="0.1"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                            <textarea
                              value={line.description}
                              onChange={(e) => updateLine(line.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Description détaillée du produit/service"
                            />
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`optional-${line.id}`}
                                checked={line.isOptional}
                                onChange={(e) => updateLine(line.id, 'isOptional', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                              />
                              <label htmlFor={`optional-${line.id}`} className="ml-2 text-sm text-slate-700">
                                Ligne optionnelle
                              </label>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-600">Total ligne</p>
                              <p className="text-lg font-bold text-slate-900">€{line.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Étape 3: Remises & Taxes */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900">Remises & Taxes</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">Remise Globale</h3>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Type de remise</label>
                          <select
                            value={quoteData.discountType}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, discountType: e.target.value }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="percentage">Pourcentage</option>
                            <option value="amount">Montant fixe</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Valeur de la remise {quoteData.discountType === 'percentage' ? '(%)' : '(€)'}
                          </label>
                          <input
                            type="number"
                            value={quoteData.discountValue}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">Taxes</h3>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Taux de TVA (%)</label>
                          <select
                            value={quoteData.taxRate}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={0}>0% (Exonéré)</option>
                            <option value={5.5}>5.5% (Taux réduit)</option>
                            <option value={10}>10% (Taux intermédiaire)</option>
                            <option value={20}>20% (Taux normal)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Résumé des totaux */}
                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                      <h3 className="font-medium text-slate-900 mb-4">Résumé Financier</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Sous-total HT</span>
                          <span className="font-medium">€{(quoteData.subtotal || 0).toFixed(2)}</span>
                        </div>
                        {quoteData.discountValue > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Remise</span>
                            <span className="font-medium text-red-600">-€{(quoteData.discountAmount || 0).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-600">TVA ({quoteData.taxRate}%)</span>
                          <span className="font-medium">€{(quoteData.taxAmount || 0).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-slate-200 pt-2">
                          <div className="flex justify-between">
                            <span className="font-bold text-slate-900">Total TTC</span>
                            <span className="font-bold text-slate-900 text-lg">€{(quoteData.total || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 4: Conditions & Finalisation */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-slate-900">Conditions & Finalisation</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Conditions de paiement</label>
                          <select
                            value={quoteData.conditions.paymentTerms}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              conditions: { ...prev.conditions, paymentTerms: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="Comptant">Comptant</option>
                            <option value="30 jours">30 jours</option>
                            <option value="45 jours">45 jours</option>
                            <option value="60 jours">60 jours</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Conditions de livraison</label>
                          <input
                            type="text"
                            value={quoteData.conditions.deliveryTerms}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              conditions: { ...prev.conditions, deliveryTerms: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Garantie</label>
                          <input
                            type="text"
                            value={quoteData.conditions.warranty}
                            onChange={(e) => setQuoteData(prev => ({
                              ...prev,
                              conditions: { ...prev.conditions, warranty: e.target.value }
                            }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Validité du devis (jours)</label>
                          <select
                            value={quoteData.validityDays}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, validityDays: parseInt(e.target.value) }))}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={15}>15 jours</option>
                            <option value={30}>30 jours</option>
                            <option value={45}>45 jours</option>
                            <option value={60}>60 jours</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Notes client</label>
                          <textarea
                            value={quoteData.notes}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, notes: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Notes visibles par le client..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Notes internes</label>
                          <textarea
                            value={quoteData.internalNotes}
                            onChange={(e) => setQuoteData(prev => ({ ...prev, internalNotes: e.target.value }))}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Notes internes non visibles par le client..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Insights Sidebar */}
          <div className="w-80 bg-slate-50 border-l border-slate-200 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-600" />
                  Insights IA
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">Probabilité de signature</span>
                      <span className={`text-lg font-bold ${
                        insights.signatureProbability >= 80 ? 'text-green-600' :
                        insights.signatureProbability >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {insights.signatureProbability}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          insights.signatureProbability >= 80 ? 'bg-green-600' :
                          insights.signatureProbability >= 60 ? 'bg-orange-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${insights.signatureProbability}%` }}
                      ></div>
                    </div>
                  </div>

                  {insights.marginAlert && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="text-sm font-medium text-orange-900">Alerte Marge</span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        Marge inférieure à 20% détectée
                      </p>
                    </div>
                  )}

                  {insights.discountAlert && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-sm font-medium text-red-900">Remise Élevée</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        Approbation manager requise (&gt; 15%)
                      </p>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-4 border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-2">Recommandations</h4>
                    <div className="space-y-2">
                      {insights.recommendations.length > 0 ? (
                        insights.recommendations.map((rec, index) => (
                          <p key={index} className="text-sm text-slate-700">{rec}</p>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500">Aucune recommandation pour le moment</p>
                      )}
                    </div>
                  </div>

                  {templates.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <h4 className="font-medium text-slate-900 mb-2">Modèles Performants</h4>
                      <div className="space-y-2">
                        {templates.slice(0, 3).map((template) => (
                          <div key={template.id} className="text-sm">
                            <p className="font-medium text-slate-700">{template.name}</p>
                            <p className="text-xs text-green-600">Win rate: {template.winRate}%</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {!isSubmitting && !showSuccessMessage && (
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!validateStep(currentStep)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Créer le Devis
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteWizard;