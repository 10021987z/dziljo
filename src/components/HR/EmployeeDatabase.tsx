import React, { useState } from 'react';
import { User, Plus, Search, Filter, Edit, Eye, Phone, Mail, MapPin, Calendar, Briefcase, GraduationCap, TrendingUp, FileText, Download, Upload } from 'lucide-react';
import ExportButtons from '../Common/ExportButtons';
import EditEmployeeForm from './EditEmployeeForm';

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

const EmployeeDatabase: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 's.martin@dziljo.com',
      phone: '+33 1 23 45 67 89',
      position: 'Développeur Full Stack Senior',
      department: 'Technique',
      manager: 'Jean Dupont',
      startDate: '2023-03-15',
      employeeId: 'EMP001',
      status: 'active',
      personalInfo: {
        birthDate: '1990-05-12',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        nationality: 'Française',
        maritalStatus: 'Célibataire',
        emergencyContact: {
          name: 'Marie Martin',
          relationship: 'Mère',
          phone: '+33 1 98 76 54 32'
        }
      },
      contractInfo: {
        type: 'CDI',
        salary: 55000,
        startDate: '2023-03-15',
        workingHours: 35
      },
      documents: [
        { id: 1, name: 'Contrat de travail', type: 'PDF', uploadDate: '2023-03-15', size: '2.3 MB' },
        { id: 2, name: 'CV', type: 'PDF', uploadDate: '2023-03-10', size: '1.8 MB' }
      ]
    },
    {
      id: 2,
      firstName: 'Thomas',
      lastName: 'Dubois',
      email: 't.dubois@dziljo.com',
      phone: '+33 1 98 76 54 32',
      position: 'Designer UX/UI',
      department: 'Design',
      manager: 'Marie Rousseau',
      startDate: '2023-06-01',
      employeeId: 'EMP002',
      status: 'active',
      personalInfo: {
        birthDate: '1988-11-23',
        address: '456 Avenue des Champs',
        city: 'Lyon',
        postalCode: '69001',
        nationality: 'Française',
        maritalStatus: 'Marié',
        emergencyContact: {
          name: 'Claire Dubois',
          relationship: 'Épouse',
          phone: '+33 1 11 22 33 44'
        }
      },
      contractInfo: {
        type: 'CDI',
        salary: 45000,
        startDate: '2023-06-01',
        workingHours: 35
      },
      documents: [
        { id: 3, name: 'Contrat de travail', type: 'PDF', uploadDate: '2023-06-01', size: '2.1 MB' },
        { id: 4, name: 'Portfolio', type: 'PDF', uploadDate: '2023-05-25', size: '15.2 MB' }
      ]
    }
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const departments = ['Technique', 'Design', 'Commercial', 'RH', 'Administration'];

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on-leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'on-leave': return 'En congé';
      default: return status;
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee);
    setShowEditModal(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => 
      prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp)
    );
    setShowEditModal(false);
    setEmployeeToEdit(null);
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Employé mis à jour avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Informations Personnelles</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date de naissance:</span>
                    <span className="text-slate-900">{selectedEmployee.personalInfo.birthDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nationalité:</span>
                    <span className="text-slate-900">{selectedEmployee.personalInfo.nationality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Statut marital:</span>
                    <span className="text-slate-900">{selectedEmployee.personalInfo.maritalStatus}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Contact d'Urgence</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Nom:</span>
                    <span className="text-slate-900">{selectedEmployee.personalInfo.emergencyContact.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Relation:</span>
                    <span className="text-slate-900">{selectedEmployee.personalInfo.emergencyContact.relationship}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Téléphone:</span>
                    <span className="text-slate-900">{selectedEmployee.personalInfo.emergencyContact.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3">Adresse</h4>
              <div className="text-sm text-slate-700">
                {selectedEmployee.personalInfo.address}<br />
                {selectedEmployee.personalInfo.postalCode} {selectedEmployee.personalInfo.city}
              </div>
            </div>
          </div>
        );

      case 'contract':
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-medium text-slate-900 mb-3">Informations Contractuelles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type de contrat:</span>
                    <span className="text-slate-900">{selectedEmployee.contractInfo.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date de début:</span>
                    <span className="text-slate-900">{selectedEmployee.contractInfo.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Heures de travail:</span>
                    <span className="text-slate-900">{selectedEmployee.contractInfo.workingHours}h/semaine</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Salaire annuel:</span>
                    <span className="text-slate-900">{selectedEmployee.contractInfo.salary.toLocaleString()}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Manager:</span>
                    <span className="text-slate-900">{selectedEmployee.manager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Département:</span>
                    <span className="text-slate-900">{selectedEmployee.department}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-slate-900">Documents</h4>
              <button className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center hover:bg-blue-700 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Ajouter Document
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedEmployee.documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-slate-600 mr-3" />
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-600">{doc.type} • {doc.size} • {doc.uploadDate}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Base de Données Employés</h2>
          <p className="text-slate-600">Gérez les dossiers complets de vos collaborateurs</p>
        </div>
        <div className="flex space-x-3">
          <ExportButtons 
            data={filteredEmployees} 
            type="employees" 
            title="Exporter Employés"
          />
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Employé
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Employés</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{employees.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Employés Actifs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {employees.filter(emp => emp.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Départements</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{departments.length}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Congé</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {employees.filter(emp => emp.status === 'on-leave').length}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les départements</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold">Liste des Employés</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Employé</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Poste</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Département</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Manager</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Date d'embauche</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 font-medium text-sm">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{employee.firstName} {employee.lastName}</p>
                        <p className="text-sm text-slate-500">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{employee.position}</td>
                  <td className="py-4 px-6 text-slate-700">{employee.department}</td>
                  <td className="py-4 px-6 text-slate-700">{employee.manager}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(employee.status)}`}>
                      {getStatusText(employee.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{employee.startDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedEmployee(employee)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-medium text-xl">
                      {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {selectedEmployee.firstName} {selectedEmployee.lastName}
                    </h3>
                    <p className="text-slate-600">{selectedEmployee.position}</p>
                    <div className="flex items-center mt-2 space-x-4 text-sm text-slate-500">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {selectedEmployee.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {selectedEmployee.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEditEmployee(selectedEmployee)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm flex items-center hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier
                  </button>
                  <button 
                    onClick={() => setSelectedEmployee(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 mt-6">
                {[
                  { id: 'overview', name: 'Vue d\'ensemble', icon: User },
                  { id: 'contract', name: 'Contrat', icon: FileText },
                  { id: 'documents', name: 'Documents', icon: FileText }
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
            </div>

            <div className="p-6">
              {renderEmployeeDetails()}
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && employeeToEdit && (
        <EditEmployeeForm
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEmployeeToEdit(null);
          }}
          onSave={handleUpdateEmployee}
          employee={employeeToEdit}
        />
      )}
    </div>
  );
};

export default EmployeeDatabase;