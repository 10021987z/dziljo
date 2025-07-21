import React, { useState } from 'react';
import { Users, Plus, Edit, Eye, Shield, Lock, Unlock, Search, Filter, UserPlus, Settings, Mail, Phone, Calendar, MapPin } from 'lucide-react';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdDate: string;
  permissions: string[];
  avatar?: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

const UserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 's.martin@dziljo.com',
      phone: '+33 1 23 45 67 89',
      role: 'Administrateur',
      department: 'Direction',
      status: 'active',
      lastLogin: '2024-01-26 09:30',
      createdDate: '2023-01-15',
      permissions: ['admin', 'users', 'contracts', 'reports', 'settings']
    },
    {
      id: 2,
      firstName: 'Thomas',
      lastName: 'Dubois',
      email: 't.dubois@dziljo.com',
      phone: '+33 1 98 76 54 32',
      role: 'Commercial',
      department: 'Commercial',
      status: 'active',
      lastLogin: '2024-01-26 08:45',
      createdDate: '2023-03-20',
      permissions: ['leads', 'opportunities', 'calendar', 'reports']
    },
    {
      id: 3,
      firstName: 'Marie',
      lastName: 'Rousseau',
      email: 'm.rousseau@dziljo.com',
      phone: '+33 1 11 22 33 44',
      role: 'RH Manager',
      department: 'Ressources Humaines',
      status: 'active',
      lastLogin: '2024-01-25 17:20',
      createdDate: '2023-02-10',
      permissions: ['hr', 'recruitment', 'employees', 'reports']
    },
    {
      id: 4,
      firstName: 'Pierre',
      lastName: 'Martin',
      email: 'p.martin@dziljo.com',
      phone: '+33 1 55 66 77 88',
      role: 'Employé',
      department: 'Technique',
      status: 'inactive',
      lastLogin: '2024-01-20 14:15',
      createdDate: '2023-06-05',
      permissions: ['dashboard']
    },
    {
      id: 5,
      firstName: 'Julie',
      lastName: 'Moreau',
      email: 'j.moreau@dziljo.com',
      phone: '+33 1 44 55 66 77',
      role: 'Commercial',
      department: 'Commercial',
      status: 'pending',
      lastLogin: '',
      createdDate: '2024-01-25',
      permissions: ['leads', 'opportunities', 'calendar']
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: 'Administrateur',
      description: 'Accès complet à toutes les fonctionnalités',
      permissions: ['admin', 'users', 'contracts', 'reports', 'settings', 'hr', 'commercial'],
      userCount: 1,
      isSystem: true
    },
    {
      id: 2,
      name: 'Commercial',
      description: 'Accès aux modules commerciaux et de prospection',
      permissions: ['leads', 'opportunities', 'calendar', 'reports'],
      userCount: 2,
      isSystem: false
    },
    {
      id: 3,
      name: 'RH Manager',
      description: 'Gestion complète des ressources humaines',
      permissions: ['hr', 'recruitment', 'employees', 'reports'],
      userCount: 1,
      isSystem: false
    },
    {
      id: 4,
      name: 'Employé',
      description: 'Accès de base au tableau de bord',
      permissions: ['dashboard'],
      userCount: 1,
      isSystem: false
    }
  ]);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Employé',
    department: 'Technique'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Unlock className="w-4 h-4" />;
      case 'inactive': return <Lock className="w-4 h-4" />;
      case 'pending': return <Calendar className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrateur': return 'bg-red-100 text-red-800';
      case 'Commercial': return 'bg-blue-100 text-blue-800';
      case 'RH Manager': return 'bg-purple-100 text-purple-800';
      case 'Employé': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length,
    admins: users.filter(u => u.role === 'Administrateur').length,
    commercial: users.filter(u => u.role === 'Commercial').length,
    hr: users.filter(u => u.role === 'RH Manager').length
  };

  const departments = ['Direction', 'Commercial', 'Ressources Humaines', 'Technique', 'Administration'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs</h2>
          <p className="text-slate-600">Gérez les comptes utilisateurs, rôles et permissions</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.active}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Unlock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">En Attente</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.pending}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Administrateurs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.admins}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="flex space-x-1 mb-6">
          {[
            { id: 'users', name: 'Utilisateurs', icon: Users },
            { id: 'roles', name: 'Rôles & Permissions', icon: Shield },
            { id: 'activity', name: 'Activité', icon: Settings }
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

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher utilisateurs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {activeTab === 'users' && (
              <>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les rôles</option>
                  <option value="Administrateur">Administrateur</option>
                  <option value="Commercial">Commercial</option>
                  <option value="RH Manager">RH Manager</option>
                  <option value="Employé">Employé</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="pending">En attente</option>
                </select>
              </>
            )}
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Utilisateur</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Rôle</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Département</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Dernière Connexion</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">{user.department}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded flex items-center w-fit ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1">{getStatusText(user.status)}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      {user.lastLogin || 'Jamais connecté'}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-purple-600 transition-colors">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-slate-900">{role.name}</h4>
                      {role.isSystem && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Système
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{role.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-700">Utilisateurs: </span>
                    <span className="text-sm text-slate-900">{role.userCount}</span>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-700 block mb-2">Permissions:</span>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Modifier
                  </button>
                  {!role.isSystem && (
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <Lock className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-4">Activité Récente</h4>
              <div className="space-y-3">
                {[
                  { user: 'Sophie Martin', action: 'Connexion', time: '2024-01-26 09:30', type: 'login' },
                  { user: 'Thomas Dubois', action: 'Création d\'un prospect', time: '2024-01-26 08:45', type: 'create' },
                  { user: 'Marie Rousseau', action: 'Modification d\'un employé', time: '2024-01-25 17:20', type: 'edit' },
                  { user: 'Julie Moreau', action: 'Première connexion', time: '2024-01-25 16:00', type: 'first-login' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-slate-200">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        activity.type === 'login' ? 'bg-green-500' :
                        activity.type === 'create' ? 'bg-blue-500' :
                        activity.type === 'edit' ? 'bg-yellow-500' : 'bg-purple-500'
                      }`}></div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{activity.user}</p>
                        <p className="text-xs text-slate-600">{activity.action}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-medium text-xl">
                      {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedUser.status)}`}>
                        {getStatusText(selectedUser.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-3">Informations de Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-slate-500" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-slate-500" />
                    <span>{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                    <span>{selectedUser.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                    <span>Créé le {selectedUser.createdDate}</span>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              {/* Activity */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Activité</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dernière connexion:</span>
                    <span className="text-slate-900">{selectedUser.lastLogin || 'Jamais connecté'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Compte créé:</span>
                    <span className="text-slate-900">{selectedUser.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Statut:</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedUser.status)}`}>
                      {getStatusText(selectedUser.status)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Modifier
                </button>
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  Réinitialiser Mot de Passe
                </button>
                {selectedUser.status === 'active' ? (
                  <button className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    Désactiver
                  </button>
                ) : (
                  <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Activer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvel Utilisateur</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Prénom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@dziljo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rôle *</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Employé">Employé</option>
                  <option value="Commercial">Commercial</option>
                  <option value="RH Manager">RH Manager</option>
                  <option value="Administrateur">Administrateur</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Département *</label>
                <select
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  // Handle create user
                  setShowCreateModal(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer l'Utilisateur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;