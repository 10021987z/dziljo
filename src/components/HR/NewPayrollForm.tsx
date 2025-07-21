import React, { useState, useEffect } from 'react';
import { X, Calculator, DollarSign, Clock, User, AlertCircle, CheckCircle, Plus, Minus, Save, Eye, Calendar, FileText, Download, Printer, ChevronRight, ChevronLeft } from 'lucide-react';

interface NewPayrollFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (payrollData: any) => void;
}

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  baseSalary: number;
  hourlyRate: number;
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

const NewPayrollForm: React.FC<NewPayrollFormProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [payPeriod, setPayPeriod] = useState('');
  const [workingDays, setWorkingDays] = useState(22);
  const [absenceDays, setAbsenceDays] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [components, setComponents] = useState<PayrollComponent[]>([]);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Exemple d'employés
  const employees: Employee[] = [
    { id: 1, name: 'Sophie Martin', position: 'Développeur Full Stack Senior', department: 'Technique', baseSalary: 4583.33, hourlyRate: 26.25 },
    { id: 2, name: 'Thomas Dubois', position: 'Designer UX/UI', department: 'Design', baseSalary: 3750.00, hourlyRate: 21.43 },
    { id: 3, name: 'Pierre Martin', position: 'Commercial Senior', department: 'Commercial', baseSalary: 3333.33, hourlyRate: 19.05 }
  ];

  // Composants de paie par défaut
  const defaultComponents: PayrollComponent[] = [
    {
      id: 'base_salary',
      name: 'Salaire de Base',
      type: 'earning',
      amount: 0,
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
      id: 'transport_allowance',
      name: 'Indemnité Transport',
      type: 'earning',
      amount: 75,
      isPercentage: false,
      isRequired: false,
      category: 'Indemnités'
    },
    {
      id: 'meal_vouchers',
      name: 'Tickets Restaurant',
      type: 'earning',
      amount: 110,
      isPercentage: false,
      isRequired: false,
      category: 'Avantages'
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
      name: 'Cotisations Sociales Salariales',
      type: 'deduction',
      amount: 22,
      isPercentage: true,
      isRequired: true,
      category: 'Charges Sociales'
    },
    {
      id: 'unemployment_insurance',
      name: 'Assurance Chômage',
      type: 'deduction',
      amount: 2.4,
      isPercentage: true,
      isRequired: true,
      category: 'Assurances'
    },
    {
      id: 'health_insurance',
      name: 'Mutuelle Santé',
      type: 'deduction',
      amount: 45,
      isPercentage: false,
      isRequired: false,
      category: 'Assurances'
    }
  ];

  // Initialiser les composants et la période de paie
  useEffect(() => {
    setComponents(defaultComponents);
    
    // Initialiser la période de paie au mois courant
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    setPayPeriod(`${year}-${month}`);
  }, []);

  // Mettre à jour les composants quand l'employé change
  useEffect(() => {
    if (selectedEmployee) {
      // Mettre à jour le salaire de base
      setComponents(prev => prev.map(comp => 
        comp.id === 'base_salary' 
          ? { ...comp, amount: selectedEmployee.baseSalary }
          : comp
      ));
      
      // Calculer les heures supplémentaires
      const overtimeAmount = overtimeHours * selectedEmployee.hourlyRate * 1.25;
      setComponents(prev => prev.map(comp => 
        comp.id === 'overtime' 
          ? { ...comp, amount: overtimeAmount }
          : comp
      ));
    }
  }, [selectedEmployee, overtimeHours]);

  // Calculer la paie quand les données changent
  useEffect(() => {
    if (selectedEmployee) {
      calculatePayroll();
    }
  }, [selectedEmployee, workingDays, absenceDays, overtimeHours, components]);

  const calculatePayroll = () => {
    if (!selectedEmployee) return;

    const errors: string[] = [];

    // Validation
    if (!payPeriod) errors.push('Période de paie requise');
    if (workingDays <= 0) errors.push('Nombre de jours travaillés invalide');
    if (absenceDays < 0) errors.push('Nombre de jours d\'absence invalide');
    if (workingDays + absenceDays > 31) errors.push('Total des jours ne peut pas dépasser 31');

    setErrors(errors);

    if (errors.length > 0) return;

    // Calcul du salaire proratisé
    const workingRatio = workingDays / 22; // 22 jours ouvrés standard
    const baseSalaryProrated = selectedEmployee.baseSalary * workingRatio;

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

  const addCustomComponent = () => {
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

  const validateStep = (step: number) => {
    const newErrors: string[] = [];
    
    if (step === 1) {
      if (!selectedEmployee) newErrors.push('Veuillez sélectionner un employé');
      if (!payPeriod) newErrors.push('Période de paie requise');
      if (workingDays <= 0) newErrors.push('Nombre de jours travaillés invalide');
      if (absenceDays < 0) newErrors.push('Nombre de jours d\'absence invalide');
      if (workingDays + absenceDays > 31) newErrors.push('Total des jours ne peut pas dépasser 31');
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (!selectedEmployee || !calculation || errors.length > 0) return;

    setIsSubmitting(true);

    const payrollData = {
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department,
      position: selectedEmployee.position,
      payPeriod,
      baseSalary: selectedEmployee.baseSalary,
      workingDays,
      absenceDays,
      overtimeHours,
      components: components.filter(comp => comp.amount > 0 || comp.isRequired),
      calculation,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0]
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
    setSelectedEmployee(null);
    setWorkingDays(22);
    setAbsenceDays(0);
    setOvertimeHours(0);
    setComponents(defaultComponents);
    setCalculation(null);
    setErrors([]);
    setCurrentStep(1);
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

  const getComponentTypeColor = (type: string) => {
    switch (type) {
      case 'earning': return 'bg-green-100 text-green-800';
      case 'deduction': return 'bg-orange-100 text-orange-800';
      case 'tax': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComponentTypeText = (type: string) => {
    switch (type) {
      case 'earning': return 'Gain';
      case 'deduction': return 'Déduction';
      case 'tax': return 'Impôt';
      default: return type;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Nouvelle Fiche de Paie</h3>
                <p className="text-slate-600">Créer une nouvelle fiche de paie en 3 étapes</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Informations de Base', icon: User },
                { step: 2, title: 'Composants de Paie', icon: Calculator },
                { step: 3, title: 'Finalisation', icon: CheckCircle }
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep === step.step 
                        ? 'bg-blue-500 text-white' 
                        : currentStep > step.step 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {currentStep > step.step ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm text-slate-600 text-center">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-slate-200 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {showSuccessMessage ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Fiche de Paie Créée avec Succès !</h2>
            <p className="text-slate-600 mb-6">
              La fiche de paie pour {selectedEmployee?.name} a été créée et enregistrée.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Période: {new Date(payPeriod).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Net à payer: {calculation ? formatCurrency(calculation.netPay) : '0,00 €'}
              </div>
            </div>
          </div>
        ) : isSubmitting ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Création en cours...</h2>
            <p className="text-slate-600">Nous enregistrons la fiche de paie</p>
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

            {/* Step 1: Informations de Base */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations de Base
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Employé <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedEmployee?.id || ''}
                        onChange={(e) => {
                          const employee = employees.find(emp => emp.id === parseInt(e.target.value));
                          setSelectedEmployee(employee || null);
                        }}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner un employé</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Période de Paie <span className="text-red-500">*</span>
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
                        Jours Travaillés <span className="text-red-500">*</span>
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
                        onChange={(e) => setOvertimeHours(parseInt(e.target.value) || 0)}
                        min="0"
                        step="0.5"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {selectedEmployee && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Salaire de base:</strong> {formatCurrency(selectedEmployee.baseSalary)}/mois
                        </p>
                        <p className="text-sm text-blue-800">
                          <strong>Taux horaire:</strong> {formatCurrency(selectedEmployee.hourlyRate)}/h
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedEmployee && (
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Informations Employé</h4>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900">{selectedEmployee.name}</h5>
                        <p className="text-sm text-slate-600">{selectedEmployee.position}</p>
                        <p className="text-sm text-slate-600">{selectedEmployee.department}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Composants de Paie */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-slate-900 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Composants de Paie
                    </h4>
                    <button
                      onClick={addCustomComponent}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un Composant
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2">Gains</h5>
                    <div className="space-y-3">
                      {components
                        .filter(comp => comp.type === 'earning' && !comp.id.startsWith('custom_'))
                        .map((component) => (
                          <div key={component.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-green-300 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-slate-900">{component.name}</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getComponentTypeColor(component.type)}`}>
                                  {getComponentTypeText(component.type)}
                                </span>
                                {component.isRequired && (
                                  <span className="text-xs text-red-600">*</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{component.category}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={component.amount}
                                onChange={(e) => updateComponent(component.id, 'amount', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                                className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                disabled={component.id === 'base_salary' || component.id === 'overtime'}
                              />
                              <span className="text-sm text-slate-600">
                                {component.isPercentage ? '%' : '€'}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    <h5 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2 pt-4">Déductions</h5>
                    <div className="space-y-3">
                      {components
                        .filter(comp => comp.type === 'deduction' && !comp.id.startsWith('custom_'))
                        .map((component) => (
                          <div key={component.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-orange-300 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-slate-900">{component.name}</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getComponentTypeColor(component.type)}`}>
                                  {getComponentTypeText(component.type)}
                                </span>
                                {component.isRequired && (
                                  <span className="text-xs text-red-600">*</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{component.category}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={component.amount}
                                onChange={(e) => updateComponent(component.id, 'amount', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                                className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-sm text-slate-600">
                                {component.isPercentage ? '%' : '€'}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    <h5 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2 pt-4">Impôts</h5>
                    <div className="space-y-3">
                      {components
                        .filter(comp => comp.type === 'tax' && !comp.id.startsWith('custom_'))
                        .map((component) => (
                          <div key={component.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-red-300 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-slate-900">{component.name}</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${getComponentTypeColor(component.type)}`}>
                                  {getComponentTypeText(component.type)}
                                </span>
                                {component.isRequired && (
                                  <span className="text-xs text-red-600">*</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{component.category}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <input
                                type="number"
                                value={component.amount}
                                onChange={(e) => updateComponent(component.id, 'amount', parseFloat(e.target.value) || 0)}
                                step="0.01"
                                min="0"
                                className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                              />
                              <span className="text-sm text-slate-600">
                                {component.isPercentage ? '%' : '€'}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Composants personnalisés */}
                    {components.filter(comp => comp.id.startsWith('custom_')).length > 0 && (
                      <>
                        <h5 className="text-sm font-medium text-slate-700 border-b border-slate-200 pb-2 pt-4">Composants Personnalisés</h5>
                        <div className="space-y-3">
                          {components
                            .filter(comp => comp.id.startsWith('custom_'))
                            .map((component) => (
                              <div key={component.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Nom du composant"
                                    value={component.name}
                                    onChange={(e) => updateComponent(component.id, 'name', e.target.value)}
                                    className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  />
                                  
                                  <select
                                    value={component.type}
                                    onChange={(e) => updateComponent(component.id, 'type', e.target.value)}
                                    className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  >
                                    <option value="earning">Gain</option>
                                    <option value="deduction">Déduction</option>
                                    <option value="tax">Impôt</option>
                                  </select>

                                  <div className="flex items-center space-x-1">
                                    <input
                                      type="number"
                                      placeholder="Montant"
                                      value={component.amount}
                                      onChange={(e) => updateComponent(component.id, 'amount', parseFloat(e.target.value) || 0)}
                                      step="0.01"
                                      min="0"
                                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <select
                                      value={component.isPercentage ? 'percentage' : 'fixed'}
                                      onChange={(e) => updateComponent(component.id, 'isPercentage', e.target.value === 'percentage')}
                                      className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="fixed">€</option>
                                      <option value="percentage">%</option>
                                    </select>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => removeComponent(component.id)}
                                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {calculation && (
                  <div className="bg-white border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Résumé des Calculs
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
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Finalisation */}
            {currentStep === 3 && calculation && (
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-medium text-slate-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Aperçu de la Fiche de Paie
                    </h4>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
                        <Printer className="w-4 h-4 mr-1" />
                        Imprimer
                      </button>
                      <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        Exporter PDF
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-slate-200 rounded-lg p-6 max-w-2xl mx-auto">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900">BULLETIN DE PAIE</h2>
                      <p className="text-sm text-slate-600">
                        {new Date(payPeriod).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="font-medium text-slate-900 mb-2 text-sm">EMPLOYEUR</h5>
                        <p className="text-sm">Dziljo SaaS</p>
                        <p className="text-sm">123 Avenue de la République</p>
                        <p className="text-sm">75011 Paris</p>
                        <p className="text-sm">SIRET: 123 456 789 00012</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-slate-900 mb-2 text-sm">SALARIÉ</h5>
                        <p className="text-sm">{selectedEmployee?.name}</p>
                        <p className="text-sm">{selectedEmployee?.position}</p>
                        <p className="text-sm">{selectedEmployee?.department}</p>
                        <p className="text-sm">N° SS: XXX XXX XXX XXX XX</p>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4 mb-4">
                      <div className="grid grid-cols-5 gap-2 text-sm font-medium text-slate-700 mb-2">
                        <div className="col-span-2">Élément</div>
                        <div className="text-right">Base</div>
                        <div className="text-right">Taux</div>
                        <div className="text-right">Montant</div>
                      </div>
                      
                      {/* Gains */}
                      <div className="mb-4">
                        {components
                          .filter(comp => comp.type === 'earning' && (comp.amount > 0 || comp.isRequired))
                          .map((comp) => (
                            <div key={comp.id} className="grid grid-cols-5 gap-2 text-sm py-1">
                              <div className="col-span-2">{comp.name}</div>
                              <div className="text-right">
                                {comp.id === 'base_salary' 
                                  ? `${workingDays} jours`
                                  : comp.id === 'overtime'
                                    ? `${overtimeHours} heures`
                                    : '-'}
                              </div>
                              <div className="text-right">
                                {comp.id === 'overtime' 
                                  ? `${formatCurrency(selectedEmployee?.hourlyRate || 0)} x 1.25`
                                  : comp.isPercentage ? `${comp.amount}%` : '-'}
                              </div>
                              <div className="text-right font-medium">
                                {comp.id === 'base_salary'
                                  ? formatCurrency((selectedEmployee?.baseSalary || 0) * (workingDays / 22))
                                  : formatCurrency(comp.amount)}
                              </div>
                            </div>
                          ))}
                      </div>
                      
                      {/* Déductions */}
                      <div className="mb-4">
                        {components
                          .filter(comp => (comp.type === 'deduction' || comp.type === 'tax') && (comp.amount > 0 || comp.isRequired))
                          .map((comp) => (
                            <div key={comp.id} className="grid grid-cols-5 gap-2 text-sm py-1">
                              <div className="col-span-2">{comp.name}</div>
                              <div className="text-right">
                                {comp.isPercentage ? formatCurrency(calculation.grossPay) : '-'}
                              </div>
                              <div className="text-right">
                                {comp.isPercentage ? `${comp.amount}%` : '-'}
                              </div>
                              <div className="text-right font-medium text-red-600">
                                {comp.isPercentage
                                  ? formatCurrency((calculation.grossPay * comp.amount) / 100)
                                  : formatCurrency(comp.amount)}
                              </div>
                            </div>
                          ))}
                      </div>
                      
                      {/* Totaux */}
                      <div className="border-t border-slate-200 pt-4">
                        <div className="grid grid-cols-2 gap-2 text-sm py-1">
                          <div className="font-medium">Total Brut</div>
                          <div className="text-right font-medium">{formatCurrency(calculation.grossPay)}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm py-1">
                          <div className="font-medium">Total Cotisations</div>
                          <div className="text-right font-medium text-red-600">
                            -{formatCurrency(calculation.totalDeductions + calculation.totalTaxes)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm py-1 border-t border-slate-200 mt-2 pt-2">
                          <div className="font-bold text-lg">Net à Payer</div>
                          <div className="text-right font-bold text-lg text-green-600">{formatCurrency(calculation.netPay)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">
                      <p>Bulletin de paie généré par dziljo SaaS Platform</p>
                      <p>Ce document a valeur de bulletin de paie original</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-blue-900">Prêt à Finaliser</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Vérifiez que toutes les informations sont correctes avant de créer la fiche de paie.
                        Une fois créée, elle sera enregistrée dans le système et pourra être consultée dans l'historique des paies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between space-x-3 mt-6 pt-6 border-t border-slate-200">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Précédent
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Annuler
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={currentStep === 1 && (!selectedEmployee || !payPeriod)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedEmployee || !calculation || errors.length > 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Créer la Fiche de Paie
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPayrollForm;