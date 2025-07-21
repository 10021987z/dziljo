import React, { useState } from 'react';
import { TrendingUp, Users, Calendar, BarChart3, Target, Building2, Zap } from 'lucide-react';
import ProspectManagement from './ProspectManagement';
import SalesOpportunities from './SalesOpportunities';
import CommercialCalendar from './CommercialCalendar';
import CommercialKPIs from './CommercialKPIs';
import QuickActions from '../Layout/QuickActions';

const Commercial: React.FC = () => {
  const [activeTab, setActiveTab] = useState('prospects');
  const [showQuickActions, setShowQuickActions] = useState(false);

  const tabs = [
    { id: 'prospects', name: 'Prospection', icon: Building2 },
    { id: 'opportunities', name: 'Opportunités', icon: Target },
    { id: 'calendar', name: 'Agenda', icon: Calendar },
    { id: 'kpis', name: 'KPI & Analytics', icon: BarChart3 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'prospects':
        return <ProspectManagement />;
      case 'opportunities':
        return <SalesOpportunities />;
      case 'calendar':
        return <CommercialCalendar />;
      case 'kpis':
        return <CommercialKPIs />;
      default:
        return <ProspectManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Interface Commerciale</h1>
              <p className="text-slate-600">Votre moteur de croissance commercial intégré</p>
            </div>
            <button 
              onClick={() => setShowQuickActions(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <Zap className="w-4 h-4 mr-2" />
              Actions Rapides
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1">
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
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {renderTabContent()}
      </div>

      {/* Quick Actions Modal */}
      <QuickActions 
        isOpen={showQuickActions} 
        onClose={() => setShowQuickActions(false)}
        activeModule="commercial"
      />
    </div>
  );
};

export default Commercial;