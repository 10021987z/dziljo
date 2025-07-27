import React, { useState } from 'react';
import { Users, Plus, Shield, Key, Settings, Mail, Phone, Calendar, Edit, Eye, Lock, Unlock, UserPlus } from 'lucide-react';
import { useFirebaseCollection } from '../../hooks/useFirebase';

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'super-admin' | 'admin' | 'manager' | 'user';
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdDate: string;
  permissions: string[];
  avatar?: string;
  twoFactorEnabled: boolean;
}

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 1,
      firstName: 'Sophie',
      lastName: 'Martin',
      email: 's.martin@dziljo.com',
      phone: '+33 1 23 45 67 89',
      role: 'super-admin',
      department: 'Direction',
      status: 'active',
      lastLogin: '2024-01-26 09:30',
      createdDate: '2023-01-15',
      permissions: ['all'],
      twoFactorEnabled: true
    },
    {
      id: 2,
      firstName: 'Thomas',
      lastName: 'Dubois',
      email: 't.dubois@dziljo.com',
      phone: '+33 1 98 76 54 32',
      role: 'admin',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-26 08:45',
      createdDate: '2023-03-20',
      permissions: ['users', 'settings', 'reports'],
      twoFactorEnabled: false
    },
    {
      id: 3,
      firstName: 'Marie',
      lastName: 'Rousseau',
      email: 'm.rousseau@dziljo.com',
      phone: '+33 1 11 22 33 44',
      role: 'manager',
      department: 'RH',
      status: 'active',
      lastLogin: '2024-01-25 17:20',
      createdDate: '2023-02-10',
      permissions: ['hr', 'reports'],
      twoFactorEnabled: true
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const { create: createUser, update: updateUser } = useFirebaseCollection('admin-users');

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'user' as AdminUser['role'],
    department: '',
    permissions: [] as string[]
  });

  const roles = [
    { id: 'super-admin', name: 'Super Administrateur', color: 'bg-red-100 text-red-800' },
    { id: 'admin', name: 'Administrateur', color: 'bg-orange-100 text-orange-800' },
    { id: 'manager', name: 'Manager', color: 'bg-blue-100 text-blue-800' },
    { id: 'user', name: 'Utilisateur', color: 'bg-gray-100 text-gray-800' }
  ];

  const permissions = [
    { id: 'all', name: 'Tous les droits', category: 'system' },
    { id: 'users', name: 'Gestion des utilisateurs', category: 'admin' },
    { id: 'settings', name: 'Paramètres système', category: 'admin' },
    { id: 'reports', name: 'Rapports', category: 'admin' },
    { id: 'hr', name: 'Ressources Humaines', category: 'modules' },
    { id: 'commercial', name: 'Commercial', category: 'modules' },
    { id: 'finance', name: 'Finance', category: 'modules' },
    { id: 'contracts', name: 'Contrats', category: 'modules' }
  ];

  const departments = ['Direction', 'IT', 'RH', 'Commercial', 'Finance', 'Administration'];

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

  const getRoleColor = (role: string) => {
    const roleObj = roles.find(r => r.id === role);
    return roleObj ? roleObj.color : 'bg-gray-100 text-gray-800';
  };

  const getRoleName = (role: string) => {
    const roleObj = roles.find(r => r.id === role);
    return roleObj ? roleObj.name : role;
  };

  const handleCreateUser = async () => {
    try {
      const userData = {
        ...newUser,
        id: Date.now(),
        status: 'pending',
        lastLogin: '',
        createdDate: new Date().toISOString().split('T')[0],
        twoFactorEnabled: false
      };

      await createUser(userData);
      setUsers(prev => [userData as AdminUser, ...prev]);
      setShowCreateModal(false);
      
      // Reset form
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'user',
        department: '',
        permissions: []
      });

      // Show success message
      const successElement = document.createElement('div');
      successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
      successElement.textContent = '✅ Utilisateur créé avec succès !';
      document.body.appendChild(successElement);
      setTimeout(() => document.body.removeChild(successElement), 3000);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleToggleStatus = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      await updateUser(userId.toString(), { status: newStatus });
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleToggle2FA = async (userId: number) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const newValue = !user.twoFactorEnabled;
      
      await updateUser(userId.toString(), { twoFactorEnabled: newValue });
      
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, twoFactorEnabled: newValue } : u
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin' || u.role === 'super-admin').length,
    with2FA: users.filter(u => u.twoFactorEnabled).length
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs Admin</h2>
          <p className="text-slate-600">Gérez les comptes administrateurs et leurs permissions</p>
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
              <p className="text-sm font-medium text-slate-600">Administrateurs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.admins}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">2FA Activé</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.with2FA}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold">Utilisateurs Administrateurs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Utilisateur</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Rôle</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Département</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Statut</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">2FA</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Dernière Connexion</th>
                <th className="text-left py-3 px-6 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-4 px-6">
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
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{user.department}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggle2FA(user.id)}
                      className={`p-1 rounded ${user.twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      <Key className="w-4 h-4" />
                    </button>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{user.lastLogin || 'Jamais'}</td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        className={`p-2 transition-colors ${
                          user.status === 'active' 
                            ? 'text-slate-400 hover:text-red-600' 
                            : 'text-slate-400 hover:text-green-600'
                        }`}
                        title={user.status === 'active' ? 'Désactiver' : 'Activer'}
                      >
                        {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPermissionsModal(true);
                        }}
                        className="p-2 text-slate-400 hover:text-purple-600 transition-colors"
                        title="Permissions"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nouvel Utilisateur Administrateur</h3>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Prénom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@dziljo.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Département</label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Rôle</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUser['role'] })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Permissions</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {permissions.map(permission => (
                    <label key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.permissions.includes(permission.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser(prev => ({
                              ...prev,
                              permissions: [...prev.permissions, permission.id]
                            }));
                          } else {
                            setNewUser(prev => ({
                              ...prev,
                              permissions: prev.permissions.filter(p => p !== permission.id)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-700">{permission.name}</span>
                    </label>
                  ))}
                </div>
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
                onClick={handleCreateUser}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer l'Utilisateur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && !showPermissionsModal && (
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
                    <p className="text-slate-600">{getRoleName(selectedUser.role)}</p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Informations de Contact</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-slate-500" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-slate-500" />
                      <span>{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                      <span>Créé le {selectedUser.createdDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Sécurité</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Authentification 2FA:</span>
                      <span className={selectedUser.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}>
                        {selectedUser.twoFactorEnabled ? 'Activée' : 'Désactivée'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Dernière connexion:</span>
                      <span className="text-slate-900">{selectedUser.lastLogin || 'Jamais'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Statut:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedUser.status)}`}>
                        {getStatusText(selectedUser.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Permissions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedUser.permissions.map((permissionId) => {
                    const permission = permissions.find(p => p.id === permissionId);
                    return permission ? (
                      <span key={permissionId} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">
                        {permission.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-200">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Modifier
                </button>
                <button 
                  onClick={() => handleToggleStatus(selectedUser.id)}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    selectedUser.status === 'active' 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedUser.status === 'active' ? 'Désactiver' : 'Activer'}
                </button>
                <button 
                  onClick={() => setShowPermissionsModal(true)}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Permissions - {selectedUser.firstName} {selectedUser.lastName}</h3>
              <button 
                onClick={() => setShowPermissionsModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Rôle Actuel</h4>
                <span className={`px-3 py-1 text-sm font-medium rounded ${getRoleColor(selectedUser.role)}`}>
                  {getRoleName(selectedUser.role)}
                </span>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Permissions Accordées</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {permissions.map(permission => (
                    <label key={permission.id} className="flex items-center p-2 hover:bg-slate-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedUser.permissions.includes(permission.id)}
                        onChange={(e) => {
                          const updatedPermissions = e.target.checked
                            ? [...selectedUser.permissions, permission.id]
                            : selectedUser.permissions.filter(p => p !== permission.id);
                          
                          setSelectedUser(prev => prev ? { ...prev, permissions: updatedPermissions } : null);
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-slate-700">{permission.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-slate-200">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateUser(selectedUser.id.toString(), { 
                      permissions: selectedUser.permissions 
                    });
                    
                    setUsers(prev => prev.map(u => 
                      u.id === selectedUser.id ? selectedUser : u
                    ));
                    
                    setShowPermissionsModal(false);
                  } catch (error) {
                    console.error('Erreur lors de la mise à jour:', error);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;