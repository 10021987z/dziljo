import React, { useState } from 'react';
import { TrendingUp, Users, Calendar, BarChart3, Target, Building2, FileText } from 'lucide-react';
import ProspectManagement from './ProspectManagement';

const Commercial: React.FC = () => {
  const [activeTab, setActiveTab] = useState('prospects');

  const tabs = [
    { id: 'prospects', name: 'Prospection', icon: Building2 },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'prospects':
        return <ProspectManagement />;
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
    </div>
  );
};

export default Commercial;