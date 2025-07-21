import React, { useState } from 'react';
import { Calendar, Clock, Plus, Edit, Trash2, Users, MapPin, Phone, Mail, Video, ChevronLeft, ChevronRight, Filter, Search, Bell, Target, Star, Tag, MessageSquare, Link, FileText, User, Building2 } from 'lucide-react';
import NewEventModal from './NewEventModal';

interface CalendarEvent {
  id: number;
  title: string;
  type: 'meeting' | 'call' | 'demo' | 'proposal' | 'follow-up' | 'internal';
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  attendees: string[];
  client: string;
  contact: string;
  email: string;
  phone: string;
  description: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  priority: 'low' | 'medium' | 'high';
  opportunity?: string;
  notes: string;
  reminderSet: boolean;
  tags?: string[];
  documents?: any[];
}

const CommercialCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 1,
      title: 'Démonstration CRM - TechCorp',
      type: 'demo',
      date: '2024-01-26',
      startTime: '10:00',
      endTime: '11:30',
      duration: 90,
      location: 'Visioconférence - Google Meet',
      attendees: ['Jean Dupont', 'Sophie Martin'],
      client: 'TechCorp Solutions',
      contact: 'Jean Dupont',
      email: 'j.dupont@techcorp.com',
      phone: '+33 1 23 45 67 89',
      description: 'Présentation de la solution CRM avec focus sur les fonctionnalités enterprise',
      status: 'confirmed',
      priority: 'high',
      opportunity: 'Projet CRM Enterprise - TechCorp',
      notes: 'Préparer démo avec données de test similaires à leur environnement',
      reminderSet: true
    },
    {
      id: 2,
      title: 'Suivi Proposition - Digital Innov',
      type: 'follow-up',
      date: '2024-01-26',
      startTime: '14:00',
      endTime: '14:30',
      duration: 30,
      location: 'Appel téléphonique',
      attendees: ['Marie Rousseau', 'Thomas Dubois'],
      client: 'Digital Innovations',
      contact: 'Marie Rousseau',
      email: 'm.rousseau@digital-innov.com',
      phone: '+33 1 98 76 54 32',
      description: 'Suivi de la proposition commerciale envoyée la semaine dernière',
      status: 'scheduled',
      priority: 'medium',
      opportunity: 'Solution Marketing Automation - Digital Innov',
      notes: 'Répondre aux questions sur le ROI et le planning d\'implémentation',
      reminderSet: true
    },
    {
      id: 3,
      title: 'Réunion Équipe Commerciale',
      type: 'internal',
      date: '2024-01-26',
      startTime: '16:00',
      endTime: '17:00',
      duration: 60,
      location: 'Salle de réunion A',
      attendees: ['Sophie Martin', 'Thomas Dubois', 'Pierre Rousseau'],
      client: 'Interne',
      contact: 'Équipe Commerciale',
      email: '',
      phone: '',
      description: 'Point hebdomadaire sur les opportunités en cours',
      status: 'scheduled',
      priority: 'medium',
      notes: 'Préparer rapport des activités de la semaine',
      reminderSet: false
    },
    {
      id: 4,
      title: 'Présentation Proposition - StartupXYZ',
      type: 'proposal',
      date: '2024-01-29',
      startTime: '11:00',
      endTime: '12:30',
      duration: 90,
      location: 'Bureaux StartupXYZ - 15 Rue de la Tech, Paris',
      attendees: ['Pierre Martin', 'Sophie Martin'],
      client: 'StartupXYZ',
      contact: 'Pierre Martin',
      email: 'p.martin@startupxyz.fr',
      phone: '+33 1 11 22 33 44',
      description: 'Présentation de la proposition pour la transformation digitale',
      status: 'scheduled',
      priority: 'high',
      opportunity: 'Transformation Digitale - StartupXYZ',
      notes: 'Apporter portfolio de projets similaires',
      reminderSet: true
    }
  ]);

  const handleCreateEvent = (eventData: any) => {
    const newEvent: CalendarEvent = {
      id: Date.now(),
      ...eventData,
      status: 'scheduled'
    };
    
    setEvents(prev => [...prev, newEvent]);
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Événement créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleUpdateEvent = (eventData: any) => {
    setEvents(prev => prev.map(event => 
      event.id === selectedEvent?.id ? { ...event, ...eventData } : event
    ));
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Événement mis à jour avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleDeleteEvent = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      setEvents(prev => prev.filter(event => event.id !== id));
      setSelectedEvent(null);
      
      // Show success notification
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Événement supprimé avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'call': return 'bg-green-100 text-green-800 border-green-200';
      case 'demo': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'proposal': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'internal': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeText = (type: string) => {
    switch (type) {
      case 'meeting': return 'Réunion';
      case 'call': return 'Appel';
      case 'demo': return 'Démonstration';
      case 'proposal': return 'Proposition';
      case 'follow-up': return 'Suivi';
      case 'internal': return 'Interne';
      default: return type;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'demo': return <Video className="w-4 h-4" />;
      case 'proposal': return <FileText className="w-4 h-4" />;
      case 'follow-up': return <MessageSquare className="w-4 h-4" />;
      case 'internal': return <Building2 className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'rescheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planifié';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      case 'rescheduled': return 'Reporté';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.contact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || event.type === filterType;
    const matchesStatus = !filterStatus || event.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const eventStats = {
    total: events.length,
    today: getEventsForDate(new Date()).length,
    thisWeek: events.filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      return eventDate >= weekStart && eventDate <= weekEnd;
    }).length,
    confirmed: events.filter(event => event.status === 'confirmed').length
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agenda Commercial</h2>
          <p className="text-slate-600">Gérez vos rendez-vous et activités commerciales</p>
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
              <p className="text-sm font-medium text-slate-600">Total RDV</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{eventStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{eventStats.today}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Cette Semaine</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{eventStats.thisWeek}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Confirmés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{eventStats.confirmed}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-slate-900 min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Mois
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Semaine
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Jour
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher événements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les types</option>
              <option value="meeting">Réunion</option>
              <option value="call">Appel</option>
              <option value="demo">Démonstration</option>
              <option value="proposal">Proposition</option>
              <option value="follow-up">Suivi</option>
              <option value="internal">Interne</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="scheduled">Planifié</option>
              <option value="confirmed">Confirmé</option>
              <option value="completed">Terminé</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center font-medium text-slate-700 bg-slate-50">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {getDaysInMonth(currentDate).map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-slate-200 ${
                  day ? 'bg-white hover:bg-slate-50' : 'bg-slate-50'
                } transition-colors`}
              >
                {day && (
                  <>
                    <div className="font-medium text-slate-900 mb-1">
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {getEventsForDate(day).slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`text-xs p-1 rounded cursor-pointer border ${getEventTypeColor(event.type)}`}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-xs opacity-75">{event.startTime}</div>
                        </div>
                      ))}
                      {getEventsForDate(day).length > 3 && (
                        <div className="text-xs text-slate-500 text-center">
                          +{getEventsForDate(day).length - 3} autres
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* List View for Week/Day */}
        {(viewMode === 'week' || viewMode === 'day') && (
          <div className="space-y-3">
            {filteredEvents
              .filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                
                if (viewMode === 'day') {
                  return eventDate.toDateString() === today.toDateString();
                } else {
                  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
                  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
                  return eventDate >= weekStart && eventDate <= weekEnd;
                }
              })
              .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
              .map((event) => (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-slate-900">{event.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                          <span className="ml-1">{getEventTypeText(event.type)}</span>
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {event.date} • {event.startTime} - {event.endTime}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {event.client} - {event.contact}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-sm font-medium ${getPriorityColor(event.priority)}`}>
                      {event.priority === 'high' ? '🔴' : event.priority === 'medium' ? '🟡' : '🟢'}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{selectedEvent.title}</h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getEventTypeColor(selectedEvent.type)}`}>
                      {getEventTypeIcon(selectedEvent.type)}
                      <span className="ml-1">{getEventTypeText(selectedEvent.type)}</span>
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedEvent.status)}`}>
                      {getStatusText(selectedEvent.status)}
                    </span>
                    {selectedEvent.tags && selectedEvent.tags.length > 0 && selectedEvent.tags[0] !== '' && (
                      <div className="flex items-center space-x-1">
                        {selectedEvent.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      setShowEditModal(true);
                      setSelectedEvent(null);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Informations Générales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                        <span>{selectedEvent.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-slate-500" />
                        <span>{selectedEvent.startTime} - {selectedEvent.endTime} ({selectedEvent.duration} min)</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                        <span>{selectedEvent.location}</span>
                      </div>
                      {selectedEvent.reminderSet && (
                        <div className="flex items-center">
                          <Bell className="w-4 h-4 mr-2 text-slate-500" />
                          <span>Rappel activé</span>
                        </div>
                      )}
                      {selectedEvent.priority && (
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-2 text-slate-500" />
                          <span className={`font-medium ${getPriorityColor(selectedEvent.priority)}`}>
                            Priorité {selectedEvent.priority === 'high' ? 'Haute' : selectedEvent.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Contact</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Client:</span>
                        <p className="text-slate-900">{selectedEvent.client}</p>
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span>
                        <p className="text-slate-900">{selectedEvent.contact}</p>
                      </div>
                      {selectedEvent.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-slate-500" />
                          <span>{selectedEvent.email}</span>
                        </div>
                      )}
                      {selectedEvent.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-slate-500" />
                          <span>{selectedEvent.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Participants</h4>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-slate-500" />
                          <span>{attendee}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedEvent.opportunity && (
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Opportunité Liée</h4>
                      <div className="flex items-center text-sm bg-blue-50 p-2 rounded-lg">
                        <Star className="w-4 h-4 mr-2 text-blue-600" />
                        <p className="text-blue-800">{selectedEvent.opportunity}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Priorité</h4>
                    <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getPriorityColor(selectedEvent.priority)}`}>
                      {selectedEvent.priority === 'high' && '🔴 Haute'}
                      {selectedEvent.priority === 'medium' && '🟡 Moyenne'}
                      {selectedEvent.priority === 'low' && '🟢 Basse'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedEvent.description}</p>
              </div>

              {/* Notes */}
              {selectedEvent.notes && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                  <p className="text-sm text-slate-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">{selectedEvent.notes}</p>
                </div>
              )}

              {/* Documents */}
              {selectedEvent.documents && selectedEvent.documents.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Documents</h4>
                  <div className="space-y-2">
                    {selectedEvent.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-slate-500" />
                          <span className="text-sm text-slate-900">{doc.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button 
                  onClick={() => {
                    setShowEditModal(true);
                    setSelectedEvent(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Video className="w-4 h-4 mr-2" />
                  Rejoindre
                </button>
                <button 
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      <NewEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateEvent}
      />

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <NewEventModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateEvent}
          initialData={selectedEvent}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default CommercialCalendar;