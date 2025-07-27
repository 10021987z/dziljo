import React, { useState, useEffect } from 'react';
import { Bell, Search, User, ChevronDown, Zap, Calendar } from 'lucide-react';
import TrialTracker from '../Auth/TrialTracker';
import TrialWelcome from '../Auth/TrialWelcome';
import NotificationCenter from './NotificationCenter';
import UserProfile from '../User/UserProfile';
import UserSettings from '../User/UserSettings';
import HelpSupport from '../User/HelpSupport';
import LogoutConfirmation from '../User/LogoutConfirmation';
import QuickActions from './QuickActions';
import NewEventModal from '../Commercial/NewEventModal';

interface HeaderProps {
  activeModule: string;
}

const Header: React.FC<HeaderProps> = ({ activeModule }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [showTrialTracker, setShowTrialTracker] = useState(true);
  const [showTrialWelcome, setShowTrialWelcome] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(25); // Simulate trial days

  // Simulate user in trial
  const isInTrial = daysRemaining > 0;

  const getModuleTitle = (module: string) => {
    const titles: { [key: string]: string } = {
      dashboard: 'Tableau de Bord',
      rh: 'Ressources Humaines',
      recruitment: 'Recrutement',
      employees: 'Dossiers Personnel',
      documents: 'Documents RH',
      commercial: 'Interface Commerciale',
      leads: 'Gestion de la Prospection',
      opportunities: 'Opportunités de Vente',
      calendar: 'Agenda Commercial',
      admin: 'Administration',
      contracts: 'Gestion des Contrats',
      invoicing: 'Facturation',
      reports: 'Comptes Rendus'
    };
    return titles[module] || 'dziljo';
  };

  // Simulated notification count
  const unreadNotifications = 4;

  const handleLogout = () => {
    console.log('User logged out');
    // Redirect to login page or perform actual logout
    alert('Vous avez été déconnecté avec succès !');
    setShowLogoutConfirmation(false);
  };

  // Add keyboard shortcut for quick actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        setShowQuickActions(true);
      } else if (e.altKey && e.key === 'e') {
        setShowNewEvent(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCreateEvent = (eventData: any) => {
    console.log('Event created from header:', eventData);
    // In a real app, you would dispatch this to your state management
    // or make an API call to save the event
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Événement créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  const handleUpgrade = () => {
    // Simulate upgrade process
    alert('Redirection vers la page de paiement...');
  };

  const handleTrialWelcome = () => {
    setShowTrialWelcome(true);
  };


  return (
    <>
      {/* Trial Tracker */}
      {isInTrial && (
        <TrialTracker
          isVisible={showTrialTracker}
          onClose={() => setShowTrialTracker(false)}
          daysRemaining={daysRemaining}
          onUpgrade={handleUpgrade}
        />
      )}

      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              {getModuleTitle(activeModule)}
            </h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button 
              onClick={() => setShowNewEvent(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
              title="Nouvel événement (Alt+E)"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Nouvel Événement
            </button>
            
            <button 
              onClick={() => setShowQuickActions(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
              title="Actions rapides (Alt+A)"
            >
              <Zap className="w-4 h-4 mr-2" />
              Actions Rapides
            </button>
            
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-lg p-2 transition-colors"
              >
                <img
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
                  alt="Admin User"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium text-slate-700">Sophie Martin</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-lg shadow-lg py-2 w-48 z-10">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">Sophie Martin</p>
                    <p className="text-xs text-slate-500">s.martin@dziljo.com</p>
                  </div>
                  <button 
                    onClick={() => {
                      setShowUserProfile(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Mon Profil
                  </button>
                  <button 
                    onClick={() => {
                      setShowUserSettings(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Paramètres
                  </button>
                  <button 
                    onClick={() => {
                      setShowHelpSupport(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Aide & Support
                  </button>
                  <div className="border-t border-slate-100 mt-2 pt-2">
                    <button 
                      onClick={() => {
                        setShowLogoutConfirmation(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Se Déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* User Profile */}
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />

      {/* User Settings */}
      <UserSettings
        isOpen={showUserSettings}
        onClose={() => setShowUserSettings(false)}
      />

      {/* Help & Support */}
      <HelpSupport
        isOpen={showHelpSupport}
        onClose={() => setShowHelpSupport(false)}
      />

      {/* Logout Confirmation */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
        onConfirm={handleLogout}
      />

      {/* Quick Actions */}
      <QuickActions
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        activeModule={activeModule}
      />

      {/* New Event Modal */}
      <NewEventModal
        isOpen={showNewEvent}
        onClose={() => setShowNewEvent(false)}
        onSave={handleCreateEvent}
      />

      {/* Trial Welcome Modal */}
      <TrialWelcome
        isOpen={showTrialWelcome}
        onClose={() => setShowTrialWelcome(false)}
        userInfo={{
          firstName: 'Sophie',
          company: 'Mon Entreprise',
          plan: 'Pro'
        }}
      />

      {/* Overlay to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </>
  );
};

export default Header;