import React, { useState } from 'react';
import { DollarSign, Calculator, FileText, Download, Upload, Calendar, TrendingUp, Users, AlertCircle, CheckCircle, Clock, Edit, Eye, Plus } from 'lucide-react';
import ExportButtons from '../Common/ExportButtons';

interface PayrollEntry {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  payPeriod: string;
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  grossPay: number;
  taxes: number;
  socialCharges: number;
  netPay: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid';
  payDate?: string;
  workingDays: number;
  absenceDays: number;
  overtimeHours: number;
}

interface PayrollSummary {
  period: string;
  totalEmployees: number;
  totalGrossPay: number;
  totalNetPay: number;
  totalTaxes: number;
  totalSocialCharges: number;
  status: 'in-progress' | 'completed' | 'paid';
  payDate?: string;
}

interface SalaryComponent {
  id: number;
  name: string;
  type: 'fixed' | 'variable' | 'deduction' | 'tax';
  category: 'salary' | 'bonus' | 'allowance' | 'tax' | 'social' | 'other';
  amount?: number;
  percentage?: number;
  isActive: boolean;
  description: string;
}

const PayrollManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payroll');
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      department: 'Technique',
      position: 'Développeur Full Stack Senior',
      payPeriod: '2024-01',
      baseSalary: 4583.33, // 55000/12
      overtime: 450.00,
      bonuses: 500.00,
      deductions: 0,
      grossPay: 5533.33,
      taxes: 1106.67,
      socialCharges: 1217.33,
      netPay: 3209.33,
      status: 'approved',
      payDate: '2024-01-31',
      workingDays: 22,
      absenceDays: 0,
      overtimeHours: 15
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      department: 'Design',
      position: 'Designer UX/UI',
      payPeriod: '2024-01',
      baseSalary: 3750.00, // 45000/12
      overtime: 0,
      bonuses: 200.00,
      deductions: 50.00,
      grossPay: 3900.00,
      taxes: 780.00,
      socialCharges: 858.00,
      netPay: 2262.00,
      status: 'calculated',
      workingDays: 21,
      absenceDays: 1,
      overtimeHours: 0
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: 'Pierre Martin',
      department: 'Commercial',
      position: 'Commercial Senior',
      payPeriod: '2024-01',
      baseSalary: 3333.33, // 40000/12
      overtime: 0,
      bonuses: 800.00,
      deductions: 0,
      grossPay: 4133.33,
      taxes: 826.67,
      socialCharges: 909.33,
      netPay: 2397.33,
      status: 'draft',
      workingDays: 22,
      absenceDays: 0,
      overtimeHours: 0
    }
  ]);

  const [payrollSummaries, setPayrollSummaries] = useState<PayrollSummary[]>([
    {
      period: '2024-01',
      totalEmployees: 3,
      totalGrossPay: 13566.66,
      totalNetPay: 7868.66,
      totalTaxes: 2713.34,
      totalSocialCharges: 2984.66,
      status: 'in-progress'
    },
    {
      period: '2023-12',
      totalEmployees: 3,
      totalGrossPay: 12800.00,
      totalNetPay: 7424.00,
      totalTaxes: 2560.00,
      totalSocialCharges: 2816.00,
      status: 'paid',
      payDate: '2023-12-31'
    }
  ]);

  const [salaryComponents, setSalaryComponents] = useState<SalaryComponent[]>([
    {
      id: 1,
      name: 'Salaire de Base',
      type: 'fixed',
      category: 'salary',
      isActive: true,
      description: 'Salaire mensuel de base'
    },
    {
      id: 2,
      name: 'Heures Supplémentaires',
      type: 'variable',
      category: 'salary',
      percentage: 125,
      isActive: true,
      description: 'Majoration de 25% sur le taux horaire'
    },
    {
      id: 3,
      name: 'Prime de Performance',
      type: 'variable',
      category: 'bonus',
      isActive: true,
      description: 'Prime basée sur les objectifs atteints'
    },
    {
      id: 4,
      name: 'Indemnité Transport',
      type: 'fixed',
      category: 'allowance',
      amount: 75.00,
      isActive: true,
      description: 'Remboursement transport en commun'
    },
    {
      id: 5,
      name: 'Impôt sur le Revenu',
      type: 'deduction',
      category: 'tax',
      percentage: 20,
      isActive: true,
      description: 'Prélèvement à la source'
    },
    {
      id: 6,
      name: 'Cotisations Sociales',
      type: 'deduction',
      category: 'social',
      percentage: 22,
      isActive: true,
      description: 'Cotisations salariales'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'calculated': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'calculated': return 'Calculé';
      case 'approved': return 'Approuvé';
      case 'paid': return 'Payé';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'calculated': return <Calculator className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'paid': return <DollarSign className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'salary': return 'bg-blue-100 text-blue-800';
      case 'bonus': return 'bg-green-100 text-green-800';
      case 'allowance': return 'bg-purple-100 text-purple-800';
      case 'tax': return 'bg-red-100 text-red-800';
      case 'social': return 'bg-orange-100 text-orange-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentSummary = payrollSummaries.find(s => s.period === selectedPeriod);
  const currentEntries = payrollEntries.filter(e => e.payPeriod === selectedPeriod);

  const payrollStats = {
    totalEmployees: currentEntries.length,
    totalGross: currentEntries.reduce((sum, entry) => sum + entry.grossPay, 0),
    totalNet: currentEntries.reduce((sum, entry) => sum + entry.netPay, 0),
    avgSalary: currentEntries.length > 0 ? currentEntries.reduce((sum, entry) => sum + entry.netPay, 0) / currentEntries.length : 0,
    pendingApproval: currentEntries.filter(e => e.status === 'calculated').length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion de la Paie</h2>
          <p className="text-slate-600">Calcul et gestion des salaires et charges sociales</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="2024-01">Janvier 2024</option>
            <option value="2023-12">Décembre 2023</option>
            <option value="2023-11">Novembre 2023</option>
          </select>
          <ExportButtons 
            data={currentEntries} 
            type="payroll" 
            title="Exporter Paie"
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors">
            <Calculator className="w-4 h-4 mr-2" />
            Calculer Paie
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Paie
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Employés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{payrollStats.totalEmployees}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Masse Salariale Brute</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">€{Math.round(payrollStats.totalGross).toLocaleString()}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Masse Salariale Nette</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">€{Math.round(payrollStats.totalNet).toLocaleString()}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Salaire Moyen</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">€{Math.round(payrollStats.avgSalary).toLocaleString()}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Attente</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{payrollStats.pendingApproval}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Period Summary */}
      {currentSummary && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Résumé de la Période - {selectedPeriod}</h3>
            <span className={`px-3 py-1 text-sm font-medium rounded flex items-center ${getStatusColor(currentSummary.status)}`}>
              {getStatusIcon(currentSummary.status)}
              <span className="ml-1">{getStatusText(currentSummary.status)}</span>
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">€{Math.round(currentSummary.totalGrossPay).toLocaleString()}</div>
              <div className="text-sm text-slate-600">Total Brut</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">€{Math.round(currentSummary.totalNetPay).toLocaleString()}</div>
              <div className="text-sm text-slate-600">Total Net</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">€{Math.round(currentSummary.totalTaxes).toLocaleString()}</div>
              <div className="text-sm text-slate-600">Total Impôts</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">€{Math.round(currentSummary.totalSocialCharges).toLocaleString()}</div>
              <div className="text-sm text-slate-600">Charges Sociales</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'payroll', name: 'Fiches de Paie', icon: FileText },
            { id: 'components', name: 'Composants Salariaux', icon: Calculator },
            { id: 'reports', name: 'Rapports', icon: TrendingUp },
            { id: 'exports', name: 'Exports', icon: Download }
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

        {activeTab === 'payroll' && (
          <div className="space-y-4">
            {currentEntries.map((entry) => (
              <div key={entry.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{entry.employeeName}</h4>
                      <span className="text-sm text-slate-600">{entry.position}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(entry.status)}`}>
                        {getStatusIcon(entry.status)}
                        <span className="ml-1">{getStatusText(entry.status)}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm text-slate-600 mb-3">
                      <div>
                        <span className="font-medium">Salaire de base:</span>
                        <div className="text-slate-900">€{entry.baseSalary.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Heures sup:</span>
                        <div className="text-slate-900">€{entry.overtime.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Primes:</span>
                        <div className="text-slate-900">€{entry.bonuses.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Brut:</span>
                        <div className="text-slate-900 font-medium">€{entry.grossPay.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Charges:</span>
                        <div className="text-red-600">-€{(entry.taxes + entry.socialCharges).toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="font-medium">Net:</span>
                        <div className="text-green-600 font-bold">€{entry.netPay.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Jours travaillés:</span> {entry.workingDays}
                      </div>
                      <div>
                        <span className="font-medium">Absences:</span> {entry.absenceDays}
                      </div>
                      <div>
                        <span className="font-medium">Heures sup:</span> {entry.overtimeHours}h
                      </div>
                      {entry.payDate && (
                        <div>
                          <span className="font-medium">Date de paie:</span> {entry.payDate}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => setSelectedEntry(entry)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <ExportButtons 
                      data={[entry]} 
                      type="payroll" 
                      className="scale-75"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-slate-900">Composants Salariaux</h4>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Composant
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {salaryComponents.map((component) => (
                <div key={component.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-slate-900">{component.name}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(component.category)}`}>
                        {component.category}
                      </span>
                      <span className={`w-3 h-3 rounded-full ${component.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-2">{component.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 capitalize">{component.type}</span>
                    <div className="font-medium text-slate-900">
                      {component.amount && `€${component.amount.toLocaleString()}`}
                      {component.percentage && `${component.percentage}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Évolution Masse Salariale</h4>
                <div className="space-y-3">
                  {[
                    { month: 'Nov 2023', amount: 12200 },
                    { month: 'Déc 2023', amount: 12800 },
                    { month: 'Jan 2024', amount: 13567 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{item.month}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(item.amount / 15000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900 w-20 text-right">
                          €{item.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Répartition par Département</h4>
                <div className="space-y-3">
                  {[
                    { dept: 'Technique', amount: 5533, employees: 1, color: 'bg-blue-500' },
                    { dept: 'Design', amount: 3900, employees: 1, color: 'bg-purple-500' },
                    { dept: 'Commercial', amount: 4133, employees: 1, color: 'bg-green-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                        <span className="text-sm font-medium text-slate-700">{item.dept}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900">€{item.amount.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">{item.employees} employé(s)</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-4">Charges Sociales et Fiscales</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-xl font-bold text-red-600">€{Math.round(payrollStats.totalGross * 0.2).toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Impôts sur le Revenu</div>
                  <div className="text-xs text-slate-500">20% du brut</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-xl font-bold text-orange-600">€{Math.round(payrollStats.totalGross * 0.22).toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Cotisations Sociales</div>
                  <div className="text-xs text-slate-500">22% du brut</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-xl font-bold text-purple-600">€{Math.round(payrollStats.totalGross * 0.42).toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Total Charges</div>
                  <div className="text-xs text-slate-500">42% du brut</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exports' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-medium text-slate-900 mb-2">Fiches de Paie PDF</h4>
                <p className="text-sm text-slate-600 mb-4">Générer les fiches de paie individuelles</p>
                <ExportButtons 
                  data={currentEntries} 
                  type="payroll" 
                  className="justify-center"
                />
              </div>

              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <Download className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-medium text-slate-900 mb-2">Export Comptable</h4>
                <p className="text-sm text-slate-600 mb-4">Export pour logiciel comptable</p>
                <ExportButtons 
                  data={currentEntries} 
                  type="payroll" 
                  className="justify-center"
                />
              </div>

              <div className="bg-slate-50 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-medium text-slate-900 mb-2">Déclarations Sociales</h4>
                <p className="text-sm text-slate-600 mb-4">Export pour organismes sociaux</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Export DSN
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-4">Historique des Exports</h4>
              <div className="space-y-3">
                {[
                  { type: 'Fiches de Paie PDF', date: '2024-01-31', status: 'Terminé', size: '2.3 MB' },
                  { type: 'Export Comptable', date: '2024-01-31', status: 'Terminé', size: '156 KB' },
                  { type: 'DSN Janvier', date: '2024-01-31', status: 'En cours', size: '-' }
                ].map((export_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{export_.type}</p>
                      <p className="text-sm text-slate-600">{export_.date}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        export_.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {export_.status}
                      </span>
                      <span className="text-sm text-slate-600">{export_.size}</span>
                      {export_.status === 'Terminé' && (
                        <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payroll Entry Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Fiche de Paie - {selectedEntry.employeeName}
                  </h3>
                  <p className="text-slate-600">{selectedEntry.position} • {selectedEntry.payPeriod}</p>
                </div>
                <button 
                  onClick={() => setSelectedEntry(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Éléments de Rémunération</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Salaire de base:</span>
                      <span className="text-slate-900">€{selectedEntry.baseSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Heures supplémentaires:</span>
                      <span className="text-slate-900">€{selectedEntry.overtime.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Primes et bonus:</span>
                      <span className="text-slate-900">€{selectedEntry.bonuses.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Déductions:</span>
                      <span className="text-red-600">-€{selectedEntry.deductions.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-900">Total Brut:</span>
                        <span className="text-slate-900">€{selectedEntry.grossPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Charges et Cotisations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Impôt sur le revenu:</span>
                      <span className="text-red-600">-€{selectedEntry.taxes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cotisations sociales:</span>
                      <span className="text-red-600">-€{selectedEntry.socialCharges.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-900">Total Charges:</span>
                        <span className="text-red-600">-€{(selectedEntry.taxes + selectedEntry.socialCharges).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="border-t border-slate-200 pt-2 mt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span className="text-slate-900">Net à Payer:</span>
                        <span className="text-green-600">€{selectedEntry.netPay.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Détails de Présence</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600">Jours travaillés:</span>
                    <p className="text-slate-900 font-medium">{selectedEntry.workingDays} jours</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Jours d'absence:</span>
                    <p className="text-slate-900 font-medium">{selectedEntry.absenceDays} jours</p>
                  </div>
                  <div>
                    <span className="text-slate-600">Heures supplémentaires:</span>
                    <p className="text-slate-900 font-medium">{selectedEntry.overtimeHours} heures</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Modifier
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Approuver
                </button>
                <ExportButtons 
                  data={[selectedEntry]} 
                  type="payroll" 
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement;