import React, { useState } from 'react';
import { Users, UserPlus, GraduationCap, TrendingUp, Calendar, FileText } from 'lucide-react';
import EmployeeDatabase from './EmployeeDatabase';
import LeaveManagement from './LeaveManagement';
import TrainingManagement from './TrainingManagement';
import CareerProgression from './CareerProgression';
import NewEmployeeForm from './NewEmployeeForm';
import QuickActions from '../Layout/QuickActions';

const EmployeeManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('database');
  const [showNewEmployeeForm, setShowNewEmployeeForm] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const tabs = [
    { id: 'database', name: 'Base de Données', icon: Users },
    { id: 'leave', name: 'Congés & Absences', icon: Calendar },
    { id: 'training', name: 'Formations', icon: GraduationCap },
    { id: 'career', name: 'Évolution de Carrière', icon: TrendingUp }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'database':
        return <EmployeeDatabase />;
      case 'leave':
        return <LeaveManagement />;
      case 'training':
        return <TrainingManagement />;
      case 'career':
        return <CareerProgression />;
      default:
        return <EmployeeDatabase />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gestion du Personnel</h1>
              <p className="text-slate-600">Gérez les dossiers, congés, formations et évolutions de vos employés</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowNewEmployeeForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Nouvel Employé
              </button>
              <button 
                onClick={() => setShowQuickActions(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Actions Rapides
              </button>
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

      {/* New Employee Form Modal */}
      <NewEmployeeForm 
        isOpen={showNewEmployeeForm} 
        onClose={() => setShowNewEmployeeForm(false)}
      />

      {/* Quick Actions Modal */}
      <QuickActions 
        isOpen={showQuickActions} 
        onClose={() => setShowQuickActions(false)}
        activeModule="employees"
      />
    </div>
  );
};

export default EmployeeManagement;