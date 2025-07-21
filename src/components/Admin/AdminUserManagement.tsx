import React, { useState } from 'react';
import { Users, Plus, Edit, Eye, Shield, Lock, Unlock, Search, Filter, UserPlus, Settings, Mail, Phone, Calendar, MapPin, Camera, Upload, Download, Trash2, Key, Activity, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';

interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'super-admin' | 'admin' | 'manager' | 'moderator';
  department: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin: string;
  createdDate: string;
  permissions: string[];
  avatar?: string;
  position: string;
  location: string;
  bio: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginAttempts: number;
    ipWhitelist: string[];
  };
  activity: {
    totalLogins: number;
    avgSessionDuration: number;
    lastActivity: string;
    favoriteModules: string[];
  };
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
  color: string;
}

interface ActivityLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  details?: string;
}

const AdminUserManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
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
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      position: 'Directrice Technique',
      location: 'Paris, France',
      bio: 'Directrice technique passionnée par l\'innovation et le développement d\'équipes performantes.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/sophie-martin',
        github: 'https://github.com/sophie-martin'
      },
      preferences: {
        theme: 'light',
        language: 'fr',
        timezone: 'Europe/Paris',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      security: {
        twoFactorEnabled: true,
        lastPasswordChange: '2024-01-01',
        loginAttempts: 0,
        ipWhitelist: ['192.168.1.100', '10.0.0.50']
      },
      activity: {
        totalLogins: 1247,
        avgSessionDuration: 4.5,
        lastActivity: '2024-01-26 09:30',
        favoriteModules: ['dashboard', 'admin', 'reports']
      }
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
      permissions: ['users', 'settings', 'reports', 'integrations'],
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      position: 'Administrateur Système',
      location: 'Lyon, France',
      bio: 'Expert en infrastructure et sécurité informatique avec 8 ans d\'expérience.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/thomas-dubois'
      },
      preferences: {
        theme: 'dark',
        language: 'fr',
        timezone: 'Europe/Paris',
        notifications: {
          email: true,
          push: false,
          sms: true
        }
      },
      security: {
        twoFactorEnabled: true,
        lastPasswordChange: '2023-12-15',
        loginAttempts: 0,
        ipWhitelist: ['192.168.1.101']
      },
      activity: {
        totalLogins: 892,
        avgSessionDuration: 3.2,
        lastActivity: '2024-01-26 08:45',
        favoriteModules: ['admin', 'integrations', 'users']
      }
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
      permissions: ['hr', 'reports', 'users-view'],
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      position: 'Responsable RH',
      location: 'Paris, France',
      bio: 'Spécialisée en gestion des talents et développement organisationnel.',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/marie-rousseau'
      },
      preferences: {
        theme: 'auto',
        language: 'fr',
        timezone: 'Europe/Paris',
        notifications: {
          email: true,
          push: true,
          sms: false
        }
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: '2023-11-20',
        loginAttempts: 0,
        ipWhitelist: []
      },
      activity: {
        totalLogins: 654,
        avgSessionDuration: 2.8,
        lastActivity: '2024-01-25 17:20',
        favoriteModules: ['hr', 'dashboard', 'reports']
      }
    },
    {
      id: 4,
      firstName: 'Pierre',
      lastName: 'Martin',
      email: 'p.martin@dziljo.com',
      phone: '+33 1 55 66 77 88',
      role: 'moderator',
      department: 'Commercial',
      status: 'pending',
      lastLogin: '',
      createdDate: '2024-01-25',
      permissions: ['commercial', 'reports-view'],
      position: 'Responsable Commercial',
      location: 'Marseille, France',
      bio: 'Nouveau responsable commercial avec une expertise en développement business.',
      socialLinks: {},
      preferences: {
        theme: 'light',
        language: 'fr',
        timezone: 'Europe/Paris',
        notifications: {
          email: true,
          push: false,
          sms: false
        }
      },
      security: {
        twoFactorEnabled: false,
        lastPasswordChange: '2024-01-25',
        loginAttempts: 0,
        ipWhitelist: []
      },
      activity: {
        totalLogins: 0,
        avgSessionDuration: 0,
        lastActivity: '',
        favoriteModules: []
      }
    }
  ]);

  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'super-admin',
      name: 'Super Administrateur',
      description: 'Accès complet à toutes les fonctionnalités du système',
      permissions: ['all'],
      userCount: 1,
      isSystem: true,
      color: 'bg-red-500'
    },
    {
      id: 'admin',
      name: 'Administrateur',
      description: 'Gestion des utilisateurs, paramètres et intégrations',
      permissions: ['users', 'settings', 'reports', 'integrations'],
      userCount: 1,
      isSystem: false,
      color: 'bg-blue-500'
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Accès aux modules métier et rapports',
      permissions: ['hr', 'commercial', 'reports', 'users-view'],
      userCount: 1,
      isSystem: false,
      color: 'bg-green-500'
    },
    {
      id: 'moderator',
      name: 'Modérateur',
      description: 'Accès limité aux modules spécifiques',
      permissions: ['commercial', 'reports-view'],
      userCount: 1,
      isSystem: false,
      color: 'bg-orange-500'
    }
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 1,
      userId: 1,
      userName: 'Sophie Martin',
      action: 'Connexion',
      module: 'Authentification',
      timestamp: '2024-01-26 09:30:15',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Thomas Dubois',
      action: 'Modification utilisateur',
      module: 'Gestion Utilisateurs',
      timestamp: '2024-01-26 08:45:32',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      details: 'Modification des permissions de Marie Rousseau'
    },
    {
      id: 3,
      userId: 1,
      userName: 'Sophie Martin',
      action: 'Export rapport',
      module: 'Rapports',
      timestamp: '2024-01-26 09:15:22',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      details: 'Export rapport mensuel RH'
    }
  ]);

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'moderator' as AdminUser['role'],
    department: 'IT',
    position: '',
    location: '',
    bio: ''
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('La taille du fichier ne doit pas dépasser 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadAvatar = () => {
    if (selectedFile && selectedUser) {
      // Simulate upload - in real app, upload to server
      const newAvatarUrl = URL.createObjectURL(selectedFile);
      
      setAdminUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, avatar: newAvatarUrl }
          : user
      ));

      setSelectedUser(prev => prev ? { ...prev, avatar: newAvatarUrl } : null);
      setSelectedFile(null);
      setPreviewUrl('');
      alert('Photo de profil mise à jour avec succès !');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'suspended': return 'Suspendu';
      case 'pending': return 'En attente';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Lock className="w-4 h-4" />;
      case 'suspended': return <AlertCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super-admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'moderator': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'super-admin': return 'Super Admin';
      case 'admin': return 'Administrateur';
      case 'manager': return 'Manager';
      case 'moderator': return 'Modérateur';
      default: return role;
    }
  };

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: adminUsers.length,
    active: adminUsers.filter(u => u.status === 'active').length,
    pending: adminUsers.filter(u => u.status === 'pending').length,
    suspended: adminUsers.filter(u => u.status === 'suspended').length,
    superAdmins: adminUsers.filter(u => u.role === 'super-admin').length,
    with2FA: adminUsers.filter(u => u.security.twoFactorEnabled).length
  };

  const departments = ['Direction', 'IT', 'RH', 'Commercial', 'Finance', 'Marketing'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs Administrateurs</h2>
          <p className="text-slate-600">Gérez les comptes administrateurs, rôles et permissions avancées</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Administrateur
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Admins</p>
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
              <p className="text-sm font-medium text-slate-600">Actifs</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.active}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
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
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Suspendus</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.suspended}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Super Admins</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.superAdmins}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Avec 2FA</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{userStats.with2FA}</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-lg">
              <Key className="w-6 h-6 text-white" />
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
            { id: 'activity', name: 'Journal d\'Activité', icon: Activity },
            { id: 'security', name: 'Sécurité', icon: Key }
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
                  <option value="super-admin">Super Administrateur</option>
                  <option value="admin">Administrateur</option>
                  <option value="manager">Manager</option>
                  <option value="moderator">Modérateur</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="pending">En attente</option>
                </select>
              </>
            )}
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-2 border-slate-200">
                        <span className="text-blue-600 font-medium text-lg">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      user.status === 'active' ? 'bg-green-500' : 
                      user.status === 'pending' ? 'bg-yellow-500' : 
                      user.status === 'suspended' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-slate-600">{user.position}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                      {user.security.twoFactorEnabled && (
                        <div className="flex items-center text-green-600">
                          <Key className="w-3 h-3 mr-1" />
                          <span className="text-xs">2FA</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-slate-600">
                    <Mail className="w-4 h-4 mr-2" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{user.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Dernière connexion: {user.lastLogin || 'Jamais'}</span>
                  </div>
                </div>

                {user.bio && (
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{user.bio}</p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className={`px-2 py-1 text-xs font-medium rounded flex items-center ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)}
                    <span className="ml-1">{getStatusText(user.status)}</span>
                  </span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => {
                        setSelectedUser(user);
                        setShowProfileModal(true);
                      }}
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
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <div key={role.id} className="p-6 border border-slate-200 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${role.color}`}></div>
                    <div>
                      <h4 className="font-medium text-slate-900">{role.name}</h4>
                      {role.isSystem && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded mt-1 inline-block">
                          Système
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-slate-600">{role.userCount} utilisateur(s)</span>
                </div>

                <p className="text-sm text-slate-600 mb-4">{role.description}</p>

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

                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Modifier
                  </button>
                  {!role.isSystem && (
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-slate-900 mb-2">Activité Récente</h4>
              <p className="text-sm text-slate-600">Journal des actions effectuées par les administrateurs</p>
            </div>

            {activityLogs.map((log) => (
              <div key={log.id} className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{log.userName}</p>
                      <p className="text-sm text-slate-600">{log.action} - {log.module}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">{log.timestamp}</span>
                </div>

                {log.details && (
                  <div className="ml-11 mb-2">
                    <p className="text-sm text-slate-600">{log.details}</p>
                  </div>
                )}

                <div className="ml-11 flex items-center space-x-4 text-xs text-slate-500">
                  <span>IP: {log.ipAddress}</span>
                  <span>User Agent: {log.userAgent.substring(0, 50)}...</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-green-900">Sécurité Renforcée</h4>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">2FA Activé:</span>
                    <span className="font-medium text-green-900">{userStats.with2FA}/{userStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Mots de passe forts:</span>
                    <span className="font-medium text-green-900">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Sessions sécurisées:</span>
                    <span className="font-medium text-green-900">Oui</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-yellow-900">Alertes Sécurité</h4>
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Tentatives échouées:</span>
                    <span className="font-medium text-yellow-900">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">Comptes suspendus:</span>
                    <span className="font-medium text-yellow-900">{userStats.suspended}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-700">IP suspectes:</span>
                    <span className="font-medium text-yellow-900">0</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-blue-900">Activité Système</h4>
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Connexions aujourd'hui:</span>
                    <span className="font-medium text-blue-900">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Sessions actives:</span>
                    <span className="font-medium text-blue-900">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Dernière sauvegarde:</span>
                    <span className="font-medium text-blue-900">2h</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <h4 className="font-medium text-slate-900 mb-4">Politiques de Sécurité</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-slate-800 mb-2">Mots de Passe</h5>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Minimum 12 caractères</li>
                    <li>• Majuscules, minuscules, chiffres et symboles</li>
                    <li>• Renouvellement tous les 90 jours</li>
                    <li>• Historique des 12 derniers mots de passe</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-slate-800 mb-2">Sessions</h5>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Expiration automatique après 8h d'inactivité</li>
                    <li>• Limitation à 3 sessions simultanées</li>
                    <li>• Chiffrement SSL/TLS obligatoire</li>
                    <li>• Journalisation complète des accès</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {selectedUser && showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                        className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-2 border-slate-200">
                        <span className="text-blue-600 font-medium text-2xl">
                          {selectedUser.firstName[0]}{selectedUser.lastName[0]}
                        </span>
                      </div>
                    )}
                    <button 
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                      className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </h3>
                    <p className="text-slate-600">{selectedUser.position}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(selectedUser.role)}`}>
                        {getRoleText(selectedUser.role)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(selectedUser.status)}`}>
                        {getStatusText(selectedUser.status)}
                      </span>
                      {selectedUser.security.twoFactorEnabled && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800 flex items-center">
                          <Key className="w-3 h-3 mr-1" />
                          2FA Activé
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowProfileModal(false);
                    setSelectedUser(null);
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>

              {/* Photo Upload Preview */}
              {previewUrl && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Nouvelle photo de profil</p>
                        <p className="text-xs text-blue-700">Cliquez sur "Mettre à jour" pour confirmer</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleUploadAvatar}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Mettre à jour
                      </button>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                        }}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
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
                        <span>{selectedUser.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                        <span>Créé le {selectedUser.createdDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {selectedUser.bio && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-2">Biographie</h4>
                      <p className="text-sm text-slate-700">{selectedUser.bio}</p>
                    </div>
                  )}

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

                  {/* Activity Stats */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Statistiques d'Activité</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedUser.activity.totalLogins}</div>
                        <div className="text-slate-600">Connexions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedUser.activity.avgSessionDuration}h</div>
                        <div className="text-slate-600">Session Moy.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedUser.activity.favoriteModules.length}</div>
                        <div className="text-slate-600">Modules Fav.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {selectedUser.activity.lastActivity ? '✓' : '✗'}
                        </div>
                        <div className="text-slate-600">Actif</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Security Info */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Sécurité</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Authentification 2FA:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          selectedUser.security.twoFactorEnabled 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedUser.security.twoFactorEnabled ? 'Activée' : 'Désactivée'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Dernier changement MDP:</span>
                        <span className="text-slate-900">{selectedUser.security.lastPasswordChange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tentatives de connexion:</span>
                        <span className="text-slate-900">{selectedUser.security.loginAttempts}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-medium text-slate-900 mb-3">Préférences</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Thème:</span>
                        <span className="text-slate-900 capitalize">{selectedUser.preferences.theme}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Langue:</span>
                        <span className="text-slate-900">{selectedUser.preferences.language.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Fuseau horaire:</span>
                        <span className="text-slate-900">{selectedUser.preferences.timezone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  {Object.keys(selectedUser.socialLinks).length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-medium text-slate-900 mb-3">Liens Sociaux</h4>
                      <div className="space-y-2">
                        {selectedUser.socialLinks.linkedin && (
                          <a href={selectedUser.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" 
                             className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                            <span className="w-4 h-4 mr-2">💼</span>
                            LinkedIn
                          </a>
                        )}
                        {selectedUser.socialLinks.twitter && (
                          <a href={selectedUser.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                             className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                            <span className="w-4 h-4 mr-2">🐦</span>
                            Twitter
                          </a>
                        )}
                        {selectedUser.socialLinks.github && (
                          <a href={selectedUser.socialLinks.github} target="_blank" rel="noopener noreferrer"
                             className="flex items-center text-sm text-blue-600 hover:text-blue-700">
                            <span className="w-4 h-4 mr-2">💻</span>
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier le Profil
                    </button>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                      <Key className="w-4 h-4 mr-2" />
                      Réinitialiser MDP
                    </button>
                    {selectedUser.status === 'active' ? (
                      <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Suspendre
                      </button>
                    ) : (
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                        <Unlock className="w-4 h-4 mr-2" />
                        Activer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminUser['role'] })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="moderator">Modérateur</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Administrateur</option>
                    <option value="super-admin">Super Administrateur</option>
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Poste *</label>
                  <input
                    type="text"
                    value={newUser.position}
                    onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Administrateur Système"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
                  <input
                    type="text"
                    value={newUser.location}
                    onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: Paris, France"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Biographie</label>
                <textarea
                  value={newUser.bio}
                  onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Description du profil et des responsabilités..."
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

export default AdminUserManagement;