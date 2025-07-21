import React, { useState, useEffect } from 'react';
import { 
  Award, Star, Save, X, Check, AlertTriangle, User, 
  Calendar, Briefcase, Target, TrendingUp, ChevronRight, 
  ChevronLeft, Plus, Trash2, CheckCircle, Edit
} from 'lucide-react';

interface NewPerformanceReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reviewData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  category: 'performance' | 'development' | 'behavioral' | 'project';
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'achieved' | 'exceeded' | 'missed';
  progress: number;
  weight: number;
  score?: number;
}

interface Competency {
  id: number;
  name: string;
  category: 'technical' | 'leadership' | 'communication' | 'problem-solving' | 'teamwork';
  currentLevel: number;
  targetLevel: number;
  score: number;
  comments?: string;
}

const NewPerformanceReviewForm: React.FC<NewPerformanceReviewFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    id: 0,
    employeeId: 0,
    employeeName: '',
    department: '',
    position: '',
    reviewPeriod: '',
    reviewDate: new Date().toISOString().split('T')[0],
    status: 'in-progress',
    overallScore: 0,
    reviewerName: 'Sophie Martin', // Default to current user
    nextReviewDate: '',
    goals: [] as Goal[],
    competencies: [] as Competency[],
    feedback: {
      strengths: [''],
      improvements: [''],
      managerComments: '',
      employeeComments: ''
    }
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Sample employees for dropdown
  const employees = [
    { id: 1, name: 'Sophie Martin', department: 'Technique', position: 'Développeur Full Stack Senior' },
    { id: 2, name: 'Thomas Dubois', department: 'Design', position: 'Designer UX/UI' },
    { id: 3, name: 'Marie Leblanc', department: 'Commercial', position: 'Responsable Commercial' }
  ];

  // Initialize form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure arrays are initialized properly
        goals: initialData.goals || [],
        competencies: initialData.competencies || [],
        feedback: {
          strengths: initialData.feedback?.strengths || [''],
          improvements: initialData.feedback?.improvements || [''],
          managerComments: initialData.feedback?.managerComments || '',
          employeeComments: initialData.feedback?.employeeComments || ''
        }
      });
    }
  }, [initialData]);

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.employeeId) newErrors.employeeId = 'Veuillez sélectionner un employé';
      if (!formData.reviewPeriod) newErrors.reviewPeriod = 'La période d\'évaluation est requise';
      if (!formData.reviewDate) newErrors.reviewDate = 'La date d\'évaluation est requise';
    }
    
    if (step === 2) {
      if (formData.goals.length === 0) {
        newErrors.goals = 'Au moins un objectif est requis';
      } else {
        formData.goals.forEach((goal, index) => {
          if (!goal.title) newErrors[`goal_${index}_title`] = 'Le titre de l\'objectif est requis';
          if (!goal.targetDate) newErrors[`goal_${index}_targetDate`] = 'La date cible est requise';
        });
      }
    }
    
    if (step === 3) {
      if (formData.competencies.length === 0) {
        newErrors.competencies = 'Au moins une compétence est requise';
      }
    }
    
    if (step === 4) {
      if (formData.feedback.strengths.length === 0 || !formData.feedback.strengths[0]) {
        newErrors.strengths = 'Au moins un point fort est requis';
      }
      if (formData.feedback.improvements.length === 0 || !formData.feedback.improvements[0]) {
        newErrors.improvements = 'Au moins un axe d\'amélioration est requis';
      }
      if (!formData.feedback.managerComments) {
        newErrors.managerComments = 'Les commentaires du manager sont requis';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // If selecting an employee, update related fields
    if (name === 'employeeId') {
      const selectedEmployee = employees.find(emp => emp.id === parseInt(value));
      if (selectedEmployee) {
        setFormData(prev => ({
          ...prev,
          employeeId: selectedEmployee.id,
          employeeName: selectedEmployee.name,
          department: selectedEmployee.department,
          position: selectedEmployee.position
        }));
      }
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (arrayName: string, index: number, value: string) => {
    setFormData(prev => {
      const array = [...prev.feedback[arrayName as keyof typeof prev.feedback] as string[]];
      array[index] = value;
      return {
        ...prev,
        feedback: {
          ...prev.feedback,
          [arrayName]: array
        }
      };
    });
  };

  const addArrayItem = (arrayName: string) => {
    setFormData(prev => {
      const array = [...prev.feedback[arrayName as keyof typeof prev.feedback] as string[]];
      array.push('');
      return {
        ...prev,
        feedback: {
          ...prev.feedback,
          [arrayName]: array
        }
      };
    });
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData(prev => {
      const array = [...prev.feedback[arrayName as keyof typeof prev.feedback] as string[]];
      array.splice(index, 1);
      if (array.length === 0) array.push('');
      return {
        ...prev,
        feedback: {
          ...prev.feedback,
          [arrayName]: array
        }
      };
    });
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now(),
      title: '',
      description: '',
      category: 'performance',
      targetDate: '',
      status: 'not-started',
      progress: 0,
      weight: 25
    };
    
    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  const updateGoal = (index: number, field: keyof Goal, value: any) => {
    setFormData(prev => {
      const goals = [...prev.goals];
      goals[index] = { ...goals[index], [field]: value };
      return { ...prev, goals };
    });
  };

  const removeGoal = (index: number) => {
    setFormData(prev => {
      const goals = [...prev.goals];
      goals.splice(index, 1);
      return { ...prev, goals };
    });
  };

  const addCompetency = () => {
    const newCompetency: Competency = {
      id: Date.now(),
      name: '',
      category: 'technical',
      currentLevel: 3,
      targetLevel: 4,
      score: 3,
      comments: ''
    };
    
    setFormData(prev => ({
      ...prev,
      competencies: [...prev.competencies, newCompetency]
    }));
  };

  const updateCompetency = (index: number, field: keyof Competency, value: any) => {
    setFormData(prev => {
      const competencies = [...prev.competencies];
      competencies[index] = { ...competencies[index], [field]: value };
      return { ...prev, competencies };
    });
  };

  const removeCompetency = (index: number) => {
    setFormData(prev => {
      const competencies = [...prev.competencies];
      competencies.splice(index, 1);
      return { ...prev, competencies };
    });
  };

  const calculateOverallScore = () => {
    // Calculate weighted average of goal scores
    let totalWeight = 0;
    let weightedScoreSum = 0;
    
    formData.goals.forEach(goal => {
      if (goal.score !== undefined) {
        totalWeight += goal.weight;
        weightedScoreSum += goal.score * goal.weight;
      }
    });
    
    // Add competency scores
    let competencyScoreSum = 0;
    formData.competencies.forEach(comp => {
      competencyScoreSum += comp.score;
    });
    
    const competencyAvg = formData.competencies.length > 0 
      ? competencyScoreSum / formData.competencies.length 
      : 0;
    
    // Final score is 70% goals, 30% competencies
    const goalScore = totalWeight > 0 ? weightedScoreSum / totalWeight : 0;
    const overallScore = formData.goals.length > 0 && formData.competencies.length > 0
      ? goalScore * 0.7 + competencyAvg * 0.3
      : formData.goals.length > 0
        ? goalScore
        : formData.competencies.length > 0
          ? competencyAvg
          : 0;
    
    return Math.round(overallScore * 10) / 10; // Round to 1 decimal place
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 4) {
        // Calculate overall score before submitting
        const overallScore = calculateOverallScore();
        setFormData(prev => ({
          ...prev,
          overallScore,
          status: 'completed'
        }));
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      // Calculate overall score
      const overallScore = calculateOverallScore();
      
      // Prepare final data
      const finalData = {
        ...formData,
        overallScore,
        status: 'completed',
        id: initialData?.id || Date.now()
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          onSave(finalData);
          setShowSuccessMessage(false);
        }, 1500);
      }, 1000);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'development': return 'bg-purple-100 text-purple-800';
      case 'behavioral': return 'bg-green-100 text-green-800';
      case 'project': return 'bg-orange-100 text-orange-800';
      case 'technical': return 'bg-indigo-100 text-indigo-800';
      case 'leadership': return 'bg-red-100 text-red-800';
      case 'communication': return 'bg-yellow-100 text-yellow-800';
      case 'problem-solving': return 'bg-pink-100 text-pink-800';
      case 'teamwork': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'achieved': return 'bg-green-100 text-green-800';
      case 'exceeded': return 'bg-purple-100 text-purple-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                {isEditing ? <Edit className="w-6 h-6" /> : <Award className="w-6 h-6" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Modifier l\'Évaluation' : 'Nouvelle Évaluation de Performance'}</h1>
                <p className="text-white/80">Évaluez les performances et définissez les objectifs</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mt-6 relative z-10">
            <div className="flex items-center justify-between">
              {[
                { step: 1, title: 'Informations de Base', icon: User },
                { step: 2, title: 'Objectifs', icon: Target },
                { step: 3, title: 'Compétences', icon: Star },
                { step: 4, title: 'Feedback', icon: TrendingUp },
                { step: 5, title: 'Finalisation', icon: Check }
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep === step.step 
                        ? 'bg-white text-orange-600' 
                        : currentStep > step.step 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white/30 text-white'
                    }`}
                  >
                    {currentStep > step.step ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm text-white/80 text-center hidden md:block">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-1 bg-white/30 mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showSuccessMessage ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isEditing ? 'Évaluation Mise à Jour !' : 'Évaluation Créée avec Succès !'}
              </h2>
              <p className="text-slate-600 mb-6">
                {isEditing 
                  ? 'Les modifications ont été enregistrées.' 
                  : 'La nouvelle évaluation a été ajoutée au système.'}
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {formData.employeeName}
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Score: {formData.overallScore.toFixed(1)}/5
                </div>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-orange-600 border-orange-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
              </h2>
              <p className="text-slate-600">Nous enregistrons l'évaluation</p>
            </div>
          ) : (
            <>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-orange-600" />
                    Informations de Base
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Employé <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.employeeId ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        disabled={isEditing} // Can't change employee when editing
                      >
                        <option value="">Sélectionner un employé</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.position}
                          </option>
                        ))}
                      </select>
                      {errors.employeeId && (
                        <p className="mt-1 text-sm text-red-500">{errors.employeeId}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Période d'Évaluation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="reviewPeriod"
                        value={formData.reviewPeriod}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.reviewPeriod ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ex: S1 2024, Janvier-Juin 2024"
                      />
                      {errors.reviewPeriod && (
                        <p className="mt-1 text-sm text-red-500">{errors.reviewPeriod}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date d'Évaluation <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="reviewDate"
                          value={formData.reviewDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.reviewDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.reviewDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.reviewDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prochaine Évaluation
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="nextReviewDate"
                          value={formData.nextReviewDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.employeeId > 0 && (
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                      <h3 className="font-medium text-orange-900 mb-3">Informations de l'Employé</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-orange-700">Nom:</span>
                          <p className="font-medium text-orange-900">{formData.employeeName}</p>
                        </div>
                        <div>
                          <span className="text-orange-700">Poste:</span>
                          <p className="font-medium text-orange-900">{formData.position}</p>
                        </div>
                        <div>
                          <span className="text-orange-700">Département:</span>
                          <p className="font-medium text-orange-900">{formData.department}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Goals */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-orange-600" />
                      Objectifs
                    </h2>
                    <button
                      onClick={addGoal}
                      className="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un Objectif
                    </button>
                  </div>

                  {errors.goals && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {errors.goals}
                    </div>
                  )}

                  {formData.goals.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                      <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">Aucun objectif défini</p>
                      <button
                        onClick={addGoal}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Ajouter un premier objectif
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.goals.map((goal, index) => (
                        <div key={goal.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-slate-900">Objectif #{index + 1}</h3>
                            <button
                              onClick={() => removeGoal(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Titre <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={goal.title}
                                onChange={(e) => updateGoal(index, 'title', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors[`goal_${index}_title`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                placeholder="Ex: Améliorer les performances de l'application"
                              />
                              {errors[`goal_${index}_title`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`goal_${index}_title`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Catégorie
                              </label>
                              <select
                                value={goal.category}
                                onChange={(e) => updateGoal(index, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="performance">Performance</option>
                                <option value="development">Développement</option>
                                <option value="behavioral">Comportemental</option>
                                <option value="project">Projet</option>
                              </select>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Description
                            </label>
                            <textarea
                              value={goal.description}
                              onChange={(e) => updateGoal(index, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Description détaillée de l'objectif..."
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Date Cible <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                value={goal.targetDate}
                                onChange={(e) => updateGoal(index, 'targetDate', e.target.value)}
                                className={`w-full px-3 py-2 border ${errors[`goal_${index}_targetDate`] ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                              {errors[`goal_${index}_targetDate`] && (
                                <p className="mt-1 text-sm text-red-500">{errors[`goal_${index}_targetDate`]}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Poids (%)
                              </label>
                              <input
                                type="number"
                                value={goal.weight}
                                onChange={(e) => updateGoal(index, 'weight', parseInt(e.target.value))}
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Statut
                              </label>
                              <select
                                value={goal.status}
                                onChange={(e) => updateGoal(index, 'status', e.target.value as Goal['status'])}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="not-started">Pas commencé</option>
                                <option value="in-progress">En cours</option>
                                <option value="achieved">Atteint</option>
                                <option value="exceeded">Dépassé</option>
                                <option value="missed">Manqué</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Progression ({goal.progress}%)
                              </label>
                              <input
                                type="range"
                                value={goal.progress}
                                onChange={(e) => updateGoal(index, 'progress', parseInt(e.target.value))}
                                min="0"
                                max="100"
                                step="5"
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Score (1-5)
                              </label>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((score) => (
                                  <button
                                    key={score}
                                    type="button"
                                    onClick={() => updateGoal(index, 'score', score)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-1 ${
                                      goal.score === score
                                        ? 'bg-orange-600 text-white'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    }`}
                                  >
                                    {score}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Competencies */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-orange-600" />
                      Compétences
                    </h2>
                    <button
                      onClick={addCompetency}
                      className="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter une Compétence
                    </button>
                  </div>

                  {errors.competencies && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {errors.competencies}
                    </div>
                  )}

                  {formData.competencies.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                      <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">Aucune compétence définie</p>
                      <button
                        onClick={addCompetency}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        Ajouter une première compétence
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.competencies.map((competency, index) => (
                        <div key={competency.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="font-medium text-slate-900">Compétence #{index + 1}</h3>
                            <button
                              onClick={() => removeCompetency(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nom <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={competency.name}
                                onChange={(e) => updateCompetency(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ex: Développement Frontend"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Catégorie
                              </label>
                              <select
                                value={competency.category}
                                onChange={(e) => updateCompetency(index, 'category', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="technical">Technique</option>
                                <option value="leadership">Leadership</option>
                                <option value="communication">Communication</option>
                                <option value="problem-solving">Résolution de problèmes</option>
                                <option value="teamwork">Travail d'équipe</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Niveau Actuel ({competency.currentLevel}/5)
                              </label>
                              <input
                                type="range"
                                value={competency.currentLevel}
                                onChange={(e) => updateCompetency(index, 'currentLevel', parseInt(e.target.value))}
                                min="1"
                                max="5"
                                step="1"
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Débutant</span>
                                <span>Expert</span>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                Niveau Cible ({competency.targetLevel}/5)
                              </label>
                              <input
                                type="range"
                                value={competency.targetLevel}
                                onChange={(e) => updateCompetency(index, 'targetLevel', parseInt(e.target.value))}
                                min="1"
                                max="5"
                                step="1"
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Débutant</span>
                                <span>Expert</span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Score (1-5)
                            </label>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((score) => (
                                <button
                                  key={score}
                                  type="button"
                                  onClick={() => updateCompetency(index, 'score', score)}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-1 ${
                                    competency.score === score
                                      ? 'bg-orange-600 text-white'
                                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  }`}
                                >
                                  {score}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Commentaires
                            </label>
                            <textarea
                              value={competency.comments || ''}
                              onChange={(e) => updateCompetency(index, 'comments', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Commentaires sur cette compétence..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Feedback */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                    Feedback et Commentaires
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Points Forts <span className="text-red-500">*</span>
                      </label>
                      {errors.strengths && (
                        <p className="mb-2 text-sm text-red-500">{errors.strengths}</p>
                      )}
                      <div className="space-y-2">
                        {formData.feedback.strengths.map((strength, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={strength}
                              onChange={(e) => handleArrayChange('strengths', index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ex: Leadership technique"
                            />
                            {formData.feedback.strengths.length > 1 && (
                              <button
                                onClick={() => removeArrayItem('strengths', index)}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addArrayItem('strengths')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter un point fort
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Axes d'Amélioration <span className="text-red-500">*</span>
                      </label>
                      {errors.improvements && (
                        <p className="mb-2 text-sm text-red-500">{errors.improvements}</p>
                      )}
                      <div className="space-y-2">
                        {formData.feedback.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={improvement}
                              onChange={(e) => handleArrayChange('improvements', index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Ex: Gestion du temps"
                            />
                            {formData.feedback.improvements.length > 1 && (
                              <button
                                onClick={() => removeArrayItem('improvements', index)}
                                className="p-2 text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => addArrayItem('improvements')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter un axe d'amélioration
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Commentaires du Manager <span className="text-red-500">*</span>
                    </label>
                    {errors.managerComments && (
                      <p className="mb-2 text-sm text-red-500">{errors.managerComments}</p>
                    )}
                    <textarea
                      name="feedback.managerComments"
                      value={formData.feedback.managerComments}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-3 py-2 border ${errors.managerComments ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="Commentaires généraux sur la performance de l'employé..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Commentaires de l'Employé
                    </label>
                    <textarea
                      name="feedback.employeeComments"
                      value={formData.feedback.employeeComments}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Commentaires de l'employé sur son évaluation..."
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Finalization */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-900">Prêt à Finaliser</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Vérifiez que toutes les informations sont correctes avant de finaliser l'évaluation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">{formData.employeeName}</h3>
                      <div className="flex items-center">
                        <span className="text-sm text-slate-600 mr-2">Score Global:</span>
                        <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-lg font-medium">
                          {calculateOverallScore().toFixed(1)}/5
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Informations</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Poste:</span>
                            <span className="text-slate-900">{formData.position}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Département:</span>
                            <span className="text-slate-900">{formData.department}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Période:</span>
                            <span className="text-slate-900">{formData.reviewPeriod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Date d'évaluation:</span>
                            <span className="text-slate-900">{formData.reviewDate}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Résumé</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Objectifs:</span>
                            <span className="text-slate-900">{formData.goals.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Compétences:</span>
                            <span className="text-slate-900">{formData.competencies.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Points forts:</span>
                            <span className="text-slate-900">{formData.feedback.strengths.filter(s => s.trim() !== '').length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Axes d'amélioration:</span>
                            <span className="text-slate-900">{formData.feedback.improvements.filter(s => s.trim() !== '').length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900 mb-2">Objectifs Principaux</h4>
                      <div className="space-y-2">
                        {formData.goals.slice(0, 3).map((goal, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-slate-200">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(goal.status)} mr-2`}></div>
                              <span className="text-sm font-medium text-slate-900">{goal.title}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-xs text-slate-600 mr-2">Score:</span>
                              <span className="text-sm font-medium">{goal.score || 'N/A'}</span>
                            </div>
                          </div>
                        ))}
                        {formData.goals.length > 3 && (
                          <div className="text-sm text-slate-500 text-center">
                            + {formData.goals.length - 3} autres objectifs
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Navigation */}
        {!isSubmitting && !showSuccessMessage && (
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-between">
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
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Annuler
                </button>
              )}

              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Mettre à Jour' : 'Finaliser l\'Évaluation'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPerformanceReviewForm;