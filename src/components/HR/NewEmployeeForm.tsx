import React, { useState } from 'react';
import { 
  UserPlus, Save, X, Calendar, Mail, Phone, MapPin, Briefcase, 
  Building, CreditCard, FileText, Upload, Check, AlertCircle, 
  ChevronRight, ChevronLeft, User, Heart, Shield, DollarSign
} from 'lucide-react';

interface NewEmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (employeeData: any) => void;
}

const NewEmployeeForm: React.FC<NewEmployeeFormProps> = ({ isOpen, onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    nationality: '',
    maritalStatus: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    
    // Informations professionnelles
    position: '',
    department: '',
    manager: '',
    startDate: '',
    employeeType: 'CDI',
    workingHours: 35,
    
    // Informations contractuelles
    salary: '',
    salaryPeriod: 'annual',
    bankName: '',
    iban: '',
    bic: '',
    
    // Contact d'urgence
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    
    // Documents
    documents: [] as File[],
    
    // Paramètres
    sendWelcomeEmail: true,
    createAccountImmediately: true,
    assignDefaultPermissions: true
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const departments = [
    'Technique', 'Commercial', 'Marketing', 'Ressources Humaines', 
    'Finance', 'Administration', 'Direction', 'Design', 'Support'
  ];

  const managers = [
    'Jean Dupont', 'Marie Rousseau', 'Thomas Dubois', 'Sophie Martin'
  ];

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Le prénom est requis';
      if (!formData.lastName) newErrors.lastName = 'Le nom est requis';
      if (!formData.email) {
        newErrors.email = 'L\'email est requis';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format d\'email invalide';
      }
      if (!formData.phone) newErrors.phone = 'Le téléphone est requis';
      if (!formData.birthDate) newErrors.birthDate = 'La date de naissance est requise';
    }
    
    if (step === 2) {
      if (!formData.position) newErrors.position = 'Le poste est requis';
      if (!formData.department) newErrors.department = 'Le département est requis';
      if (!formData.startDate) newErrors.startDate = 'La date de début est requise';
    }
    
    if (step === 3) {
      if (!formData.salary) newErrors.salary = 'Le salaire est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Reset form after success
        setTimeout(() => {
          if (onSave) onSave(formData);
          setShowSuccessMessage(false);
          onClose();
          resetForm();
        }, 2000);
      }, 1500);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      nationality: '',
      maritalStatus: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'France',
      position: '',
      department: '',
      manager: '',
      startDate: '',
      employeeType: 'CDI',
      workingHours: 35,
      salary: '',
      salaryPeriod: 'annual',
      bankName: '',
      iban: '',
      bic: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      documents: [],
      sendWelcomeEmail: true,
      createAccountImmediately: true,
      assignDefaultPermissions: true
    });
    setCurrentStep(1);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <UserPlus className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nouvel Employé</h1>
                <p className="text-white/80">Ajoutez un nouveau membre à votre équipe</p>
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
                { step: 1, title: 'Informations Personnelles', icon: User },
                { step: 2, title: 'Informations Professionnelles', icon: Briefcase },
                { step: 3, title: 'Contrat & Rémunération', icon: FileText },
                { step: 4, title: 'Finalisation', icon: Check }
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      currentStep === step.step 
                        ? 'bg-white text-purple-600' 
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
                style={{ width: `${(currentStep / 4) * 100}%` }}
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Employé Ajouté avec Succès !</h2>
              <p className="text-slate-600 mb-6">
                {formData.firstName} {formData.lastName} a été ajouté à votre équipe.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
                  Email de bienvenue envoyé
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  Compte créé avec succès
                </div>
              </div>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Création en cours...</h2>
              <p className="text-slate-600">Nous ajoutons le nouvel employé au système</p>
            </div>
          ) : (
            <>
              {/* Step 1: Informations Personnelles */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Informations Personnelles
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Prénom"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Nom"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="email@exemple.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de Naissance <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.birthDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.birthDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Genre
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner</option>
                        <option value="male">Homme</option>
                        <option value="female">Femme</option>
                        <option value="other">Autre</option>
                        <option value="prefer_not_to_say">Préfère ne pas préciser</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nationalité
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nationalité"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Situation Familiale
                      </label>
                      <select
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner</option>
                        <option value="single">Célibataire</option>
                        <option value="married">Marié(e)</option>
                        <option value="divorced">Divorcé(e)</option>
                        <option value="widowed">Veuf/Veuve</option>
                        <option value="pacs">Pacsé(e)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-slate-800 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-slate-600" />
                      Adresse
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Adresse
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Numéro et nom de rue"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Ville
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ville"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Code Postal
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Code postal"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-slate-800 mb-3 flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-600" />
                      Contact d'Urgence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Nom du contact
                        </label>
                        <input
                          type="text"
                          name="emergencyContactName"
                          value={formData.emergencyContactName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Nom complet"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Relation
                        </label>
                        <input
                          type="text"
                          name="emergencyContactRelationship"
                          value={formData.emergencyContactRelationship}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Conjoint, Parent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="emergencyContactPhone"
                          value={formData.emergencyContactPhone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Informations Professionnelles */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                    Informations Professionnelles
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Poste <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border ${errors.position ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        placeholder="Ex: Développeur Full Stack"
                      />
                      {errors.position && (
                        <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Département <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.department ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        >
                          <option value="">Sélectionner un département</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      {errors.department && (
                        <p className="mt-1 text-sm text-red-500">{errors.department}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Manager
                      </label>
                      <select
                        name="manager"
                        value={formData.manager}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner un manager</option>
                        {managers.map((manager) => (
                          <option key={manager} value={manager}>{manager}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de début <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.startDate ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        />
                      </div>
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Type de Contrat
                      </label>
                      <select
                        name="employeeType"
                        value={formData.employeeType}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="CDI">CDI</option>
                        <option value="CDD">CDD</option>
                        <option value="Interim">Intérim</option>
                        <option value="Apprentissage">Apprentissage</option>
                        <option value="Stage">Stage</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Heures Hebdomadaires
                      </label>
                      <input
                        type="number"
                        name="workingHours"
                        value={formData.workingHours}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-900">Informations Professionnelles</h3>
                        <p className="text-sm text-blue-700 mt-1">
                          Ces informations seront utilisées pour configurer l'accès de l'employé aux systèmes et définir sa position dans l'organigramme de l'entreprise.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contrat & Rémunération */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Contrat & Rémunération
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Salaire <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="number"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-4 py-2 border ${errors.salary ? 'border-red-500' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          placeholder="Ex: 45000"
                        />
                      </div>
                      {errors.salary && (
                        <p className="mt-1 text-sm text-red-500">{errors.salary}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Période
                      </label>
                      <select
                        name="salaryPeriod"
                        value={formData.salaryPeriod}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="annual">Annuel</option>
                        <option value="monthly">Mensuel</option>
                        <option value="hourly">Horaire</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-md font-medium text-slate-800 mb-3 flex items-center">
                        <CreditCard className="w-4 h-4 mr-2 text-slate-600" />
                        Informations Bancaires
                      </h3>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nom de la Banque
                      </label>
                      <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nom de la banque"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        IBAN
                      </label>
                      <input
                        type="text"
                        name="iban"
                        value={formData.iban}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        BIC/SWIFT
                      </label>
                      <input
                        type="text"
                        name="bic"
                        value={formData.bic}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="BNPAFRPPXXX"
                      />
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-900">Sécurité des Données</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Les informations bancaires sont chiffrées et stockées de manière sécurisée. Seul le personnel autorisé peut y accéder.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium text-slate-800 mb-3 flex items-center">
                      <Upload className="w-4 h-4 mr-2 text-slate-600" />
                      Documents
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
                          Accepte les fichiers PDF, DOCX, JPG (max 10MB)
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
                  </div>
                </div>
              )}

              {/* Step 4: Finalisation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-600" />
                    Finalisation
                  </h2>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-900">Prêt à ajouter le nouvel employé</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Vérifiez les informations ci-dessous avant de finaliser l'ajout.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        Informations Personnelles
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Nom complet:</span>
                          <span className="text-slate-900 font-medium">{formData.firstName} {formData.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Email:</span>
                          <span className="text-slate-900">{formData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Téléphone:</span>
                          <span className="text-slate-900">{formData.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date de naissance:</span>
                          <span className="text-slate-900">{formData.birthDate}</span>
                        </div>
                        {formData.address && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Adresse:</span>
                            <span className="text-slate-900">{formData.address}, {formData.postalCode} {formData.city}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-purple-600" />
                        Informations Professionnelles
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Poste:</span>
                          <span className="text-slate-900 font-medium">{formData.position}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Département:</span>
                          <span className="text-slate-900">{formData.department}</span>
                        </div>
                        {formData.manager && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Manager:</span>
                            <span className="text-slate-900">{formData.manager}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-slate-600">Date de début:</span>
                          <span className="text-slate-900">{formData.startDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Type de contrat:</span>
                          <span className="text-slate-900">{formData.employeeType}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                        Rémunération
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Salaire:</span>
                          <span className="text-slate-900 font-medium">
                            {formData.salary} € {formData.salaryPeriod === 'annual' ? 'par an' : formData.salaryPeriod === 'monthly' ? 'par mois' : 'par heure'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Heures hebdomadaires:</span>
                          <span className="text-slate-900">{formData.workingHours}h</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-orange-600" />
                        Documents & Paramètres
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Documents:</span>
                          <span className="text-slate-900">{formData.documents.length} fichier(s)</span>
                        </div>
                        <div className="pt-2 space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="sendWelcomeEmail"
                              checked={formData.sendWelcomeEmail}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-slate-700">Envoyer un email de bienvenue</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="createAccountImmediately"
                              checked={formData.createAccountImmediately}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-slate-700">Créer un compte immédiatement</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              name="assignDefaultPermissions"
                              checked={formData.assignDefaultPermissions}
                              onChange={handleChange}
                              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-slate-700">Assigner les permissions par défaut</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Vérification Finale</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          En cliquant sur "Ajouter l'Employé", vous confirmez que toutes les informations sont correctes et que vous avez l'autorisation de les enregistrer dans le système.
                        </p>
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

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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
                  Ajouter l'Employé
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewEmployeeForm;