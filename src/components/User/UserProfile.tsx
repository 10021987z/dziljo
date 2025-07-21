import React, { useState } from 'react';
import { User, Camera, Edit, Save, X, Mail, Phone, MapPin, Calendar, Briefcase, Award, Star, Heart, Coffee, Zap, Target, TrendingUp, Clock, CheckCircle, Upload, Download, Share2, Settings, Shield, Bell, Eye, EyeOff } from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: 'Sophie',
    lastName: 'Martin',
    email: 's.martin@dziljo.com',
    phone: '+33 1 23 45 67 89',
    position: 'Développeur Full Stack Senior',
    department: 'Technique',
    location: 'Paris, France',
    bio: 'Passionnée par le développement web moderne et l\'innovation technologique. Spécialisée en React, Node.js et architecture cloud.',
    startDate: '2023-03-15',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'GraphQL'],
    achievements: [
      { id: 1, title: 'Expert React', description: 'Maîtrise avancée de React', icon: '⚛️', date: '2024-01-15' },
      { id: 2, title: 'Mentor de l\'année', description: 'Accompagnement exceptionnel des juniors', icon: '🏆', date: '2023-12-20' },
      { id: 3, title: 'Innovation Award', description: 'Contribution majeure au projet CRM', icon: '💡', date: '2023-11-10' }
    ],
    stats: {
      projectsCompleted: 24,
      hoursWorked: 1847,
      teamCollaborations: 12,
      certifications: 5
    }
  });

  const [tempData, setTempData] = useState(profileData);

  const handleSave = () => {
    setProfileData(tempData);
    setIsEditing(false);
    // Animation de succès
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Profil mis à jour !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    // Simulation du changement d'avatar
    const avatars = [
      'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop'
    ];
    const currentIndex = avatars.indexOf(tempData.avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    setTempData({ ...tempData, avatar: avatars[nextIndex] });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header avec gradient animé */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <img
                  src={isEditing ? tempData.avatar : profileData.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                {isEditing && (
                  <button
                    onClick={handleAvatarChange}
                    className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEditing ? `${tempData.firstName} ${tempData.lastName}` : `${profileData.firstName} ${profileData.lastName}`}
                </h1>
                <p className="text-white/80">
                  {isEditing ? tempData.position : profileData.position}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
                >
                  <Edit className="w-5 h-5" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-colors"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats animées */}
          <div className="grid grid-cols-4 gap-4 mt-6 relative z-10">
            {[
              { label: 'Projets', value: profileData.stats.projectsCompleted, icon: Target, color: 'text-yellow-300' },
              { label: 'Heures', value: profileData.stats.hoursWorked, icon: Clock, color: 'text-green-300' },
              { label: 'Équipes', value: profileData.stats.teamCollaborations, icon: Heart, color: 'text-pink-300' },
              { label: 'Certifs', value: profileData.stats.certifications, icon: Award, color: 'text-blue-300' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm group-hover:bg-white/20 transition-colors">
                  <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color} group-hover:scale-110 transition-transform`} />
                  <div className="text-xl font-bold animate-count-up">{stat.value}</div>
                  <div className="text-xs text-white/80">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* Sidebar avec onglets */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <div className="space-y-2">
              {[
                { id: 'profile', name: 'Profil', icon: User, color: 'text-blue-600' },
                { id: 'skills', name: 'Compétences', icon: Zap, color: 'text-purple-600' },
                { id: 'achievements', name: 'Réussites', icon: Award, color: 'text-yellow-600' },
                { id: 'activity', name: 'Activité', icon: TrendingUp, color: 'text-green-600' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white shadow-md border border-slate-200 scale-105'
                      : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 mr-3 ${tab.color} ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                  <span className={`font-medium ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-600'}`}>
                    {tab.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Actions rapides */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Actions Rapides</h3>
              <div className="space-y-2">
                {[
                  { icon: Download, label: 'Exporter CV', color: 'text-blue-600' },
                  { icon: Share2, label: 'Partager Profil', color: 'text-green-600' },
                  { icon: Settings, label: 'Paramètres', color: 'text-slate-600' }
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center px-3 py-2 text-left hover:bg-white rounded-lg transition-colors group"
                  >
                    <action.icon className={`w-4 h-4 mr-3 ${action.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm text-slate-700">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-6 max-h-96 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Informations Personnelles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Prénom</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.firstName}
                        onChange={(e) => setTempData({ ...tempData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">{profileData.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Nom</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={tempData.lastName}
                        onChange={(e) => setTempData({ ...tempData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    ) : (
                      <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">{profileData.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-slate-500 mr-2" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={tempData.email}
                          onChange={(e) => setTempData({ ...tempData, email: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="text-slate-900">{profileData.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Téléphone</label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-slate-500 mr-2" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={tempData.phone}
                          onChange={(e) => setTempData({ ...tempData, phone: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="text-slate-900">{profileData.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Poste</label>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 text-slate-500 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.position}
                          onChange={(e) => setTempData({ ...tempData, position: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="text-slate-900">{profileData.position}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Localisation</label>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-slate-500 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempData.location}
                          onChange={(e) => setTempData({ ...tempData, location: e.target.value })}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="text-slate-900">{profileData.location}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      value={tempData.bio}
                      onChange={(e) => setTempData({ ...tempData, bio: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  ) : (
                    <p className="text-slate-900 bg-slate-50 px-3 py-2 rounded-lg">{profileData.bio}</p>
                  )}
                </div>

                <div className="flex items-center text-sm text-slate-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Membre depuis le {new Date(profileData.startDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-600" />
                  Compétences
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profileData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg p-3 text-center hover:scale-105 transition-transform cursor-pointer group"
                    >
                      <div className="text-lg font-medium text-purple-800 group-hover:animate-bounce">
                        {skill}
                      </div>
                      <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.random() * 40 + 60}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {isEditing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Ajouter une compétence</h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Nouvelle compétence..."
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Ajouter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600" />
                  Réussites & Récompenses
                </h2>

                <div className="space-y-4">
                  {profileData.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl group-hover:animate-spin">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{achievement.title}</h3>
                          <p className="text-slate-600 text-sm">{achievement.description}</p>
                          <div className="flex items-center mt-2 text-xs text-slate-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(achievement.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                        <div className="text-yellow-500">
                          <Star className="w-6 h-6 fill-current" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Activité Récente
                </h2>

                <div className="space-y-4">
                  {[
                    { action: 'Projet CRM terminé', time: '2h', icon: CheckCircle, color: 'text-green-600' },
                    { action: 'Formation React suivie', time: '1j', icon: Award, color: 'text-blue-600' },
                    { action: 'Code review effectuée', time: '2j', icon: Eye, color: 'text-purple-600' },
                    { action: 'Réunion équipe animée', time: '3j', icon: Coffee, color: 'text-orange-600' }
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="text-slate-900">{activity.action}</p>
                        <p className="text-sm text-slate-500">Il y a {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;