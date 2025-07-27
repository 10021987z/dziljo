import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Shield, Database, Mail, Bell, Globe, Users, CreditCard, Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { useFirebaseCollection } from '../../hooks/useFirebase';

interface SettingsProps {
  module?: string;
}

const Settings: React.FC<SettingsProps> = ({ module = 'general' }) => {
  const [activeTab, setActiveTab] = useState(module);
  const [settings, setSettings] = useState({
    general: {
      companyName: 'dziljo SaaS',
      companyEmail: 'contact@dziljo.com',
      companyPhone: '+33 1 23 45 67 89',
      companyAddress: '123 Rue de la Tech, 75001 Paris',
      timezone: 'Europe/Paris',
      language: 'fr',
      currency: 'EUR',
      dateFormat: 'DD/MM/YYYY'
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      systemAlerts: true,
      marketingEmails: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordPolicy: 'medium',
      ipWhitelist: '',
      auditLogs: true,
      dataEncryption: true
    },
    integrations: {
      googleWorkspace: false,
      microsoftOffice: false,
      slack: false,
      zapier: false,
      webhooks: true,
      apiAccess: true
    },
    billing: {
      plan: 'Pro',
      billingEmail: 'billing@dziljo.com',
      autoRenewal: true,
      invoiceFrequency: 'monthly',
      paymentMethod: 'card',
      taxId: 'FR12345678901'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { create: saveSettings } = useFirebaseCollection('settings');

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings({
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: 'current-user'
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'Général', icon: SettingsIcon },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Sécurité', icon: Shield },
    { id: 'integrations', name: 'Intégrations', icon: Zap },
    { id: 'billing', name: 'Facturation', icon: CreditCard }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Paramètres Système</h2>
          <p className="text-slate-600">Configurez votre plateforme dziljo</p>
        </div>
        <div className="flex space-x-3">
          {saveSuccess && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Paramètres sauvegardés</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {/* Tab Navigation */}
        <div className="border-b border-slate-200">
          <div className="flex space-x-1 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Paramètres Généraux</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'entreprise</label>
                  <input
                    type="text"
                    value={settings.general.companyName}
                    onChange={(e) => handleSettingChange('general', 'companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email de l'entreprise</label>
                  <input
                    type="email"
                    value={settings.general.companyEmail}
                    onChange={(e) => handleSettingChange('general', 'companyEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={settings.general.companyPhone}
                    onChange={(e) => handleSettingChange('general', 'companyPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fuseau horaire</label>
                  <select
                    value={settings.general.timezone}
                    onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Europe/Paris">Europe/Paris</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New_York</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Langue</label>
                  <select
                    value={settings.general.language}
                    onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Devise</label>
                  <select
                    value={settings.general.currency}
                    onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                    <option value="GBP">Livre (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Adresse de l'entreprise</label>
                <textarea
                  value={settings.general.companyAddress}
                  onChange={(e) => handleSettingChange('general', 'companyAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Paramètres de Notifications</h3>
              
              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-slate-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-slate-600">
                        {key === 'emailNotifications' && 'Recevoir des notifications par email'}
                        {key === 'pushNotifications' && 'Notifications push dans le navigateur'}
                        {key === 'smsNotifications' && 'Notifications par SMS'}
                        {key === 'weeklyReports' && 'Rapports hebdomadaires automatiques'}
                        {key === 'systemAlerts' && 'Alertes système importantes'}
                        {key === 'marketingEmails' && 'Emails marketing et promotions'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value as boolean}
                        onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Paramètres de Sécurité</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Attention</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Les modifications de sécurité peuvent affecter l'accès de tous les utilisateurs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-slate-900">Authentification à deux facteurs</h4>
                    <p className="text-sm text-slate-600">Sécurité renforcée pour tous les comptes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Délai d'expiration de session (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="5"
                    max="480"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Politique de mot de passe
                  </label>
                  <select
                    value={settings.security.passwordPolicy}
                    onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Faible (8 caractères min)</option>
                    <option value="medium">Moyenne (8 car. + majuscule + chiffre)</option>
                    <option value="high">Forte (12 car. + majuscule + chiffre + symbole)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Intégrations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(settings.integrations).map(([key, value]) => (
                  <div key={key} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value as boolean}
                          onChange={(e) => handleSettingChange('integrations', key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="text-sm text-slate-600">
                      {key === 'googleWorkspace' && 'Synchronisation avec Google Workspace'}
                      {key === 'microsoftOffice' && 'Intégration Microsoft Office 365'}
                      {key === 'slack' && 'Notifications et commandes Slack'}
                      {key === 'zapier' && 'Automatisations via Zapier'}
                      {key === 'webhooks' && 'Webhooks pour intégrations personnalisées'}
                      {key === 'apiAccess' && 'Accès API pour développeurs'}
                    </p>
                    {value && (
                      <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                        Configurer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Facturation et Abonnement</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Plan Actuel: {settings.billing.plan}</h4>
                    <p className="text-sm text-blue-700">Renouvellement automatique activé</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email de facturation</label>
                  <input
                    type="email"
                    value={settings.billing.billingEmail}
                    onChange={(e) => handleSettingChange('billing', 'billingEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Numéro de TVA</label>
                  <input
                    type="text"
                    value={settings.billing.taxId}
                    onChange={(e) => handleSettingChange('billing', 'taxId', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fréquence de facturation</label>
                  <select
                    value={settings.billing.invoiceFrequency}
                    onChange={(e) => handleSettingChange('billing', 'invoiceFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Mensuelle</option>
                    <option value="quarterly">Trimestrielle</option>
                    <option value="yearly">Annuelle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mode de paiement</label>
                  <select
                    value={settings.billing.paymentMethod}
                    onChange={(e) => handleSettingChange('billing', 'paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="card">Carte bancaire</option>
                    <option value="transfer">Virement bancaire</option>
                    <option value="check">Chèque</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-900">Renouvellement automatique</h4>
                  <p className="text-sm text-slate-600">Renouveler automatiquement l'abonnement</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.billing.autoRenewal}
                    onChange={(e) => handleSettingChange('billing', 'autoRenewal', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;