import React, { useState, useEffect } from 'react';
import { 
  User, Save, X, Calendar, Mail, Phone, MapPin, Briefcase, 
  Building, CreditCard, FileText, Upload, Check, AlertCircle, 
  ChevronRight, ChevronLeft, Heart, Shield, DollarSign, Edit,
  CheckCircle
} from 'lucide-react';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  manager: string;
  startDate: string;
  employeeId: string;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
  personalInfo: {
    birthDate: string;
    address: string;
    city: string;
    postalCode: string;
    nationality: string;
    maritalStatus: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  contractInfo: {
    type: string;
    salary: number;
    startDate: string;
    endDate?: string;
    workingHours: number;
  };
  documents: Array<{
    id: number;
    name: string;
    type: string;
    uploadDate: string;
    size: string;
  }>;
}

interface EditEmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Employee) => void;
  employee: Employee;
}

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  employee 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Employee>({...employee});
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
      if (!formData.personalInfo.birthDate) newErrors.birthDate = 'La date de naissance est requise';
    }
    
    if (step === 2) {
      if (!formData.position) newErrors.position = 'Le poste est requis';
      if (!formData.department) newErrors.department = 'Le département est requis';
      if (!formData.startDate) newErrors.startDate = 'La date de début est requise';
    }
    
    if (step === 3) {
      if (!formData.contractInfo.salary) newErrors.salary = 'Le salaire est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof Employee],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
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

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof Employee],
        [field]: value
      }
    }));
    
    // Clear error
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        emergencyContact: {
          ...prev.personalInfo.emergencyContact,
          [field]: value
        }
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file, index) => ({
        id: Date.now() + index,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024).toFixed(1)} KB`
      }));
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  const removeDocument = (id: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== id)
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
          onSave(formData);
        }, 1500);
      }, 1000);
    }
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
                <Edit className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Modifier l'Employé</h1>
                <p className="text-white/80">Mettre à jour les informations de {employee.firstName} {employee.lastName}</p>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Employé Mis à Jour avec Succès !</h2>
              <p className="text-slate-600 mb-6">
                Les informations de {formData.firstName} {formData.lastName} ont été mises à jour.
              </p>
            </div>
          ) : isSubmitting ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Mise à jour en cours...</h2>
              <p className="text-slate-600">Nous mettons à jour les informations de l'employé</p>
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
                          name="personalInfo.birthDate"
                          value={formData.personalInfo.birthDate}
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
                        Nationalité
                      </label>
                      <input
                        type="text"
                        name="personalInfo.nationality"
                        value={formData.personalInfo.nationality}
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
                        name="personalInfo.maritalStatus"
                        value={formData.personalInfo.maritalStatus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner</option>
                        <option value="Célibataire">Célibataire</option>
                        <option value="Marié(e)">Marié(e)</option>
                        <option value="Divorcé(e)">Divorcé(e)</option>
                        <option value="Veuf/Veuve">Veuf/Veuve</option>
                        <option value="Pacsé(e)">Pacsé(e)</option>
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
                          name="personalInfo.address"
                          value={formData.personalInfo.address}
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
                          name="personalInfo.city"
                          value={formData.personalInfo.city}
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
                          name="personalInfo.postalCode"
                          value={formData.personalInfo.postalCode}
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
                          value={formData.personalInfo.emergencyContact.name}
                          onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
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
                          value={formData.personalInfo.emergencyContact.relationship}
                          onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
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
                          value={formData.personalInfo.emergencyContact.phone}
                          onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
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
                        ID Employé
                      </label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: EMP001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Statut
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="on-leave">En congé</option>
                      </select>
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
                          Ces informations sont utilisées pour définir la position de l'employé dans l'organigramme de l'entreprise et configurer ses accès aux systèmes.
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
                        Type de Contrat
                      </label>
                      <select
                        name="contractInfo.type"
                        value={formData.contractInfo.type}
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
                        Salaire Annuel <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="number"
                          name="contractInfo.salary"
                          value={formData.contractInfo.salary}
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
                        Date de début de contrat
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="contractInfo.startDate"
                          value={formData.contractInfo.startDate}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Date de fin de contrat
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="date"
                          name="contractInfo.endDate"
                          value={formData.contractInfo.endDate || ''}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Heures Hebdomadaires
                      </label>
                      <input
                        type="number"
                        name="contractInfo.workingHours"
                        value={formData.contractInfo.workingHours}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
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
                        {formData.documents.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="w-5 h-5 text-slate-500 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-slate-900">{file.name}</p>
                                <p className="text-xs text-slate-500">{file.size} • {file.uploadDate}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeDocument(file.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-900">Sécurité des Données</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Les informations contractuelles et financières sont chiffrées et stockées de manière sécurisée. Seul le personnel autorisé peut y accéder.
                        </p>
                      </div>
                    </div>
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
                        <h3 className="font-medium text-green-900">Prêt à mettre à jour l'employé</h3>
                        <p className="text-sm text-green-700 mt-1">
                          Vérifiez les informations ci-dessous avant de finaliser la mise à jour.
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
                          <span className="text-slate-900">{formData.personalInfo.birthDate}</span>
                        </div>
                        {formData.personalInfo.address && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Adresse:</span>
                            <span className="text-slate-900">{formData.personalInfo.address}, {formData.personalInfo.postalCode} {formData.personalInfo.city}</span>
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
                          <span className="text-slate-600">Statut:</span>
                          <span className="text-slate-900">{
                            formData.status === 'active' ? 'Actif' : 
                            formData.status === 'inactive' ? 'Inactif' : 'En congé'
                          }</span>
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
                          <span className="text-slate-600">Type de contrat:</span>
                          <span className="text-slate-900">{formData.contractInfo.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Salaire:</span>
                          <span className="text-slate-900 font-medium">
                            {formData.contractInfo.salary.toLocaleString()} € par an
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Heures hebdomadaires:</span>
                          <span className="text-slate-900">{formData.contractInfo.workingHours}h</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2 text-orange-600" />
                        Documents
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Documents:</span>
                          <span className="text-slate-900">{formData.documents.length} fichier(s)</span>
                        </div>
                        {formData.documents.length > 0 && (
                          <ul className="list-disc list-inside text-slate-700">
                            {formData.documents.slice(0, 3).map((doc, index) => (
                              <li key={index}>{doc.name}</li>
                            ))}
                            {formData.documents.length > 3 && (
                              <li>+ {formData.documents.length - 3} autres documents</li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Vérification Finale</h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          En cliquant sur "Mettre à Jour", vous confirmez que toutes les informations sont correctes et que vous avez l'autorisation de les modifier dans le système.
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
                  Mettre à Jour
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditEmployeeForm;