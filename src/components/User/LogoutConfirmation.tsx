import React, { useState } from 'react';
import { LogOut, AlertCircle, CheckCircle, Clock, Calendar, Coffee, Lightbulb } from 'lucide-react';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ isOpen, onClose, onConfirm }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showFunFact, setShowFunFact] = useState(true);

  const funFacts = [
    "Saviez-vous que les utilisateurs de dziljo gagnent en moyenne 2h de productivité par semaine ?",
    "Plus de 10 000 tâches sont accomplies chaque jour grâce à dziljo !",
    "Notre équipe de support répond en moins de 2h à 98% des demandes.",
    "dziljo est utilisé dans plus de 20 pays à travers le monde.",
    "La fonctionnalité la plus utilisée est le pipeline commercial."
  ];

  const randomFunFact = funFacts[Math.floor(Math.random() * funFacts.length)];

  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowFunFact(false);
    
    // Simuler un délai de déconnexion
    setTimeout(() => {
      onConfirm();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <LogOut className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">Déconnexion</h2>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isLoggingOut ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Déconnexion en cours...</h3>
              <p className="text-slate-600">Merci d'avoir utilisé dziljo aujourd'hui !</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Êtes-vous sûr de vouloir vous déconnecter ?</h3>
                <p className="text-slate-600">Vous devrez vous reconnecter pour accéder à votre compte.</p>
              </div>

              {showFunFact && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Le saviez-vous ?</h4>
                      <p className="text-sm text-blue-700 mt-1">{randomFunFact}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-slate-600 mb-6">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Session: 2h 15min</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Dernière connexion: Hier, 18:30</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se Déconnecter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;