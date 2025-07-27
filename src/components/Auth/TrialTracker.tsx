import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Zap, X, Bell, Gift, ArrowRight, Clock, Star } from 'lucide-react';

interface TrialTrackerProps {
  isVisible: boolean;
  onClose: () => void;
  daysRemaining: number;
  onUpgrade: () => void;
}

const TrialTracker: React.FC<TrialTrackerProps> = ({ 
  isVisible, 
  onClose, 
  daysRemaining, 
  onUpgrade 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      title: "Importez vos prospects",
      description: "Utilisez l'import CSV pour ajouter rapidement vos contacts",
      icon: "📊",
      action: "Importer maintenant"
    },
    {
      title: "Configurez vos workflows",
      description: "Automatisez vos processus pour gagner du temps",
      icon: "⚡",
      action: "Voir les workflows"
    },
    {
      title: "Créez votre premier devis",
      description: "Utilisez nos modèles pour des devis professionnels",
      icon: "📄",
      action: "Créer un devis"
    },
    {
      title: "Invitez votre équipe",
      description: "Collaborez efficacement avec vos collègues",
      icon: "👥",
      action: "Inviter l'équipe"
    }
  ];

  const usageStats = {
    prospects: { current: 23, limit: 100 },
    users: { current: 2, limit: 10 },
    storage: { current: 1.2, limit: 50 },
    automations: { current: 5, limit: 20 }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getProgressColor = () => {
    if (daysRemaining > 20) return 'bg-green-500';
    if (daysRemaining > 10) return 'bg-yellow-500';
    if (daysRemaining > 5) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getUrgencyMessage = () => {
    if (daysRemaining > 20) return "Profitez de votre essai !";
    if (daysRemaining > 10) return "Votre essai se déroule bien";
    if (daysRemaining > 5) return "Plus que quelques jours d'essai";
    if (daysRemaining > 0) return "⚠️ Votre essai se termine bientôt";
    return "🚨 Essai terminé - Passez au plan gratuit";
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Trial Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">
                {daysRemaining > 0 ? `${daysRemaining} jours restants` : 'Essai terminé'}
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-32 bg-white/20 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                  style={{ width: `${(30 - daysRemaining) / 30 * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-blue-100">{getUrgencyMessage()}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Détails
            </button>
            <button
              onClick={onUpgrade}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center"
            >
              <Star className="w-4 h-4 mr-2" />
              Passer à Pro
            </button>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(usageStats).map(([key, stat]) => (
                <div key={key} className="bg-white/10 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize">{key}</span>
                    <span className="text-xs text-blue-100">
                      {stat.current}/{stat.limit}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(stat.current / stat.limit) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Tip */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{tips[currentTip].icon}</span>
            <div>
              <h4 className="font-semibold text-yellow-800">{tips[currentTip].title}</h4>
              <p className="text-yellow-700 text-sm">{tips[currentTip].description}</p>
            </div>
          </div>
          <button className="bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center">
            {tips[currentTip].action}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Critical Alerts */}
      {daysRemaining <= 3 && daysRemaining > 0 && (
        <div className="bg-red-50 border border-red-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-red-600" />
              <div>
                <h4 className="font-semibold text-red-800">
                  ⚠️ Ajoutez un moyen de paiement
                </h4>
                <p className="text-red-700 text-sm">
                  Pour ne pas interrompre vos automatisations après l'essai
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Ajouter Paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End of Trial */}
      {daysRemaining === 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Gift className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-800">
                  Essai terminé - Continuez avec le plan Gratuit
                </h4>
                <p className="text-blue-700 text-sm">
                  Vos données sont conservées. Passez à Pro quand vous voulez !
                </p>
              </div>
            </div>
            <button
              onClick={onUpgrade}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Découvrir Pro
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TrialTracker;