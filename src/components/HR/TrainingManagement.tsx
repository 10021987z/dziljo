import React, { useState } from 'react';
import { GraduationCap, Plus, Calendar, Clock, Users, Award, BookOpen, Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface Training {
  id: number;
  title: string;
  description: string;
  provider: string;
  category: string;
  duration: number; // in hours
  startDate: string;
  endDate: string;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  maxParticipants: number;
  currentParticipants: number;
  cost: number;
  location: string;
  instructor: string;
  skills: string[];
}

interface EmployeeTraining {
  id: number;
  employeeId: number;
  employeeName: string;
  trainingId: number;
  trainingTitle: string;
  status: 'enrolled' | 'in-progress' | 'completed' | 'failed';
  enrollmentDate: string;
  completionDate?: string;
  score?: number;
  certificate?: string;
}

interface Certification {
  id: number;
  employeeId: number;
  employeeName: string;
  name: string;
  provider: string;
  obtainedDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'expiring-soon';
  certificateUrl?: string;
}

const TrainingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trainings');
  
  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: 1,
      title: 'Formation React Avancé',
      description: 'Formation approfondie sur React, hooks avancés et optimisation des performances',
      provider: 'TechFormation',
      category: 'Développement',
      duration: 24,
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      status: 'planned',
      maxParticipants: 12,
      currentParticipants: 8,
      cost: 1200,
      location: 'Salle de formation A',
      instructor: 'Jean-Pierre Développeur',
      skills: ['React', 'JavaScript', 'Performance', 'Hooks']
    },
    {
      id: 2,
      title: 'Gestion de Projet Agile',
      description: 'Méthodologies Scrum et Kanban pour une gestion de projet efficace',
      provider: 'AgileAcademy',
      category: 'Management',
      duration: 16,
      startDate: '2024-01-20',
      endDate: '2024-01-21',
      status: 'completed',
      maxParticipants: 15,
      currentParticipants: 12,
      cost: 800,
      location: 'En ligne',
      instructor: 'Marie Scrum',
      skills: ['Scrum', 'Kanban', 'Leadership', 'Communication']
    },
    {
      id: 3,
      title: 'Design System et Figma',
      description: 'Création et maintenance de design systems avec Figma',
      provider: 'DesignPro',
      category: 'Design',
      duration: 12,
      startDate: '2024-02-10',
      endDate: '2024-02-10',
      status: 'ongoing',
      maxParticipants: 8,
      currentParticipants: 6,
      cost: 600,
      location: 'Studio Design',
      instructor: 'Sophie Designer',
      skills: ['Figma', 'Design System', 'UI/UX', 'Prototyping']
    }
  ]);

  const [employeeTrainings, setEmployeeTrainings] = useState<EmployeeTraining[]>([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      trainingId: 1,
      trainingTitle: 'Formation React Avancé',
      status: 'enrolled',
      enrollmentDate: '2024-01-15'
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      trainingId: 3,
      trainingTitle: 'Design System et Figma',
      status: 'in-progress',
      enrollmentDate: '2024-02-01'
    },
    {
      id: 3,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      trainingId: 2,
      trainingTitle: 'Gestion de Projet Agile',
      status: 'completed',
      enrollmentDate: '2024-01-10',
      completionDate: '2024-01-21',
      score: 92
    }
  ]);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: 1,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      name: 'AWS Certified Developer',
      provider: 'Amazon Web Services',
      obtainedDate: '2023-06-15',
      expiryDate: '2026-06-15',
      status: 'active'
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: 'Thomas Dubois',
      name: 'Adobe Certified Expert',
      provider: 'Adobe',
      obtainedDate: '2023-03-20',
      expiryDate: '2024-03-20',
      status: 'expiring-soon'
    },
    {
      id: 3,
      employeeId: 1,
      employeeName: 'Sophie Martin',
      name: 'Scrum Master Certified',
      provider: 'Scrum Alliance',
      obtainedDate: '2022-11-10',
      expiryDate: '2023-11-10',
      status: 'expired'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTraining, setNewTraining] = useState({
    title: '',
    description: '',
    provider: '',
    category: 'Développement',
    duration: 8,
    startDate: '',
    endDate: '',
    maxParticipants: 10,
    cost: 0,
    location: '',
    instructor: '',
    skills: ['']
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'enrolled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring-soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned': return 'Planifiée';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      case 'enrolled': return 'Inscrit';
      case 'in-progress': return 'En cours';
      case 'failed': return 'Échoué';
      case 'active': return 'Active';
      case 'expired': return 'Expirée';
      case 'expiring-soon': return 'Expire bientôt';
      default: return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Développement': return 'bg-blue-100 text-blue-800';
      case 'Design': return 'bg-purple-100 text-purple-800';
      case 'Management': return 'bg-green-100 text-green-800';
      case 'Commercial': return 'bg-orange-100 text-orange-800';
      case 'RH': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalTrainings = trainings.length;
  const ongoingTrainings = trainings.filter(t => t.status === 'ongoing').length;
  const completedTrainings = trainings.filter(t => t.status === 'completed').length;
  const totalParticipants = employeeTrainings.length;

  const addSkill = () => {
    setNewTraining({
      ...newTraining,
      skills: [...newTraining.skills, '']
    });
  };

  const updateSkill = (index: number, value: string) => {
    const updated = [...newTraining.skills];
    updated[index] = value;
    setNewTraining({ ...newTraining, skills: updated });
  };

  const removeSkill = (index: number) => {
    const updated = newTraining.skills.filter((_, i) => i !== index);
    setNewTraining({ ...newTraining, skills: updated });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Formations</h2>
          <p className="text-slate-600">Organisez et suivez les formations et certifications de vos équipes</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Formation
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Formations</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{totalTrainings}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Cours</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{ongoingTrainings}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Terminées</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{completedTrainings}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Participants</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{totalParticipants}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'trainings', name: 'Formations', icon: BookOpen },
            { id: 'participants', name: 'Participants', icon: Users },
            { id: 'certifications', name: 'Certifications', icon: Award }
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

        {activeTab === 'trainings' && (
          <div className="space-y-4">
            {trainings.map((training) => (
              <div key={training.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{training.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(training.category)}`}>
                        {training.category}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(training.status)}`}>
                        {getStatusText(training.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{training.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Formateur:</span> {training.instructor}
                      </div>
                      <div>
                        <span className="font-medium">Durée:</span> {training.duration}h
                      </div>
                      <div>
                        <span className="font-medium">Participants:</span> {training.currentParticipants}/{training.maxParticipants}
                      </div>
                      <div>
                        <span className="font-medium">Coût:</span> {training.cost}€
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {training.startDate} - {training.endDate}
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {training.location}
                      </div>
                    </div>

                    <div className="mt-3">
                      <span className="text-sm font-medium text-slate-700">Compétences: </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {training.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4">
                    <div className="text-right">
                      <div className="text-sm text-slate-500 mb-1">Taux de remplissage</div>
                      <div className="w-20 bg-slate-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(training.currentParticipants / training.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-slate-600">
                        {Math.round((training.currentParticipants / training.maxParticipants) * 100)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'participants' && (
          <div className="space-y-4">
            {employeeTrainings.map((participation) => (
              <div key={participation.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{participation.employeeName}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(participation.status)}`}>
                        {getStatusText(participation.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">{participation.trainingTitle}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Inscrit le:</span> {participation.enrollmentDate}
                      </div>
                      {participation.completionDate && (
                        <div>
                          <span className="font-medium">Terminé le:</span> {participation.completionDate}
                        </div>
                      )}
                      {participation.score && (
                        <div>
                          <span className="font-medium">Score:</span> {participation.score}%
                        </div>
                      )}
                    </div>
                  </div>

                  {participation.score && (
                    <div className="ml-4 text-right">
                      <div className="text-sm text-slate-500 mb-1">Score</div>
                      <div className={`text-2xl font-bold ${
                        participation.score >= 80 ? 'text-green-600' : 
                        participation.score >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {participation.score}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium text-slate-900">{cert.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(cert.status)}`}>
                        {getStatusText(cert.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">{cert.employeeName}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Organisme:</span> {cert.provider}
                      </div>
                      <div>
                        <span className="font-medium">Obtenue le:</span> {cert.obtainedDate}
                      </div>
                      {cert.expiryDate && (
                        <div>
                          <span className="font-medium">Expire le:</span> {cert.expiryDate}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    {cert.status === 'expiring-soon' && (
                      <div className="flex items-center text-yellow-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">Expire bientôt</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Training Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvelle Formation</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Titre de la Formation *
                  </label>
                  <input
                    type="text"
                    value={newTraining.title}
                    onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Formation React Avancé"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    value={newTraining.category}
                    onChange={(e) => setNewTraining({ ...newTraining, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Développement">Développement</option>
                    <option value="Design">Design</option>
                    <option value="Management">Management</option>
                    <option value="Commercial">Commercial</option>
                    <option value="RH">Ressources Humaines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Organisme de Formation *
                  </label>
                  <input
                    type="text"
                    value={newTraining.provider}
                    onChange={(e) => setNewTraining({ ...newTraining, provider: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: TechFormation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Formateur *
                  </label>
                  <input
                    type="text"
                    value={newTraining.instructor}
                    onChange={(e) => setNewTraining({ ...newTraining, instructor: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom du formateur"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date de Début *
                  </label>
                  <input
                    type="date"
                    value={newTraining.startDate}
                    onChange={(e) => setNewTraining({ ...newTraining, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date de Fin *
                  </label>
                  <input
                    type="date"
                    value={newTraining.endDate}
                    onChange={(e) => setNewTraining({ ...newTraining, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Durée (heures) *
                  </label>
                  <input
                    type="number"
                    value={newTraining.duration}
                    onChange={(e) => setNewTraining({ ...newTraining, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Participants Max *
                  </label>
                  <input
                    type="number"
                    value={newTraining.maxParticipants}
                    onChange={(e) => setNewTraining({ ...newTraining, maxParticipants: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Coût (€)
                  </label>
                  <input
                    type="number"
                    value={newTraining.cost}
                    onChange={(e) => setNewTraining({ ...newTraining, cost: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lieu *
                  </label>
                  <input
                    type="text"
                    value={newTraining.location}
                    onChange={(e) => setNewTraining({ ...newTraining, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Salle A, En ligne, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newTraining.description}
                  onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description détaillée de la formation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Compétences Acquises
                </label>
                {newTraining.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: React, JavaScript, etc."
                    />
                    {newTraining.skills.length > 1 && (
                      <button
                        onClick={() => removeSkill(index)}
                        className="p-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addSkill}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + Ajouter une compétence
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Handle create training
                  setShowCreateModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer la Formation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingManagement;