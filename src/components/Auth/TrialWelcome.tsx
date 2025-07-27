import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, Play, Users, Zap, BarChart3, Target, Calendar, X, Star, Gift } from 'lucide-react';

interface TrialWelcomeProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: {
    firstName: string;
    company: string;
    plan: string;
  };
}

const TrialWelcome: React.FC<TrialWelcomeProps> = ({ 
  isOpen, 
  onClose, 
  userInfo 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const onboardingSteps = [
    {
      title: "Bienvenue dans dziljo !",
      description: "Votre essai de 30 jours commence maintenant",
      icon: Gift,
      color: "text-blue-600",
      action: "Commencer le tour"
    },
    {
      title: "Importez vos données",
      description: "Prospects, contacts, ou employés via CSV",
      icon: Users,
      color: "text-green-600",
      action: "Importer des données"
    },
    {
      title: "Configurez vos workflows",
      description: "Automatisez vos processus métier",
      icon: Zap,
      color: "text-purple-600",
      action: "Voir les workflows"
    },
    {
      title: "Créez votre premier devis",
      description: "Utilisez nos modèles intelligents",
      icon: BarChart3,
      color: "text-orange-600",
      action: "Créer un devis"
    },
    {
      title: "Invitez votre équipe",
      description: "Collaborez efficacement",
      icon: Target,
      color: "text-indigo-600",
      action: "Inviter l'équipe"
    }
  ];

  const features = [
    "✅ Tous les modules Pro débloqués",
    "✅ Support prioritaire inclus",
    "✅ Intégrations illimitées",
    "✅ Exports et rapports avancés",
    "✅ Aucune limitation de données"
  ];

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % onboardingSteps.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const handleStepComplete = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
  };

  const handleGetStarted = () => {
    // Simulate starting the onboarding
    onClose();
    
    // Show success message
    const successElement = document.createElement('div');
    successElement.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    successElement.textContent = '🎉 Bienvenue dans dziljo ! Votre essai a commencé.';
    document.body.appendChild(successElement);
    setTimeout(() => document.body.removeChild(successElement), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 animate-gradient-x"></div>
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Votre essai démarre !
            </h1>
            <p className="text-green-100 text-lg">
              Bonjour {userInfo.firstName} ! Bienvenue chez {userInfo.company}
            </p>
            
            {/* Trial Progress */}
            <div className="mt-6 bg-white/10 rounded-full p-1">
              <div className="bg-white rounded-full px-4 py-2 text-green-600 font-semibold text-sm">
                📅 J-30 → J-0 : Votre période d'essai complète
              </div>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Features */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 Plan {userInfo.plan} activé !
              </h2>
              <p className="text-gray-600 mb-6">
                Profitez de toutes les fonctionnalités premium pendant 30 jours, 
                sans limitation.
              </p>

              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <span className="mr-3">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Rappels automatiques</h3>
                    <ul className="text-blue-800 text-sm mt-2 space-y-1">
                      <li>• J-25 : Récap usage + recommandations</li>
                      <li>• J-3 : Rappel ajout moyen de paiement</li>
                      <li>• J-0 : Transition douce vers plan Gratuit</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Interactive Steps */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                🚀 Premiers pas recommandés
              </h3>
              
              <div className="space-y-4">
                {onboardingSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      index === currentStep
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : completedSteps.includes(index)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleStepComplete(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          completedSteps.includes(index) 
                            ? 'bg-green-100' 
                            : index === currentStep 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100'
                        }`}>
                          {completedSteps.includes(index) ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <step.icon className={`w-5 h-5 ${step.color}`} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                          <p className="text-gray-600 text-sm">{step.description}</p>
                        </div>
                      </div>
                      
                      {!completedSteps.includes(index) && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                          {step.action}
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <div className="text-sm text-gray-500 mb-4">
                  {completedSteps.length}/{onboardingSteps.length} étapes complétées
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSteps.length / onboardingSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center mx-auto"
            >
              <Play className="w-5 h-5 mr-3" />
              Commencer l'exploration
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Vous pouvez fermer cette fenêtre et revenir plus tard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialWelcome;