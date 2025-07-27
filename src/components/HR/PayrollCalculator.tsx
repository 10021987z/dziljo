import React, { useState } from 'react';
import { Calculator, Save, X, DollarSign, Users, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { useFirebaseCollection } from '../../hooks/useFirebase';

interface PayrollCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payrollData: any) => void;
  employeeData?: any;
}

const PayrollCalculator: React.FC<PayrollCalculatorProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeData
}) => {
  const [formData, setFormData] = useState({
    employeeId: employeeData?.id || '',
    employeeName: employeeData?.name || '',
    department: employeeData?.department || '',
    position: employeeData?.position || '',
    payPeriod: new Date().toISOString().slice(0, 7), // YYYY-MM format
    baseSalary: employeeData?.baseSalary || 0,
    overtime: 0,
    bonuses: 0,
    deductions: 0,
    workingDays: 22,
    absenceDays: 0,
    overtimeHours: 0,
    taxRate: 20, // 20% par défaut
    socialChargesRate: 22 // 22% par défaut
  });

  const [calculatedValues, setCalculatedValues] = useState({
    grossPay: 0,
    taxes: 0,
    socialCharges: 0,
    netPay: 0
  });

  const { create: createPayroll } = useFirebaseCollection('payroll');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericValue = ['baseSalary', 'overtime', 'bonuses', 'deductions', 'workingDays', 'absenceDays', 'overtimeHours', 'taxRate', 'socialChargesRate'].includes(name) 
      ? parseFloat(value) || 0 
      : value;

    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  // Recalculate when form data changes
  React.useEffect(() => {
    const grossPay = formData.baseSalary + formData.overtime + formData.bonuses - formData.deductions;
    const taxes = grossPay * (formData.taxRate / 100);
    const socialCharges = grossPay * (formData.socialChargesRate / 100);
    const netPay = grossPay - taxes - socialCharges;

    setCalculatedValues({
      grossPay,
      taxes,
      socialCharges,
      netPay
    });
  }, [formData]);

  const handleSave = async () => {
    try {
      const payrollData = {
        ...formData,
        ...calculatedValues,
        calculatedAt: new Date().toISOString(),
        status: 'calculated'
      };

      await createPayroll(payrollData);
      onSave(payrollData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Calculateur de Paie</h1>
                <p className="text-white/80">Calculez précisément les salaires et charges</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Informations Employé
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom de l'employé</label>
                    <input
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nom complet"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Département</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Département"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Poste</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Poste"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Période de paie</label>
                    <input
                      type="month"
                      name="payPeriod"
                      value={formData.payPeriod}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Éléments de Rémunération
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Salaire de base (€)</label>
                    <input
                      type="number"
                      name="baseSalary"
                      value={formData.baseSalary}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="3500"
                      step="0.01"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Heures supplémentaires (€)</label>
                      <input
                        type="number"
                        name="overtime"
                        value={formData.overtime}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Primes et bonus (€)</label>
                      <input
                        type="number"
                        name="bonuses"
                        value={formData.bonuses}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Déductions (€)</label>
                    <input
                      type="number"
                      name="deductions"
                      value={formData.deductions}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                  Détails de Présence
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Jours travaillés</label>
                    <input
                      type="number"
                      name="workingDays"
                      value={formData.workingDays}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="31"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Jours d'absence</label>
                    <input
                      type="number"
                      name="absenceDays"
                      value={formData.absenceDays}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="31"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Heures sup.</label>
                    <input
                      type="number"
                      name="overtimeHours"
                      value={formData.overtimeHours}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                  Taux de Charges
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Taux d'imposition (%)</label>
                    <input
                      type="number"
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Charges sociales (%)</label>
                    <input
                      type="number"
                      name="socialChargesRate"
                      value={formData.socialChargesRate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-medium text-blue-900 mb-4 flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Résultats du Calcul
                </h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-slate-700">Salaire brut:</span>
                    <span className="text-xl font-bold text-slate-900">
                      {calculatedValues.grossPay.toFixed(2)} €
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-red-700">Impôts sur le revenu:</span>
                      <span className="font-medium text-red-800">
                        -{calculatedValues.taxes.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <span className="text-red-700">Cotisations sociales:</span>
                      <span className="font-medium text-red-800">
                        -{calculatedValues.socialCharges.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-blue-300 pt-4">
                    <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg border border-green-300">
                      <span className="text-green-800 font-medium">Net à payer:</span>
                      <span className="text-2xl font-bold text-green-900">
                        {calculatedValues.netPay.toFixed(2)} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900">Informations Importantes</h4>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• Les taux de charges sont configurables selon la législation</li>
                      <li>• Ce calcul est indicatif et peut nécessiter des ajustements</li>
                      <li>• Vérifiez les conventions collectives applicables</li>
                      <li>• Les heures supplémentaires peuvent avoir des majorations spécifiques</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Répartition des Charges</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Salaire net</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(calculatedValues.netPay / calculatedValues.grossPay) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {((calculatedValues.netPay / calculatedValues.grossPay) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Impôts</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${(calculatedValues.taxes / calculatedValues.grossPay) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {((calculatedValues.taxes / calculatedValues.grossPay) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Charges sociales</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${(calculatedValues.socialCharges / calculatedValues.grossPay) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {((calculatedValues.socialCharges / calculatedValues.grossPay) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Enregistrer le Calcul
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollCalculator;