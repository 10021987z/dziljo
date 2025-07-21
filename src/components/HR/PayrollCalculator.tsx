import React, { useState, useEffect } from 'react';
import { X, Calculator, DollarSign, Clock, User, AlertCircle, CheckCircle, Plus, Minus, Save, Eye, Calendar } from 'lucide-react';

interface PayrollCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payrollData: any) => void;
  employeeData?: any;
}

interface PayrollComponent {
  id: string;
  name: string;
  type: 'earning' | 'deduction' | 'tax';
  amount: number;
  isPercentage: boolean;
  isRequired: boolean;
  category: string;
}

interface PayrollCalculation {
  grossPay: number;
  totalEarnings: number;
  totalDeductions: number;
  totalTaxes: number;
  netPay: number;
  employerCharges: number;
  totalCost: number;
}

const PayrollCalculator: React.FC<PayrollCalculatorProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeData
}) => {
  const [employeeName, setEmployeeName] = useState('');
  const [baseSalary, setBaseSalary] = useState(0);
  const [workingDays, setWorkingDays] = useState(22);
  const [absenceDays, setAbsenceDays] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(1.25);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [components, setComponents] = useState<PayrollComponent[]>([]);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [payPeriod, setPayPeriod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Initialiser les composants par défaut
  useEffect(() => {
    const defaultComponents: PayrollComponent[] = [
      {
        id: 'base_salary',
        name: 'Salaire de Base',
        type: 'earning',
        amount: baseSalary,
        isPercentage: false,
        isRequired: true,
        category: 'Salaire'
      },
      {
        id: 'overtime',
        name: 'Heures Supplémentaires',
        type: 'earning',
        amount: 0,
        isPercentage: false,
        isRequired: false,
        category: 'Salaire'
      },
      {
        id: 'income_tax',
        name: 'Impôt sur le Revenu',
        type: 'tax',
        amount: 20,
        isPercentage: true,
        isRequired: true,
        category: 'Impôts'
      },
      {
        id: 'social_charges',
        name: 'Cotisations Sociales',
        type: 'deduction',
        amount: 22,
        isPercentage: true,
        isRequired: true,
        category: 'Charges Sociales'
      }
    ];
    
    setComponents(defaultComponents);
    
    // Initialiser la période de paie au mois courant
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    setPayPeriod(`${year}-${month}`);
  }, []);

  // Mettre à jour les composants quand le salaire de base change
  useEffect(() => {
    setComponents(prev => prev.map(comp => 
      comp.id === 'base_salary' 
        ? { ...comp, amount: baseSalary }
        : comp
    ));
  }, [baseSalary]);

  // Mettre à jour les heures supplémentaires
  useEffect(() => {
    if (hourlyRate > 0 && overtimeHours > 0) {
      const overtimeAmount = overtimeHours * hourlyRate * overtimeRate;
      setComponents(prev => prev.map(comp => 
        comp.id === 'overtime' 
          ? { ...comp, amount: overtimeAmount }
          : comp
      ));
    } else {
      setComponents(prev => prev.map(comp => 
        comp.id === 'overtime' 
          ? { ...comp, amount: 0 }
          : comp
      ));
    }
  }, [hourlyRate, overtimeHours, overtimeRate]);

  // Calculer la paie quand les données changent
  useEffect(() => {
    calculatePayroll();
  }, [baseSalary, workingDays, absenceDays, overtimeHours, components]);

  // Initialiser avec les données de l'employé si fournies
  useEffect(() => {
    if (employeeData) {
      setEmployeeName(`${employeeData.firstName} ${employeeData.lastName}`);
      setBaseSalary(employeeData.baseSalary);
      setHourlyRate(employeeData.hourlyRate);
    }
  }, [employeeData]);

  const calculatePayroll = () => {
    const errors: string[] = [];

    // Validation
    if (baseSalary <= 0) errors.push('Le salaire de base doit être supérieur à 0');
    if (workingDays <= 0) errors.push('Le nombre de jours travaillés doit être supérieur à 0');
    if (absenceDays < 0) errors.push('Le nombre de jours d\'absence ne peut pas être négatif');
    if (workingDays + absenceDays > 31) errors.push('Le total des jours ne peut pas dépasser 31');
    if (!payPeriod) errors.push('La période de paie est requise');

    setErrors(errors);

    if (errors.length > 0) return;

    // Calcul du salaire proratisé
    const workingRatio = workingDays / 22; // 22 jours ouvrés standard
    const baseSalaryProrated = baseSalary * workingRatio;

    // Calcul des gains
    const earnings = components
      .filter(comp => comp.type === 'earning')
      .reduce((total, comp) => {
        if (comp.id === 'base_salary') {
          return total + baseSalaryProrated;
        }
        return total + comp.amount;
      }, 0);

    const totalEarnings = earnings;
    const grossPay = totalEarnings;

    // Calcul des déductions (pourcentages appliqués sur le brut)
    const deductions = components
      .filter(comp => comp.type === 'deduction')
      .reduce((total, comp) => {
        const amount = comp.isPercentage 
          ? (grossPay * comp.amount / 100)
          : comp.amount;
        return total + amount;
      }, 0);

    // Calcul des impôts (pourcentages appliqués sur le brut)
    const taxes = components
      .filter(comp => comp.type === 'tax')
      .reduce((total, comp) => {
        const amount = comp.isPercentage 
          ? (grossPay * comp.amount / 100)
          : comp.amount;
        return total + amount;
      }, 0);

    const totalDeductions = deductions;
    const totalTaxes = taxes;
    const netPay = grossPay - totalDeductions - totalTaxes;

    // Charges patronales (approximation)
    const employerCharges = grossPay * 0.42; // 42% de charges patronales
    const totalCost = grossPay + employerCharges;

    setCalculation({
      grossPay,
      totalEarnings,
      totalDeductions,
      totalTaxes,
      netPay,
      employerCharges,
      totalCost
    });
  };

  const addComponent = () => {
    const newComponent: PayrollComponent = {
      id: `custom_${Date.now()}`,
      name: '',
      type: 'earning',
      amount: 0,
      isPercentage: false,
      isRequired: false,
      category: 'Personnalisé'
    };
    setComponents([...components, newComponent]);
  };

  const updateComponent = (id: string, field: keyof PayrollComponent, value: any) => {
    setComponents(prev => prev.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ));
  };

  const removeComponent = (id: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== id && !comp.isRequired));
  };

  const handleSave = () => {
    if (errors.length > 0) return;

    setIsSubmitting(true);

    const payrollData = {
      employeeName,
      baseSalary,
      workingDays,
      absenceDays,
      overtimeHours,
      hourlyRate,
      payPeriod,
      components: components.filter(comp => comp.amount > 0 || comp.isRequired),
      calculation,
      date: new Date().toISOString()
    };

    // Simuler un délai de traitement
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessMessage(true);
      
      // Attendre un peu avant de fermer
      setTimeout(() => {
        if (onSave) onSave(payrollData);
        onClose();
        resetForm();
      }, 1500);
    }, 1000);
  };

  const resetForm = () => {
    setEmployeeName('');
    setBaseSalary(0);
    setWorkingDays(22);
    setAbsenceDays(0);
    setOvertimeHours(0);
    setHourlyRate(0);
    setCalculation(null);
    setErrors([]);
    setShowSuccessMessage(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Calculateur de Paie</h3>
                <p className="text-slate-600">Simulez et calculez une fiche de paie</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {showSuccessMessage ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Calcul Effectué avec Succès !</h2>
            <p className="text-slate-600 mb-6">
              Le calcul de paie a été effectué et enregistré.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
                <User className="w-4 h-4 mr-2" />
                {employeeName}
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Net à payer: {calculation ? formatCurrency(calculation.netPay) : '0,00 €'}
              </div>
            </div>
          </div>
        ) : isSubmitting ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-t-green-600 border-green-200 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Calcul en cours...</h2>
            <p className="text-slate-600">Nous effectuons les calculs de paie</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Erreurs */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-medium text-red-900">Erreurs de validation</h4>
                </div>
                <ul className="list-disc list-inside text-sm text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations de base */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations de Base
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom de l'Employé
                      </label>
                      <input
                        type="text"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom de l'employé"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Période de Paie
                      </label>
                      <input
                        type="month"
                        value={payPeriod}
                        onChange={(e) => setPayPeriod(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Salaire Mensuel Brut
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="number"
                          value={baseSalary}
                          onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                          step="100"
                          min="0"
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 3000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Taux Horaire
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                          step="0.01"
                          min="0"
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 20.50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Jours Travaillés
                      </label>
                      <input
                        type="number"
                        value={workingDays}
                        onChange={(e) => setWorkingDays(parseInt(e.target.value) || 0)}
                        min="0"
                        max="31"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Jours d'Absence
                      </label>
                      <input
                        type="number"
                        value={absenceDays}
                        onChange={(e) => setAbsenceDays(parseInt(e.target.value) || 0)}
                        min="0"
                        max="31"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Heures Supplémentaires
                      </label>
                      <input
                        type="number"
                        value={overtimeHours}
                        onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Taux Majoration Heures Sup.
                      </label>
                      <select
                        value={overtimeRate}
                        onChange={(e) => setOvertimeRate(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={1.25}>25% (1.25)</option>
                        <option value={1.5}>50% (1.5)</option>
                        <option value={2}>100% (2.0)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Composants de paie */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-slate-900 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Composants de Paie
                    </h4>
                    <button
                      onClick={addComponent}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </button>
                  </div>

                  <div className="space-y-3">
                    {components.map((component) => (
                      <div key={component.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                        <div className="flex-1">
                          {component.id.startsWith('custom_') ? (
                            <input
                              type="text"
                              value={component.name}
                              onChange={(e) => updateComponent(component.id, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Nom du composant"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-slate-900">{component.name}</span>
                              {component.isRequired && (
                                <span className="text-xs text-red-600">*</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {component.id.startsWith('custom_') && (
                          <select
                            value={component.type}
                            onChange={(e) => updateComponent(component.id, 'type', e.target.value)}
                            className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="earning">Gain</option>
                            <option value="deduction">Déduction</option>
                            <option value="tax">Impôt</option>
                          </select>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={component.amount}
                            onChange={(e) => updateComponent(component.id, 'amount', parseFloat(e.target.value) || 0)}
                            step="0.01"
                            min="0"
                            className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            disabled={component.id === 'base_salary' || component.id === 'overtime'}
                          />
                          
                          {component.id.startsWith('custom_') ? (
                            <select
                              value={component.isPercentage ? 'percentage' : 'fixed'}
                              onChange={(e) => updateComponent(component.id, 'isPercentage', e.target.value === 'percentage')}
                              className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="fixed">€</option>
                              <option value="percentage">%</option>
                            </select>
                          ) : (
                            <span className="text-sm text-slate-600">
                              {component.isPercentage ? '%' : '€'}
                            </span>
                          )}
                          
                          {!component.isRequired && (
                            <button
                              onClick={() => removeComponent(component.id)}
                              className="p-1 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Résultats */}
              <div className="space-y-6">
                {calculation && (
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Résultats
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm font-medium text-green-800">Total Gains</span>
                        <span className="font-bold text-green-900">{formatCurrency(calculation.totalEarnings)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                        <span className="text-sm font-medium text-blue-800">Salaire Brut</span>
                        <span className="font-bold text-blue-900">{formatCurrency(calculation.grossPay)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-orange-50 rounded">
                        <span className="text-sm font-medium text-orange-800">Déductions</span>
                        <span className="font-bold text-orange-900">-{formatCurrency(calculation.totalDeductions)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                        <span className="text-sm font-medium text-red-800">Impôts</span>
                        <span className="font-bold text-red-900">-{formatCurrency(calculation.totalTaxes)}</span>
                      </div>
                      
                      <div className="border-t border-slate-200 pt-2">
                        <div className="flex justify-between items-center p-2 bg-slate-100 rounded">
                          <span className="text-sm font-medium text-slate-800">Salaire Net</span>
                          <span className="font-bold text-slate-900 text-lg">{formatCurrency(calculation.netPay)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <h5 className="text-sm font-medium text-slate-700 mb-2">Coûts Employeur</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Charges patronales</span>
                            <span className="text-slate-900">{formatCurrency(calculation.employerCharges)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span className="text-slate-700">Coût total</span>
                            <span className="text-slate-900">{formatCurrency(calculation.totalCost)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900">Calcul en Temps Réel</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Les calculs sont mis à jour automatiquement lorsque vous modifiez les valeurs.
                        Vous pouvez ajouter des composants personnalisés pour des calculs plus précis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-yellow-900">Simulation Uniquement</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Ce calculateur est fourni à titre indicatif. Pour des calculs officiels, 
                        veuillez utiliser le module complet de paie ou consulter un expert-comptable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={calculatePayroll}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Recalculer
              </button>
              <button
                onClick={handleSave}
                disabled={!calculation || errors.length > 0}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollCalculator;