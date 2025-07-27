import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Star, Target, Award, User, Calendar, FileText } from 'lucide-react';
import { useFirebaseCollection } from '../../hooks/useFirebase';

interface SaveError {
  message: string;
  code?: string;
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

interface NewPerformanceReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reviewData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const NewPerformanceReviewForm: React.FC<NewPerformanceReviewFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [formData, setFormData] = useState({
    employeeName: initialData?.employeeName || '',
    department: initialData?.department || '',
    position: initialData?.position || '',
    reviewPeriod: initialData?.reviewPeriod || '',
    reviewDate: initialData?.reviewDate || new Date().toISOString().split('T')[0],
    reviewerName: initialData?.reviewerName || 'Current User',
    nextReviewDate: initialData?.nextReviewDate || '',
    overallScore: initialData?.overallScore || 0,
    goals: initialData?.goals || [] as Goal[],
    competencies: initialData?.competencies || [] as Competency[],
    strengths: initialData?.feedback?.strengths || [''],
    improvements: initialData?.feedback?.improvements || [''],
    managerComments: initialData?.feedback?.managerComments || '',
    employeeComments: initialData?.feedback?.employeeComments || ''
  });

  const { create: createReview, update: updateReview } = useFirebaseCollection('performance-reviews');

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'performance' as Goal['category'],
    targetDate: '',
    weight: 20
  });

  const [newCompetency, setNewCompetency] = useState({
    name: '',
    category: 'technical' as Competency['category'],
    currentLevel: 1,
    targetLevel: 3,
    score: 3,
    comments: ''
  });

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCompetencyModal, setShowCompetencyModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const employees = [
    'Sophie Martin',
    'Thomas Dubois',
    'Pierre Martin',
    'Marie Rousseau'
  ];

  const departments = [
    'Technique',
    'Design',
    'Commercial',
    'RH',
    'Administration'
  ];

  const goalCategories = [
    { id: 'performance', name: 'Performance' },
    { id: 'development', name: 'Développement' },
    { id: 'behavioral', name: 'Comportemental' },
    { id: 'project', name: 'Projet' }
  ];

  const competencyCategories = [
    { id: 'technical', name: 'Technique' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'communication', name: 'Communication' },
    { id: 'problem-solving', name: 'Résolution de problèmes' },
    { id: 'teamwork', name: 'Travail d\'équipe' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddGoal = () => {
    const goal: Goal = {
      id: Date.now(),
      ...newGoal,
      status: 'not-started',
      progress: 0
    };

    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));

    setNewGoal({
      title: '',
      description: '',
      category: 'performance',
      targetDate: '',
      weight: 20
    });
    setShowGoalModal(false);
  };

  const handleAddCompetency = () => {
    const competency: Competency = {
      id: Date.now(),
      ...newCompetency
    };

    setFormData(prev => ({
      ...prev,
      competencies: [...prev.competencies, competency]
    }));

    setNewCompetency({
      name: '',
      category: 'technical',
      currentLevel: 1,
      targetLevel: 3,
      score: 3,
      comments: ''
    });
    setShowCompetencyModal(false);
  };

  const removeGoal = (id: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id)
    }));
  };

  const removeCompetency = (id: number) => {
    setFormData(prev => ({
      ...prev,
      competencies: prev.competencies.filter(comp => comp.id !== id)
    }));
  };

  const updateStrength = (index: number, value: string) => {
    const updatedStrengths = [...formData.strengths];
    updatedStrengths[index] = value;
    setFormData(prev => ({ ...prev, strengths: updatedStrengths }));
  };

  const addStrength = () => {
    setFormData(prev => ({
      ...prev,
      strengths: [...prev.strengths, '']
    }));
  };

  const removeStrength = (index: number) => {
    const updatedStrengths = formData.strengths.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, strengths: updatedStrengths.length ? updatedStrengths : [''] }));
  };

  const updateImprovement = (index: number, value: string) => {
    const updatedImprovements = [...formData.improvements];
    updatedImprovements[index] = value;
    setFormData(prev => ({ ...prev, improvements: updatedImprovements }));
  };

  const addImprovement = () => {
    setFormData(prev => ({
      ...prev,
      improvements: [...prev.improvements, '']
    }));
  };

  const removeImprovement = (index: number) => {
    const updatedImprovements = formData.improvements.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, improvements: updatedImprovements.length ? updatedImprovements : [''] }));
  };

  const calculateOverallScore = () => {
    if (formData.competencies.length === 0) return 0;
    const totalScore = formData.competencies.reduce((sum, comp) => sum + comp.score, 0);
    return totalScore / formData.competencies.length;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const overallScore = calculateOverallScore();
      
      const reviewData = {
        ...formData,
        id: initialData?.id || Date.now(),
        overallScore,
        status: 'completed',
        feedback: {
          strengths: formData.strengths.filter(s => s.trim() !== ''),
          improvements: formData.improvements.filter(i => i.trim() !== ''),
          managerComments: formData.managerComments,
          employeeComments: formData.employeeComments
        },
        createdAt: initialData?.id ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (isEditing) {
        await updateReview(reviewData.id.toString(), reviewData);
      } else {
        await createReview(reviewData);
      }

      onSave(reviewData);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
      
      if (errorMessage.includes('Missing or insufficient permissions')) {
        setSaveError('Permissions insuffisantes. Veuillez contacter votre administrateur pour accéder à cette fonctionnalité.');
      } else if (errorMessage.includes('offline')) {
        setSaveError('Connexion internet requise. Veuillez vérifier votre connexion et réessayer.');
      } else {
        setSaveError(`Erreur lors de la sauvegarde: ${errorMessage}`);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? 'Modifier l\'Évaluation' : 'Nouvelle Évaluation de Performance'}
                </h1>
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
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informations de Base
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Employé</label>
                  <select
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un employé</option>
                    {employees.map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Département</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Poste</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Poste de l'employé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Période d'évaluation</label>
                  <input
                    type="text"
                    name="reviewPeriod"
                    value={formData.reviewPeriod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: S2 2023"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date d'évaluation</label>
                  <input
                    type="date"
                    name="reviewDate"
                    value={formData.reviewDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Prochaine évaluation</label>
                  <input
                    type="date"
                    name="nextReviewDate"
                    value={formData.nextReviewDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Goals Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-slate-900 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-600" />
                  Objectifs
                </h3>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter Objectif
                </button>
              </div>

              <div className="space-y-3">
                {formData.goals.map((goal) => (
                  <div key={goal.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-slate-900">{goal.title}</h4>
                      <button
                        onClick={() => removeGoal(goal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        {goalCategories.find(c => c.id === goal.category)?.name}
                      </span>
                      <span className="text-slate-600">Échéance: {goal.targetDate}</span>
                      <span className="text-slate-600">Poids: {goal.weight}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competencies Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-slate-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Compétences
                </h3>
                <button
                  onClick={() => setShowCompetencyModal(true)}
                  className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter Compétence
                </button>
              </div>

              <div className="space-y-3">
                {formData.competencies.map((competency) => (
                  <div key={competency.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-slate-900">{competency.name}</h4>
                      <button
                        onClick={() => removeCompetency(competency.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        {competencyCategories.find(c => c.id === competency.category)?.name}
                      </span>
                      <span className="text-slate-600">
                        Niveau: {competency.currentLevel}/5 → {competency.targetLevel}/5
                      </span>
                      <span className="text-slate-600">Score: {competency.score}/5</span>
                    </div>
                    {competency.comments && (
                      <p className="text-sm text-slate-600 mt-2 italic">{competency.comments}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-3">Points Forts</h3>
                {formData.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => updateStrength(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Point fort"
                    />
                    <button
                      onClick={() => removeStrength(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addStrength}
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  + Ajouter un point fort
                </button>
              </div>

              <div>
                <h3 className="font-medium text-slate-900 mb-3">Axes d'Amélioration</h3>
                {formData.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={improvement}
                      onChange={(e) => updateImprovement(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Axe d'amélioration"
                    />
                    <button
                      onClick={() => removeImprovement(index)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addImprovement}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  + Ajouter un axe d'amélioration
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Commentaires du Manager</label>
                <textarea
                  name="managerComments"
                  value={formData.managerComments}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Commentaires détaillés sur la performance..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Commentaires de l'Employé</label>
                <textarea
                  name="employeeComments"
                  value={formData.employeeComments}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Auto-évaluation et commentaires de l'employé..."
                />
              </div>
            </div>

            {/* Overall Score Display */}
            {formData.competencies.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Score Global Calculé</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-blue-800">
                    {calculateOverallScore().toFixed(1)}/5
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(calculateOverallScore()) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {saveError && (
          <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <X className="w-5 h-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{saveError}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSaveError(null)}
                  className="inline-flex text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? 'Mettre à jour' : 'Créer l\'Évaluation'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Goal Modal */}
        {showGoalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Nouvel Objectif</h3>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre de l'objectif"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description détaillée"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {goalCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Poids (%)</label>
                    <input
                      type="number"
                      value={newGoal.weight}
                      onChange={(e) => setNewGoal({ ...newGoal, weight: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date cible</label>
                  <input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddGoal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Competency Modal */}
        {showCompetencyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Nouvelle Compétence</h3>
                <button
                  onClick={() => setShowCompetencyModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom de la compétence</label>
                  <input
                    type="text"
                    value={newCompetency.name}
                    onChange={(e) => setNewCompetency({ ...newCompetency, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Développement Frontend"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                  <select
                    value={newCompetency.category}
                    onChange={(e) => setNewCompetency({ ...newCompetency, category: e.target.value as Competency['category'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {competencyCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Niveau actuel</label>
                    <select
                      value={newCompetency.currentLevel}
                      onChange={(e) => setNewCompetency({ ...newCompetency, currentLevel: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Niveau cible</label>
                    <select
                      value={newCompetency.targetLevel}
                      onChange={(e) => setNewCompetency({ ...newCompetency, targetLevel: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5].map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Score</label>
                    <select
                      value={newCompetency.score}
                      onChange={(e) => setNewCompetency({ ...newCompetency, score: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5].map(score => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Commentaires</label>
                  <textarea
                    value={newCompetency.comments}
                    onChange={(e) => setNewCompetency({ ...newCompetency, comments: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Commentaires sur cette compétence..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCompetencyModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddCompetency}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPerformanceReviewForm;