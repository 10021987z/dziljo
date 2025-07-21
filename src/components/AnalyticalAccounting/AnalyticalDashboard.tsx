import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, Users, Building2, Package, Calendar, Filter, Download, RefreshCw, Eye, Layers, Activity, PieChart } from 'lucide-react';

interface KPICard {
  title: string;
  value: string;
  change: number;
  changeText: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface AnalyticalEntry {
  id: number;
  date: string;
  description: string;
  amount: number;
  project: string;
  client: string;
  product: string;
  costCenter: string;
  margin: number;
  marginPercent: number;
}

interface BudgetAlert {
  id: number;
  type: 'overrun' | 'warning' | 'info';
  title: string;
  message: string;
  axis: string;
  value: string;
  budget: number;
  actual: number;
  variance: number;
  date: string;
}

const AnalyticalDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedAxes, setSelectedAxes] = useState<string[]>(['project', 'client']);
  const [refreshing, setRefreshing] = useState(false);

  // Sample KPI data
  const kpis: KPICard[] = [
    {
      title: 'Marge Brute Totale',
      value: '€342,580',
      change: 12.5,
      changeText: '+€38,120 vs mois dernier',
      icon: DollarSign,
      color: 'bg-green-500',
      trend: 'up'
    },
    {
      title: 'Taux de Marge Moyen',
      value: '34.2%',
      change: 2.1,
      changeText: '+2.1 points vs mois dernier',
      icon: TrendingUp,
      color: 'bg-blue-500',
      trend: 'up'
    },
    {
      title: 'Projets Rentables',
      value: '18/23',
      change: -1,
      changeText: '1 projet sous le seuil',
      icon: Target,
      color: 'bg-purple-500',
      trend: 'down'
    },
    {
      title: 'Centres de Coût Actifs',
      value: '12',
      change: 0,
      changeText: 'Stable ce mois',
      icon: Building2,
      color: 'bg-orange-500',
      trend: 'stable'
    }
  ];

  // Sample budget alerts
  const budgetAlerts: BudgetAlert[] = [
    {
      id: 1,
      type: 'overrun',
      title: 'Dépassement Budget Projet Alpha',
      message: 'Le projet Alpha a dépassé son budget de 15%',
      axis: 'project',
      value: 'Projet Alpha',
      budget: 50000,
      actual: 57500,
      variance: 15,
      date: '2024-01-26'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Alerte Marge Client TechCorp',
      message: 'La marge sur TechCorp est en baisse (-5%)',
      axis: 'client',
      value: 'TechCorp Solutions',
      budget: 25000,
      actual: 23750,
      variance: -5,
      date: '2024-01-25'
    },
    {
      id: 3,
      type: 'info',
      title: 'Performance Produit CRM',
      message: 'Le produit CRM dépasse les objectifs de marge',
      axis: 'product',
      value: 'CRM Enterprise',
      budget: 30000,
      actual: 34500,
      variance: 15,
      date: '2024-01-24'
    }
  ];

  // Sample top performers data
  const topPerformers = {
    projects: [
      { name: 'Projet Beta', margin: 45.2, revenue: 85000, budget: 80000 },
      { name: 'Transformation Digital', margin: 38.7, revenue: 125000, budget: 120000 },
      { name: 'Migration Cloud', margin: 35.1, revenue: 95000, budget: 90000 }
    ],
    clients: [
      { name: 'Digital Innovations', margin: 42.3, revenue: 156000, projects: 3 },
      { name: 'TechCorp Solutions', margin: 38.9, revenue: 234000, projects: 5 },
      { name: 'StartupXYZ', margin: 35.6, revenue: 89000, projects: 2 }
    ],
    products: [
      { name: 'CRM Enterprise', margin: 48.5, revenue: 198000, sales: 12 },
      { name: 'Marketing Automation', margin: 41.2, revenue: 145000, sales: 8 },
      { name: 'Consulting', margin: 35.8, revenue: 267000, sales: 15 }
    ]
  };

  // Sample recent entries
  const recentEntries: AnalyticalEntry[] = [
    {
      id: 1,
      date: '2024-01-26',
      description: 'Facture TechCorp - Développement CRM',
      amount: 15000,
      project: 'Projet Alpha',
      client: 'TechCorp Solutions',
      product: 'CRM Enterprise',
      costCenter: 'Développement',
      margin: 5250,
      marginPercent: 35.0
    },
    {
      id: 2,
      date: '2024-01-25',
      description: 'Achat licences logicielles',
      amount: -2500,
      project: 'Projet Beta',
      client: 'Digital Innovations',
      product: 'Infrastructure',
      costCenter: 'IT',
      margin: -2500,
      marginPercent: 0
    },
    {
      id: 3,
      date: '2024-01-25',
      description: 'Prestation consulting',
      amount: 8000,
      project: 'Migration Cloud',
      client: 'StartupXYZ',
      product: 'Consulting',
      costCenter: 'Consulting',
      margin: 3200,
      marginPercent: 40.0
    }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'overrun': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info': return <Activity className="w-5 h-5 text-blue-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'overrun': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tableau de Bord Analytique</h2>
          <p className="text-slate-600">Vue d'ensemble de la rentabilité multidimensionnelle</p>
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
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                kpi.trend === 'up' ? 'text-green-600' : 
                kpi.trend === 'down' ? 'text-red-600' : 'text-slate-600'
              }`}>
                {kpi.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : kpi.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 mr-1" />
                ) : (
                  <Activity className="w-4 h-4 mr-1" />
                )}
                {kpi.trend === 'up' ? '+' : kpi.trend === 'down' ? '' : '='}{kpi.change}%
              </div>
            </div>
            <h3 className="font-medium text-slate-700 mb-1">{kpi.title}</h3>
            <p className="text-2xl font-bold text-slate-900 mb-1">{kpi.value}</p>
            <p className="text-sm text-slate-500">{kpi.changeText}</p>
          </div>
        ))}
      </div>

      {/* Budget Alerts */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Alertes Budget & Performance
          </h3>
          <span className="text-sm text-slate-500">{budgetAlerts.length} alertes actives</span>
        </div>
        
        <div className="space-y-3">
          {budgetAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-slate-900">{alert.title}</h4>
                    <span className="text-sm text-slate-500">{alert.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 mb-2">{alert.message}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div>
                      <span className="text-slate-600">Budget:</span>
                      <span className="font-medium text-slate-900 ml-1">{formatCurrency(alert.budget)}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Réalisé:</span>
                      <span className="font-medium text-slate-900 ml-1">{formatCurrency(alert.actual)}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Écart:</span>
                      <span className={`font-medium ml-1 ${
                        alert.variance > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {alert.variance > 0 ? '+' : ''}{formatPercentage(alert.variance)}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-blue-600" />
            Top Projets
          </h3>
          <div className="space-y-3">
            {topPerformers.projects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{project.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>CA: {formatCurrency(project.revenue)}</span>
                    <span>Budget: {formatCurrency(project.budget)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{formatPercentage(project.margin)}</div>
                  <div className="text-xs text-slate-500">Marge</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Top Clients
          </h3>
          <div className="space-y-3">
            {topPerformers.clients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{client.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>CA: {formatCurrency(client.revenue)}</span>
                    <span>{client.projects} projets</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{formatPercentage(client.margin)}</div>
                  <div className="text-xs text-slate-500">Marge</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-purple-600" />
            Top Produits
          </h3>
          <div className="space-y-3">
            {topPerformers.products.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{product.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>CA: {formatCurrency(product.revenue)}</span>
                    <span>{product.sales} ventes</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{formatPercentage(product.margin)}</div>
                  <div className="text-xs text-slate-500">Marge</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Analytical Entries */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Écritures Analytiques Récentes</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Voir toutes les écritures
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Description</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Montant</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Projet</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Produit</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Marge</th>
              </tr>
            </thead>
            <tbody>
              {recentEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 text-slate-700">{entry.date}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{entry.description}</div>
                    <div className="text-sm text-slate-500">{entry.costCenter}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${entry.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(entry.amount)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{entry.project}</td>
                  <td className="py-3 px-4 text-slate-700">{entry.client}</td>
                  <td className="py-3 px-4 text-slate-700">{entry.product}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${entry.margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(entry.margin)}
                      </span>
                      <span className="text-sm text-slate-500">
                        ({formatPercentage(entry.marginPercent)})
                      </span>
                    </div>
                  </td>
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
            <PieChart className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Répartition par Axe</h3>
          <p className="text-blue-100 mb-1">Projets: 65% du CA</p>
          <p className="text-sm text-blue-200">Clients récurrents: 78% de la marge</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Performance Budget</h3>
          <p className="text-green-100 mb-1">92% des budgets respectés</p>
          <p className="text-sm text-green-200">Écart moyen: -2.3% vs prévisions</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Tendance Marge</h3>
          <p className="text-purple-100 mb-1">+2.1% ce mois</p>
          <p className="text-sm text-purple-200">Objectif annuel: 35% (34.2% actuel)</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticalDashboard;