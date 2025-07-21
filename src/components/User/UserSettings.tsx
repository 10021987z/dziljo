import React, { useState } from 'react';
import { Settings, Bell, Shield, Eye, Palette, Globe, Moon, Sun, Volume2, VolumeX, Smartphone, Monitor, Wifi, Database, Key, Lock, Unlock, Save, RotateCcw, Download, Upload, Trash2, AlertTriangle, CheckCircle, Zap, Heart, Coffee } from 'lucide-react';

interface UserSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      language: 'fr',
      timezone: 'Europe/Paris',
      dateFormat: 'DD/MM/YYYY',
      theme: 'light',
      autoSave: true,
      compactMode: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      soundEnabled: true,
      desktopNotifications: true,
      marketingEmails: false,
      weeklyDigest: true,
      instantAlerts: true,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    },
    privacy: {
      profileVisibility: 'team',
      showOnlineStatus: true,
      allowDirectMessages: true,
      shareAnalytics: false,
      dataCollection: 'minimal',
      twoFactorAuth: false,
      sessionTimeout: 30
    },
    appearance: {
      theme: 'light',
      accentColor: 'blue',
      fontSize: 'medium',
      animations: true,
      highContrast: false,
      reducedMotion: false,
      customBackground: false
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const categories = [
    { id: 'general', name: 'Général', icon: Settings, color: 'text-blue-600' },
    { id: 'notifications', name: 'Notifications', icon: Bell, color: 'text-green-600' },
    { id: 'privacy', name: 'Confidentialité', icon: Shield, color: 'text-purple-600' },
    { id: 'appearance', name: 'Apparence', icon: Palette, color: 'text-pink-600' }
  ];

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateNestedSetting = (category: string, parentKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [parentKey]: {
          ...(prev[category as keyof typeof prev] as any)[parentKey],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    // Simulation de la sauvegarde
    console.log('Saving settings:', settings);
    setHasChanges(false);
    
    // Animation de succès
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Paramètres sauvegardés !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const resetSettings = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      // Reset logic here
      setHasChanges(false);
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dziljo-settings.json';
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Paramètres</h1>
                <p className="text-white/80">Personnalisez votre expérience dziljo</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasChanges && (
                <div className="flex space-x-2">
                  <button
                    onClick={saveSettings}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </button>
                  <button
                    onClick={resetSettings}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Réinitialiser
                  </button>
                </div>
              )}
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2 mt-4">
            <button
              onClick={exportSettings}
              className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm flex items-center transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </button>
            <button className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg text-sm flex items-center transition-colors">
              <Upload className="w-4 h-4 mr-2" />
              Importer
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    activeCategory === category.id
                      ? 'bg-white shadow-md border border-slate-200 scale-105'
                      : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <category.icon className={`w-4 h-4 mr-3 ${category.color} ${activeCategory === category.id ? 'animate-pulse' : ''}`} />
                  <span className={`font-medium ${activeCategory === category.id ? 'text-slate-900' : 'text-slate-600'}`}>
                    {category.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">Système à jour</span>
                </div>
                <p className="text-xs text-green-600 mt-1">Dernière sync: maintenant</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-h-96 overflow-y-auto">
            {activeCategory === 'general' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Paramètres Généraux
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Langue</label>
                      <select
                        value={settings.general.language}
                        onChange={(e) => updateSetting('general', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Fuseau Horaire</label>
                      <select
                        value={settings.general.timezone}
                        onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                        <option value="Europe/London">Europe/London (UTC+0)</option>
                        <option value="America/New_York">America/New_York (UTC-5)</option>
                        <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Format de Date</label>
                      <select
                        value={settings.general.dateFormat}
                        onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h3 className="font-medium text-slate-900 mb-3">Préférences d'Interface</h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Sauvegarde Automatique</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.general.autoSave}
                              onChange={(e) => updateSetting('general', 'autoSave', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateSetting('general', 'autoSave', !settings.general.autoSave)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.general.autoSave ? 'bg-blue-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.general.autoSave ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Mode Compact</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.general.compactMode}
                              onChange={(e) => updateSetting('general', 'compactMode', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateSetting('general', 'compactMode', !settings.general.compactMode)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.general.compactMode ? 'bg-blue-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.general.compactMode ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-green-600" />
                  Notifications
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-3 flex items-center">
                        <Bell className="w-4 h-4 mr-2" />
                        Types de Notifications
                      </h3>
                      
                      <div className="space-y-3">
                        {[
                          { key: 'emailNotifications', label: 'Notifications Email', icon: '📧' },
                          { key: 'pushNotifications', label: 'Notifications Push', icon: '📱' },
                          { key: 'desktopNotifications', label: 'Notifications Bureau', icon: '💻' },
                          { key: 'soundEnabled', label: 'Sons Activés', icon: '🔊' },
                          { key: 'weeklyDigest', label: 'Résumé Hebdomadaire', icon: '📊' },
                          { key: 'instantAlerts', label: 'Alertes Instantanées', icon: '⚡' }
                        ].map((item) => (
                          <label key={item.key} className="flex items-center justify-between">
                            <span className="text-sm text-slate-700 flex items-center">
                              <span className="mr-2">{item.icon}</span>
                              {item.label}
                            </span>
                            <div className="relative">
                              <input
                                type="checkbox"
                                checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean}
                                onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                                className="sr-only"
                              />
                              <div
                                onClick={() => updateSetting('notifications', item.key, !settings.notifications[item.key as keyof typeof settings.notifications])}
                                className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                  settings.notifications[item.key as keyof typeof settings.notifications] ? 'bg-green-600' : 'bg-slate-300'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                    settings.notifications[item.key as keyof typeof settings.notifications] ? 'translate-x-5' : 'translate-x-1'
                                  } mt-1`}
                                ></div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                        <Moon className="w-4 h-4 mr-2" />
                        Heures Silencieuses
                      </h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Activer les heures silencieuses</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.notifications.quietHours.enabled}
                              onChange={(e) => updateNestedSetting('notifications', 'quietHours', 'enabled', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateNestedSetting('notifications', 'quietHours', 'enabled', !settings.notifications.quietHours.enabled)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.notifications.quietHours.enabled ? 'bg-blue-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.notifications.quietHours.enabled ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>

                        {settings.notifications.quietHours.enabled && (
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-slate-600 mb-1">Début</label>
                              <input
                                type="time"
                                value={settings.notifications.quietHours.start}
                                onChange={(e) => updateNestedSetting('notifications', 'quietHours', 'start', e.target.value)}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-600 mb-1">Fin</label>
                              <input
                                type="time"
                                value={settings.notifications.quietHours.end}
                                onChange={(e) => updateNestedSetting('notifications', 'quietHours', 'end', e.target.value)}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Confidentialité & Sécurité
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h3 className="font-medium text-purple-900 mb-3 flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Visibilité du Profil
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-slate-700 mb-2">Qui peut voir votre profil ?</label>
                          <select
                            value={settings.privacy.profileVisibility}
                            onChange={(e) => updateSetting('privacy', 'profileVisibility', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="public">Public</option>
                            <option value="team">Équipe seulement</option>
                            <option value="private">Privé</option>
                          </select>
                        </div>

                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Afficher le statut en ligne</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.privacy.showOnlineStatus}
                              onChange={(e) => updateSetting('privacy', 'showOnlineStatus', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateSetting('privacy', 'showOnlineStatus', !settings.privacy.showOnlineStatus)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.privacy.showOnlineStatus ? 'bg-purple-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.privacy.showOnlineStatus ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Autoriser les messages directs</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.privacy.allowDirectMessages}
                              onChange={(e) => updateSetting('privacy', 'allowDirectMessages', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateSetting('privacy', 'allowDirectMessages', !settings.privacy.allowDirectMessages)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.privacy.allowDirectMessages ? 'bg-purple-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.privacy.allowDirectMessages ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <h3 className="font-medium text-red-900 mb-3 flex items-center">
                        <Key className="w-4 h-4 mr-2" />
                        Sécurité
                      </h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Authentification à deux facteurs</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.privacy.twoFactorAuth}
                              onChange={(e) => updateSetting('privacy', 'twoFactorAuth', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateSetting('privacy', 'twoFactorAuth', !settings.privacy.twoFactorAuth)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.privacy.twoFactorAuth ? 'bg-red-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.privacy.twoFactorAuth ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>

                        <div>
                          <label className="block text-sm text-slate-700 mb-2">Délai d'expiration de session (minutes)</label>
                          <input
                            type="number"
                            value={settings.privacy.sessionTimeout}
                            onChange={(e) => updateSetting('privacy', 'sessionTimeout', parseInt(e.target.value))}
                            min="5"
                            max="240"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-slate-700 mb-2">Collecte de données</label>
                          <select
                            value={settings.privacy.dataCollection}
                            onChange={(e) => updateSetting('privacy', 'dataCollection', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          >
                            <option value="none">Aucune</option>
                            <option value="minimal">Minimale</option>
                            <option value="standard">Standard</option>
                            <option value="full">Complète</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-900">Zone Sensible</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Les modifications de confidentialité et de sécurité peuvent affecter votre accès au système.
                        Assurez-vous de comprendre les implications avant de modifier ces paramètres.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeCategory === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-pink-600" />
                  Apparence
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Thème</label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'light', name: 'Clair', icon: Sun },
                          { id: 'dark', name: 'Sombre', icon: Moon },
                          { id: 'system', name: 'Système', icon: Monitor }
                        ].map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => updateSetting('appearance', 'theme', theme.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                              settings.appearance.theme === theme.id
                                ? 'border-pink-500 bg-pink-50 shadow-md scale-105'
                                : 'border-slate-200 hover:border-pink-300 hover:bg-pink-50'
                            }`}
                          >
                            <theme.icon className={`w-6 h-6 mb-2 ${settings.appearance.theme === theme.id ? 'text-pink-600' : 'text-slate-600'}`} />
                            <span className="text-sm font-medium">{theme.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Couleur d'Accent</label>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { id: 'blue', color: 'bg-blue-500' },
                          { id: 'purple', color: 'bg-purple-500' },
                          { id: 'pink', color: 'bg-pink-500' },
                          { id: 'green', color: 'bg-green-500' },
                          { id: 'orange', color: 'bg-orange-500' }
                        ].map((color) => (
                          <button
                            key={color.id}
                            onClick={() => updateSetting('appearance', 'accentColor', color.id)}
                            className={`w-full h-10 rounded-lg transition-transform ${color.color} ${
                              settings.appearance.accentColor === color.id
                                ? 'ring-2 ring-offset-2 ring-slate-900 scale-110'
                                : 'hover:scale-105'
                            }`}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Taille de Police</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs">A</span>
                        <input
                          type="range"
                          min="0"
                          max="2"
                          step="1"
                          value={settings.appearance.fontSize === 'small' ? 0 : settings.appearance.fontSize === 'medium' ? 1 : 2}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            updateSetting('appearance', 'fontSize', value === 0 ? 'small' : value === 1 ? 'medium' : 'large');
                          }}
                          className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-lg">A</span>
                      </div>
                    </div>

                    <div className="bg-pink-50 rounded-lg p-4">
                      <h3 className="font-medium text-pink-900 mb-3">Accessibilité</h3>
                      
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Animations</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.appearance.animations}
                              onChange={(e) => updateSetting('appearance', 'animations', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateSetting('appearance', 'animations', !settings.appearance.animations)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.appearance.animations ? 'bg-pink-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.appearance.animations ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Contraste Élevé</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.appearance.highContrast}
                              onChange={(e) => updateSetting('appearance', 'highContrast', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateSetting('appearance', 'highContrast', !settings.appearance.highContrast)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.appearance.highContrast ? 'bg-pink-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.appearance.highContrast ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>

                        <label className="flex items-center justify-between">
                          <span className="text-sm text-slate-700">Réduire les Mouvements</span>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={settings.appearance.reducedMotion}
                              onChange={(e) => updateSetting('appearance', 'reducedMotion', e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              onClick={() => updateSetting('appearance', 'reducedMotion', !settings.appearance.reducedMotion)}
                              className={`w-10 h-6 rounded-full cursor-pointer transition-colors ${
                                settings.appearance.reducedMotion ? 'bg-pink-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                                  settings.appearance.reducedMotion ? 'translate-x-5' : 'translate-x-1'
                                } mt-1`}
                              ></div>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Aperçu */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-3">Aperçu</h3>
                  <div className={`p-4 rounded-lg border border-slate-300 ${
                    settings.appearance.theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                  }`}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        settings.appearance.accentColor === 'blue' ? 'bg-blue-500' :
                        settings.appearance.accentColor === 'purple' ? 'bg-purple-500' :
                        settings.appearance.accentColor === 'pink' ? 'bg-pink-500' :
                        settings.appearance.accentColor === 'green' ? 'bg-green-500' :
                        'bg-orange-500'
                      } text-white`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className={`font-medium ${
                          settings.appearance.fontSize === 'small' ? 'text-sm' :
                          settings.appearance.fontSize === 'medium' ? 'text-base' :
                          'text-lg'
                        }`}>
                          Aperçu du Thème
                        </h4>
                        <p className={`${
                          settings.appearance.fontSize === 'small' ? 'text-xs' :
                          settings.appearance.fontSize === 'medium' ? 'text-sm' :
                          'text-base'
                        } ${settings.appearance.theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                          Voici à quoi ressemblera votre interface
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className={`px-3 py-1 rounded-lg text-sm ${
                        settings.appearance.accentColor === 'blue' ? 'bg-blue-500' :
                        settings.appearance.accentColor === 'purple' ? 'bg-purple-500' :
                        settings.appearance.accentColor === 'pink' ? 'bg-pink-500' :
                        settings.appearance.accentColor === 'green' ? 'bg-green-500' :
                        'bg-orange-500'
                      } text-white`}>
                        Bouton Principal
                      </button>
                      <button className={`px-3 py-1 rounded-lg text-sm ${
                        settings.appearance.theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-800'
                      }`}>
                        Bouton Secondaire
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Heart className="w-4 h-4 text-pink-500" />
              <span>Fait avec amour par l'équipe dziljo</span>
            </div>
            <div className="flex space-x-2">
              {hasChanges && (
                <button
                  onClick={saveSettings}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder les Modifications
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;