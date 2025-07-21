import React, { useState } from 'react';
import { Users, UserPlus, GraduationCap, TrendingUp, Calendar, FileText, Award, DollarSign, BarChart3, Clock, Zap } from 'lucide-react';
import HRDashboard from './HRDashboard';
import Recruitment from './Recruitment';
import EmployeeManagement from './EmployeeManagement';
import DocumentGeneration from './DocumentGeneration';
import PerformanceManagement from './PerformanceManagement';
import PayrollManagement from './PayrollManagement';
import QuickActions from '../Layout/QuickActions';

const HR: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: BarChart3 },
    { id: 'recruitment', name: 'Recrutement', icon: UserPlus },
    { id: 'employees', name: 'Gestion du Personnel', icon: Users },
    { id: 'performance', name: 'Performance', icon: Award },
    { id: 'payroll', name: 'Paie', icon: DollarSign },
    { id: 'documents', name: 'Documents RH', icon: FileText }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <HRDashboard />;
      case 'recruitment':
        return <Recruitment />;
      case 'employees':
        return <EmployeeManagement />;
      case 'performance':
        return <PerformanceManagement />;
      case 'payroll':
        return <PayrollManagement />;
      case 'documents':
        return <DocumentGeneration />;
      default:
        return <HRDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Ressources Humaines</h1>
              <p className="text-slate-600">Plateforme complète de gestion RH moderne</p>
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
        activeModule="rh"
      />
    </div>
  );
};

export default HR;