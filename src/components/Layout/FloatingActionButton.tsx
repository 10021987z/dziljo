import React, { useState, useEffect } from 'react';
import { Zap, Plus, X, Calendar, UserPlus, FileText, Phone, Mail, Settings, Target, TrendingUp } from 'lucide-react';
import QuickActions from './QuickActions';
import NewEventModal from '../Commercial/NewEventModal';

interface FloatingActionButtonProps {
  activeModule: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ activeModule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide/show on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setShowQuickActions(true);
      } else if (e.altKey && e.key === 'e') {
        e.preventDefault();
        setShowNewEvent(true);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleQuickActionsOpen = () => {
    setIsOpen(false);
    setShowQuickActions(true);
  };

  const handleNewEventOpen = () => {
    setIsOpen(false);
    setShowNewEvent(true);
  };

  const handleCreateEvent = (eventData: any) => {
    console.log('Event created:', eventData);
    
    // Add event to localStorage for persistence (simulation)
    const existingEvents = JSON.parse(localStorage.getItem('dziljo-events') || '[]');
    const newEvent = {
      ...eventData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    existingEvents.push(newEvent);
    localStorage.setItem('dziljo-events', JSON.stringify(existingEvents));
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Événement créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  // Get context-specific actions based on active module
  const getContextActions = () => {
    switch (activeModule) {
      case 'rh':
      case 'employees':
      case 'recruitment':
        return [
          { icon: UserPlus, label: 'Nouvel Employé', color: 'bg-purple-600', action: () => console.log('New employee') },
          { icon: Calendar, label: 'Entretien', color: 'bg-blue-600', action: () => console.log('Interview') },
          { icon: FileText, label: 'Contrat', color: 'bg-green-600', action: () => console.log('Contract') },
          { icon: Target, label: 'Évaluation', color: 'bg-orange-600', action: () => console.log('Review') }
        ];
      case 'commercial':
      case 'leads':
      case 'opportunities':
        return [
          { icon: TrendingUp, label: 'Prospect', color: 'bg-blue-600', action: () => console.log('New prospect') },
          { icon: Target, label: 'Opportunité', color: 'bg-green-600', action: () => console.log('New opportunity') },
          { icon: Calendar, label: 'RDV', color: 'bg-purple-600', action: handleNewEventOpen },
          { icon: FileText, label: 'Devis', color: 'bg-orange-600', action: () => console.log('New quote') }
        ];
      case 'admin':
      case 'contracts':
      case 'reports':
        return [
          { icon: FileText, label: 'Contrat', color: 'bg-green-600', action: () => console.log('New contract') },
          { icon: FileText, label: 'Rapport', color: 'bg-blue-600', action: () => console.log('New report') },
          { icon: UserPlus, label: 'Utilisateur', color: 'bg-purple-600', action: () => console.log('New user') },
          { icon: Settings, label: 'Workflow', color: 'bg-orange-600', action: () => console.log('New workflow') }
        ];
      default:
        return [
          { icon: Calendar, label: 'Événement', color: 'bg-green-600', action: handleNewEventOpen },
          { icon: UserPlus, label: 'Contact', color: 'bg-blue-600', action: () => console.log('New contact') },
          { icon: FileText, label: 'Document', color: 'bg-purple-600', action: () => console.log('New document') },
          { icon: Phone, label: 'Appel', color: 'bg-orange-600', action: () => console.log('Make call') }
        ];
    }
  };

  const contextActions = getContextActions();

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        {/* Context action buttons */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-scale-in">
            {contextActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`w-12 h-12 ${action.color} hover:opacity-90 rounded-full shadow-lg flex items-center justify-center group relative transform transition-all duration-200`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  transform: `translateY(${isOpen ? 0 : 20}px)`,
                  opacity: isOpen ? 1 : 0
                }}
              >
                <action.icon className="w-5 h-5 text-white" />
                <span className="absolute right-14 bg-slate-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {action.label}
                </span>
              </button>
            ))}
            
            {/* Quick Actions button */}
            <button
              onClick={handleQuickActionsOpen}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg flex items-center justify-center group relative transform transition-all duration-200"
              style={{ 
                animationDelay: `${contextActions.length * 50}ms`,
                transform: `translateY(${isOpen ? 0 : 20}px)`,
                opacity: isOpen ? 1 : 0
              }}
            >
              <Zap className="w-5 h-5 text-white" />
              <span className="absolute right-14 bg-slate-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Toutes les Actions (Alt+A)
              </span>
            </button>
          </div>
        )}

        {/* Main button */}
        <button
          onClick={toggleOpen}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Tooltip for main button */}
        {!isOpen && (
          <div className="absolute bottom-16 right-0 bg-slate-800 text-white text-sm py-1 px-2 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Actions Rapides
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Quick Actions Modal */}
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
    </>
  );
};

export default FloatingActionButton;