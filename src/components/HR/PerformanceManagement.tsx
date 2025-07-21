import React, { useState } from 'react';
import { Award, TrendingUp, Target, Calendar, Star, Plus, Edit, Eye, BarChart3, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import NewPerformanceReviewForm from './NewPerformanceReviewForm';

interface PerformanceReview {
  id: number;
  employeeId: number;
  employeeName: string;
  department: string;
  position: string;
  reviewPeriod: string;
  reviewDate: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  overallScore: number;
  reviewerName: string;
  nextReviewDate: string;
  goals: Goal[];
  competencies: Competency[];
  feedback: {
    strengths: string[];
    improvements: string[];
    managerComments: string;
    employeeComments?: string;
  };
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

interface PerformancePlan {
  id: number;
  employeeId: number;
  employeeName: string;
  planType: 'improvement' | 'development' | 'succession';
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  objectives: string[];
  milestones: Milestone[];
  mentor?: string;
}

interface Milestone {
  id: number;
  title: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  description: string;
}

const PerformanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReviewForEdit, setSelectedReviewForEdit] = useState<PerformanceReview | null>(null);

  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      department: 'Technique',
      position: 'Développeur Full Stack Senior',
      reviewPeriod: 'S2 2023',
      reviewDate: '2024-01-15',
      status: 'completed',
      overallScore: 4.2,
      reviewerName: 'Jean Dupont',
      nextReviewDate: '2024-07-15',
      goals: [
        {
          id: 1,
          title: 'Améliorer les performances de l\'application',
          description: 'Optimiser le temps de chargement de 30%',
          category: 'performance',
          targetDate: '2024-06-30',
          status: 'achieved',
          progress: 100,
          weight: 30,
          score: 4.5
        },
        {
          id: 2,
          title: 'Mentorer un développeur junior',
          description: 'Accompagner un nouveau développeur dans son intégration',
          category: 'development',
          targetDate: '2024-12-31',
          status: 'in-progress',
          progress: 75,
          weight: 25,
          score: 4.0
        }
      ],
      competencies: [
        {
          id: 1,
          name: 'Développement Frontend',
          category: 'technical',
          currentLevel: 4,
          targetLevel: 5,
          score: 4.2,
          comments: 'Excellente maîtrise de React et TypeScript'
        },
        {
          id: 2,
          name: 'Leadership',
          category: 'leadership',
          currentLevel: 3,
          targetLevel: 4,
          score: 3.8,
          comments: 'Montre de bonnes capacités de leadership avec l\'équipe'
        }
      ],
      feedback: {
        strengths: ['Expertise technique solide', 'Capacité d\'apprentissage rapide', 'Collaboration excellente'],
        improvements: ['Gestion du temps', 'Communication écrite', 'Présentation publique'],
        managerComments: 'Sophie est un élément clé de l\'équipe avec un potentiel de leadership important.',
        employeeComments: 'Je souhaite développer mes compétences en management d\'équipe.'
      }
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      department: 'Design',
      position: 'Designer UX/UI',
      reviewPeriod: 'S2 2023',
      reviewDate: '2024-01-20',
      status: 'in-progress',
      overallScore: 0,
      reviewerName: 'Marie Rousseau',
      nextReviewDate: '2024-07-20',
      goals: [
        {
          id: 3,
          title: 'Créer le nouveau design system',
          description: 'Développer un design system complet pour l\'entreprise',
          category: 'project',
          targetDate: '2024-03-31',
          status: 'in-progress',
          progress: 60,
          weight: 40
        }
      ],
      competencies: [
        {
          id: 3,
          name: 'Design UX',
          category: 'technical',
          currentLevel: 4,
          targetLevel: 4,
          score: 4.1
        }
      ],
      feedback: {
        strengths: ['Créativité exceptionnelle', 'Attention aux détails'],
        improvements: ['Respect des délais', 'Communication avec les développeurs'],
        managerComments: 'En cours d\'évaluation...'
      }
    }
  ]);

  const [performancePlans, setPerformancePlans] = useState<PerformancePlan[]>([
    {
      id: 1,
      employeeId: 3,
      employeeName: 'Pierre Martin',
      planType: 'improvement',
      startDate: '2024-01-01',
      endDate: '2024-06-30',
      status: 'active',
      objectives: [
        'Améliorer la ponctualité aux réunions',
        'Développer les compétences en communication',
        'Atteindre les objectifs de vente trimestriels'
      ],
      milestones: [
        {
          id: 1,
          title: 'Formation en communication',
          dueDate: '2024-02-15',
          status: 'completed',
          description: 'Suivre une formation de 2 jours sur la communication efficace'
        },
        {
          id: 2,
          title: 'Évaluation intermédiaire',
          dueDate: '2024-03-31',
          status: 'pending',
          description: 'Point d\'étape sur les progrès réalisés'
        }
      ],
      mentor: 'Sophie Martin'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'achieved':
      case 'exceeded': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled':
      case 'pending':
      case 'not-started': return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
      case 'missed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planifié';
      case 'in-progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'overdue': return 'En retard';
      case 'achieved': return 'Atteint';
      case 'exceeded': return 'Dépassé';
      case 'missed': return 'Manqué';
      case 'not-started': return 'Pas commencé';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'active': return 'Actif';
      default: return status;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-orange-600';
    return 'text-red-600';
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

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case 'improvement': return 'bg-orange-100 text-orange-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'succession': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanTypeText = (type: string) => {
    switch (type) {
      case 'improvement': return 'Plan d\'Amélioration';
      case 'development': return 'Plan de Développement';
      case 'succession': return 'Plan de Succession';
      default: return type;
    }
  };

  const reviewStats = {
    total: performanceReviews.length,
    completed: performanceReviews.filter(r => r.status === 'completed').length,
    inProgress: performanceReviews.filter(r => r.status === 'in-progress').length,
    overdue: performanceReviews.filter(r => r.status === 'overdue').length,
    avgScore: performanceReviews.filter(r => r.overallScore > 0).reduce((sum, r) => sum + r.overallScore, 0) / performanceReviews.filter(r => r.overallScore > 0).length || 0
  };

  const handleSaveReview = (reviewData: any) => {
    if (selectedReviewForEdit) {
      // Update existing review
      setPerformanceReviews(prev => 
        prev.map(review => review.id === selectedReviewForEdit.id ? reviewData : review)
      );
      setSelectedReviewForEdit(null);
    } else {
      // Add new review
      setPerformanceReviews(prev => [...prev, reviewData]);
    }
    setShowCreateModal(false);
    setShowEditModal(false);
  };

  const handleEditReview = (review: PerformanceReview) => {
    setSelectedReviewForEdit(review);
    setShowEditModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion de la Performance</h2>
          <p className="text-slate-600">Évaluations, objectifs et plans de développement</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Évaluation
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Évaluations</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reviewStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Terminées</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reviewStats.completed}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Cours</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reviewStats.inProgress}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Retard</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reviewStats.overdue}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Score Moyen</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{reviewStats.avgScore.toFixed(1)}/5</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'reviews', name: 'Évaluations', icon: Award },
            { id: 'goals', name: 'Objectifs', icon: Target },
            { id: 'plans', name: 'Plans de Performance', icon: TrendingUp },
            { id: 'analytics', name: 'Analytics', icon: BarChart3 }
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

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {performanceReviews.map((review) => (
              <div key={review.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{review.employeeName}</h4>
                      <span className="text-sm text-slate-600">{review.position}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(review.status)}`}>
                        {getStatusText(review.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-3">
                      <div>
                        <span className="font-medium">Période:</span> {review.reviewPeriod}
                      </div>
                      <div>
                        <span className="font-medium">Évaluateur:</span> {review.reviewerName}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {review.reviewDate}
                      </div>
                      <div>
                        <span className="font-medium">Prochaine:</span> {review.nextReviewDate}
                      </div>
                    </div>

                    {review.overallScore > 0 && (
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-slate-700 mr-2">Score global:</span>
                          <div className="flex items-center">
                            <span className={`text-lg font-bold ${getScoreColor(review.overallScore)}`}>
                              {review.overallScore.toFixed(1)}/5
                            </span>
                            <div className="flex ml-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(review.overallScore) 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-slate-600">
                          {review.goals.length} objectifs • {review.competencies.length} compétences évaluées
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button 
                      onClick={() => setSelectedReview(review)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEditReview(review)}
                      className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-6">
            {performanceReviews.map((review) => (
              <div key={review.id} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-4">{review.employeeName} - {review.position}</h4>
                <div className="space-y-3">
                  {review.goals.map((goal) => (
                    <div key={goal.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium text-slate-900">{goal.title}</h5>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(goal.category)}`}>
                            {goal.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(goal.status)}`}>
                            {getStatusText(goal.status)}
                          </span>
                        </div>
                        {goal.score && (
                          <span className={`font-bold ${getScoreColor(goal.score)}`}>
                            {goal.score.toFixed(1)}/5
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <span className="text-slate-600">Échéance: {goal.targetDate}</span>
                          <span className="text-slate-600">Poids: {goal.weight}%</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-slate-600 mr-2">Progrès:</span>
                          <div className="w-20 bg-slate-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-4">
            {performancePlans.map((plan) => (
              <div key={plan.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-slate-900">{plan.employeeName}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getPlanTypeColor(plan.planType)}`}>
                      {getPlanTypeText(plan.planType)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(plan.status)}`}>
                      {getStatusText(plan.status)}
                    </span>
                  </div>
                  {plan.mentor && (
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Mentor:</span> {plan.mentor}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                  <div>
                    <span className="font-medium">Début:</span> {plan.startDate}
                  </div>
                  <div>
                    <span className="font-medium">Fin:</span> {plan.endDate}
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="font-medium text-slate-900 mb-2">Objectifs:</h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                    {plan.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-medium text-slate-900 mb-2">Jalons:</h5>
                  <div className="space-y-2">
                    {plan.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(milestone.status)}`}>
                            {getStatusText(milestone.status)}
                          </span>
                          <span className="text-sm font-medium text-slate-900">{milestone.title}</span>
                        </div>
                        <span className="text-sm text-slate-600">{milestone.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Distribution des Scores</h4>
                <div className="space-y-3">
                  {[
                    { range: '4.5 - 5.0', count: 1, color: 'bg-green-500' },
                    { range: '4.0 - 4.4', count: 1, color: 'bg-blue-500' },
                    { range: '3.5 - 3.9', count: 0, color: 'bg-yellow-500' },
                    { range: '3.0 - 3.4', count: 0, color: 'bg-orange-500' },
                    { range: '< 3.0', count: 0, color: 'bg-red-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded ${item.color} mr-3`}></div>
                        <span className="text-sm font-medium text-slate-700">{item.range}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h4 className="font-medium text-slate-900 mb-4">Statut des Objectifs</h4>
                <div className="space-y-3">
                  {[
                    { status: 'Atteints', count: 1, color: 'bg-green-500' },
                    { status: 'En cours', count: 1, color: 'bg-blue-500' },
                    { status: 'En retard', count: 0, color: 'bg-red-500' },
                    { status: 'Pas commencés', count: 0, color: 'bg-gray-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded ${item.color} mr-3`}></div>
                        <span className="text-sm font-medium text-slate-700">{item.status}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-4">Performance par Département</h4>
              <div className="space-y-4">
                {[
                  { dept: 'Technique', avgScore: 4.2, employees: 1 },
                  { dept: 'Design', avgScore: 0, employees: 1 },
                  { dept: 'Commercial', avgScore: 0, employees: 0 },
                  { dept: 'Administration', avgScore: 0, employees: 0 }
                ].map((dept, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-slate-700 w-24">{dept.dept}</span>
                      <div className="flex items-center ml-4">
                        <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${dept.avgScore > 0 ? (dept.avgScore / 5) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900 w-12">
                          {dept.avgScore > 0 ? dept.avgScore.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-slate-600">{dept.employees} évaluation(s)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Évaluation - {selectedReview.employeeName}
                  </h3>
                  <p className="text-slate-600">{selectedReview.position} • {selectedReview.reviewPeriod}</p>
                </div>
                <button 
                  onClick={() => setSelectedReview(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {selectedReview.overallScore > 0 && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-slate-900">Score Global</h4>
                    <div className="flex items-center">
                      <span className={`text-2xl font-bold ${getScoreColor(selectedReview.overallScore)} mr-2`}>
                        {selectedReview.overallScore.toFixed(1)}/5
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(selectedReview.overallScore) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium text-slate-900 mb-4">Objectifs</h4>
                <div className="space-y-3">
                  {selectedReview.goals.map((goal) => (
                    <div key={goal.id} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-slate-900">{goal.title}</h5>
                        {goal.score && (
                          <span className={`font-bold ${getScoreColor(goal.score)}`}>
                            {goal.score.toFixed(1)}/5
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{goal.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(goal.category)}`}>
                            {goal.category}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(goal.status)}`}>
                            {getStatusText(goal.status)}
                          </span>
                          <span className="text-slate-600">Poids: {goal.weight}%</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-20 bg-slate-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{goal.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-4">Compétences</h4>
                <div className="space-y-3">
                  {selectedReview.competencies.map((comp) => (
                    <div key={comp.id} className="p-3 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium text-slate-900">{comp.name}</h5>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(comp.category)}`}>
                            {comp.category}
                          </span>
                        </div>
                        <span className={`font-bold ${getScoreColor(comp.score)}`}>
                          {comp.score.toFixed(1)}/5
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">
                          Niveau: {comp.currentLevel}/5 → Cible: {comp.targetLevel}/5
                        </span>
                      </div>
                      {comp.comments && (
                        <p className="text-sm text-slate-600 mt-2 italic">{comp.comments}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Points Forts</h4>
                  <div className="space-y-2">
                    {selectedReview.feedback.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center p-2 bg-green-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm text-green-800">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Axes d'Amélioration</h4>
                  <div className="space-y-2">
                    {selectedReview.feedback.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-center p-2 bg-orange-50 rounded">
                        <Target className="w-4 h-4 text-orange-600 mr-2" />
                        <span className="text-sm text-orange-800">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Commentaires du Manager</h4>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-700">{selectedReview.feedback.managerComments}</p>
                </div>
              </div>

              {selectedReview.feedback.employeeComments && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Commentaires de l'Employé</h4>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">{selectedReview.feedback.employeeComments}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => handleEditReview(selectedReview)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Performance Review Modal */}
      <NewPerformanceReviewForm 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveReview}
      />

      {/* Edit Performance Review Modal */}
      {selectedReviewForEdit && (
        <NewPerformanceReviewForm 
          isOpen={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setSelectedReviewForEdit(null);
          }}
          onSave={handleSaveReview}
          initialData={selectedReviewForEdit}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default PerformanceManagement;