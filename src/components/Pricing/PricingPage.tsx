import React, { useState } from 'react';
import SignupModal from '../Auth/SignupModal';
import { Check, X, Star, Shield, Zap, Users, BarChart3, Settings, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');


  const plans = [
    {
      name: 'Gratuit',
      description: 'Pour découvrir dziljo',
      price: { monthly: 0, annual: 0 },
      features: [
        '2 utilisateurs maximum',
        'Tableau de bord basique',
        'Gestion de 10 prospects',
        'Support par email',
        'Stockage 1 GB'
      ],
      limitations: [
        'Pas de modules avancés',
        'Pas d\'intégrations',
        'Pas de rapports personnalisés'
      ],
      cta: 'Commencer gratuitement',
      popular: false,
      color: 'border-slate-600'
    },
    {
      name: 'Pro',
      description: 'Pour les équipes en croissance',
      price: { monthly: 29, annual: 26 },
      features: [
        '10 utilisateurs inclus',
        'Tous les modules de base',
        'Prospects illimités',
        'Intégrations CRM',
        'Rapports avancés',
        'Support prioritaire',
        'Stockage 50 GB',
        'API access'
      ],
      limitations: [],
      cta: 'Essai gratuit 30 jours',
      popular: true,
      color: 'border-blue-500'
    },
    {
      name: 'Team',
      description: 'Pour les équipes établies',
      price: { monthly: 59, annual: 53 },
      features: [
        '25 utilisateurs inclus',
        'Comptabilité analytique',
        'Workflows personnalisés',
        'Signature électronique',
        'Intégrations avancées',
        'Formation dédiée',
        'Support téléphonique',
        'Stockage 200 GB',
        'SLA 99.9%'
      ],
      limitations: [],
      cta: 'Essai gratuit 30 jours',
      popular: false,
      color: 'border-purple-500'
    },
    {
      name: 'Enterprise',
      description: 'Pour les grandes organisations',
      price: { monthly: 'Sur mesure', annual: 'Sur mesure' },
      features: [
        'Utilisateurs illimités',
        'Déploiement on-premise',
        'SSO & sécurité avancée',
        'Intégrations sur mesure',
        'Support dédié 24/7',
        'Formation sur site',
        'Stockage illimité',
        'SLA personnalisé',
        'Conformité RGPD+'
      ],
      limitations: [],
      cta: 'Nous contacter',
      popular: false,
      color: 'border-gold-500'
    }
  ];

  const faqs = [
    {
      question: 'Puis-je changer de plan à tout moment ?',
      answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et la facturation est ajustée au prorata.'
    },
    {
      question: 'Y a-t-il des frais de configuration ?',
      answer: 'Non, il n\'y a aucun frais de configuration. Vous pouvez commencer à utiliser dziljo immédiatement après votre inscription.'
    },
    {
      question: 'Que se passe-t-il après la période d\'essai ?',
      answer: 'Après 30 jours, vous pouvez choisir un plan payant ou continuer avec le plan gratuit. Vos données sont conservées dans tous les cas.'
    },
    {
      question: 'Proposez-vous des remises pour les associations ?',
      answer: 'Oui, nous offrons des remises spéciales pour les associations, ONG et établissements d\'enseignement. Contactez-nous pour plus d\'informations.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Absolument. Nous utilisons un chiffrement AES-256, des sauvegardes quotidiennes et sommes conformes RGPD. Vos données sont hébergées en France.'
    },
    {
      question: 'Puis-je exporter mes données ?',
      answer: 'Oui, vous pouvez exporter toutes vos données à tout moment en formats CSV, Excel ou via notre API. Aucun vendor lock-in.'
    }
  ];

  const getPrice = (plan: any) => {
    if (typeof plan.price.monthly === 'string') {
      return plan.price.monthly;
    }
    return isAnnual ? plan.price.annual : plan.price.monthly;
  };

  const getSavings = (plan: any) => {
    if (typeof plan.price.monthly === 'string') return null;
    if (!isAnnual) return null;
    const monthlyCost = plan.price.monthly * 12;
    const annualCost = plan.price.annual * 12;
    const savings = monthlyCost - annualCost;
    return savings;
  };

  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setShowSignupModal(true);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Commencez gratuitement.<br />
              Passez à la vitesse supérieure<br />
              quand vous le souhaitez.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
              30 jours d'essai complet, sans engagement, sans carte bancaire.
            </p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center mb-16">
              <div className="bg-gray-800 p-1 rounded-xl border border-gray-700">
                <div className="flex items-center">
                  <button
                    onClick={() => setIsAnnual(false)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      !isAnnual
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Mensuel
                  </button>
                  <button
                    onClick={() => setIsAnnual(true)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all relative ${
                      isAnnual
                        ? 'bg-white text-gray-900 shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Annuel
                    <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      -10%
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-800 rounded-2xl p-8 border-2 transition-all hover:scale-105 ${
                plan.popular
                  ? 'border-blue-500 shadow-2xl shadow-blue-500/25'
                  : plan.color
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  {typeof getPrice(plan) === 'string' ? (
                    <div className="text-3xl font-bold">{getPrice(plan)}</div>
                  ) : (
                    <>
                      <div className="text-5xl font-bold mb-2">
                        {getPrice(plan) === 0 ? 'Gratuit' : `${getPrice(plan)}€`}
                      </div>
                      {getPrice(plan) !== 0 && (
                        <div className="text-gray-400">
                          par utilisateur / {isAnnual ? 'an' : 'mois'}
                        </div>
                      )}
                      {getSavings(plan) && (
                        <div className="text-green-400 text-sm mt-2">
                          Économisez {getSavings(plan)}€ par an
                        </div>
                      )}
                    </>
                  )}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                      : plan.name === 'Gratuit'
                      ? 'bg-white text-gray-900 hover:bg-gray-100'
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.cta}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3 text-green-400">✓ Inclus</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-red-400">✗ Non inclus</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start">
                          <X className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-400 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Toutes les fonctionnalités pour faire grandir votre entreprise
            </h2>
            <p className="text-xl text-gray-400">
              Découvrez ce qui rend dziljo unique
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Automatisation Intelligente</h3>
              <p className="text-gray-400">
                Workflows automatisés, règles de ventilation et alertes intelligentes pour optimiser votre productivité.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Sécurité & Conformité</h3>
              <p className="text-gray-400">
                Chiffrement AES-256, conformité RGPD, hébergement France et sauvegardes automatiques quotidiennes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Analytics Avancés</h3>
              <p className="text-gray-400">
                Comptabilité analytique multidimensionnelle, KPIs temps réel et rapports personnalisables.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-xl text-gray-400">
              Tout ce que vous devez savoir sur dziljo
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-750 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RGPD Compliance */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="flex items-center">
                <Shield className="w-6 h-6 text-green-400 mr-2" />
                <span className="text-sm text-gray-400">Conforme RGPD</span>
              </div>
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-400 mr-2" />
                <span className="text-sm text-gray-400">Hébergé en France</span>
              </div>
              <div className="flex items-center">
                <Settings className="w-6 h-6 text-purple-400 mr-2" />
                <span className="text-sm text-gray-400">ISO 27001</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Vos données sont protégées selon les plus hauts standards de sécurité. 
              Nous respectons votre vie privée et vous gardez le contrôle total de vos informations.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-blue-600 p-4 md:hidden z-50 shadow-2xl">
        <button 
          onClick={() => handlePlanSelect('Pro')}
          className="w-full bg-white text-blue-600 font-bold py-3 px-6 rounded-xl flex items-center justify-center">
          Démarrer l'essai gratuit
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        selectedPlan={selectedPlan}
        onSuccess={() => {
          setShowSignupModal(false);
          // Redirect to trial welcome or dashboard
        }}
      />
    </div>
  );
};

export default PricingPage;