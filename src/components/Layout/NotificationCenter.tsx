import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Clock, AlertCircle, CheckCircle, Info, Star, Trash2, Settings, Filter, Search, MoreHorizontal } from 'lucide-react';

interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'hr' | 'commercial' | 'admin' | 'system' | 'security';
  actionUrl?: string;
  actionText?: string;
  avatar?: string;
  relatedUser?: string;
  metadata?: {
    module?: string;
    entityId?: number;
    entityType?: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'info',
      title: 'Nouvelle candidature reçue',
      message: 'Sophie Martin a postulé pour le poste de Développeur Full Stack Senior',
      timestamp: '2024-01-26T09:30:00Z',
      isRead: false,
      isStarred: false,
      priority: 'medium',
      category: 'hr',
      actionUrl: '/hr/recruitment',
      actionText: 'Voir la candidature',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      relatedUser: 'Sophie Martin',
      metadata: {
        module: 'recruitment',
        entityId: 1,
        entityType: 'application'
      }
    },
    {
      id: 2,
      type: 'warning',
      title: 'Contrat expirant bientôt',
      message: 'Le contrat avec TechCorp Solutions expire dans 7 jours',
      timestamp: '2024-01-26T08:45:00Z',
      isRead: false,
      isStarred: true,
      priority: 'high',
      category: 'admin',
      actionUrl: '/admin/contracts',
      actionText: 'Renouveler le contrat',
      metadata: {
        module: 'contracts',
        entityId: 1,
        entityType: 'contract'
      }
    },
    {
      id: 3,
      type: 'success',
      title: 'Opportunité signée',
      message: 'Thomas Dubois a signé le contrat pour le projet CRM - 25 000€',
      timestamp: '2024-01-26T08:15:00Z',
      isRead: true,
      isStarred: false,
      priority: 'medium',
      category: 'commercial',
      actionUrl: '/commercial/opportunities',
      actionText: 'Voir l\'opportunité',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      relatedUser: 'Thomas Dubois',
      metadata: {
        module: 'opportunities',
        entityId: 2,
        entityType: 'opportunity'
      }
    },
    {
      id: 4,
      type: 'error',
      title: 'Échec de synchronisation CRM',
      message: 'La synchronisation avec Salesforce a échoué. Vérifiez la configuration.',
      timestamp: '2024-01-26T07:30:00Z',
      isRead: false,
      isStarred: false,
      priority: 'urgent',
      category: 'system',
      actionUrl: '/admin/integrations',
      actionText: 'Vérifier la configuration',
      metadata: {
        module: 'integrations',
        entityId: 1,
        entityType: 'integration'
      }
    },
    {
      id: 5,
      type: 'info',
      title: 'Demande de congés en attente',
      message: 'Marie Rousseau a demandé 5 jours de congés du 15 au 19 février',
      timestamp: '2024-01-25T17:20:00Z',
      isRead: true,
      isStarred: false,
      priority: 'medium',
      category: 'hr',
      actionUrl: '/hr/leave-management',
      actionText: 'Approuver/Refuser',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      relatedUser: 'Marie Rousseau',
      metadata: {
        module: 'leave',
        entityId: 3,
        entityType: 'leave_request'
      }
    },
    {
      id: 6,
      type: 'system',
      title: 'Sauvegarde automatique terminée',
      message: 'La sauvegarde quotidienne des données a été effectuée avec succès',
      timestamp: '2024-01-26T02:00:00Z',
      isRead: true,
      isStarred: false,
      priority: 'low',
      category: 'system',
      metadata: {
        module: 'system',
        entityType: 'backup'
      }
    },
    {
      id: 7,
      type: 'warning',
      title: 'Certification expirante',
      message: 'La certification AWS de Sophie Martin expire dans 30 jours',
      timestamp: '2024-01-25T16:00:00Z',
      isRead: false,
      isStarred: false,
      priority: 'medium',
      category: 'hr',
      actionUrl: '/hr/training',
      actionText: 'Planifier renouvellement',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      relatedUser: 'Sophie Martin',
      metadata: {
        module: 'training',
        entityId: 1,
        entityType: 'certification'
      }
    },
    {
      id: 8,
      type: 'info',
      title: 'Nouveau prospect ajouté',
      message: 'Un nouveau prospect "StartupXYZ" a été ajouté au pipeline commercial',
      timestamp: '2024-01-25T14:30:00Z',
      isRead: true,
      isStarred: false,
      priority: 'low',
      category: 'commercial',
      actionUrl: '/commercial/leads',
      actionText: 'Voir le prospect',
      metadata: {
        module: 'prospects',
        entityId: 3,
        entityType: 'prospect'
      }
    }
  ]);

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'starred' | 'urgent'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'system': return <Settings className="w-5 h-5 text-blue-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hr': return 'bg-purple-100 text-purple-800';
      case 'commercial': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'hr': return 'RH';
      case 'commercial': return 'Commercial';
      case 'admin': return 'Admin';
      case 'system': return 'Système';
      case 'security': return 'Sécurité';
      default: return category;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAsUnread = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: false } : notif
    ));
  };

  const toggleStar = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isStarred: !notif.isStarred } : notif
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'unread' && !notif.isRead) ||
      (activeFilter === 'starred' && notif.isStarred) ||
      (activeFilter === 'urgent' && notif.priority === 'urgent');

    const matchesCategory = !categoryFilter || notif.category === categoryFilter;
    
    const matchesSearch = !searchTerm || 
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesCategory && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const urgentCount = notifications.filter(n => n.priority === 'urgent' && !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-end z-50">
      <div className="bg-white w-full max-w-md h-full shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 text-white placeholder-slate-400 rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-2 mb-4">
            {[
              { id: 'all', name: 'Toutes', count: notifications.length },
              { id: 'unread', name: 'Non lues', count: unreadCount },
              { id: 'starred', name: 'Favoris', count: notifications.filter(n => n.isStarred).length },
              { id: 'urgent', name: 'Urgent', count: urgentCount }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {filter.name} ({filter.count})
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les catégories</option>
            <option value="hr">RH</option>
            <option value="commercial">Commercial</option>
            <option value="admin">Administration</option>
            <option value="system">Système</option>
            <option value="security">Sécurité</option>
          </select>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Tout marquer comme lu
              </button>
              <span className="text-xs text-slate-400">
                {urgentCount > 0 && `${urgentCount} urgent(s)`}
              </span>
            </div>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Aucune notification trouvée</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 hover:bg-slate-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50' : 'bg-white'
                  } ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar or Icon */}
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <img
                          src={notification.avatar}
                          alt={notification.relatedUser}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className={`text-sm font-medium ${
                          !notification.isRead ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => toggleStar(notification.id)}
                            className={`p-1 rounded transition-colors ${
                              notification.isStarred 
                                ? 'text-yellow-500 hover:text-yellow-600' 
                                : 'text-slate-300 hover:text-yellow-500'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${notification.isStarred ? 'fill-current' : ''}`} />
                          </button>
                          <div className="relative group">
                            <button className="p-1 text-slate-300 hover:text-slate-600 transition-colors">
                              <MoreHorizontal className="w-3 h-3" />
                            </button>
                            <div className="absolute right-0 top-6 bg-white border border-slate-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <button
                                onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                                className="w-full px-3 py-1 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                              >
                                {notification.isRead ? 'Marquer non lu' : 'Marquer lu'}
                              </button>
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="w-full px-3 py-1 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(notification.category)}`}>
                            {getCategoryText(notification.category)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>

                        {notification.actionUrl && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id);
                              // Navigate to actionUrl
                              console.log('Navigate to:', notification.actionUrl);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                          >
                            {notification.actionText}
                          </button>
                        )}
                      </div>

                      {/* Priority indicator for urgent notifications */}
                      {notification.priority === 'urgent' && !notification.isRead && (
                        <div className="mt-2 flex items-center text-red-600">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs font-medium">URGENT</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              {filteredNotifications.length} notification(s)
            </span>
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center">
              <Settings className="w-4 h-4 mr-1" />
              Paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;