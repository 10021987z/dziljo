import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Target, AlertTriangle, TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, Bell, Settings, Download, Upload, Filter } from 'lucide-react';

interface Budget {
  id: number;
  name: string;
  period: string;
  startDate: string;
  endDate: string;
  axisType: string;
  axisValue: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  status: 'on-track' | 'warning' | 'overrun' | 'under-budget';
  alertThreshold: number;
  isActive: boolean;
  createdDate: string;
  lastUpdated: string;
  notes?: string;
}

interface BudgetAlert {
  id: number;
  budgetId: number;
  budgetName: string;
  type: 'threshold' | 'overrun' | 'forecast';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  currentAmount: number;
  budgetAmount: number;
  variance: number;
  triggeredDate: string;
  isRead: boolean;
  actionRequired: boolean;
}

interface BudgetForecast {
  budgetId: number;
  currentAmount: number;
  forecastAmount: number;
  confidence: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  projectedVariance: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const BudgetManagement: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 1,
      name: 'Budget Projet Alpha',
      period: '2024',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      axisType: 'PROJECT',
      axisValue: 'PROJ_ALPHA',
      budgetAmount: 150000,
      actualAmount: 127500,
      variance: -22500,
      variancePercent: -15.0,
      status: 'on-track',
      alertThreshold: 90,
      isActive: true,
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-26',
      notes: 'Budget principal pour le projet Alpha avec TechCorp'
    },
    {
      id: 2,
      name: 'Budget Client TechCorp',
      period: '2024-Q1',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      axisType: 'CLIENT',
      axisValue: 'CLI_TECHCORP',
      budgetAmount: 75000,
      actualAmount: 82500,
      variance: 7500,
      variancePercent: 10.0,
      status: 'overrun',
      alertThreshold: 95,
      isActive: true,
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-25',
      notes: 'Dépassement prévu suite aux demandes additionnelles'
    },
    {
      id: 3,
      name: 'Budget Développement',
      period: '2024-01',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      axisType: 'COST_CENTER',
      axisValue: 'CC_DEV',
      budgetAmount: 45000,
      actualAmount: 38250,
      variance: -6750,
      variancePercent: -15.0,
      status: 'under-budget',
      alertThreshold: 85,
      isActive: true,
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-26'
    },
    {
      id: 4,
      name: 'Budget CRM Enterprise',
      period: '2024-Q1',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      axisType: 'PRODUCT',
      axisValue: 'PROD_CRM',
      budgetAmount: 120000,
      actualAmount: 108000,
      variance: -12000,
      variancePercent: -10.0,
      status: 'warning',
      alertThreshold: 80,
      isActive: true,
      createdDate: '2024-01-01',
      lastUpdated: '2024-01-24'
    }
  ]);

  const [alerts, setAlerts] = useState<BudgetAlert[]>([
    {
      id: 1,
      budgetId: 2,
      budgetName: 'Budget Client TechCorp',
      type: 'overrun',
      severity: 'critical',
      message: 'Budget dépassé de 10% - Action requise',
      currentAmount: 82500,
      budgetAmount: 75000,
      variance: 10.0,
      triggeredDate: '2024-01-25',
      isRead: false,
      actionRequired: true
    },
    {
      id: 2,
      budgetId: 4,
      budgetName: 'Budget CRM Enterprise',
      type: 'threshold',
      severity: 'warning',
      message: 'Seuil d\'alerte atteint (80%)',
      currentAmount: 108000,
      budgetAmount: 120000,
      variance: -10.0,
      triggeredDate: '2024-01-24',
      isRead: false,
      actionRequired: false
    },
    {
      id: 3,
      budgetId: 1,
      budgetName: 'Budget Projet Alpha',
      type: 'forecast',
      severity: 'info',
      message: 'Prévision de dépassement en fin d\'année',
      currentAmount: 127500,
      budgetAmount: 150000,
      variance: 5.0,
      triggeredDate: '2024-01-23',
      isRead: true,
      actionRequired: false
    }
  ]);

  const [forecasts] = useState<BudgetForecast[]>([
    {
      budgetId: 1,
      currentAmount: 127500,
      forecastAmount: 157500,
      confidence: 85,
      trend: 'increasing',
      projectedVariance: 5.0,
      riskLevel: 'medium'
    },
    {
      budgetId: 2,
      currentAmount: 82500,
      forecastAmount: 95000,
      confidence: 92,
      trend: 'increasing',
      projectedVariance: 26.7,
      riskLevel: 'high'
    },
    {
      budgetId: 3,
      currentAmount: 38250,
      forecastAmount: 42000,
      confidence: 78,
      trend: 'stable',
      projectedVariance: -6.7,
      riskLevel: 'low'
    }
  ]);

  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [activeTab, setActiveTab] = useState('budgets');
  const [filterPeriod, setFilterPeriod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [newBudget, setNewBudget] = useState({
    name: '',
    period: '2024',
    startDate: '',
    endDate: '',
    axisType: 'PROJECT',
    axisValue: '',
    budgetAmount: 0,
    alertThreshold: 90,
    notes: ''
  });

  const availableAxes = [
    { code: 'PROJECT', label: 'Projets', values: ['PROJ_ALPHA', 'PROJ_BETA', 'PROJ_GAMMA'] },
    { code: 'CLIENT', label: 'Clients', values: ['CLI_TECHCORP', 'CLI_DIGITAL', 'CLI_STARTUP'] },
    { code: 'PRODUCT', label: 'Produits', values: ['PROD_CRM', 'PROD_MARKETING', 'PROD_CONSULTING'] },
    { code: 'COST_CENTER', label: 'Centres de Coût', values: ['CC_DEV', 'CC_COMMERCIAL', 'CC_ADMIN'] }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'overrun': return 'bg-red-100 text-red-800';
      case 'under-budget': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'on-track': return 'Dans les clous';
      case 'warning': return 'Attention';
      case 'overrun': return 'Dépassement';
      case 'under-budget': return 'Sous-budget';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track': return <Target className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'overrun': return <TrendingUp className="w-4 h-4" />;
      case 'under-budget': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'stable': return <BarChart3 className="w-4 h-4 text-blue-600" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleCreateBudget = () => {
    const budget: Budget = {
      id: Date.now(),
      ...newBudget,
      actualAmount: 0,
      variance: -newBudget.budgetAmount,
      variancePercent: -100,
      status: 'on-track',
      isActive: true,
      createdDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    setBudgets([...budgets, budget]);
    setNewBudget({
      name: '',
      period: '2024',
      startDate: '',
      endDate: '',
      axisType: 'PROJECT',
      axisValue: '',
      budgetAmount: 0,
      alertThreshold: 90,
      notes: ''
    });
    setShowCreateModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Budget créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const markAlertAsRead = (alertId: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
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

  const filteredBudgets = budgets.filter(budget => {
    const matchesPeriod = !filterPeriod || budget.period === filterPeriod;
    const matchesStatus = !filterStatus || budget.status === filterStatus;
    return matchesPeriod && matchesStatus;
  });

  const budgetStats = {
    total: budgets.length,
    onTrack: budgets.filter(b => b.status === 'on-track').length,
    overrun: budgets.filter(b => b.status === 'overrun').length,
    totalBudget: budgets.reduce((sum, b) => sum + b.budgetAmount, 0),
    totalActual: budgets.reduce((sum, b) => sum + b.actualAmount, 0),
    unreadAlerts: alerts.filter(a => !a.isRead).length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Budgets & Alertes</h2>
          <p className="text-slate-600">Suivi budgétaire multidimensionnel avec alertes automatiques</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowAlertModal(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700 transition-colors relative"
          >
            <Bell className="w-4 h-4 mr-2" />
            Alertes
            {budgetStats.unreadAlerts > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {budgetStats.unreadAlerts}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Budget
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Budgets Totaux</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{budgetStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Dans les Clous</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{budgetStats.onTrack}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Dépassements</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{budgetStats.overrun}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Budget Total</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(budgetStats.totalBudget)}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Réalisé</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(budgetStats.totalActual)}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'budgets', name: 'Budgets', icon: Target },
            { id: 'forecasts', name: 'Prévisions', icon: TrendingUp },
            { id: 'alerts', name: 'Alertes', icon: Bell }
          ].map((tab) => (
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
              {tab.id === 'alerts' && budgetStats.unreadAlerts > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {budgetStats.unreadAlerts}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les périodes</option>
            <option value="2024">2024</option>
            <option value="2024-Q1">2024-Q1</option>
            <option value="2024-01">Janvier 2024</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="on-track">Dans les clous</option>
            <option value="warning">Attention</option>
            <option value="overrun">Dépassement</option>
            <option value="under-budget">Sous-budget</option>
          </select>
        </div>

        {activeTab === 'budgets' && (
          <div className="space-y-4">
            {filteredBudgets.map((budget) => (
              <div key={budget.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{budget.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(budget.status)}`}>
                        {getStatusIcon(budget.status)}
                        <span className="ml-1">{getStatusText(budget.status)}</span>
                      </span>
                      <span className="text-sm text-slate-500">{budget.period}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-slate-600">Budget:</span>
                        <p className="font-medium text-slate-900">{formatCurrency(budget.budgetAmount)}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Réalisé:</span>
                        <p className="font-medium text-slate-900">{formatCurrency(budget.actualAmount)}</p>
                      </div>
                      <div>
                        <span className="text-slate-600">Écart:</span>
                        <p className={`font-medium ${budget.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {budget.variance >= 0 ? '+' : ''}{formatCurrency(budget.variance)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600">Écart %:</span>
                        <p className={`font-medium ${budget.variancePercent >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {budget.variancePercent >= 0 ? '+' : ''}{formatPercentage(budget.variancePercent)}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600">Consommation:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (budget.actualAmount / budget.budgetAmount) * 100 > budget.alertThreshold 
                                  ? 'bg-red-600' 
                                  : 'bg-green-600'
                              }`}
                              style={{ width: `${Math.min((budget.actualAmount / budget.budgetAmount) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">
                            {formatPercentage((budget.actualAmount / budget.budgetAmount) * 100)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div>
                        <span className="font-medium">Axe:</span> {budget.axisType} - {budget.axisValue}
                      </div>
                      <div>
                        <span className="font-medium">Période:</span> {budget.startDate} → {budget.endDate}
                      </div>
                      <div>
                        <span className="font-medium">Seuil d'alerte:</span> {budget.alertThreshold}%
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => setSelectedBudget(budget)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-orange-600 transition-colors">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'forecasts' && (
          <div className="space-y-4">
            {forecasts.map((forecast) => {
              const budget = budgets.find(b => b.id === forecast.budgetId);
              if (!budget) return null;

              return (
                <div key={forecast.budgetId} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900">{budget.name}</h4>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(forecast.trend)}
                      <span className={`text-sm font-medium ${getRiskColor(forecast.riskLevel)}`}>
                        Risque {forecast.riskLevel}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Actuel:</span>
                      <p className="font-medium text-slate-900">{formatCurrency(forecast.currentAmount)}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Prévision:</span>
                      <p className="font-medium text-slate-900">{formatCurrency(forecast.forecastAmount)}</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Confiance:</span>
                      <p className="font-medium text-slate-900">{forecast.confidence}%</p>
                    </div>
                    <div>
                      <span className="text-slate-600">Écart projeté:</span>
                      <p className={`font-medium ${forecast.projectedVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {forecast.projectedVariance >= 0 ? '+' : ''}{formatPercentage(forecast.projectedVariance)}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600">Tendance:</span>
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(forecast.trend)}
                        <span className="capitalize">{forecast.trend}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div className="relative h-3 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-3 rounded-full"
                          style={{ width: `${(forecast.currentAmount / budget.budgetAmount) * 100}%` }}
                        ></div>
                        <div 
                          className="absolute top-0 bg-blue-300 h-3"
                          style={{ 
                            left: `${(forecast.currentAmount / budget.budgetAmount) * 100}%`,
                            width: `${Math.max(0, (forecast.forecastAmount - forecast.currentAmount) / budget.budgetAmount * 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0</span>
                      <span>Budget: {formatCurrency(budget.budgetAmount)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  alert.isRead ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50'
                }`}
                onClick={() => markAlertAsRead(alert.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.severity === 'critical' ? 'text-red-600' :
                      alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-slate-900">{alert.budgetName}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className="text-sm text-slate-500">{alert.triggeredDate}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 mb-2">{alert.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Budget:</span> {formatCurrency(alert.budgetAmount)}
                      </div>
                      <div>
                        <span className="font-medium">Actuel:</span> {formatCurrency(alert.currentAmount)}
                      </div>
                      <div>
                        <span className="font-medium">Écart:</span>
                        <span className={`font-medium ${alert.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {alert.variance >= 0 ? '+' : ''}{formatPercentage(alert.variance)}
                        </span>
                      </div>
                    </div>

                    {alert.actionRequired && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-800 font-medium">
                          ⚠️ Action requise - Veuillez réviser ce budget
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Budget Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouveau Budget</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nom du budget <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newBudget.name}
                    onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Budget Projet Alpha"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Période <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBudget.period}
                    onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="2024">2024</option>
                    <option value="2024-Q1">2024-Q1</option>
                    <option value="2024-Q2">2024-Q2</option>
                    <option value="2024-01">Janvier 2024</option>
                    <option value="2024-02">Février 2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date de début <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newBudget.startDate}
                    onChange={(e) => setNewBudget({ ...newBudget, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date de fin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={newBudget.endDate}
                    onChange={(e) => setNewBudget({ ...newBudget, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type d'axe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBudget.axisType}
                    onChange={(e) => setNewBudget({ ...newBudget, axisType: e.target.value, axisValue: '' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableAxes.map(axis => (
                      <option key={axis.code} value={axis.code}>{axis.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Valeur d'axe <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newBudget.axisValue}
                    onChange={(e) => setNewBudget({ ...newBudget, axisValue: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une valeur</option>
                    {availableAxes.find(axis => axis.code === newBudget.axisType)?.values.map(value => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Montant du budget <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newBudget.budgetAmount}
                    onChange={(e) => setNewBudget({ ...newBudget, budgetAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Seuil d'alerte (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={newBudget.alertThreshold}
                    onChange={(e) => setNewBudget({ ...newBudget, alertThreshold: parseFloat(e.target.value) || 90 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="100"
                    step="5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newBudget.notes}
                  onChange={(e) => setNewBudget({ ...newBudget, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notes sur ce budget..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateBudget}
                disabled={!newBudget.name || !newBudget.axisValue || !newBudget.budgetAmount}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer le Budget
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManagement;