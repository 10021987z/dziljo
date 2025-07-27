import React, { useState } from 'react';
import { BarChart3, TrendingUp, Settings, Target, AlertTriangle, Plus, Eye, Edit, Download, Upload, Filter, Search, Calendar, DollarSign, Layers, Database, Zap, PieChart, Activity, Users, Building2 } from 'lucide-react';
import QuickActions from '../Layout/QuickActions';

const AnalyticalAccounting: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [isSetupComplete, setIsSetupComplete] = useState(true); // Set to false for first-time setup

  const tabs = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: BarChart3 },
    { id: 'settings', name: 'Paramètres', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="p-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 text-center">
              <BarChart3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Comptabilité Analytique
              </h2>
              <p className="text-slate-600 mb-6">
                Module de comptabilité analytique multidimensionnelle
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Layers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-blue-900">Axes Analytiques</h3>
                  <p className="text-sm text-blue-700">Configuration des dimensions d'analyse</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-green-900">Budgets & Alertes</h3>
                  <p className="text-sm text-green-700">Suivi budgétaire en temps réel</p>
                </div>
              </div>
            </div>
          </div>
        );
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
            </div>
          </div>
        );
      default:
        return <AnalyticalDashboard />;
    }
  };

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