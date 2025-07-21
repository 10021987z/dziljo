import React, { useState } from 'react';
import { Plus, Settings, Zap, Webhook, Key, Globe, CheckCircle, AlertCircle, XCircle, Clock, Play, Pause, Edit, Trash2, Eye, Download, Upload, RefreshCw, Link, Database, Code, Activity } from 'lucide-react';

interface CRMConnection {
  id: number;
  name: string;
  type: 'salesforce' | 'hubspot' | 'dynamics' | 'pipedrive' | 'zoho' | 'custom';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSync: string;
  syncFrequency: string;
  recordsSynced: number;
  apiEndpoint?: string;
  authMethod: 'oauth' | 'api-key' | 'basic';
  syncDirection: 'bidirectional' | 'import' | 'export';
  mappedFields: number;
  totalFields: number;
  errorCount: number;
  config: {
    syncContacts: boolean;
    syncCompanies: boolean;
    syncOpportunities: boolean;
    syncActivities: boolean;
  };
}

interface APIEndpoint {
  id: number;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  description: string;
  category: 'contacts' | 'companies' | 'opportunities' | 'activities' | 'webhooks';
  authentication: boolean;
  rateLimit: string;
  usage: number;
  lastUsed: string;
}

interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive' | 'error';
  secret: string;
  lastTriggered: string;
  successCount: number;
  errorCount: number;
  retryPolicy: string;
}

interface AutomationFlow {
  id: number;
  name: string;
  platform: 'zapier' | 'make' | 'custom';
  trigger: string;
  actions: string[];
  status: 'active' | 'inactive' | 'error';
  runsCount: number;
  lastRun: string;
  successRate: number;
}

const CRMIntegrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connections');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<CRMConnection | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showAPIModal, setShowAPIModal] = useState(false);

  const [connections, setConnections] = useState<CRMConnection[]>([
    {
      id: 1,
      name: 'Salesforce Production',
      type: 'salesforce',
      status: 'connected',
      lastSync: '2024-01-26 14:30',
      syncFrequency: 'Toutes les 15 minutes',
      recordsSynced: 2847,
      authMethod: 'oauth',
      syncDirection: 'bidirectional',
      mappedFields: 24,
      totalFields: 35,
      errorCount: 0,
      config: {
        syncContacts: true,
        syncCompanies: true,
        syncOpportunities: true,
        syncActivities: false
      }
    },
    {
      id: 2,
      name: 'HubSpot Marketing',
      type: 'hubspot',
      status: 'syncing',
      lastSync: '2024-01-26 14:25',
      syncFrequency: 'Toutes les 30 minutes',
      recordsSynced: 1523,
      authMethod: 'api-key',
      syncDirection: 'import',
      mappedFields: 18,
      totalFields: 28,
      errorCount: 2,
      config: {
        syncContacts: true,
        syncCompanies: true,
        syncOpportunities: false,
        syncActivities: true
      }
    },
    {
      id: 3,
      name: 'Pipedrive Sales',
      type: 'pipedrive',
      status: 'error',
      lastSync: '2024-01-26 12:15',
      syncFrequency: 'Toutes les heures',
      recordsSynced: 892,
      authMethod: 'api-key',
      syncDirection: 'export',
      mappedFields: 12,
      totalFields: 20,
      errorCount: 5,
      config: {
        syncContacts: false,
        syncCompanies: true,
        syncOpportunities: true,
        syncActivities: false
      }
    }
  ]);

  const [apiEndpoints] = useState<APIEndpoint[]>([
    {
      id: 1,
      name: 'Get Contacts',
      method: 'GET',
      endpoint: '/api/v1/contacts',
      description: 'Récupère la liste des contacts avec pagination',
      category: 'contacts',
      authentication: true,
      rateLimit: '1000/heure',
      usage: 2847,
      lastUsed: '2024-01-26 14:30'
    },
    {
      id: 2,
      name: 'Create Contact',
      method: 'POST',
      endpoint: '/api/v1/contacts',
      description: 'Crée un nouveau contact',
      category: 'contacts',
      authentication: true,
      rateLimit: '500/heure',
      usage: 156,
      lastUsed: '2024-01-26 13:45'
    },
    {
      id: 3,
      name: 'Get Companies',
      method: 'GET',
      endpoint: '/api/v1/companies',
      description: 'Récupère la liste des entreprises',
      category: 'companies',
      authentication: true,
      rateLimit: '1000/heure',
      usage: 1234,
      lastUsed: '2024-01-26 14:15'
    },
    {
      id: 4,
      name: 'Create Opportunity',
      method: 'POST',
      endpoint: '/api/v1/opportunities',
      description: 'Crée une nouvelle opportunité commerciale',
      category: 'opportunities',
      authentication: true,
      rateLimit: '300/heure',
      usage: 89,
      lastUsed: '2024-01-26 12:30'
    }
  ]);

  const [webhooks, setWebhooks] = useState<Webhook[]>([
    {
      id: 1,
      name: 'Contact Created',
      url: 'https://external-crm.com/webhooks/contact-created',
      events: ['contact.created', 'contact.updated'],
      status: 'active',
      secret: 'whsec_1234567890abcdef',
      lastTriggered: '2024-01-26 14:20',
      successCount: 1247,
      errorCount: 3,
      retryPolicy: '3 tentatives avec backoff exponentiel'
    },
    {
      id: 2,
      name: 'Opportunity Status Change',
      url: 'https://sales-system.com/api/opportunity-update',
      events: ['opportunity.status_changed', 'opportunity.won', 'opportunity.lost'],
      status: 'active',
      secret: 'whsec_abcdef1234567890',
      lastTriggered: '2024-01-26 13:45',
      successCount: 456,
      errorCount: 1,
      retryPolicy: '5 tentatives avec délai fixe'
    },
    {
      id: 3,
      name: 'Employee Onboarding',
      url: 'https://hr-platform.com/webhooks/new-hire',
      events: ['employee.hired'],
      status: 'inactive',
      secret: 'whsec_fedcba0987654321',
      lastTriggered: '2024-01-25 16:30',
      successCount: 23,
      errorCount: 0,
      retryPolicy: '3 tentatives avec backoff exponentiel'
    }
  ]);

  const [automationFlows] = useState<AutomationFlow[]>([
    {
      id: 1,
      name: 'Nouveau Contact → Slack + Email',
      platform: 'zapier',
      trigger: 'Nouveau contact créé',
      actions: ['Envoyer notification Slack', 'Ajouter à liste email'],
      status: 'active',
      runsCount: 234,
      lastRun: '2024-01-26 14:15',
      successRate: 98.5
    },
    {
      id: 2,
      name: 'Opportunité Gagnée → Facturation',
      platform: 'make',
      trigger: 'Opportunité marquée comme gagnée',
      actions: ['Créer facture', 'Envoyer contrat', 'Notifier équipe'],
      status: 'active',
      runsCount: 45,
      lastRun: '2024-01-26 11:30',
      successRate: 100
    },
    {
      id: 3,
      name: 'Candidat Embauché → Onboarding',
      platform: 'custom',
      trigger: 'Candidat embauché',
      actions: ['Créer dossier RH', 'Planifier formation', 'Préparer matériel'],
      status: 'inactive',
      runsCount: 12,
      lastRun: '2024-01-24 09:15',
      successRate: 91.7
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'disconnected':
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'disconnected':
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCRMIcon = (type: string) => {
    switch (type) {
      case 'salesforce': return '☁️';
      case 'hubspot': return '🧡';
      case 'dynamics': return '🔷';
      case 'pipedrive': return '🟢';
      case 'zoho': return '🔴';
      default: return '🔗';
    }
  };

  const getCRMName = (type: string) => {
    switch (type) {
      case 'salesforce': return 'Salesforce';
      case 'hubspot': return 'HubSpot';
      case 'dynamics': return 'Microsoft Dynamics';
      case 'pipedrive': return 'Pipedrive';
      case 'zoho': return 'Zoho CRM';
      default: return 'CRM Personnalisé';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-orange-100 text-orange-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zapier': return '⚡';
      case 'make': return '🔧';
      default: return '🔗';
    }
  };

  const connectionStats = {
    total: connections.length,
    connected: connections.filter(c => c.status === 'connected').length,
    syncing: connections.filter(c => c.status === 'syncing').length,
    errors: connections.filter(c => c.status === 'error').length,
    totalRecords: connections.reduce((sum, c) => sum + c.recordsSynced, 0)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Connexions CRM & Intégrations</h2>
          <p className="text-slate-600">Gérez vos intégrations avec les CRM externes et automatisations</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Documentation API
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Connexion
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Connexions Totales</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{connectionStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Link className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Connectées</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{connectionStats.connected}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Synchronisation</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{connectionStats.syncing}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Erreurs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{connectionStats.errors}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Enregistrements</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{connectionStats.totalRecords.toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'connections', name: 'Connexions CRM', icon: Link },
            { id: 'api', name: 'API & Endpoints', icon: Code },
            { id: 'webhooks', name: 'Webhooks', icon: Webhook },
            { id: 'automations', name: 'Automatisations', icon: Zap }
          ].map((tab) => (
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

        {activeTab === 'connections' && (
          <div className="space-y-4">
            {connections.map((connection) => (
              <div key={connection.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{getCRMIcon(connection.type)}</div>
                      <div>
                        <h4 className="font-medium text-slate-900">{connection.name}</h4>
                        <p className="text-sm text-slate-600">{getCRMName(connection.type)}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(connection.status)}`}>
                        {getStatusIcon(connection.status)}
                        <span className="ml-1 capitalize">{connection.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                      <div>
                        <span className="font-medium">Dernière sync:</span> {connection.lastSync}
                      </div>
                      <div>
                        <span className="font-medium">Fréquence:</span> {connection.syncFrequency}
                      </div>
                      <div>
                        <span className="font-medium">Enregistrements:</span> {connection.recordsSynced.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Direction:</span> {connection.syncDirection}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-600">Champs mappés:</span>
                        <div className="flex items-center">
                          <span className="font-medium text-slate-900">{connection.mappedFields}/{connection.totalFields}</span>
                          <div className="w-16 bg-slate-200 rounded-full h-2 ml-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(connection.mappedFields / connection.totalFields) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {connection.errorCount > 0 && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          <span>{connection.errorCount} erreur(s)</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-xs">
                        {connection.config.syncContacts && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">Contacts</span>}
                        {connection.config.syncCompanies && <span className="px-2 py-1 bg-green-100 text-green-800 rounded">Entreprises</span>}
                        {connection.config.syncOpportunities && <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">Opportunités</span>}
                        {connection.config.syncActivities && <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">Activités</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => setSelectedConnection(connection)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    {connection.status === 'connected' ? (
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-2">Documentation API</h4>
              <p className="text-sm text-slate-600 mb-4">
                Notre API RESTful permet une intégration complète avec votre système. 
                Authentification via clé API ou OAuth 2.0.
              </p>
              <div className="flex space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Voir la Documentation
                </button>
                <button className="bg-slate-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors">
                  Générer Clé API
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {apiEndpoints.map((endpoint) => (
                <div key={endpoint.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <span className="text-xs text-slate-500">{endpoint.usage} appels</span>
                  </div>
                  
                  <h4 className="font-medium text-slate-900 mb-1">{endpoint.name}</h4>
                  <code className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded block mb-2">
                    {endpoint.endpoint}
                  </code>
                  <p className="text-sm text-slate-600 mb-3">{endpoint.description}</p>
                  
                  <div className="space-y-1 text-xs text-slate-500">
                    <div>Limite: {endpoint.rateLimit}</div>
                    <div>Dernière utilisation: {endpoint.lastUsed}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'webhooks' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-slate-900">Webhooks Configurés</h4>
              <button 
                onClick={() => setShowWebhookModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Webhook
              </button>
            </div>

            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-slate-900">{webhook.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(webhook.status)}`}>
                      {getStatusIcon(webhook.status)}
                      <span className="ml-1 capitalize">{webhook.status}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                  <div>
                    <span className="font-medium">URL:</span>
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded block mt-1">{webhook.url}</code>
                  </div>
                  <div>
                    <span className="font-medium">Dernière exécution:</span> {webhook.lastTriggered}
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-sm font-medium text-slate-700">Événements: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {webhook.events.map((event, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {event}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>{webhook.successCount} succès</span>
                  </div>
                  {webhook.errorCount > 0 && (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      <span>{webhook.errorCount} erreurs</span>
                    </div>
                  )}
                  <div className="text-slate-600">
                    <span className="font-medium">Politique de retry:</span> {webhook.retryPolicy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">⚡</div>
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Zapier</h3>
                <p className="text-orange-100 text-sm mb-3">Connectez-vous à 5000+ applications</p>
                <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                  Configurer Zapier
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">🔧</div>
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Make (Integromat)</h3>
                <p className="text-blue-100 text-sm mb-3">Automatisations visuelles avancées</p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  Configurer Make
                </button>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">🔗</div>
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">API Personnalisée</h3>
                <p className="text-purple-100 text-sm mb-3">Créez vos propres intégrations</p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                  Documentation
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Flux d'Automatisation Actifs</h4>
              {automationFlows.map((flow) => (
                <div key={flow.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">{getPlatformIcon(flow.platform)}</div>
                      <div>
                        <h4 className="font-medium text-slate-900">{flow.name}</h4>
                        <p className="text-sm text-slate-600 capitalize">{flow.platform}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(flow.status)}`}>
                        {getStatusIcon(flow.status)}
                        <span className="ml-1 capitalize">{flow.status}</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{flow.successRate}%</div>
                      <div className="text-xs text-slate-500">Taux de succès</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600 mb-3">
                    <div>
                      <span className="font-medium">Déclencheur:</span> {flow.trigger}
                    </div>
                    <div>
                      <span className="font-medium">Exécutions:</span> {flow.runsCount}
                    </div>
                    <div>
                      <span className="font-medium">Dernière exécution:</span> {flow.lastRun}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-700">Actions: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {flow.actions.map((action, index) => (
                        <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Connection Details Modal */}
      {selectedConnection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getCRMIcon(selectedConnection.type)}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{selectedConnection.name}</h3>
                    <p className="text-slate-600">{getCRMName(selectedConnection.type)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedConnection(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Configuration</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Méthode d'authentification:</span>
                      <span className="text-slate-900 capitalize">{selectedConnection.authMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Direction de sync:</span>
                      <span className="text-slate-900 capitalize">{selectedConnection.syncDirection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Fréquence:</span>
                      <span className="text-slate-900">{selectedConnection.syncFrequency}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Statistiques</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Enregistrements synchronisés:</span>
                      <span className="text-slate-900">{selectedConnection.recordsSynced.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Champs mappés:</span>
                      <span className="text-slate-900">{selectedConnection.mappedFields}/{selectedConnection.totalFields}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Erreurs:</span>
                      <span className={selectedConnection.errorCount > 0 ? 'text-red-600' : 'text-green-600'}>
                        {selectedConnection.errorCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Modules Synchronisés</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(selectedConnection.config).map(([key, enabled]) => (
                    <div key={key} className={`p-3 rounded-lg border-2 ${
                      enabled ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-slate-50'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900 capitalize">
                          {key.replace('sync', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        {enabled ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Modifier Configuration
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Synchroniser Maintenant
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMIntegrations;