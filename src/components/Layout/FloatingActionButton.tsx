import React, { useState } from 'react';
import { Zap, Plus, X, Calendar } from 'lucide-react';
import QuickActions from './QuickActions';
import NewEventModal from '../Commercial/NewEventModal';

interface FloatingActionButtonProps {
  activeModule: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ activeModule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNewEvent, setShowNewEvent] = useState(false);

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
    // In a real app, you would dispatch this to your state management
    // or make an API call to save the event
    
    // Show success notification
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '✅ Événement créé avec succès !';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 3000);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        {/* Main button */}
        <button
          onClick={toggleOpen}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
            isOpen 
              ? 'bg-red-500 hover:bg-red-600 rotate-45' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Action buttons */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-scale-in">
            <button
              onClick={handleNewEventOpen}
              className="w-12 h-12 bg-green-600 hover:bg-green-700 rounded-full shadow-lg flex items-center justify-center group relative"
            >
              <Calendar className="w-5 h-5 text-white" />
              <span className="absolute right-14 bg-slate-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Nouvel Événement
              </span>
            </button>
            
            <button
              onClick={handleQuickActionsOpen}
              className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-lg flex items-center justify-center group relative"
            >
              <Zap className="w-5 h-5 text-white" />
              <span className="absolute right-14 bg-slate-800 text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Actions Rapides
              </span>
            </button>
          </div>
        )}
      </div>

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