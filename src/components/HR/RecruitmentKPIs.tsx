import React from 'react';
import { TrendingUp, TrendingDown, Users, Clock, Target, Award, Calendar, DollarSign } from 'lucide-react';

const RecruitmentKPIs: React.FC = () => {
  const kpiData = [
    {
      title: 'Temps Moyen de Recrutement',
      value: '28 jours',
      change: '-3 jours',
      changeType: 'positive',
      icon: Clock,
      color: 'bg-blue-500',
      description: 'Temps entre publication et embauche'
    },
    {
      title: 'Taux de Conversion',
      value: '12.5%',
      change: '+2.3%',
      changeType: 'positive',
      icon: Target,
      color: 'bg-green-500',
      description: 'Candidatures → Embauches'
    },
    {
      title: 'Coût par Embauche',
      value: '€2,450',
      change: '-€150',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-orange-500',
      description: 'Coût total incluant publicité et temps'
    },
    {
      title: 'Satisfaction Candidats',
      value: '4.2/5',
      change: '+0.3',
      changeType: 'positive',
      icon: Award,
      color: 'bg-purple-500',
      description: 'Note moyenne des candidats'
    }
  ];

  const pipelineData = [
    { stage: 'Candidatures', count: 156, percentage: 100 },
    { stage: 'Présélection', count: 45, percentage: 29 },
    { stage: 'Entretien RH', count: 23, percentage: 15 },
    { stage: 'Entretien Technique', count: 12, percentage: 8 },
    { stage: 'Entretien Final', count: 8, percentage: 5 },
    { stage: 'Offre Envoyée', count: 5, percentage: 3 },
    { stage: 'Embauché', count: 3, percentage: 2 }
  ];

  const monthlyData = [
    { month: 'Jan', applications: 45, hires: 3, interviews: 12 },
    { month: 'Fév', applications: 52, hires: 4, interviews: 15 },
    { month: 'Mar', applications: 38, hires: 2, interviews: 10 },
    { month: 'Avr', applications: 61, hires: 5, interviews: 18 },
    { month: 'Mai', applications: 48, hires: 3, interviews: 14 },
    { month: 'Juin', applications: 55, hires: 4, interviews: 16 }
  ];

  const sourceData = [
    { source: 'Site Carrières', applications: 89, percentage: 35, color: 'bg-blue-500' },
    { source: 'LinkedIn', applications: 67, percentage: 26, color: 'bg-indigo-500' },
    { source: 'Indeed', applications: 45, percentage: 18, color: 'bg-green-500' },
    { source: 'Cooptation', applications: 32, percentage: 13, color: 'bg-purple-500' },
    { source: 'Autres', applications: 21, percentage: 8, color: 'bg-gray-500' }
  ];

  const positionStats = [
    { position: 'Développeur Full Stack', applications: 78, hires: 3, avgTime: 32 },
    { position: 'Designer UX/UI', applications: 45, hires: 2, avgTime: 25 },
    { position: 'Chef de Projet', applications: 34, hires: 1, avgTime: 35 },
    { position: 'Commercial', applications: 29, hires: 2, avgTime: 22 }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">KPI de Recrutement</h2>
          <p className="text-slate-600">Suivez les performances de votre processus de recrutement</p>
        </div>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>Derniers 30 jours</option>
            <option>Derniers 3 mois</option>
            <option>Derniers 6 mois</option>
            <option>Cette année</option>
          </select>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.changeType === 'positive' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {kpi.change}
              </div>
            </div>
            <h3 className="font-medium text-slate-700 mb-1">{kpi.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</p>
            <p className="text-sm text-slate-500">{kpi.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6">Entonnoir de Recrutement</h3>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">{stage.count}</span>
                    <span className="text-xs text-slate-500">({stage.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de Candidatures */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6">Sources de Candidatures</h3>
          <div className="space-y-4">
            {sourceData.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${source.color} mr-3`}></div>
                  <span className="text-sm font-medium text-slate-700">{source.source}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-slate-600">{source.applications}</span>
                  <div className="w-20 bg-slate-200 rounded-full h-2">
                    <div 
                      className={`${source.color} h-2 rounded-full`}
                      style={{ width: `${source.percentage * 2}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 w-8">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-6">Tendances Mensuelles</h3>
        <div className="grid grid-cols-6 gap-4">
          {monthlyData.map((month, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-medium text-slate-700 mb-3">{month.month}</p>
              <div className="space-y-2">
                <div className="relative">
                  <div className="w-full bg-slate-200 rounded h-20 flex items-end justify-center">
                    <div 
                      className="bg-blue-500 rounded-t w-4"
                      style={{ height: `${(month.applications / 70) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{month.applications} candidatures</p>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span>{month.hires} embauches</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                    <span>{month.interviews} entretiens</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Position Statistics */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-6">Statistiques par Poste</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Poste</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Candidatures</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Embauches</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Taux de Conversion</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Temps Moyen</th>
              </tr>
            </thead>
            <tbody>
              {positionStats.map((position, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="py-3 px-4 font-medium text-slate-900">{position.position}</td>
                  <td className="py-3 px-4 text-slate-700">{position.applications}</td>
                  <td className="py-3 px-4 text-slate-700">{position.hires}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="text-slate-700 mr-2">
                        {Math.round((position.hires / position.applications) * 100)}%
                      </span>
                      <div className="w-16 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(position.hires / position.applications) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{position.avgTime} jours</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Meilleure Performance</h3>
          <p className="text-blue-100 mb-1">Designer UX/UI</p>
          <p className="text-sm text-blue-200">Temps de recrutement le plus court (25 jours)</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Source la Plus Efficace</h3>
          <p className="text-green-100 mb-1">Cooptation</p>
          <p className="text-sm text-green-200">Taux de conversion de 25%</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Prochaine Échéance</h3>
          <p className="text-purple-100 mb-1">3 entretiens cette semaine</p>
          <p className="text-sm text-purple-200">2 décisions en attente</p>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentKPIs;