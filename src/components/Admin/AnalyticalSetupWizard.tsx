import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, X, Layers, Target, Settings, BarChart3, AlertTriangle, CheckCircle, Users, Building2, Package, Database } from 'lucide-react';

interface AnalyticalSetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

interface SetupData {
  company: {
    name: string;
    industry: string;
    size: string;
  };
  axes: Array<{
    code: string;
    label: string;
    required: boolean;
    values: string[];
  }>;
  integrations: {
    accounting: boolean;
    hr: boolean;
    commercial: boolean;
    banking: boolean;
  };
  preferences: {
    currency: string;
    fiscalYearStart: string;
    reportingFrequency: string;
    alertThresholds: {
      budget: number;
      margin: number;
    };
  };
}

const AnalyticalSetupWizard: React.FC<AnalyticalSetupWizardProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [setupData, setSetupData] = useState<SetupData>({
    company: {
      name: '',
      industry: '',
      size: ''
    },
    axes: [
      {
        code: 'PROJECT',
        label: 'Projets',
        required: true,
        values: []
      },
      {
        code: 'CLIENT',
        label: 'Clients',
        required: true,
        values: []
      }
    ],
    integrations: {
      accounting: true,
      hr: true,
      commercial: true,
      banking: false
    },
    preferences: {
      currency: 'EUR',
      fiscalYearStart: '01-01',
      reportingFrequency: 'monthly',
      alertThresholds: {
        budget: 90,
        margin: 20
      }
    }
  });

  const industries = [
    'Technologie', 'Services', 'Commerce', 'Industrie', 'Finance', 
    'Santé', 'Éducation', 'Immobilier', 'Transport', 'Autre'
  ];

  const companySizes = [
    'TPE (1-9 salariés)', 'PME (10-249 salariés)', 'ETI (250-4999 salariés)', 'Grande entreprise (5000+ salariés)'
  ];

  const availableAxes = [
    { code: 'PROJECT', label: 'Projets', icon: Layers, description: 'Suivi de rentabilité par projet' },
    { code: 'CLIENT', label: 'Clients', icon: Users, description: 'Analyse par client' },
    { code: 'PRODUCT', label: 'Produits/Services', icon: Package, description: 'Performance par produit' },
    { code: 'COST_CENTER', label: 'Centres de Coût', icon: Building2, description: 'Répartition par département' }
  ];

  const steps = [
    { id: 1, title: 'Informations Entreprise', icon: Building2 },
    { id: 2, title: 'Configuration des Axes', icon: Layers },
    { id: 3, title: 'Intégrations', icon: Database },
    { id: 4, title: 'Préférences', icon: Settings }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsSubmitting(true);
    
    // Simulate setup completion
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2000);
  };

  const addAxisValue = (axisIndex: number, value: string) => {
    if (!value.trim()) return;
    
    const newAxes = [...setupData.axes];
    if (!newAxes[axisIndex].values.includes(value)) {
      newAxes[axisIndex].values.push(value);
      setSetupData({ ...setupData, axes: newAxes });
    }
  };

  const removeAxisValue = (axisIndex: number, valueIndex: number) => {
    const newAxes = [...setupData.axes];
    newAxes[axisIndex].values.splice(valueIndex, 1);
    setSetupData({ ...setupData, axes: newAxes });
  };

  const toggleAxis = (axisCode: string) => {
    const existingIndex = setupData.axes.findIndex(axis => axis.code === axisCode);
    
    if (existingIndex >= 0) {
      // Remove axis if not required
      const axis = setupData.axes[existingIndex];
      if (!axis.required) {
        const newAxes = setupData.axes.filter(a => a.code !== axisCode);
        setSetupData({ ...setupData, axes: newAxes });
      }
    } else {
      // Add axis
      if (setupData.axes.length < 4) {
        const axisTemplate = availableAxes.find(a => a.code === axisCode);
        if (axisTemplate) {
          const newAxis = {
            code: axisTemplate.code,
            label: axisTemplate.label,
            required: false,
            values: []
          };
          setSetupData({ ...setupData, axes: [...setupData.axes, newAxis] });
        }
      }
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return setupData.company.name && setupData.company.industry && setupData.company.size;
      case 2:
        return setupData.axes.length >= 2 && setupData.axes.every(axis => axis.values.length > 0);
      case 3:
        return true; // Integrations are optional
      case 4:
        return setupData.preferences.currency && setupData.preferences.fiscalYearStart;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Configuration Comptabilité Analytique</h1>
                <p className="text-white/80">Assistant de configuration en 4 étapes</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 relative z-10">
            <div className="flex items-center justify-between">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep === step.id 
                        ? 'bg-white text-blue-600' 
                        : currentStep > step.id 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/30 text-white'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm text-white/80 text-center hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-white/30 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showSuccessMessage ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Configuration Terminée !</h2>
              <p className="text-slate-600 mb-6">
                Le module Comptabilité Analytique est maintenant configuré et prêt à l'emploi.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                  {setupData.axes.length} axes configurés
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  {Object.values(setupData.integrations).filter(Boolean).length} intégrations activées
                </div>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Configuration en cours...</h2>
              <p className="text-slate-600">Nous configurons votre module analytique</p>
            </div>
          ) : (
            <>
              {/* Step 1: Company Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900">Informations sur votre Entreprise</h2>
                    <p className="text-slate-600">Ces informations nous aideront à personnaliser votre configuration</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom de l'entreprise <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={setupData.company.name}
                        onChange={(e) => setSetupData({
                          ...setupData,
                          company: { ...setupData.company, name: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Dziljo SaaS"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Secteur d'activité <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={setupData.company.industry}
                        onChange={(e) => setSetupData({
                          ...setupData,
                          company: { ...setupData.company, industry: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner un secteur</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Taille de l'entreprise <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={setupData.company.size}
                        onChange={(e) => setSetupData({
                          ...setupData,
                          company: { ...setupData.company, size: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner une taille</option>
                        {companySizes.map(size => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Analytical Axes */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Layers className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900">Configuration des Axes Analytiques</h2>
                    <p className="text-slate-600">Sélectionnez les dimensions d'analyse (maximum 4 axes)</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableAxes.map((axis) => {
                      const isSelected = setupData.axes.some(a => a.code === axis.code);
                      const selectedAxis = setupData.axes.find(a => a.code === axis.code);
                      const isRequired = selectedAxis?.required || false;
                      
                      return (
                        <div
                          key={axis.code}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-200 hover:border-slate-300'
                          } ${setupData.axes.length >= 4 && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => !isRequired && (setupData.axes.length < 4 || isSelected) && toggleAxis(axis.code)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <axis.icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-slate-600'}`} />
                              <h3 className="font-medium text-slate-900">{axis.label}</h3>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isRequired && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                  Obligatoire
                                </span>
                              )}
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600">{axis.description}</p>
                          
                          {isSelected && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Valeurs initiales (optionnel)
                              </label>
                              <div className="space-y-2">
                                {selectedAxis?.values.map((value, valueIndex) => (
                                  <div key={valueIndex} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={value}
                                      readOnly
                                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm bg-slate-50"
                                    />
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeAxisValue(setupData.axes.findIndex(a => a.code === axis.code), valueIndex);
                                      }}
                                      className="p-1 text-red-500 hover:text-red-700"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ))}
                                <input
                                  type="text"
                                  placeholder="Ajouter une valeur..."
                                  className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      const target = e.target as HTMLInputElement;
                                      addAxisValue(setupData.axes.findIndex(a => a.code === axis.code), target.value);
                                      target.value = '';
                                    }
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {setupData.axes.length >= 4 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-orange-900">Limite d'axes atteinte</h3>
                          <p className="text-sm text-orange-700 mt-1">
                            Vous avez sélectionné le maximum de 4 axes analytiques. 
                            Désélectionnez un axe pour en choisir un autre.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Integrations */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900">Intégrations avec les Modules</h2>
                    <p className="text-slate-600">Activez les intégrations pour automatiser la ventilation analytique</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        key: 'accounting',
                        title: 'Comptabilité Générale',
                        description: 'Ventilation automatique des écritures comptables',
                        icon: BarChart3,
                        recommended: true
                      },
                      {
                        key: 'hr',
                        title: 'Ressources Humaines',
                        description: 'Répartition des salaires par projet/centre de coût',
                        icon: Users,
                        recommended: true
                      },
                      {
                        key: 'commercial',
                        title: 'Module Commercial',
                        description: 'Taggage automatique des ventes par client/produit',
                        icon: Target,
                        recommended: true
                      },
                      {
                        key: 'banking',
                        title: 'Synchronisation Bancaire',
                        description: 'Catégorisation automatique des mouvements bancaires',
                        icon: Database,
                        recommended: false
                      }
                    ].map((integration) => (
                      <div
                        key={integration.key}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          setupData.integrations[integration.key as keyof typeof setupData.integrations]
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setSetupData({
                          ...setupData,
                          integrations: {
                            ...setupData.integrations,
                            [integration.key]: !setupData.integrations[integration.key as keyof typeof setupData.integrations]
                          }
                        })}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <integration.icon className={`w-6 h-6 ${
                              setupData.integrations[integration.key as keyof typeof setupData.integrations] 
                                ? 'text-blue-600' : 'text-slate-600'
                            }`} />
                            <h3 className="font-medium text-slate-900">{integration.title}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            {integration.recommended && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                Recommandé
                              </span>
                            )}
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              setupData.integrations[integration.key as keyof typeof setupData.integrations]
                                ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                            }`}>
                              {setupData.integrations[integration.key as keyof typeof setupData.integrations] && 
                                <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600">{integration.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Preferences */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-900">Préférences et Paramètres</h2>
                    <p className="text-slate-600">Configurez les paramètres par défaut du module</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Devise <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={setupData.preferences.currency}
                          onChange={(e) => setSetupData({
                            ...setupData,
                            preferences: { ...setupData.preferences, currency: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="EUR">Euro (EUR)</option>
                          <option value="USD">Dollar US (USD)</option>
                          <option value="GBP">Livre Sterling (GBP)</option>
                          <option value="CHF">Franc Suisse (CHF)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Début d'exercice fiscal <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={setupData.preferences.fiscalYearStart}
                          onChange={(e) => setSetupData({
                            ...setupData,
                            preferences: { ...setupData.preferences, fiscalYearStart: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="01-01">1er Janvier</option>
                          <option value="04-01">1er Avril</option>
                          <option value="07-01">1er Juillet</option>
                          <option value="10-01">1er Octobre</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Fréquence de reporting
                        </label>
                        <select
                          value={setupData.preferences.reportingFrequency}
                          onChange={(e) => setSetupData({
                            ...setupData,
                            preferences: { ...setupData.preferences, reportingFrequency: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="weekly">Hebdomadaire</option>
                          <option value="monthly">Mensuel</option>
                          <option value="quarterly">Trimestriel</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Seuil d'alerte budget (%)
                        </label>
                        <input
                          type="number"
                          value={setupData.preferences.alertThresholds.budget}
                          onChange={(e) => setSetupData({
                            ...setupData,
                            preferences: {
                              ...setupData.preferences,
                              alertThresholds: {
                                ...setupData.preferences.alertThresholds,
                                budget: parseFloat(e.target.value) || 90
                              }
                            }
                          })}
                          min="0"
                          max="100"
                          step="5"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Alerte déclenchée quand le budget atteint ce pourcentage
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Seuil de marge minimum (%)
                        </label>
                        <input
                          type="number"
                          value={setupData.preferences.alertThresholds.margin}
                          onChange={(e) => setSetupData({
                            ...setupData,
                            preferences: {
                              ...setupData.preferences,
                              alertThresholds: {
                                ...setupData.preferences.alertThresholds,
                                margin: parseFloat(e.target.value) || 20
                              }
                            }
                          })}
                          min="0"
                          max="100"
                          step="1"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Alerte déclenchée si la marge descend sous ce seuil
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-blue-900">Configuration Prête</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Votre module de comptabilité analytique sera configuré avec {setupData.axes.length} axes, 
                          {Object.values(setupData.integrations).filter(Boolean).length} intégrations activées 
                          et des alertes automatiques.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Navigation */}
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

              <button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {currentStep === 4 ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Terminer la Configuration
                  </>
                ) : (
                  <>
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticalSetupWizard;