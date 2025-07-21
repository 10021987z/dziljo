import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Play, Pause, Settings, Database, Calculator, Clock, AlertTriangle, CheckCircle, Code, Target, Zap, Calendar, BarChart3 } from 'lucide-react';

interface AllocationRule {
  id: number;
  name: string;
  description: string;
  type: 'fixed' | 'formula' | 'percentage';
  sourceAccount: string;
  targetAxes: string[];
  formula?: string;
  percentage?: number;
  schedule: 'manual' | 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  lastExecution?: string;
  nextExecution?: string;
  executionCount: number;
  successRate: number;
  createdDate: string;
  conditions?: AllocationCondition[];
}

interface AllocationCondition {
  id: number;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: string;
  axisValue: string;
}

interface AllocationExecution {
  id: number;
  ruleId: number;
  ruleName: string;
  executionDate: string;
  status: 'success' | 'error' | 'partial';
  entriesProcessed: number;
  entriesAllocated: number;
  totalAmount: number;
  duration: number;
  errorMessage?: string;
}

const AllocationRules: React.FC = () => {
  const [rules, setRules] = useState<AllocationRule[]>([
    {
      id: 1,
      name: 'Ventilation Salaires par Projet',
      description: 'Répartition automatique des salaires selon le temps passé par projet',
      type: 'formula',
      sourceAccount: '641000 - Salaires',
      targetAxes: ['PROJECT', 'COST_CENTER'],
      formula: 'timesheet.hours / total_hours * amount',
      schedule: 'monthly',
      isActive: true,
      lastExecution: '2024-01-01',
      nextExecution: '2024-02-01',
      executionCount: 12,
      successRate: 98.5,
      createdDate: '2023-01-15',
      conditions: [
        {
          id: 1,
          field: 'account_code',
          operator: 'contains',
          value: '641',
          axisValue: 'CC_DEV'
        }
      ]
    },
    {
      id: 2,
      name: 'Répartition Charges Locatives',
      description: 'Ventilation des charges de bureau selon la surface occupée',
      type: 'percentage',
      sourceAccount: '613000 - Loyers',
      targetAxes: ['COST_CENTER'],
      percentage: 100,
      schedule: 'monthly',
      isActive: true,
      lastExecution: '2024-01-01',
      nextExecution: '2024-02-01',
      executionCount: 12,
      successRate: 100,
      createdDate: '2023-01-15',
      conditions: [
        {
          id: 2,
          field: 'cost_center',
          operator: 'equals',
          value: 'DEV',
          axisValue: 'CC_DEV'
        },
        {
          id: 3,
          field: 'cost_center',
          operator: 'equals',
          value: 'COMMERCIAL',
          axisValue: 'CC_COMMERCIAL'
        }
      ]
    },
    {
      id: 3,
      name: 'Allocation Frais Généraux',
      description: 'Répartition des frais généraux au prorata du CA par client',
      type: 'formula',
      sourceAccount: '62* - Frais Généraux',
      targetAxes: ['CLIENT', 'PROJECT'],
      formula: 'client.revenue / total_revenue * amount',
      schedule: 'monthly',
      isActive: false,
      lastExecution: '2023-12-01',
      executionCount: 11,
      successRate: 95.2,
      createdDate: '2023-02-01'
    }
  ]);

  const [executions, setExecutions] = useState<AllocationExecution[]>([
    {
      id: 1,
      ruleId: 1,
      ruleName: 'Ventilation Salaires par Projet',
      executionDate: '2024-01-01',
      status: 'success',
      entriesProcessed: 156,
      entriesAllocated: 156,
      totalAmount: 45000,
      duration: 2.3
    },
    {
      id: 2,
      ruleId: 2,
      ruleName: 'Répartition Charges Locatives',
      executionDate: '2024-01-01',
      status: 'success',
      entriesProcessed: 12,
      entriesAllocated: 12,
      totalAmount: 8500,
      duration: 0.8
    },
    {
      id: 3,
      ruleId: 1,
      ruleName: 'Ventilation Salaires par Projet',
      executionDate: '2023-12-01',
      status: 'partial',
      entriesProcessed: 145,
      entriesAllocated: 142,
      totalAmount: 43200,
      duration: 2.1,
      errorMessage: '3 écritures sans projet assigné'
    }
  ]);

  const [selectedRule, setSelectedRule] = useState<AllocationRule | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('rules');

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    type: 'percentage' as AllocationRule['type'],
    sourceAccount: '',
    targetAxes: [] as string[],
    formula: '',
    percentage: 100,
    schedule: 'monthly' as AllocationRule['schedule']
  });

  const availableAxes = [
    { code: 'PROJECT', label: 'Projets' },
    { code: 'CLIENT', label: 'Clients' },
    { code: 'PRODUCT', label: 'Produits' },
    { code: 'COST_CENTER', label: 'Centres de Coût' }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fixed': return 'bg-blue-100 text-blue-800';
      case 'formula': return 'bg-purple-100 text-purple-800';
      case 'percentage': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'fixed': return 'Fixe';
      case 'formula': return 'Formule';
      case 'percentage': return 'Pourcentage';
      default: return type;
    }
  };

  const getScheduleColor = (schedule: string) => {
    switch (schedule) {
      case 'manual': return 'bg-gray-100 text-gray-800';
      case 'daily': return 'bg-blue-100 text-blue-800';
      case 'weekly': return 'bg-green-100 text-green-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScheduleText = (schedule: string) => {
    switch (schedule) {
      case 'manual': return 'Manuel';
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      default: return schedule;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return 'Succès';
      case 'error': return 'Erreur';
      case 'partial': return 'Partiel';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      case 'partial': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreateRule = () => {
    const rule: AllocationRule = {
      id: Date.now(),
      ...newRule,
      isActive: true,
      executionCount: 0,
      successRate: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setRules([...rules, rule]);
    setNewRule({
      name: '',
      description: '',
      type: 'percentage',
      sourceAccount: '',
      targetAxes: [],
      formula: '',
      percentage: 100,
      schedule: 'monthly'
    });
    setShowCreateModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Règle de ventilation créée avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleExecuteRule = (ruleId: number) => {
    const rule = rules.find(r => r.id === ruleId);
    if (!rule) return;

    // Simulate execution
    const execution: AllocationExecution = {
      id: Date.now(),
      ruleId: rule.id,
      ruleName: rule.name,
      executionDate: new Date().toISOString().split('T')[0],
      status: 'success',
      entriesProcessed: Math.floor(Math.random() * 200) + 50,
      entriesAllocated: Math.floor(Math.random() * 200) + 50,
      totalAmount: Math.floor(Math.random() * 50000) + 10000,
      duration: Math.random() * 5 + 0.5
    };
    
    execution.entriesAllocated = Math.min(execution.entriesAllocated, execution.entriesProcessed);
    
    setExecutions([execution, ...executions]);
    
    // Update rule
    setRules(prev => prev.map(r => 
      r.id === ruleId 
        ? { 
            ...r, 
            lastExecution: execution.executionDate,
            executionCount: r.executionCount + 1,
            successRate: ((r.successRate * r.executionCount) + (execution.status === 'success' ? 100 : 0)) / (r.executionCount + 1)
          }
        : r
    ));
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Règle exécutée avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const toggleRuleStatus = (ruleId: number) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const ruleStats = {
    total: rules.length,
    active: rules.filter(r => r.isActive).length,
    avgSuccessRate: rules.reduce((sum, r) => sum + r.successRate, 0) / rules.length,
    totalExecutions: rules.reduce((sum, r) => sum + r.executionCount, 0)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Règles de Ventilation</h2>
          <p className="text-slate-600">Automatisation des allocations et ventilations analytiques</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Règle
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Règles Totales</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{ruleStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Règles Actives</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{ruleStats.active}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux de Succès</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{ruleStats.avgSuccessRate.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Exécutions</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{ruleStats.totalExecutions}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'rules', name: 'Règles de Ventilation', icon: Database },
            { id: 'executions', name: 'Historique d\'Exécution', icon: BarChart3 }
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
            </button>
          ))}
        </div>

        {activeTab === 'rules' && (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{rule.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(rule.type)}`}>
                        {getTypeText(rule.type)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getScheduleColor(rule.schedule)}`}>
                        {getScheduleText(rule.schedule)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{rule.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Source:</span> {rule.sourceAccount}
                      </div>
                      <div>
                        <span className="font-medium">Axes cibles:</span> {rule.targetAxes.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Exécutions:</span> {rule.executionCount}
                      </div>
                      <div>
                        <span className="font-medium">Succès:</span> {rule.successRate.toFixed(1)}%
                      </div>
                    </div>

                    {rule.type === 'formula' && rule.formula && (
                      <div className="mt-3 p-2 bg-slate-100 rounded font-mono text-sm">
                        <Code className="w-4 h-4 inline mr-2" />
                        {rule.formula}
                      </div>
                    )}

                    {rule.type === 'percentage' && rule.percentage && (
                      <div className="mt-3 text-sm text-slate-600">
                        <Calculator className="w-4 h-4 inline mr-2" />
                        Répartition: {rule.percentage}%
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-slate-500 mt-3">
                      {rule.lastExecution && (
                        <div>
                          <span className="font-medium">Dernière exécution:</span> {rule.lastExecution}
                        </div>
                      )}
                      {rule.nextExecution && (
                        <div>
                          <span className="font-medium">Prochaine exécution:</span> {rule.nextExecution}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => setSelectedRule(rule)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleExecuteRule(rule.id)}
                      disabled={!rule.isActive}
                      className="p-2 text-slate-400 hover:text-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleRuleStatus(rule.id)}
                      className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                    >
                      {rule.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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

        {activeTab === 'executions' && (
          <div className="space-y-4">
            {executions.map((execution) => (
              <div key={execution.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-slate-900">{execution.ruleName}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(execution.status)}`}>
                      {getStatusIcon(execution.status)}
                      <span className="ml-1">{getStatusText(execution.status)}</span>
                    </span>
                  </div>
                  <span className="text-sm text-slate-500">{execution.executionDate}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Écritures traitées:</span>
                    <p className="font-medium text-slate-900">{execution.entriesProcessed}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Écritures ventilées:</span>
                    <p className="font-medium text-slate-900">{execution.entriesAllocated}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Montant total:</span>
                    <p className="font-medium text-slate-900">{formatCurrency(execution.totalAmount)}</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Durée:</span>
                    <p className="font-medium text-slate-900">{execution.duration.toFixed(1)}s</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Taux de succès:</span>
                    <p className="font-medium text-slate-900">
                      {((execution.entriesAllocated / execution.entriesProcessed) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {execution.errorMessage && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-800">
                      <AlertTriangle className="w-4 h-4 inline mr-2" />
                      {execution.errorMessage}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle Règle de Ventilation</h3>
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
                    Nom de la règle <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Ventilation Salaires par Projet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type de règle <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as AllocationRule['type'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="percentage">Pourcentage</option>
                    <option value="formula">Formule</option>
                    <option value="fixed">Montant fixe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description de la règle de ventilation..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Compte source <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newRule.sourceAccount}
                    onChange={(e) => setNewRule({ ...newRule, sourceAccount: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 641000 - Salaires"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Fréquence d'exécution <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newRule.schedule}
                    onChange={(e) => setNewRule({ ...newRule, schedule: e.target.value as AllocationRule['schedule'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="manual">Manuel</option>
                    <option value="daily">Quotidien</option>
                    <option value="weekly">Hebdomadaire</option>
                    <option value="monthly">Mensuel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Axes cibles <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableAxes.map((axis) => (
                    <label key={axis.code} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newRule.targetAxes.includes(axis.code)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRule({ ...newRule, targetAxes: [...newRule.targetAxes, axis.code] });
                          } else {
                            setNewRule({ ...newRule, targetAxes: newRule.targetAxes.filter(a => a !== axis.code) });
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">{axis.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {newRule.type === 'formula' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Formule de calcul <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newRule.formula}
                    onChange={(e) => setNewRule({ ...newRule, formula: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="Ex: timesheet.hours / total_hours * amount"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Variables disponibles: amount, timesheet.hours, total_hours, client.revenue, total_revenue
                  </p>
                </div>
              )}

              {newRule.type === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pourcentage à ventiler <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={newRule.percentage}
                      onChange={(e) => setNewRule({ ...newRule, percentage: parseFloat(e.target.value) })}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-slate-600">%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateRule}
                disabled={!newRule.name || !newRule.sourceAccount || newRule.targetAxes.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer la Règle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationRules;