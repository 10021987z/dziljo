import React, { useState } from 'react';
import { DollarSign, Calendar, TrendingUp, Users, Download, Printer, Calculator, ChevronLeft, ChevronRight, Filter, Search, ArrowUp, ArrowDown, Plus, X, Save } from 'lucide-react';
import PayrollSummaryCard from './PayrollSummaryCard';
import PayrollCalculator from './PayrollCalculator';

const PayrollDashboard: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showNewPayrollModal, setShowNewPayrollModal] = useState(false);
  const [newPayrollData, setNewPayrollData] = useState({
    employeeName: '',
    department: '',
    position: '',
    payPeriod: new Date().toISOString().slice(0, 7),
    baseSalary: 0,
    overtime: 0,
    bonuses: 0,
    deductions: 0
  });

  // Sample data
  const payrollData = {
    totalEmployees: 47,
    totalGrossSalary: 235000,
    totalNetSalary: 165000,
    averageSalary: 3510,
    changeFromLastMonth: 2.5,
    topEarners: [
      { name: 'Sophie Martin', position: 'Directrice Technique', salary: 6500 },
      { name: 'Thomas Dubois', position: 'Directeur Commercial', salary: 6200 },
      { name: 'Marie Rousseau', position: 'Responsable RH', salary: 5800 }
    ],
    departmentBreakdown: [
      { name: 'Technique', employees: 18, totalSalary: 72000, avgSalary: 4000, color: 'bg-blue-500' },
      { name: 'Commercial', employees: 12, totalSalary: 48000, avgSalary: 4000, color: 'bg-green-500' },
      { name: 'Administration', employees: 8, totalSalary: 28000, avgSalary: 3500, color: 'bg-purple-500' },
      { name: 'RH', employees: 5, totalSalary: 17500, avgSalary: 3500, color: 'bg-orange-500' },
      { name: 'Autres', employees: 4, totalSalary: 12000, avgSalary: 3000, color: 'bg-gray-500' }
    ],
    recentPayrolls: [
      { id: 1, period: 'Janvier 2024', processedDate: '31/01/2024', status: 'Terminé', employees: 47, totalAmount: 165000 },
      { id: 2, period: 'Décembre 2023', processedDate: '31/12/2023', status: 'Terminé', employees: 46, totalAmount: 161000 },
      { id: 3, period: 'Novembre 2023', processedDate: '30/11/2023', status: 'Terminé', employees: 45, totalAmount: 157500 }
    ],
    upcomingPayments: [
      { id: 1, name: 'Cotisations URSSAF', dueDate: '15/02/2024', amount: 105750 },
      { id: 2, name: 'Prélèvement à la source', dueDate: '15/02/2024', amount: 47000 },
      { id: 3, name: 'Cotisations retraite', dueDate: '20/02/2024', amount: 35250 }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentMonth(newDate);
  };

  const getCurrentPeriod = () => {
    return `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  };

  const handleCalculatorSave = (payrollData: any) => {
    console.log('Payroll data saved:', payrollData);
    setShowCalculator(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Calcul de paie effectué avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleNewPayrollSave = () => {
    // Simulate saving new payroll
    console.log('New payroll created:', newPayrollData);
    
    // Reset form
    setNewPayrollData({
      employeeName: '',
      department: '',
      position: '',
      payPeriod: new Date().toISOString().slice(0, 7),
      baseSalary: 0,
      overtime: 0,
      bonuses: 0,
      deductions: 0
    });
    
    setShowNewPayrollModal(false);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Nouvelle paie créée avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tableau de Bord Paie</h2>
          <p className="text-slate-600">Vue d'ensemble de la gestion de la paie</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex items-center bg-white border border-slate-300 rounded-lg overflow-hidden">
            <button
              onClick={() => navigateMonth('prev')}
              className="px-3 py-2 hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 font-medium">
              {currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="px-3 py-2 hover:bg-slate-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setShowCalculator(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculateur de Paie
          </button>
          <button 
            onClick={() => setShowNewPayrollModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Paie
          </button>
        </div>
      </div>

      {/* Payroll Summary Card */}
      <PayrollSummaryCard 
        period={getCurrentPeriod()}
        totalEmployees={payrollData.totalEmployees}
        totalGrossSalary={payrollData.totalGrossSalary}
        totalNetSalary={payrollData.totalNetSalary}
        averageSalary={payrollData.averageSalary}
        changeFromLastMonth={payrollData.changeFromLastMonth}
        onCalculateClick={() => setShowCalculator(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Répartition par Département
          </h3>
          <div className="space-y-4">
            {payrollData.departmentBreakdown.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3 w-1/3">
                  <div className={`w-3 h-3 rounded-full ${dept.color}`}></div>
                  <span className="font-medium text-slate-900">{dept.name}</span>
                </div>
                <div className="w-1/3 px-4">
                  <div className="flex items-center">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${dept.color} h-2 rounded-full`}
                        style={{ width: `${(dept.totalSalary / payrollData.totalNetSalary) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="w-1/3 text-right">
                  <div className="text-sm font-medium text-slate-900">{formatCurrency(dept.totalSalary)}</div>
                  <div className="text-xs text-slate-500">{dept.employees} employés • {formatCurrency(dept.avgSalary)}/emp</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Earners */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Top Salaires
          </h3>
          <div className="space-y-4">
            {payrollData.topEarners.map((employee, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{employee.name}</p>
                    <p className="text-sm text-slate-600">{employee.position}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{formatCurrency(employee.salary)}</p>
                  <p className="text-xs text-slate-500">Net mensuel</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payrolls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-600" />
            Paies Récentes
          </h3>
          <div className="space-y-3">
            {payrollData.recentPayrolls.map((payroll) => (
              <div key={payroll.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{payroll.period}</p>
                  <p className="text-xs text-slate-500">Traité le {payroll.processedDate}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-900">{payroll.employees} employés</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-900">{formatCurrency(payroll.totalAmount)}</p>
                  <div className="flex items-center justify-end mt-1">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mr-2">
                      {payroll.status}
                    </span>
                    <button className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
            Paiements à Venir
          </h3>
          <div className="space-y-3">
            {payrollData.upcomingPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{payment.name}</p>
                  <p className="text-xs text-slate-500">Échéance: {payment.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-red-600">{formatCurrency(payment.amount)}</p>
                  <button className="text-xs text-blue-600 hover:text-blue-700 mt-1">
                    Préparer le paiement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex flex-col items-center text-center">
            <Calculator className="w-8 h-8 text-blue-600 mb-2" />
            <span className="font-medium text-slate-900">Calculer une Paie</span>
            <span className="text-xs text-slate-600 mt-1">Calcul individuel</span>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <span className="font-medium text-slate-900">Paie en Masse</span>
            <span className="text-xs text-slate-600 mt-1">Tous les employés</span>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex flex-col items-center text-center">
            <Download className="w-8 h-8 text-purple-600 mb-2" />
            <span className="font-medium text-slate-900">Exporter</span>
            <span className="text-xs text-slate-600 mt-1">PDF, Excel, DSN</span>
          </button>
          
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors flex flex-col items-center text-center">
            <Printer className="w-8 h-8 text-orange-600 mb-2" />
            <span className="font-medium text-slate-900">Imprimer</span>
            <span className="text-xs text-slate-600 mt-1">Fiches de paie</span>
          </button>
        </div>
      </div>

      {/* Payroll Calculator Modal */}
      <PayrollCalculator 
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onSave={handleCalculatorSave}
        employeeData={selectedEmployee}
      />
    </div>
  );
};

export default PayrollDashboard;