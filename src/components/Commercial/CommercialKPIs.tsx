import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Users, Calendar, Phone, Mail, BarChart3, PieChart, Activity, Award } from 'lucide-react';

const CommercialKPIs: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedTeamMember, setSelectedTeamMember] = useState('all');

  // Sample KPI data
  const kpiData = {
    revenue: {
      current: 125430,
      previous: 98750,
      target: 150000,
      change: 27.0
    },
    deals: {
      won: 12,
      lost: 3,
      pending: 8,
      total: 23
    },
    pipeline: {
      value: 340000,
      weightedValue: 187000,
      avgDealSize: 14783,
      conversionRate: 28.5
    },
    activities: {
      calls: 156,
      emails: 89,
      meetings: 34,
      demos: 12
    },
    teamPerformance: [
      { name: 'Sophie Martin', revenue: 65000, deals: 7, activities: 145, target: 75000 },
      { name: 'Thomas Dubois', revenue: 45000, deals: 4, activities: 98, target: 60000 },
      { name: 'Pierre Rousseau', revenue: 15430, deals: 1, activities: 67, target: 45000 }
    ]
  };

  const monthlyTrends = [
    { month: 'Jan', revenue: 85000, deals: 8, pipeline: 280000 },
    { month: 'Fév', revenue: 92000, deals: 9, pipeline: 310000 },
    { month: 'Mar', revenue: 78000, deals: 7, pipeline: 295000 },
    { month: 'Avr', revenue: 105000, deals: 11, pipeline: 340000 },
    { month: 'Mai', revenue: 98750, deals: 10, pipeline: 325000 },
    { month: 'Juin', revenue: 125430, deals: 12, pipeline: 340000 }
  ];

  const sourceAnalysis = [
    { source: 'LinkedIn', leads: 45, conversion: 32, revenue: 67000 },
    { source: 'Site Web', leads: 38, conversion: 24, revenue: 45000 },
    { source: 'Référence', leads: 23, conversion: 48, revenue: 38000 },
    { source: 'Email', leads: 19, conversion: 16, revenue: 15000 },
    { source: 'Événements', leads: 12, conversion: 58, revenue: 28000 }
  ];

  const pipelineByStage = [
    { stage: 'Prospection', count: 15, value: 125000, color: 'bg-blue-500' },
    { stage: 'Qualification', count: 12, value: 98000, color: 'bg-yellow-500' },
    { stage: 'Proposition', count: 8, value: 76000, color: 'bg-orange-500' },
    { stage: 'Négociation', count: 5, value: 41000, color: 'bg-purple-500' }
  ];

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">KPI & Analytics Commerciaux</h2>
          <p className="text-slate-600">Suivez les performances de votre équipe commerciale</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <select
            value={selectedTeamMember}
            onChange={(e) => setSelectedTeamMember(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Toute l'équipe</option>
            <option value="sophie">Sophie Martin</option>
            <option value="thomas">Thomas Dubois</option>
            <option value="pierre">Pierre Rousseau</option>
          </select>
        </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center text-sm font-medium ${getChangeColor(kpiData.revenue.change)}`}>
              {getChangeIcon(kpiData.revenue.change)}
              <span className="ml-1">+{kpiData.revenue.change}%</span>
            </div>
          </div>
          <h3 className="font-medium text-slate-700 mb-1">Chiffre d'Affaires</h3>
          <p className="text-2xl font-bold text-slate-900 mb-1">{formatCurrency(kpiData.revenue.current)}</p>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Objectif: {formatCurrency(kpiData.revenue.target)}</span>
            <span>{formatPercentage((kpiData.revenue.current / kpiData.revenue.target) * 100)}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((kpiData.revenue.current / kpiData.revenue.target) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              +15%
            </div>
          </div>
          <h3 className="font-medium text-slate-700 mb-1">Deals Fermés</h3>
          <p className="text-2xl font-bold text-slate-900 mb-1">{kpiData.deals.won}</p>
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Taux de réussite</span>
            <span>{formatPercentage((kpiData.deals.won / kpiData.deals.total) * 100)}</span>
          </div>
          <div className="flex space-x-1 mt-2">
            <div className="flex-1 bg-green-200 rounded h-2"></div>
            <div className="flex-1 bg-red-200 rounded h-2"></div>
            <div className="flex-1 bg-yellow-200 rounded h-2"></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              +8%
            </div>
          </div>
          <h3 className="font-medium text-slate-700 mb-1">Pipeline</h3>
          <p className="text-2xl font-bold text-slate-900 mb-1">{formatCurrency(kpiData.pipeline.value)}</p>
          <div className="text-sm text-slate-500">
            <div>Pondéré: {formatCurrency(kpiData.pipeline.weightedValue)}</div>
            <div>Deal moyen: {formatCurrency(kpiData.pipeline.avgDealSize)}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="text-sm font-medium text-green-600">
              <TrendingUp className="w-4 h-4 inline mr-1" />
              +22%
            </div>
          </div>
          <h3 className="font-medium text-slate-700 mb-1">Activités</h3>
          <p className="text-2xl font-bold text-slate-900 mb-1">{kpiData.activities.calls + kpiData.activities.emails + kpiData.activities.meetings}</p>
          <div className="text-sm text-slate-500">
            <div>{kpiData.activities.calls} appels • {kpiData.activities.emails} emails</div>
            <div>{kpiData.activities.meetings} RDV • {kpiData.activities.demos} démos</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6">Évolution du Chiffre d'Affaires</h3>
          <div className="space-y-4">
            {monthlyTrends.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 w-12">{month.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(month.revenue / 150000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-900 w-20 text-right">
                  {formatCurrency(month.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline by Stage */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-6">Pipeline par Étape</h3>
          <div className="space-y-4">
            {pipelineByStage.map((stage, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${stage.color} mr-3`}></div>
                  <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-slate-600">{stage.count} deals</span>
                  <span className="text-sm font-medium text-slate-900 w-20 text-right">
                    {formatCurrency(stage.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-slate-700">Total Pipeline</span>
              <span className="font-bold text-slate-900">
                {formatCurrency(pipelineByStage.reduce((sum, stage) => sum + stage.value, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-6">Performance de l'Équipe</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Commercial</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">CA Réalisé</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Objectif</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">% Objectif</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Deals</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Activités</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Performance</th>
              </tr>
            </thead>
            <tbody>
              {kpiData.teamPerformance.map((member, index) => {
                const achievementRate = (member.revenue / member.target) * 100;
                return (
                  <tr key={index} className="border-b border-slate-200">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-900">
                      {formatCurrency(member.revenue)}
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      {formatCurrency(member.target)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className={`font-medium mr-2 ${
                          achievementRate >= 100 ? 'text-green-600' : 
                          achievementRate >= 80 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(achievementRate)}
                        </span>
                        <div className="w-16 bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              achievementRate >= 100 ? 'bg-green-600' : 
                              achievementRate >= 80 ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${Math.min(achievementRate, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{member.deals}</td>
                    <td className="py-4 px-4 text-slate-700">{member.activities}</td>
                    <td className="py-4 px-4">
                      {achievementRate >= 100 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          Excellent
                        </span>
                      ) : achievementRate >= 80 ? (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                          Bon
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                          À améliorer
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source Analysis */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-6">Analyse des Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {sourceAnalysis.map((source, index) => (
            <div key={index} className="text-center p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">{source.source}</h4>
              <div className="space-y-2">
                <div>
                  <span className="text-2xl font-bold text-blue-600">{source.leads}</span>
                  <p className="text-xs text-slate-600">Leads</p>
                </div>
                <div>
                  <span className="text-lg font-semibold text-green-600">{source.conversion}%</span>
                  <p className="text-xs text-slate-600">Conversion</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-slate-900">{formatCurrency(source.revenue)}</span>
                  <p className="text-xs text-slate-600">Revenue</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Top Performer</h3>
          <p className="text-green-100 mb-1">Sophie Martin</p>
          <p className="text-sm text-green-200">{formatCurrency(65000)} de CA ce mois</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Meilleure Source</h3>
          <p className="text-blue-100 mb-1">LinkedIn</p>
          <p className="text-sm text-blue-200">32% de taux de conversion</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Prévision</h3>
          <p className="text-purple-100 mb-1">{formatCurrency(187000)}</p>
          <p className="text-sm text-purple-200">Pipeline pondéré</p>
        </div>
      </div>
    </div>
  );
};

export default CommercialKPIs;