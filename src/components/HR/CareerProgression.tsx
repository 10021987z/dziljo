import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Award, Plus, Edit, Eye, ArrowUp, ArrowRight, User, Briefcase } from 'lucide-react';

interface CareerEvent {
  id: number;
  employeeId: number;
  employeeName: string;
  type: 'promotion' | 'salary-increase' | 'position-change' | 'department-change';
  date: string;
  previousPosition: string;
  newPosition: string;
  previousSalary?: number;
  newSalary?: number;
  previousDepartment?: string;
  newDepartment?: string;
  reason: string;
  approvedBy: string;
  effectiveDate: string;
  notes?: string;
}

interface PerformanceReview {
  id: number;
  employeeId: number;
  employeeName: string;
  reviewDate: string;
  period: string;
  overallScore: number;
  goals: Array<{
    title: string;
    status: 'achieved' | 'partially-achieved' | 'not-achieved';
    score: number;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  nextGoals: string[];
  reviewerName: string;
  nextReviewDate: string;
}

const CareerProgression: React.FC = () => {
  const [activeTab, setActiveTab] = useState('progression');
  
  const [careerEvents, setCareerEvents] = useState<CareerEvent[]>([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      type: 'promotion',
      date: '2024-01-15',
      previousPosition: 'Développeur Full Stack',
      newPosition: 'Développeur Full Stack Senior',
      previousSalary: 45000,
      newSalary: 55000,
      reason: 'Excellentes performances et leadership technique démontré',
      approvedBy: 'Jean Dupont',
      effectiveDate: '2024-02-01',
      notes: 'Promotion méritée après 18 mois d\'excellents résultats'
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      type: 'salary-increase',
      date: '2023-12-10',
      previousPosition: 'Designer UX/UI',
      newPosition: 'Designer UX/UI',
      previousSalary: 40000,
      newSalary: 45000,
      reason: 'Augmentation annuelle basée sur les performances',
      approvedBy: 'Marie Rousseau',
      effectiveDate: '2024-01-01'
    },
    {
      id: 3,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      type: 'position-change',
      date: '2023-03-15',
      previousPosition: 'Développeur Junior',
      newPosition: 'Développeur Full Stack',
      previousSalary: 35000,
      newSalary: 45000,
      reason: 'Montée en compétences et prise de responsabilités',
      approvedBy: 'Jean Dupont',
      effectiveDate: '2023-04-01'
    }
  ]);

  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      reviewDate: '2024-01-10',
      period: 'Juillet 2023 - Décembre 2023',
      overallScore: 4.5,
      goals: [
        { title: 'Améliorer les performances de l\'application', status: 'achieved', score: 5 },
        { title: 'Mentorer un développeur junior', status: 'achieved', score: 4 },
        { title: 'Obtenir certification AWS', status: 'partially-achieved', score: 3 }
      ],
      strengths: ['Leadership technique', 'Qualité du code', 'Collaboration'],
      areasForImprovement: ['Gestion du temps', 'Communication écrite'],
      nextGoals: ['Diriger un projet majeur', 'Améliorer la documentation'],
      reviewerName: 'Jean Dupont',
      nextReviewDate: '2024-07-10'
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      reviewDate: '2023-12-15',
      period: 'Juin 2023 - Novembre 2023',
      overallScore: 4.2,
      goals: [
        { title: 'Créer le nouveau design system', status: 'achieved', score: 5 },
        { title: 'Former l\'équipe sur Figma', status: 'achieved', score: 4 },
        { title: 'Améliorer l\'accessibilité', status: 'not-achieved', score: 2 }
      ],
      strengths: ['Créativité', 'Attention aux détails', 'Collaboration'],
      areasForImprovement: ['Respect des délais', 'Connaissances techniques'],
      nextGoals: ['Maîtriser l\'accessibilité web', 'Développer des compétences en animation'],
      reviewerName: 'Marie Rousseau',
      nextReviewDate: '2024-06-15'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'promotion': return <ArrowUp className="w-4 h-4" />;
      case 'salary-increase': return <DollarSign className="w-4 h-4" />;
      case 'position-change': return <ArrowRight className="w-4 h-4" />;
      case 'department-change': return <Briefcase className="w-4 h-4" />;
      default: return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'promotion': return 'Promotion';
      case 'salary-increase': return 'Augmentation';
      case 'position-change': return 'Changement de poste';
      case 'department-change': return 'Changement de département';
      default: return type;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'promotion': return 'bg-green-100 text-green-800';
      case 'salary-increase': return 'bg-blue-100 text-blue-800';
      case 'position-change': return 'bg-purple-100 text-purple-800';
      case 'department-change': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-green-100 text-green-800';
      case 'partially-achieved': return 'bg-yellow-100 text-yellow-800';
      case 'not-achieved': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGoalStatusText = (status: string) => {
    switch (status) {
      case 'achieved': return 'Atteint';
      case 'partially-achieved': return 'Partiellement atteint';
      case 'not-achieved': return 'Non atteint';
      default: return status;
    }
  };

  const getEmployeeCareerPath = (employeeId: number) => {
    return careerEvents
      .filter(event => event.employeeId === employeeId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const totalPromotions = careerEvents.filter(e => e.type === 'promotion').length;
  const totalSalaryIncreases = careerEvents.filter(e => e.type === 'salary-increase').length;
  const avgPerformanceScore = performanceReviews.reduce((sum, review) => sum + review.overallScore, 0) / performanceReviews.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Évolution de Carrière</h2>
          <p className="text-slate-600">Suivez les promotions, augmentations et évaluations de performance</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Événement
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Promotions</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{totalPromotions}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <ArrowUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Augmentations</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{totalSalaryIncreases}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Score Moyen</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{avgPerformanceScore.toFixed(1)}/5</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Évaluations</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{performanceReviews.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'progression', name: 'Évolutions de Carrière' },
            { id: 'reviews', name: 'Évaluations de Performance' },
            { id: 'timeline', name: 'Chronologie par Employé' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {activeTab === 'progression' && (
          <div className="space-y-4">
            {careerEvents.map((event) => (
              <div key={event.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{event.employeeName}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getEventTypeColor(event.type)}`}>
                        {getEventTypeIcon(event.type)}
                        <span className="ml-1">{getEventTypeText(event.type)}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-sm font-medium text-slate-700">Évolution:</span>
                        <div className="text-sm text-slate-600">
                          {event.previousPosition} → {event.newPosition}
                        </div>
                      </div>
                      
                      {event.previousSalary && event.newSalary && (
                        <div>
                          <span className="text-sm font-medium text-slate-700">Salaire:</span>
                          <div className="text-sm text-slate-600">
                            {event.previousSalary.toLocaleString()}€ → {event.newSalary.toLocaleString()}€
                            <span className="text-green-600 ml-2">
                              (+{((event.newSalary - event.previousSalary) / event.previousSalary * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-slate-600 mb-2">
                      <span className="font-medium">Motif:</span> {event.reason}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-500">
                      <div>
                        <span className="font-medium">Date:</span> {event.date}
                      </div>
                      <div>
                        <span className="font-medium">Effectif le:</span> {event.effectiveDate}
                      </div>
                      <div>
                        <span className="font-medium">Approuvé par:</span> {event.approvedBy}
                      </div>
                    </div>

                    {event.notes && (
                      <div className="mt-2 p-2 bg-slate-100 rounded text-sm text-slate-700">
                        <span className="font-medium">Notes:</span> {event.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {performanceReviews.map((review) => (
              <div key={review.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-1">{review.employeeName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>Période: {review.period}</span>
                      <span>Évalué le: {review.reviewDate}</span>
                      <span>Par: {review.reviewerName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{review.overallScore}/5</div>
                    <div className="text-sm text-slate-500">Score global</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-slate-900 mb-2">Objectifs</h5>
                    <div className="space-y-2">
                      {review.goals.map((goal, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                          <span className="text-sm text-slate-700">{goal.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{goal.score}/5</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getGoalStatusColor(goal.status)}`}>
                              {getGoalStatusText(goal.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Points Forts</h5>
                      <div className="flex flex-wrap gap-1">
                        {review.strengths.map((strength, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-slate-900 mb-2">Axes d'Amélioration</h5>
                      <div className="flex flex-wrap gap-1">
                        {review.areasForImprovement.map((area, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h5 className="font-medium text-slate-900 mb-2">Objectifs pour la Prochaine Période</h5>
                  <div className="flex flex-wrap gap-1">
                    {review.nextGoals.map((goal, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {goal}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-slate-500">
                    Prochaine évaluation: {review.nextReviewDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <div className="flex space-x-4">
              <select
                value={selectedEmployee || ''}
                onChange={(e) => setSelectedEmployee(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Sélectionner un employé</option>
                <option value={1}>Sophie Martin</option>
                <option value={2}>Thomas Dubois</option>
              </select>
            </div>

            {selectedEmployee && (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                <div className="space-y-6">
                  {getEmployeeCareerPath(selectedEmployee).map((event, index) => (
                    <div key={event.id} className="relative flex items-start">
                      <div className="absolute left-2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
                      <div className="ml-10 bg-white p-4 rounded-lg border border-slate-200 flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getEventTypeColor(event.type)}`}>
                            {getEventTypeIcon(event.type)}
                            <span className="ml-1">{getEventTypeText(event.type)}</span>
                          </span>
                          <span className="text-sm text-slate-500">{event.date}</span>
                        </div>
                        <h4 className="font-medium text-slate-900 mb-1">
                          {event.previousPosition} → {event.newPosition}
                        </h4>
                        {event.previousSalary && event.newSalary && (
                          <p className="text-sm text-slate-600 mb-1">
                            Salaire: {event.previousSalary.toLocaleString()}€ → {event.newSalary.toLocaleString()}€
                          </p>
                        )}
                        <p className="text-sm text-slate-600">{event.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!selectedEmployee && (
              <div className="text-center py-8">
                <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Sélectionnez un employé pour voir sa chronologie de carrière</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerProgression;