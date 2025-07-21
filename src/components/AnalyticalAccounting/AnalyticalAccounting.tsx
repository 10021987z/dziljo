import React, { useState } from 'react';
import { BarChart3, TrendingUp, Settings, Target, AlertTriangle, Plus, Eye, Edit, Download, Upload, Filter, Search, Calendar, DollarSign, Layers, Database, Zap, PieChart, Activity, Users, Building2 } from 'lucide-react';
import AnalyticalDashboard from './AnalyticalDashboard';
import AnalyticalAxes from './AnalyticalAxes';
import AllocationRules from './AllocationRules';
import BudgetManagement from './BudgetManagement';
import AnalyticalReports from './AnalyticalReports';
import AnalyticalSetupWizard from './AnalyticalSetupWizard';
import QuickActions from '../Layout/QuickActions';

const AnalyticalAccounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(true); // Set to false for first-time setup

  const tabs = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: BarChart3 },
    { id: 'axes', name: 'Axes Analytiques', icon: Layers },
    { id: 'allocation', name: 'Règles de Ventilation', icon: Database },
    { id: 'budgets', name: 'Budgets & Alertes', icon: Target },
    { id: 'reports', name: 'Rapports OLAP', icon: TrendingUp },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticalDashboard />;
      case 'axes':
        return <AnalyticalAxes />;
      case 'allocation':
        return <AllocationRules />;
      case 'budgets':
        return <BudgetManagement />;
      case 'reports':
        return <AnalyticalReports />;
      case 'settings':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
              <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Paramètres Comptabilité Analytique
              </h2>
              <p className="text-slate-600 mb-6">
                Configuration avancée du module analytique
              </p>
              <button 
                onClick={() => setShowSetupWizard(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reconfigurer le Module
              </button>
            </div>
          </div>
        );
      default:
        return <AnalyticalDashboard />;
    }
  };

  if (!isSetupComplete) {
    return (
      <AnalyticalSetupWizard
        isOpen={true}
        onClose={() => setIsSetupComplete(true)}
        onComplete={() => setIsSetupComplete(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Comptabilité Analytique</h1>
              <p className="text-slate-600">Suivi de rentabilité multidimensionnel et reporting OLAP en temps réel</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Module Actif
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

      {/* Setup Wizard Modal */}
      <AnalyticalSetupWizard
        isOpen={showSetupWizard}
        onClose={() => setShowSetupWizard(false)}
        onComplete={() => {
          setShowSetupWizard(false);
          setIsSetupComplete(true);
        }}
      />

      {/* Quick Actions Modal */}
      <QuickActions 
        isOpen={showQuickActions} 
        onClose={() => setShowQuickActions(false)}
        activeModule="analytical"
      />
    </div>
  );
};

export default AnalyticalAccounting;