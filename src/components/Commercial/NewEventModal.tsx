import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, Clock, Users, MapPin, Video, Phone, Plus, Edit, Trash2, Bell, 
  Target, Star, Tag, MessageSquare, Link, FileText, User, Building2, Save, Mail,
  X, Check, ChevronLeft, ChevronRight
} from 'lucide-react';

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (eventData: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

interface EventFormData {
  title: string;
  type: 'meeting' | 'call' | 'demo' | 'proposal' | 'follow-up' | 'internal';
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location: string;
  locationType: 'physical' | 'virtual' | 'phone';
  client: string;
  contact: string;
  email: string;
  phone: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  opportunity: string;
  notes: string;
  attendees: string[];
  reminderSet: boolean;
  reminderTime: string;
  reminderUnit: 'minutes' | 'hours' | 'days';
  tags: string[];
  documents: File[];
  isRecurring: boolean;
  recurrencePattern: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  recurrenceEndDate: string;
}

const NewEventModal: React.FC<NewEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditing = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    type: 'meeting',
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    location: '',
    locationType: 'physical',
    client: '',
    contact: '',
    email: '',
    phone: '',
    description: '',
    priority: 'medium',
    opportunity: '',
    notes: '',
    attendees: [''],
    reminderSet: true,
    reminderTime: '15',
    reminderUnit: 'minutes',
    tags: [''],
    documents: [],
    isRecurring: false,
    recurrencePattern: 'weekly',
    recurrenceEndDate: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  // Clients and contacts data (would come from API in real app)
  const clients = [
    { id: 1, name: 'TechCorp Solutions', contacts: [
      { id: 1, name: 'Jean Dupont', email: 'j.dupont@techcorp.com', phone: '+33 1 23 45 67 89' },
      { id: 2, name: 'Marie Leclerc', email: 'm.leclerc@techcorp.com', phone: '+33 1 23 45 67 90' }
    ]},
    { id: 2, name: 'Digital Innovations', contacts: [
      { id: 3, name: 'Marie Rousseau', email: 'm.rousseau@digital-innov.com', phone: '+33 1 98 76 54 32' }
    ]},
    { id: 3, name: 'StartupXYZ', contacts: [
      { id: 4, name: 'Pierre Martin', email: 'p.martin@startupxyz.fr', phone: '+33 1 11 22 33 44' }
    ]}
  ];

  const opportunities = [
    { id: 1, title: 'Projet CRM Enterprise - TechCorp' },
    { id: 2, title: 'Solution Marketing Automation - Digital Innov' },
    { id: 3, title: 'Transformation Digitale - StartupXYZ' }
  ];

  // Initialize form with initial data if provided (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData
      });
    }
    
    // Set today's date as default if creating new event
    if (!isEditing && !initialData) {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: today
      }));
    }
  }, [initialData, isEditing]);

  // Focus on title input when modal opens
  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Calculate duration when start or end time changes
  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const diffMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
      
      if (diffMinutes > 0) {
        setFormData(prev => ({
          ...prev,
          duration: diffMinutes
        }));
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = parseInt(e.target.value);
    const selectedClient = clients.find(c => c.id === clientId);
    
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        client: selectedClient.name,
        contact: '',
        email: '',
        phone: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        client: '',
        contact: '',
        email: '',
        phone: ''
      }));
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const contactId = parseInt(e.target.value);
    const selectedClient = clients.find(c => c.name === formData.client);
    
    if (selectedClient) {
      const selectedContact = selectedClient.contacts.find(c => c.id === contactId);
      if (selectedContact) {
        setFormData(prev => ({
          ...prev,
          contact: selectedContact.name,
          email: selectedContact.email,
          phone: selectedContact.phone
        }));
      }
    }
  };

  const handleAttendeeChange = (index: number, value: string) => {
    const newAttendees = [...formData.attendees];
    newAttendees[index] = value;
    setFormData(prev => ({
      ...prev,
      attendees: newAttendees
    }));
  };

  const addAttendee = () => {
    setFormData(prev => ({
      ...prev,
      attendees: [...prev.attendees, '']
    }));
  };

  const removeAttendee = (index: number) => {
    const newAttendees = formData.attendees.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      attendees: newAttendees.length ? newAttendees : ['']
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, '']
    }));
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      tags: newTags.length ? newTags : ['']
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title) newErrors.title = 'Le titre est requis';
    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.startTime) newErrors.startTime = 'L\'heure de début est requise';
    if (!formData.endTime) newErrors.endTime = 'L\'heure de fin est requise';
    if (!formData.location) newErrors.location = 'Le lieu est requis';
    if (!formData.client) newErrors.client = 'Le client est requis';
    
    // Validate end time is after start time
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'L\'heure de fin doit être après l\'heure de début';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Clean up data before submission
      const cleanedData = {
        ...formData,
        attendees: formData.attendees.filter(a => a.trim() !== ''),
        tags: formData.tags.filter(t => t.trim() !== '')
      };
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          if (onSave) onSave(cleanedData);
          setShowSuccessMessage(false);
          onClose();
          if (!isEditing) resetForm();
        }, 1500);
      }, 1000);
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'meeting',
      date: '',
      startTime: '',
      endTime: '',
      duration: 60,
      location: '',
      locationType: 'physical',
      client: '',
      contact: '',
      email: '',
      phone: '',
      description: '',
      priority: 'medium',
      opportunity: '',
      notes: '',
      attendees: [''],
      reminderSet: true,
      reminderTime: '15',
      reminderUnit: 'minutes',
      tags: [''],
      documents: [],
      isRecurring: false,
      recurrencePattern: 'weekly',
      recurrenceEndDate: ''
    });
    setErrors({});
    setActiveTab('basic');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                {isEditing ? <Edit className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{isEditing ? 'Modifier l\'Événement' : 'Nouvel Événement'}</h1>
                <p className="text-white/80">Planifiez un rendez-vous dans votre agenda commercial</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 relative z-10">
            {[
              { id: 'basic', name: 'Informations de Base' },
              { id: 'details', name: 'Détails' },
              { id: 'attendees', name: 'Participants' },
              { id: 'documents', name: 'Documents' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-700'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab.name}
              </button>
            ))}
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
                {isEditing ? 'Événement Mis à Jour !' : 'Événement Créé avec Succès !'}
              </h2>
              <p className="text-slate-600 mb-6">
                {isEditing 
                  ? 'Les modifications ont été enregistrées dans votre agenda.' 
                  : 'Le nouvel événement a été ajouté à votre agenda.'}
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formData.date} • {formData.startTime}
                </div>
                {formData.reminderSet && (
                  <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    Rappel {formData.reminderTime} {formData.reminderUnit} avant
                  </div>
                )}
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {isEditing ? 'Mise à jour en cours...' : 'Création en cours...'}
              </h2>
              <p className="text-slate-600">Nous enregistrons votre événement</p>
            </div>
          ) : (
            <>
              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Titre <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={titleInputRef}
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.title ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ex: Réunion avec TechCorp"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type d'Événement
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="meeting">Réunion</option>
                        <option value="call">Appel</option>
                        <option value="demo">Démonstration</option>
                        <option value="proposal">Proposition</option>
                        <option value="follow-up">Suivi</option>
                        <option value="internal">Interne</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.date ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Heure de début <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border ${errors.startTime ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>
                        {errors.startTime && (
                          <p className="mt-1 text-sm text-red-500">{errors.startTime}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Heure de fin <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                          <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-2 border ${errors.endTime ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>
                        {errors.endTime && (
                          <p className="mt-1 text-sm text-red-500">{errors.endTime}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type de Lieu
                      </label>
                      <select
                        name="locationType"
                        value={formData.locationType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="physical">Présentiel</option>
                        <option value="virtual">Visioconférence</option>
                        <option value="phone">Téléphone</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Lieu / Lien <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        {formData.locationType === 'physical' ? (
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        ) : formData.locationType === 'virtual' ? (
                          <Video className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        ) : (
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        )}
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.location ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder={
                            formData.locationType === 'physical' 
                              ? 'Ex: Salle de réunion A, 123 Rue de Paris' 
                              : formData.locationType === 'virtual'
                                ? 'Ex: https://meet.google.com/abc-defg-hij'
                                : 'Ex: +33 1 23 45 67 89'
                          }
                        />
                      </div>
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Client <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                          name="client"
                          value={clients.find(c => c.name === formData.client)?.id || ''}
                          onChange={handleClientChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.client ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          <option value="">Sélectionner un client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.id}>{client.name}</option>
                          ))}
                        </select>
                      </div>
                      {errors.client && (
                        <p className="mt-1 text-sm text-red-500">{errors.client}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Contact
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                          name="contact"
                          value={
                            clients.find(c => c.name === formData.client)?.contacts.find(
                              contact => contact.name === formData.contact
                            )?.id || ''
                          }
                          onChange={handleContactChange}
                          disabled={!formData.client}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-400"
                        >
                          <option value="">Sélectionner un contact</option>
                          {clients.find(c => c.name === formData.client)?.contacts.map(contact => (
                            <option key={contact.id} value={contact.id}>{contact.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Priorité
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Basse</option>
                        <option value="medium">Moyenne</option>
                        <option value="high">Haute</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Opportunité Liée
                      </label>
                      <select
                        name="opportunity"
                        value={formData.opportunity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Aucune</option>
                        {opportunities.map(opp => (
                          <option key={opp.id} value={opp.title}>{opp.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Description de l'événement..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reminderSet"
                      name="reminderSet"
                      checked={formData.reminderSet}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="reminderSet" className="ml-2 text-sm text-slate-700">
                      Définir un rappel
                    </label>
                    
                    {formData.reminderSet && (
                      <div className="ml-4 flex items-center space-x-2">
                        <input
                          type="number"
                          name="reminderTime"
                          value={formData.reminderTime}
                          onChange={handleChange}
                          min="1"
                          max="60"
                          className="w-16 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <select
                          name="reminderUnit"
                          value={formData.reminderUnit}
                          onChange={handleChange}
                          className="px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="minutes">minutes</option>
                          <option value="hours">heures</option>
                          <option value="days">jours</option>
                        </select>
                        <span className="text-sm text-slate-700">avant</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email du Contact
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="email@exemple.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Téléphone du Contact
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes Privées
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Notes personnelles sur cet événement..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      Tags
                    </label>
                    <div className="space-y-2">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleTagChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Important, Suivi, Prospect"
                          />
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addTag}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Ajouter un tag
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      Récurrence
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isRecurring"
                          name="isRecurring"
                          checked={formData.isRecurring}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isRecurring" className="ml-2 text-sm text-slate-700">
                          Événement récurrent
                        </label>
                      </div>

                      {formData.isRecurring && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Fréquence
                            </label>
                            <select
                              name="recurrencePattern"
                              value={formData.recurrencePattern}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="daily">Quotidienne</option>
                              <option value="weekly">Hebdomadaire</option>
                              <option value="biweekly">Toutes les deux semaines</option>
                              <option value="monthly">Mensuelle</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Date de fin
                            </label>
                            <input
                              type="date"
                              name="recurrenceEndDate"
                              value={formData.recurrenceEndDate}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Attendees Tab */}
              {activeTab === 'attendees' && (
                <div className="space-y-6">
                  <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    Participants
                  </h3>
                  
                  <div className="space-y-3">
                    {formData.attendees.map((attendee, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={attendee}
                          onChange={(e) => handleAttendeeChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom du participant"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttendee(index)}
                          className="p-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAttendee}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter un participant
                    </button>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-900">Invitations par Email</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Des invitations seront automatiquement envoyées aux participants avec les détails de l'événement.
                        </p>
                        <div className="mt-3">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={true}
                              className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-blue-800">Envoyer des invitations par email</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="space-y-6">
                  <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                    Documents Associés
                  </h3>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="document-upload"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-medium">Déposez vos fichiers ici ou cliquez pour parcourir</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Accepte les fichiers PDF, DOCX, PPTX, XLSX (max 10MB)
                      </p>
                    </label>
                  </div>

                  {formData.documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-slate-700">Documents téléchargés</h4>
                      {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="w-5 h-5 text-slate-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-slate-900">{file.name}</p>
                              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-100 p-2 rounded-full">
                        <Link className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-yellow-900">Liens Externes</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Vous pouvez également ajouter des liens vers des documents externes (Google Drive, Dropbox, etc.)
                        </p>
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder="https://..."
                            className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Actions */}
        {!isSubmitting && !showSuccessMessage && (
          <div className="bg-slate-50 border-t border-slate-200 p-4">
            <div className="flex justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Annuler
              </button>

              <div className="flex space-x-2">
                {activeTab !== 'basic' && (
                  <button
                    onClick={() => {
                      const tabs = ['basic', 'details', 'attendees', 'documents'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex - 1]);
                    }}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 inline mr-1" />
                    Précédent
                  </button>
                )}

                {activeTab !== 'documents' ? (
                  <button
                    onClick={() => {
                      const tabs = ['basic', 'details', 'attendees', 'documents'];
                      const currentIndex = tabs.indexOf(activeTab);
                      setActiveTab(tabs[currentIndex + 1]);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isEditing ? 'Mettre à Jour' : 'Créer l\'Événement'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewEventModal;