import React, { useState } from 'react';
import { Users, UserPlus, Calendar, TrendingUp, Award, Clock, AlertCircle, CheckCircle, BarChart3, FileText, GraduationCap, Heart, DollarSign, Target } from 'lucide-react';

const HRDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample data for HR metrics
  const hrMetrics = {
    totalEmployees: 47,
    newHires: 3,
    turnoverRate: 8.5,
    avgSalary: 52000,
    satisfactionScore: 4.2,
    trainingHours: 156,
    openPositions: 5,
    pendingLeaves: 8,
    upcomingReviews: 12,
    certifications: 23
  };

  const recentActivities = [
    { type: 'hire', message: 'Sophie Martin a été embauchée comme Développeur Senior', time: '2h', icon: UserPlus, color: 'text-green-600' },
    { type: 'leave', message: 'Thomas Dubois a demandé 5 jours de congés', time: '4h', icon: Calendar, color: 'text-blue-600' },
    { type: 'training', message: 'Formation React terminée par 8 employés', time: '1j', icon: GraduationCap, color: 'text-purple-600' },
    { type: 'review', message: 'Évaluation annuelle de Marie Rousseau programmée', time: '2j', icon: Award, color: 'text-orange-600' }
  ];

  const departmentStats = [
    { name: 'Technique', employees: 18, budget: 95000, satisfaction: 4.3, color: 'bg-blue-500' },
    { name: 'Commercial', employees: 12, budget: 68000, satisfaction: 4.1, color: 'bg-green-500' },
    { name: 'Design', employees: 8, budget: 45000, satisfaction: 4.5, color: 'bg-purple-500' },
    { name: 'Administration', employees: 9, budget: 52000, satisfaction: 3.9, color: 'bg-orange-500' }
  ];

  const upcomingEvents = [
    { title: 'Entretien - Développeur Full Stack', date: '2024-01-28', time: '14:00', type: 'interview' },
    { title: 'Formation Sécurité Informatique', date: '2024-01-30', time: '09:00', type: 'training' },
    { title: 'Évaluation Annuelle - Pierre Martin', date: '2024-02-02', time: '15:30', type: 'review' },
    { title: 'Réunion Équipe RH', date: '2024-02-05', time: '10:00', type: 'meeting' }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'interview': return <Users className="w-4 h-4" />;
      case 'training': return <GraduationCap className="w-4 h-4" />;
      case 'review': return <Award className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'review': return 'bg-orange-100 text-orange-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tableau de Bord RH</h1>
          <p className="text-slate-600">Vue d'ensemble de vos ressources humaines</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <UserPlus className="w-4 h-4 mr-2" />
            Actions Rapides
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{hrMetrics.totalEmployees}</div>
              <div className="text-sm text-slate-500">Employés</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">+{hrMetrics.newHires} ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{hrMetrics.turnoverRate}%</div>
              <div className="text-sm text-slate-500">Turnover</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">Sous la moyenne</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-500 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{hrMetrics.satisfactionScore}/5</div>
              <div className="text-sm text-slate-500">Satisfaction</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">+0.3 vs dernier trimestre</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-500 p-3 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">{hrMetrics.trainingHours}h</div>
              <div className="text-sm text-slate-500">Formation</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Target className="w-4 h-4 text-blue-600 mr-1" />
            <span className="text-blue-600">{hrMetrics.certifications} certifications</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900">€{(hrMetrics.avgSalary / 1000).toFixed(0)}k</div>
              <div className="text-sm text-slate-500">Salaire Moyen</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-green-600">+5% vs année dernière</span>
          </div>
        </div>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            Actions Requises
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-orange-900">Congés en attente</p>
                <p className="text-xs text-orange-700">{hrMetrics.pendingLeaves} demandes</p>
              </div>
              <button className="text-orange-600 hover:text-orange-700">
                <CheckCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Évaluations à venir</p>
                <p className="text-xs text-blue-700">{hrMetrics.upcomingReviews} prévues</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700">
                <Calendar className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Postes ouverts</p>
                <p className="text-xs text-green-700">{hrMetrics.openPositions} à pourvoir</p>
              </div>
              <button className="text-green-600 hover:text-green-700">
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Performance par Département
          </h3>
          <div className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${dept.color} mr-3`}></div>
                  <div>
                    <p className="font-medium text-slate-900">{dept.name}</p>
                    <p className="text-sm text-slate-600">{dept.employees} employés</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-slate-900">€{(dept.budget / 1000).toFixed(0)}k</p>
                      <p className="text-xs text-slate-500">Budget</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{dept.satisfaction}/5</p>
                      <p className="text-xs text-slate-500">Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-purple-500" />
            Événements à Venir
          </h3>
          <div className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-3 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getEventColor(event.type)}`}>
                    {getEventIcon(event.type)}
                    <span className="ml-1 capitalize">{event.type}</span>
                  </span>
                  <span className="text-xs text-slate-500">{event.date}</span>
                </div>
                <p className="text-sm font-medium text-slate-900">{event.title}</p>
                <p className="text-xs text-slate-600">{event.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-slate-600" />
          Activités Récentes
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10`}>
                <activity.icon className={`w-4 h-4 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                <p className="text-xs text-slate-500">Il y a {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Croissance de l'Équipe</h3>
          <p className="text-blue-100 mb-1">+{hrMetrics.newHires} nouveaux employés</p>
          <p className="text-sm text-blue-200">Croissance de 6.8% ce trimestre</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Excellence Opérationnelle</h3>
          <p className="text-green-100 mb-1">Satisfaction employés: {hrMetrics.satisfactionScore}/5</p>
          <p className="text-sm text-green-200">Turnover sous la moyenne du secteur</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <GraduationCap className="w-8 h-8" />
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Développement des Talents</h3>
          <p className="text-purple-100 mb-1">{hrMetrics.trainingHours}h de formation</p>
          <p className="text-sm text-purple-200">{hrMetrics.certifications} certifications obtenues</p>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;