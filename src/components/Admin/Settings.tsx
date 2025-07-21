import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Save, RefreshCw, Download, Upload, 
  Bell, Shield, Eye, Palette, Globe, Moon, Sun, Volume2, VolumeX, 
  Smartphone, Monitor, Wifi, Database, Key, Lock, Unlock, 
  Trash2, AlertTriangle, CheckCircle, Zap, Heart, Coffee, 
  DollarSign, Percent, CreditCard, Calendar, Clock, FileText,
  Users, Building, Mail, Phone, MapPin, ChevronDown, ChevronUp
} from 'lucide-react';

interface SettingsProps {
  module?: 'invoicing' | 'contracts' | 'admin' | 'general';
}

const Settings: React.FC<SettingsProps> = ({ module = 'invoicing' }) => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      companyName: 'dziljo SaaS',
      companyLogo: '/logo.png',
      companyAddress: '123 Rue de la Tech, 75001 Paris',
      companyPhone: '+33 1 23 45 67 89',
      companyEmail: 'contact@dziljo.com',
      companyWebsite: 'www.dziljo.com',
      companyVAT: 'FR12345678901',
      companySIRET: '12345678901234',
      language: 'fr',
      timezone: 'Europe/Paris',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      currency: 'EUR'
    },
    invoicing: {
      invoicePrefix: 'FACT-',
      invoiceNumberFormat: 'YYYY-{NUM}',
      nextInvoiceNumber: 1001,
      defaultPaymentTerms: 30,
      defaultTaxRate: 20,
      defaultCurrency: 'EUR',
      showLogo: true,
      showBankDetails: true,
      bankName: 'Banque Exemple',
      bankIBAN: 'FR76 1234 5678 9012 3456 7890 123',
      bankBIC: 'EXAMPLEBIC',
      invoiceNotes: 'Merci pour votre confiance. Paiement à effectuer sous 30 jours.',
      invoiceFooter: 'dziljo SaaS - SIRET: 12345678901234 - TVA: FR12345678901',
      reminderEnabled: true,
      reminderDays: [7, 14, 30],
      reminderTemplate: 'Rappel: Votre facture {invoice_number} d\'un montant de {amount} est due le {due_date}.',
      lateFeePercentage: 10,
      lateFeeEnabled: true
    },
    notifications: {
      emailNotifications: true,
      invoiceCreated: true,
      invoiceSent: true,
      paymentReceived: true,
      paymentOverdue: true,
      reminderSent: true,
      emailTemplate: {
        invoiceCreated: 'Nouvelle facture créée: {invoice_number}',
        invoiceSent: 'Facture envoyée: {invoice_number}',
        paymentReceived: 'Paiement reçu pour la facture: {invoice_number}',
        paymentOverdue: 'Facture en retard: {invoice_number}',
        reminderSent: 'Rappel envoyé pour la facture: {invoice_number}'
      }
    },
    export: {
      defaultExportFormat: 'pdf',
      pdfTemplate: 'standard',
      includeCompanyDetails: true,
      includeBankDetails: true,
      includePaymentHistory: true,
      includeSignature: true,
      signatureName: 'Jean Dupont',
      signaturePosition: 'Directeur Financier'
    },
    integration: {
      accountingSystem: 'none',
      accountingSystemApiKey: '',
      accountingSystemUrl: '',
      paymentGateway: 'none',
      paymentGatewayApiKey: '',
      paymentGatewayUrl: '',
      syncEnabled: false,
      syncFrequency: 'daily',
      lastSync: ''
    }
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    companyInfo: true,
    invoiceSettings: true,
    paymentSettings: true,
    reminderSettings: true,
    bankDetails: true,
    exportSettings: true,
    integrationSettings: true
  });

  const categories = [
    { id: 'general', name: 'Informations Générales', icon: SettingsIcon, color: 'text-blue-600' },
    { id: 'invoicing', name: 'Paramètres de Facturation', icon: FileText, color: 'text-green-600' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'text-purple-600' },
    { id: 'export', name: 'Export & Impression', icon: Download, color: 'text-orange-600' },
    { id: 'integration', name: 'Intégrations', icon: Zap, color: 'text-pink-600' }
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedSetting = (category: string, parentKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [parentKey]: {
          ...(prev[category as keyof typeof prev] as any)[parentKey],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const handleArrayChange = (category: string, key: string, index: number, value: any) => {
    setSettings(prev => {
      const array = [...(prev[category as keyof typeof prev] as any)[key]];
      array[index] = value;
      return {
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [key]: array
        }
      };
    });
    setHasChanges(true);
  };

  const addArrayItem = (category: string, key: string, defaultValue: any) => {
    setSettings(prev => {
      const array = [...(prev[category as keyof typeof prev] as any)[key]];
      array.push(defaultValue);
      return {
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [key]: array
        }
      };
    });
    setHasChanges(true);
  };

  const removeArrayItem = (category: string, key: string, index: number) => {
    setSettings(prev => {
      const array = [...(prev[category as keyof typeof prev] as any)[key]];
      array.splice(index, 1);
      return {
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [key]: array
        }
      };
    });
    setHasChanges(true);
  };

  const saveSettings = () => {
    setIsSubmitting(true);
    
    // Simulation de la sauvegarde
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      setHasChanges(false);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }, 1500);
  };

  const resetSettings = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      // Reset logic would go here
      setHasChanges(false);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dziljo-settings.json';
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Paramètres</h2>
          <p className="text-slate-600">
            {module === 'invoicing' 
              ? 'Configurez vos paramètres de facturation' 
              : module === 'contracts' 
                ? 'Configurez vos paramètres de contrats'
                : 'Configurez les paramètres de votre application'}
          </p>
        </div>
        <div className="flex space-x-3">
          {hasChanges && (
            <>
              <button
                onClick={resetSettings}
                className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg flex items-center hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
              <button
                onClick={saveSettings}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </>
          )}
        </div>
      </div>

      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Paramètres enregistrés avec succès !
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 rounded-l-xl">
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-white shadow-md border border-slate-200 scale-105'
                    : 'hover:bg-white hover:shadow-sm'
                }`}
              >
                <category.icon className={`w-4 h-4 mr-3 ${category.color} ${activeCategory === category.id ? 'animate-pulse' : ''}`} />
                <span className={`font-medium ${activeCategory === category.id ? 'text-slate-900' : 'text-slate-600'}`}>
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-between">
              <button
                onClick={exportSettings}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                <Download className="w-4 h-4 mr-1" />
                Exporter
              </button>
              <button
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                <Upload className="w-4 h-4 mr-1" />
                Importer
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 bg-white rounded-r-xl max-h-[70vh] overflow-y-auto">
          {activeCategory === 'general' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  Informations de l'Entreprise
                </h3>
                <button 
                  onClick={() => toggleSection('companyInfo')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {expandedSections.companyInfo ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {expandedSections.companyInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nom de l'Entreprise
                    </label>
                    <input
                      type="text"
                      value={settings.general.companyName}
                      onChange={(e) => updateSetting('general', 'companyName', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Logo
                    </label>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-slate-200 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                        {settings.general.companyLogo ? (
                          <img 
                            src={settings.general.companyLogo} 
                            alt="Logo" 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Building className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        Changer le logo
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Adresse
                    </label>
                    <textarea
                      value={settings.general.companyAddress}
                      onChange={(e) => updateSetting('general', 'companyAddress', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Téléphone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="tel"
                          value={settings.general.companyPhone}
                          onChange={(e) => updateSetting('general', 'companyPhone', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="email"
                          value={settings.general.companyEmail}
                          onChange={(e) => updateSetting('general', 'companyEmail', e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Site Web
                    </label>
                    <input
                      type="text"
                      value={settings.general.companyWebsite}
                      onChange={(e) => updateSetting('general', 'companyWebsite', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Numéro de TVA
                    </label>
                    <input
                      type="text"
                      value={settings.general.companyVAT}
                      onChange={(e) => updateSetting('general', 'companyVAT', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      SIRET
                    </label>
                    <input
                      type="text"
                      value={settings.general.companySIRET}
                      onChange={(e) => updateSetting('general', 'companySIRET', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-blue-600" />
                    Paramètres Régionaux
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Langue
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Fuseau Horaire
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                      <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Format de Date
                    </label>
                    <select
                      value={settings.general.dateFormat}
                      onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Devise
                    </label>
                    <select
                      value={settings.general.currency}
                      onChange={(e) => updateSetting('general', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dollar US ($)</option>
                      <option value="GBP">Livre Sterling (£)</option>
                      <option value="CHF">Franc Suisse (CHF)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-blue-600" />
                    Apparence
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Thème
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'light', name: 'Clair', icon: Sun },
                        { id: 'dark', name: 'Sombre', icon: Moon },
                        { id: 'system', name: 'Système', icon: Monitor }
                      ].map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => updateSetting('general', 'theme', theme.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                            settings.general.theme === theme.id
                              ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                              : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <theme.icon className={`w-6 h-6 mb-2 ${settings.general.theme === theme.id ? 'text-blue-600' : 'text-slate-600'}`} />
                          <span className="text-sm font-medium">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'invoicing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-600" />
                  Paramètres des Factures
                </h3>
                <button 
                  onClick={() => toggleSection('invoiceSettings')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {expandedSections.invoiceSettings ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {expandedSections.invoiceSettings && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Préfixe des Factures
                    </label>
                    <input
                      type="text"
                      value={settings.invoicing.invoicePrefix}
                      onChange={(e) => updateSetting('invoicing', 'invoicePrefix', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Format de Numérotation
                    </label>
                    <input
                      type="text"
                      value={settings.invoicing.invoiceNumberFormat}
                      onChange={(e) => updateSetting('invoicing', 'invoiceNumberFormat', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Utilisez {'{NUM}'} pour le numéro et YYYY, MM, DD pour la date
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Prochain Numéro de Facture
                    </label>
                    <input
                      type="number"
                      value={settings.invoicing.nextInvoiceNumber}
                      onChange={(e) => updateSetting('invoicing', 'nextInvoiceNumber', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Afficher le Logo sur les Factures
                    </label>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings.invoicing.showLogo}
                        onChange={(e) => updateSetting('invoicing', 'showLogo', e.target.checked)}
                        className="sr-only"
                        id="show-logo"
                      />
                      <div
                        onClick={() => updateSetting('invoicing', 'showLogo', !settings.invoicing.showLogo)}
                        className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                          settings.invoicing.showLogo ? 'bg-green-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                            settings.invoicing.showLogo ? 'translate-x-5' : 'translate-x-1'
                          } mt-1`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Paramètres de Paiement
                  </h3>
                  <button 
                    onClick={() => toggleSection('paymentSettings')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {expandedSections.paymentSettings ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {expandedSections.paymentSettings && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Délai de Paiement par Défaut (jours)
                      </label>
                      <input
                        type="number"
                        value={settings.invoicing.defaultPaymentTerms}
                        onChange={(e) => updateSetting('invoicing', 'defaultPaymentTerms', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Taux de TVA par Défaut (%)
                      </label>
                      <input
                        type="number"
                        value={settings.invoicing.defaultTaxRate}
                        onChange={(e) => updateSetting('invoicing', 'defaultTaxRate', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Devise par Défaut
                      </label>
                      <select
                        value={settings.invoicing.defaultCurrency}
                        onChange={(e) => updateSetting('invoicing', 'defaultCurrency', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar US ($)</option>
                        <option value="GBP">Livre Sterling (£)</option>
                        <option value="CHF">Franc Suisse (CHF)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Afficher les Coordonnées Bancaires
                      </label>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.invoicing.showBankDetails}
                          onChange={(e) => updateSetting('invoicing', 'showBankDetails', e.target.checked)}
                          className="sr-only"
                          id="show-bank-details"
                        />
                        <div
                          onClick={() => updateSetting('invoicing', 'showBankDetails', !settings.invoicing.showBankDetails)}
                          className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                            settings.invoicing.showBankDetails ? 'bg-green-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              settings.invoicing.showBankDetails ? 'translate-x-5' : 'translate-x-1'
                            } mt-1`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-green-600" />
                    Rappels et Pénalités
                  </h3>
                  <button 
                    onClick={() => toggleSection('reminderSettings')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {expandedSections.reminderSettings ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {expandedSections.reminderSettings && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Activer les Rappels Automatiques
                      </label>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.invoicing.reminderEnabled}
                          onChange={(e) => updateSetting('invoicing', 'reminderEnabled', e.target.checked)}
                          className="sr-only"
                          id="reminder-enabled"
                        />
                        <div
                          onClick={() => updateSetting('invoicing', 'reminderEnabled', !settings.invoicing.reminderEnabled)}
                          className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                            settings.invoicing.reminderEnabled ? 'bg-green-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              settings.invoicing.reminderEnabled ? 'translate-x-5' : 'translate-x-1'
                            } mt-1`}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {settings.invoicing.reminderEnabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Jours de Rappel (avant/après échéance)
                          </label>
                          <div className="space-y-2">
                            {settings.invoicing.reminderDays.map((day, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="number"
                                  value={day}
                                  onChange={(e) => handleArrayChange('invoicing', 'reminderDays', index, parseInt(e.target.value))}
                                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <span className="text-sm text-slate-600">jours</span>
                                <button
                                  onClick={() => removeArrayItem('invoicing', 'reminderDays', index)}
                                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addArrayItem('invoicing', 'reminderDays', 0)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              + Ajouter un rappel
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Modèle de Message de Rappel
                          </label>
                          <textarea
                            value={settings.invoicing.reminderTemplate}
                            onChange={(e) => updateSetting('invoicing', 'reminderTemplate', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <p className="mt-1 text-xs text-slate-500">
                            Utilisez {'{invoice_number}'}, {'{amount}'}, {'{due_date}'} comme variables
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <label className="text-sm font-medium text-slate-700">
                        Activer les Pénalités de Retard
                      </label>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.invoicing.lateFeeEnabled}
                          onChange={(e) => updateSetting('invoicing', 'lateFeeEnabled', e.target.checked)}
                          className="sr-only"
                          id="late-fee-enabled"
                        />
                        <div
                          onClick={() => updateSetting('invoicing', 'lateFeeEnabled', !settings.invoicing.lateFeeEnabled)}
                          className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                            settings.invoicing.lateFeeEnabled ? 'bg-green-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              settings.invoicing.lateFeeEnabled ? 'translate-x-5' : 'translate-x-1'
                            } mt-1`}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {settings.invoicing.lateFeeEnabled && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Taux de Pénalité (%)
                        </label>
                        <div className="relative">
                          <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="number"
                            value={settings.invoicing.lateFeePercentage}
                            onChange={(e) => updateSetting('invoicing', 'lateFeePercentage', parseFloat(e.target.value))}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                    Coordonnées Bancaires
                  </h3>
                  <button 
                    onClick={() => toggleSection('bankDetails')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {expandedSections.bankDetails ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {expandedSections.bankDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-scale-in">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom de la Banque
                      </label>
                      <input
                        type="text"
                        value={settings.invoicing.bankName}
                        onChange={(e) => updateSetting('invoicing', 'bankName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        IBAN
                      </label>
                      <input
                        type="text"
                        value={settings.invoicing.bankIBAN}
                        onChange={(e) => updateSetting('invoicing', 'bankIBAN', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        BIC/SWIFT
                      </label>
                      <input
                        type="text"
                        value={settings.invoicing.bankBIC}
                        onChange={(e) => updateSetting('invoicing', 'bankBIC', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-200 pt-6 mt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes par Défaut sur les Factures
                    </label>
                    <textarea
                      value={settings.invoicing.invoiceNotes}
                      onChange={(e) => updateSetting('invoicing', 'invoiceNotes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pied de Page des Factures
                    </label>
                    <textarea
                      value={settings.invoicing.invoiceFooter}
                      onChange={(e) => updateSetting('invoicing', 'invoiceFooter', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCategory === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-purple-600" />
                Notifications par Email
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Activer les Notifications par Email
                  </label>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                      className="sr-only"
                      id="email-notifications"
                    />
                    <div
                      onClick={() => updateSetting('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
                      className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                        settings.notifications.emailNotifications ? 'bg-purple-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          settings.notifications.emailNotifications ? 'translate-x-5' : 'translate-x-1'
                        } mt-1`}
                      ></div>
                    </div>
                  </div>
                </div>

                {settings.notifications.emailNotifications && (
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-medium text-purple-900 mb-3">Événements de Notification</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-700 flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.invoiceCreated}
                            onChange={(e) => updateSetting('notifications', 'invoiceCreated', e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          Facture créée
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-700 flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.invoiceSent}
                            onChange={(e) => updateSetting('notifications', 'invoiceSent', e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          Facture envoyée
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-700 flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.paymentReceived}
                            onChange={(e) => updateSetting('notifications', 'paymentReceived', e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          Paiement reçu
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-700 flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.paymentOverdue}
                            onChange={(e) => updateSetting('notifications', 'paymentOverdue', e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          Paiement en retard
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-slate-700 flex items-center">
                          <input
                            type="checkbox"
                            checked={settings.notifications.reminderSent}
                            onChange={(e) => updateSetting('notifications', 'reminderSent', e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                          />
                          Rappel envoyé
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {settings.notifications.emailNotifications && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-medium text-slate-900">Modèles d'Email</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Facture Créée
                        </label>
                        <textarea
                          value={settings.notifications.emailTemplate.invoiceCreated}
                          onChange={(e) => updateNestedSetting('notifications', 'emailTemplate', 'invoiceCreated', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Facture Envoyée
                        </label>
                        <textarea
                          value={settings.notifications.emailTemplate.invoiceSent}
                          onChange={(e) => updateNestedSetting('notifications', 'emailTemplate', 'invoiceSent', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Paiement Reçu
                        </label>
                        <textarea
                          value={settings.notifications.emailTemplate.paymentReceived}
                          onChange={(e) => updateNestedSetting('notifications', 'emailTemplate', 'paymentReceived', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Paiement en Retard
                        </label>
                        <textarea
                          value={settings.notifications.emailTemplate.paymentOverdue}
                          onChange={(e) => updateNestedSetting('notifications', 'emailTemplate', 'paymentOverdue', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Rappel Envoyé
                        </label>
                        <textarea
                          value={settings.notifications.emailTemplate.reminderSent}
                          onChange={(e) => updateNestedSetting('notifications', 'emailTemplate', 'reminderSent', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeCategory === 'export' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-orange-600" />
                  Paramètres d'Export
                </h3>
                <button 
                  onClick={() => toggleSection('exportSettings')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {expandedSections.exportSettings ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {expandedSections.exportSettings && (
                <div className="space-y-6 animate-scale-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Format d'Export par Défaut
                      </label>
                      <select
                        value={settings.export.defaultExportFormat}
                        onChange={(e) => updateSetting('export', 'defaultExportFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pdf">PDF</option>
                        <option value="csv">CSV</option>
                        <option value="xlsx">Excel (XLSX)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Modèle PDF
                      </label>
                      <select
                        value={settings.export.pdfTemplate}
                        onChange={(e) => updateSetting('export', 'pdfTemplate', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="standard">Standard</option>
                        <option value="minimal">Minimal</option>
                        <option value="professional">Professionnel</option>
                        <option value="modern">Moderne</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-700 flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.export.includeCompanyDetails}
                          onChange={(e) => updateSetting('export', 'includeCompanyDetails', e.target.checked)}
                          className="mr-2 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        Inclure les détails de l'entreprise
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-700 flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.export.includeBankDetails}
                          onChange={(e) => updateSetting('export', 'includeBankDetails', e.target.checked)}
                          className="mr-2 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        Inclure les coordonnées bancaires
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-700 flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.export.includePaymentHistory}
                          onChange={(e) => updateSetting('export', 'includePaymentHistory', e.target.checked)}
                          className="mr-2 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        Inclure l'historique des paiements
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-700 flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.export.includeSignature}
                          onChange={(e) => updateSetting('export', 'includeSignature', e.target.checked)}
                          className="mr-2 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        Inclure la signature
                      </label>
                    </div>
                  </div>

                  {settings.export.includeSignature && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nom du Signataire
                        </label>
                        <input
                          type="text"
                          value={settings.export.signatureName}
                          onChange={(e) => updateSetting('export', 'signatureName', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Poste du Signataire
                        </label>
                        <input
                          type="text"
                          value={settings.export.signaturePosition}
                          onChange={(e) => updateSetting('export', 'signaturePosition', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeCategory === 'integration' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-pink-600" />
                  Intégrations
                </h3>
                <button 
                  onClick={() => toggleSection('integrationSettings')}
                  className="text-slate-400 hover:text-slate-600"
                >
                  {expandedSections.integrationSettings ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {expandedSections.integrationSettings && (
                <div className="space-y-6 animate-scale-in">
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <div className="bg-pink-100 p-2 rounded-full">
                        <Database className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-pink-900">Intégration Comptable</h3>
                        <p className="text-sm text-pink-700 mt-1">
                          Connectez votre système de facturation à votre logiciel de comptabilité pour synchroniser automatiquement vos factures et paiements.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Système Comptable
                      </label>
                      <select
                        value={settings.integration.accountingSystem}
                        onChange={(e) => updateSetting('integration', 'accountingSystem', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="none">Aucun</option>
                        <option value="quickbooks">QuickBooks</option>
                        <option value="xero">Xero</option>
                        <option value="sage">Sage</option>
                        <option value="custom">Personnalisé</option>
                      </select>
                    </div>

                    {settings.integration.accountingSystem !== 'none' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            URL de l'API
                          </label>
                          <input
                            type="text"
                            value={settings.integration.accountingSystemUrl}
                            onChange={(e) => updateSetting('integration', 'accountingSystemUrl', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Clé API
                          </label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                              type="password"
                              value={settings.integration.accountingSystemApiKey}
                              onChange={(e) => updateSetting('integration', 'accountingSystemApiKey', e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-900">Passerelle de Paiement</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            Intégrez une passerelle de paiement pour permettre à vos clients de payer leurs factures en ligne.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Passerelle de Paiement
                        </label>
                        <select
                          value={settings.integration.paymentGateway}
                          onChange={(e) => updateSetting('integration', 'paymentGateway', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="none">Aucune</option>
                          <option value="stripe">Stripe</option>
                          <option value="paypal">PayPal</option>
                          <option value="custom">Personnalisée</option>
                        </select>
                      </div>

                      {settings.integration.paymentGateway !== 'none' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              URL de l'API
                            </label>
                            <input
                              type="text"
                              value={settings.integration.paymentGatewayUrl}
                              onChange={(e) => updateSetting('integration', 'paymentGatewayUrl', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Clé API
                            </label>
                            <div className="relative">
                              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                              <input
                                type="password"
                                value={settings.integration.paymentGatewayApiKey}
                                onChange={(e) => updateSetting('integration', 'paymentGatewayApiKey', e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6 mt-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Activer la Synchronisation Automatique
                      </label>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={settings.integration.syncEnabled}
                          onChange={(e) => updateSetting('integration', 'syncEnabled', e.target.checked)}
                          className="sr-only"
                          id="sync-enabled"
                        />
                        <div
                          onClick={() => updateSetting('integration', 'syncEnabled', !settings.integration.syncEnabled)}
                          className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                            settings.integration.syncEnabled ? 'bg-pink-600' : 'bg-slate-300'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              settings.integration.syncEnabled ? 'translate-x-5' : 'translate-x-1'
                            } mt-1`}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {settings.integration.syncEnabled && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Fréquence de Synchronisation
                        </label>
                        <select
                          value={settings.integration.syncFrequency}
                          onChange={(e) => updateSetting('integration', 'syncFrequency', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="hourly">Toutes les heures</option>
                          <option value="daily">Quotidienne</option>
                          <option value="weekly">Hebdomadaire</option>
                          <option value="monthly">Mensuelle</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Paramètres mis à jour automatiquement pour tous les utilisateurs</span>
          </div>
          <div className="flex space-x-2">
            {hasChanges && (
              <>
                <button
                  onClick={resetSettings}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg flex items-center hover:bg-slate-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </button>
                <button
                  onClick={saveSettings}
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer les Modifications'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;