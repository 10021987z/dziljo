import React, { useState } from 'react';
import { UserPlus, Briefcase, Users, Calendar, BarChart3, Search, Filter } from 'lucide-react';
import JobPostings from './JobPostings';
import CandidatePipeline from './CandidatePipeline';
import InterviewScheduler from './InterviewScheduler';
import RecruitmentKPIs from './RecruitmentKPIs';

const Recruitment: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pipeline');

  const tabs = [
    { id: 'pipeline', name: 'Pipeline Candidats', icon: Users },
    { id: 'jobs', name: 'Offres d\'Emploi', icon: Briefcase },
    { id: 'interviews', name: 'Entretiens', icon: Calendar },
    { id: 'kpis', name: 'KPI & Analytics', icon: BarChart3 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pipeline':
        return <CandidatePipeline />;
      case 'jobs':
        return <JobPostings />;
      case 'interviews':
        return <InterviewScheduler />;
      case 'kpis':
        return <RecruitmentKPIs />;
      default:
        return <CandidatePipeline />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Recrutement</h1>
              <p className="text-slate-600">Gérez votre processus de recrutement de A à Z</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
              <UserPlus className="w-4 h-4 mr-2" />
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
    </div>
  );
};

export default Recruitment;