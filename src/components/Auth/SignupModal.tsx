import React, { useState } from 'react';
import { X, Mail, Eye, EyeOff, Check, ArrowRight, Shield, Zap } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedPlan?: string;
}

const SignupModal: React.FC<SignupModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess,
  selectedPlan = 'Pro'
}) => {
  const [step, setStep] = useState<'signup' | 'verification' | 'success'>('signup');
  const [authMethod, setAuthMethod] = useState<'social' | 'email'>('social');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: ''
  });

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: '🔍',
      color: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      icon: '🪟',
      color: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      id: 'apple',
      name: 'Apple',
      icon: '🍎',
      color: 'bg-black text-white hover:bg-gray-900'
    }
  ];

  const handleSocialAuth = async (provider: string) => {
    setIsLoading(true);
    
    // Simulate OAuth flow
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1500);
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) return;
    
    setIsLoading(true);
    
    // Simulate email signup
    setTimeout(() => {
      setIsLoading(false);
      setStep('verification');
    }, 1500);
  };

  const handleEmailVerification = () => {
    setStep('success');
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 animate-gradient-x"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Créez votre compte</h2>
              <p className="text-blue-100 text-sm">Plan {selectedPlan} - 30 jours gratuits</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 'signup' && (
            <>
              {authMethod === 'social' && (
                <div className="space-y-4">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Inscription en 1 clic
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choisissez votre méthode préférée
                    </p>
                  </div>

                  {/* Social Auth Buttons */}
                  <div className="space-y-3">
                    {socialProviders.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => handleSocialAuth(provider.id)}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${provider.color} disabled:opacity-50`}
                      >
                        <span className="text-lg mr-3">{provider.icon}</span>
                        Continuer avec {provider.name}
                      </button>
                    ))}
                  </div>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">ou</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setAuthMethod('email')}
                    className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    Continuer avec Email
                  </button>
                </div>
              )}

              {authMethod === 'email' && (
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('social')}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
                  >
                    ← Retour aux options de connexion
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="jean@entreprise.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entreprise *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Mon Entreprise"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      J'accepte les{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                        Conditions Générales d'Utilisation
                      </a>{' '}
                      et la{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                        Politique de Confidentialité RGPD
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!acceptTerms || isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Démarrer l'essai gratuit
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-green-500" />
                    <span>Sécurisé SSL</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    <span>RGPD</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-blue-500" />
                    <span>Activation immédiate</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {step === 'verification' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vérifiez votre email
                </h3>
                <p className="text-gray-600 text-sm">
                  Nous avons envoyé un lien de vérification à<br />
                  <strong>{formData.email}</strong>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  💡 Vérifiez aussi vos spams. Le lien expire dans 24h.
                </p>
              </div>

              <button
                onClick={handleEmailVerification}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                J'ai vérifié mon email
              </button>

              <button
                onClick={() => setStep('signup')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Modifier l'adresse email
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Compte créé avec succès !
                </h3>
                <p className="text-gray-600 text-sm">
                  Redirection vers votre tableau de bord...
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  🎉 Votre essai de 30 jours commence maintenant !
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupModal;