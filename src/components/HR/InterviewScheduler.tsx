import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Video, Phone, Plus, Edit, Trash2, Bell } from 'lucide-react';

interface Interview {
  id: number;
  candidateName: string;
  candidateEmail: string;
  position: string;
  date: string;
  time: string;
  duration: number;
  type: 'presential' | 'video' | 'phone';
  location: string;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
}

const InterviewScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  
  const [interviews, setInterviews] = useState<Interview[]>([
    {
      id: 1,
      candidateName: 'Sophie Martin',
      candidateEmail: 's.martin@email.com',
      position: 'Développeur Full Stack',
      date: '2024-01-26',
      time: '10:00',
      duration: 60,
      type: 'video',
      location: 'Google Meet',
      interviewer: 'Jean Dupont',
      status: 'scheduled',
      notes: 'Entretien technique - Focus sur React et Node.js'
    },
    {
      id: 2,
      candidateName: 'Thomas Dubois',
      candidateEmail: 't.dubois@email.com',
      position: 'Designer UX/UI',
      date: '2024-01-26',
      time: '14:30',
      duration: 45,
      type: 'presential',
      location: 'Bureau Paris - Salle de réunion A',
      interviewer: 'Marie Rousseau',
      status: 'scheduled',
      notes: 'Présentation du portfolio et discussion sur l\'expérience'
    },
    {
      id: 3,
      candidateName: 'Pierre Rousseau',
      candidateEmail: 'p.rousseau@email.com',
      position: 'Chef de Projet',
      date: '2024-01-25',
      time: '16:00',
      duration: 90,
      type: 'video',
      location: 'Zoom',
      interviewer: 'Paul Martin',
      status: 'completed',
      notes: 'Entretien final avec l\'équipe de direction'
    }
  ]);

  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    candidateEmail: '',
    position: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video' as Interview['type'],
    location: '',
    interviewer: '',
    notes: ''
  });

  const getInterviewsByDate = (date: string) => {
    return interviews.filter(interview => interview.date === date);
  };

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled': return 'Planifié';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      case 'rescheduled': return 'Reporté';
      default: return status;
    }
  };

  const getTypeIcon = (type: Interview['type']) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'presential': return <MapPin className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeText = (type: Interview['type']) => {
    switch (type) {
      case 'video': return 'Visioconférence';
      case 'phone': return 'Téléphone';
      case 'presential': return 'Présentiel';
      default: return type;
    }
  };

  const handleCreateInterview = () => {
    const interview: Interview = {
      id: Date.now(),
      ...newInterview,
      status: 'scheduled'
    };
    
    setInterviews([...interviews, interview]);
    setShowCreateModal(false);
    setNewInterview({
      candidateName: '',
      candidateEmail: '',
      position: '',
      date: '',
      time: '',
      duration: 60,
      type: 'video',
      location: '',
      interviewer: '',
      notes: ''
    });
  };

  const todayInterviews = getInterviewsByDate(selectedDate);
  const upcomingInterviews = interviews.filter(interview => 
    new Date(interview.date) > new Date() && interview.status === 'scheduled'
  ).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Planning des Entretiens</h2>
          <p className="text-slate-600">Organisez et suivez vos entretiens de recrutement</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Planifier Entretien
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{todayInterviews.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Cette Semaine</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {interviews.filter(i => {
                  const interviewDate = new Date(i.date);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return interviewDate >= today && interviewDate <= weekFromNow;
                }).length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Terminés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {interviews.filter(i => i.status === 'completed').length}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Taux de Présence</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">92%</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Planning du Jour</h3>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            {todayInterviews.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Aucun entretien prévu pour cette date</p>
              </div>
            ) : (
              todayInterviews.map((interview) => (
                <div
                  key={interview.id}
                  onClick={() => setSelectedInterview(interview)}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center text-slate-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {interview.time}
                        </div>
                        <div className="flex items-center text-slate-600">
                          {getTypeIcon(interview.type)}
                          <span className="ml-1">{getTypeText(interview.type)}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(interview.status)}`}>
                          {getStatusText(interview.status)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-slate-900 mb-1">{interview.candidateName}</h4>
                      <p className="text-sm text-slate-600 mb-2">{interview.position}</p>
                      
                      <div className="flex items-center text-sm text-slate-500">
                        <User className="w-3 h-3 mr-1" />
                        Entretien avec {interview.interviewer}
                      </div>
                      
                      {interview.location && (
                        <div className="flex items-center text-sm text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {interview.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Prochains Entretiens</h3>
          
          <div className="space-y-3">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="p-3 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-slate-900 text-sm">{interview.candidateName}</h4>
                  <span className="text-xs text-slate-500">{interview.date}</span>
                </div>
                <p className="text-sm text-slate-600 mb-1">{interview.position}</p>
                <div className="flex items-center text-xs text-slate-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {interview.time} ({interview.duration}min)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Interview Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Planifier un Entretien</h3>
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
                    Nom du Candidat *
                  </label>
                  <input
                    type="text"
                    value={newInterview.candidateName}
                    onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Sophie Martin"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email du Candidat *
                  </label>
                  <input
                    type="email"
                    value={newInterview.candidateEmail}
                    onChange={(e) => setNewInterview({ ...newInterview, candidateEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="candidat@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Poste *
                  </label>
                  <input
                    type="text"
                    value={newInterview.position}
                    onChange={(e) => setNewInterview({ ...newInterview, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Développeur Full Stack"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Recruteur *
                  </label>
                  <select
                    value={newInterview.interviewer}
                    onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un recruteur</option>
                    <option value="Jean Dupont">Jean Dupont</option>
                    <option value="Marie Rousseau">Marie Rousseau</option>
                    <option value="Paul Martin">Paul Martin</option>
                    <option value="Sophie Durand">Sophie Durand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Durée (minutes) *
                  </label>
                  <select
                    value={newInterview.duration}
                    onChange={(e) => setNewInterview({ ...newInterview, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 heure</option>
                    <option value={90}>1h30</option>
                    <option value={120}>2 heures</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Type d'Entretien *
                  </label>
                  <select
                    value={newInterview.type}
                    onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value as Interview['type'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="video">Visioconférence</option>
                    <option value="presential">Présentiel</option>
                    <option value="phone">Téléphone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Lieu / Lien de Connexion *
                </label>
                <input
                  type="text"
                  value={newInterview.location}
                  onChange={(e) => setNewInterview({ ...newInterview, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Salle de réunion A ou https://meet.google.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newInterview.notes}
                  onChange={(e) => setNewInterview({ ...newInterview, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Notes sur l'entretien, points à aborder..."
                />
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
                onClick={handleCreateInterview}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Planifier l'Entretien
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Détails de l'Entretien</h3>
              <button 
                onClick={() => setSelectedInterview(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Candidat</p>
                  <p className="text-slate-900">{selectedInterview.candidateName}</p>
                  <p className="text-sm text-slate-600">{selectedInterview.candidateEmail}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Poste</p>
                  <p className="text-slate-900">{selectedInterview.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Date et Heure</p>
                  <p className="text-slate-900">{selectedInterview.date} à {selectedInterview.time}</p>
                  <p className="text-sm text-slate-600">Durée: {selectedInterview.duration} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Recruteur</p>
                  <p className="text-slate-900">{selectedInterview.interviewer}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Type</p>
                  <div className="flex items-center">
                    {getTypeIcon(selectedInterview.type)}
                    <span className="ml-2 text-slate-900">{getTypeText(selectedInterview.type)}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Statut</p>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedInterview.status)}`}>
                    {getStatusText(selectedInterview.status)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Lieu / Lien</p>
                <p className="text-slate-900">{selectedInterview.location}</p>
              </div>

              {selectedInterview.notes && (
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Notes</p>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-slate-900">{selectedInterview.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Modifier
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Marquer comme Terminé
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;