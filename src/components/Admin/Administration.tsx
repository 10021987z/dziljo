import React, { useState } from 'react';
import { Settings, FileText, Receipt, ClipboardList, Users, BarChart3, Shield, Database, Link, UserCheck, Zap, Copy, Workflow, Layers } from 'lucide-react';
import ContractManagement from './ContractManagement';
import InvoiceManagement from './InvoiceManagement';
import ReportsManagement from './ReportsManagement';
import UserManagement from './UserManagement';
import CRMIntegrations from './CRMIntegrations';
import AdminUserManagement from './AdminUserManagement';
import QuickActions from '../Layout/QuickActions';
import TemplateLibrary from './TemplateLibrary';
import DocumentGenerator from './DocumentGenerator';
import WorkflowManagement from './WorkflowManagement';
import AnalyticalAccounting from './AnalyticalAccounting';

const Administration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const tabs = [
    { id: 'contracts', name: 'Gestion des Contrats', icon: FileText },
    { id: 'templates', name: 'Bibliothèque de Modèles', icon: Copy },
    { id: 'documents', name: 'Générateur de Documents', icon: FileText },
    { id: 'invoicing', name: 'Facturation', icon: Receipt },
    { id: 'reports', name: 'Rapports', icon: ClipboardList },
    { id: 'users', name: 'Utilisateurs', icon: Users },
    { id: 'admin-users', name: 'Utilisateurs Admin', icon: UserCheck },
    { id: 'integrations', name: 'Intégrations CRM', icon: Link },
    { id: 'workflows', name: 'Workflows', icon: Workflow },
    { id: 'analytical', name: 'Comptabilité Analytique', icon: Layers },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'contracts':
        return <ContractManagement />;
      case 'templates':
        return <TemplateLibrary />;
      case 'documents':
        return <DocumentGenerator />;
      case 'invoicing':
        return <InvoiceManagement />;
      case 'reports':
        return <ReportsManagement />;
      case 'users':
        return <UserManagement />;
      case 'admin-users':
        return <AdminUserManagement />;
      case 'integrations':
        return <CRMIntegrations />;
      case 'workflows':
        return <WorkflowManagement />;
      case 'analytical':
        return <AnalyticalAccounting />;
      case 'settings':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
              <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Paramètres Système
              </h2>
              <p className="text-slate-600">
                Configuration avancée du système - À implémenter
              </p>
            </div>
          </div>
        );
      default:
        return <ContractManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Interface de Gestion d'Accueil</h1>
              <p className="text-slate-600">Centralisez toutes vos tâches administratives cruciales</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Système Opérationnel
              </div>
              <button 
                onClick={() => setShowQuickActions(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <Zap className="w-4 h-4 mr-2" />
                Actions Rapides
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
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
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {renderTabContent()}
      </div>

      {/* Quick Actions Modal */}
      <QuickActions 
        isOpen={showQuickActions} 
        onClose={() => setShowQuickActions(false)}
        activeModule="admin"
      />
    </div>
  );
};

export default Administration;