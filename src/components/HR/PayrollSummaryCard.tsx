import React from 'react';
import { DollarSign, Users, TrendingUp, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface PayrollSummaryCardProps {
  period: string;
  totalEmployees: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  averageSalary: number;
  changeFromLastMonth: number;
  onCalculateClick: () => void;
}

const PayrollSummaryCard: React.FC<PayrollSummaryCardProps> = ({
  period,
  totalEmployees,
  totalGrossSalary,
  totalNetSalary,
  averageSalary,
  changeFromLastMonth,
  onCalculateClick
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMonthName = (periodStr: string) => {
    const [year, month] = periodStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-blue-600" />
          Résumé de la Paie - {getMonthName(period)}
        </h3>
        <button
          onClick={onCalculateClick}
          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center"
        >
          <DollarSign className="w-4 h-4 mr-1" />
          Calculer
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-600">Employés</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{totalEmployees}</div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-600">Masse Brute</span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(totalGrossSalary)}</div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-600">Masse Nette</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(totalNetSalary)}</div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-600">Salaire Moyen</span>
            <div className="flex items-center">
              {changeFromLastMonth >= 0 ? (
                <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-600 mr-1" />
              )}
              <span className={`text-xs ${changeFromLastMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {changeFromLastMonth >= 0 ? '+' : ''}{changeFromLastMonth}%
              </span>
            </div>
          </div>
          <div className="text-xl font-bold text-slate-900">{formatCurrency(averageSalary)}</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
        <div className="text-slate-600">
          Charges patronales estimées: {formatCurrency(totalGrossSalary * 0.45)}
        </div>
        <div className="text-slate-600">
          Coût total: {formatCurrency(totalGrossSalary * 1.45)}
        </div>
      </div>
    </div>
  );
};

export default PayrollSummaryCard;