import React, { useState } from 'react';
import { HelpCircle, Search, Book, MessageCircle, Video, FileText, Zap, Star, ThumbsUp, ThumbsDown, Send, Phone, Mail, Clock, CheckCircle, AlertCircle, Info, Rocket, Heart, Coffee, Users, Award, Shield, Lightbulb } from 'lucide-react';

interface HelpSupportProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [supportTicket, setSupportTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  });

  const faqCategories = [
    { id: 'getting-started', name: 'Premiers Pas', icon: Rocket, color: 'text-blue-600' },
    { id: 'hr', name: 'Ressources Humaines', icon: Users, color: 'text-purple-600' },
    { id: 'commercial', name: 'Commercial', icon: Star, color: 'text-green-600' },
    { id: 'admin', name: 'Administration', icon: Award, color: 'text-orange-600' },
    { id: 'technical', name: 'Technique', icon: Zap, color: 'text-red-600' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'Comment commencer avec dziljo ?',
      answer: 'Bienvenue dans dziljo ! Commencez par explorer le tableau de bord principal. Vous y trouverez un aperçu de toutes les fonctionnalités. Ensuite, configurez votre profil dans les paramètres et invitez votre équipe.',
      helpful: 24,
      notHelpful: 2,
      tags: ['débutant', 'configuration', 'équipe']
    },
    {
      id: 2,
      category: 'hr',
      question: 'Comment ajouter un nouvel employé ?',
      answer: 'Rendez-vous dans le module RH > Gestion du Personnel > Base de Données. Cliquez sur "Nouvel Employé" et remplissez les informations requises. Vous pouvez également importer plusieurs employés via un fichier CSV.',
      helpful: 18,
      notHelpful: 1,
      tags: ['employé', 'ajout', 'csv']
    },
    {
      id: 3,
      category: 'commercial',
      question: 'Comment suivre mes prospects ?',
      answer: 'Utilisez le module Commercial > Prospection. Vous pouvez ajouter des prospects manuellement ou les importer. Le pipeline Kanban vous permet de suivre leur progression à travers les étapes de vente.',
      helpful: 31,
      notHelpful: 0,
      tags: ['prospects', 'pipeline', 'vente']
    },
    {
      id: 4,
      category: 'admin',
      question: 'Comment générer des rapports ?',
      answer: 'Accédez à Administration > Rapports. Sélectionnez le type de rapport souhaité, définissez la période et les filtres. Vous pouvez exporter les rapports en PDF ou Excel.',
      helpful: 15,
      notHelpful: 3,
      tags: ['rapports', 'export', 'analytics']
    },
    {
      id: 5,
      category: 'technical',
      question: 'Comment sauvegarder mes données ?',
      answer: 'dziljo effectue des sauvegardes automatiques quotidiennes. Vous pouvez également créer des sauvegardes manuelles dans Paramètres > Sauvegarde. Les données sont chiffrées et stockées de manière sécurisée.',
      helpful: 22,
      notHelpful: 1,
      tags: ['sauvegarde', 'sécurité', 'données']
    }
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Tour Complet de dziljo',
      description: 'Découvrez toutes les fonctionnalités en 10 minutes',
      duration: '10:32',
      difficulty: 'Débutant',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      views: 1247
    },
    {
      id: 2,
      title: 'Gestion RH Avancée',
      description: 'Maîtrisez le module RH de A à Z',
      duration: '15:45',
      difficulty: 'Intermédiaire',
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      views: 892
    },
    {
      id: 3,
      title: 'Pipeline Commercial Efficace',
      description: 'Optimisez votre processus de vente',
      duration: '12:18',
      difficulty: 'Intermédiaire',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
      views: 1056
    }
  ];

  const quickActions = [
    { icon: Video, title: 'Démo Interactive', description: 'Visite guidée de 5 minutes', action: 'Commencer' },
    { icon: Book, title: 'Guide Utilisateur', description: 'Documentation complète', action: 'Lire' },
    { icon: MessageCircle, title: 'Chat en Direct', description: 'Support instantané', action: 'Chatter' },
    { icon: Phone, title: 'Appel Support', description: 'Assistance téléphonique', action: 'Appeler' }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const submitTicket = () => {
    console.log('Submitting support ticket:', supportTicket);
    // Simuler l'envoi
    setSupportTicket({ subject: '', category: 'general', priority: 'medium', description: '' });
    alert('Votre demande a été envoyée ! Nous vous répondrons sous 24h.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Aide & Support</h1>
                <p className="text-white/80">Nous sommes là pour vous aider !</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{'< 2h'}</div>
              <div className="text-sm text-white/80">Temps de réponse</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm text-white/80">Satisfaction</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-white/80">Disponibilité</div>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200">
            <div className="p-4 space-y-2">
              {[
                { id: 'faq', name: 'FAQ', icon: HelpCircle },
                { id: 'tutorials', name: 'Tutoriels', icon: Video },
                { id: 'guides', name: 'Guides', icon: Book },
                { id: 'contact', name: 'Nous Contacter', icon: MessageCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-3" />
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-slate-200">
              <h3 className="font-medium text-slate-900 mb-3">Actions Rapides</h3>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center p-2 text-left hover:bg-slate-100 rounded-lg transition-colors group"
                  >
                    <action.icon className="w-4 h-4 mr-2 text-slate-500 group-hover:text-blue-600" />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{action.title}</div>
                      <div className="text-xs text-slate-500">{action.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 max-h-96 overflow-y-auto">
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">Questions Fréquentes</h2>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Lightbulb className="w-4 h-4" />
                    <span>{filteredFaqs.length} réponses trouvées</span>
                  </div>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher dans la FAQ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      !selectedCategory
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Toutes
                  </button>
                  {faqCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <category.icon className={`w-3 h-3 mr-1 ${category.color}`} />
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {filteredFaqs.map((faq) => (
                    <div key={faq.id} className="bg-slate-50 rounded-lg p-4 hover:bg-slate-100 transition-colors">
                      <h3 className="font-medium text-slate-900 mb-2">{faq.question}</h3>
                      <p className="text-slate-700 text-sm mb-3">{faq.answer}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {faq.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-slate-500">Cette réponse vous a-t-elle aidé ?</span>
                          <div className="flex items-center space-x-1">
                            <button className="flex items-center text-green-600 hover:text-green-700 text-xs">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {faq.helpful}
                            </button>
                            <button className="flex items-center text-red-600 hover:text-red-700 text-xs">
                              <ThumbsDown className="w-3 h-3 mr-1" />
                              {faq.notHelpful}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Aucune réponse trouvée pour votre recherche.</p>
                    <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm">
                      Contactez notre support
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tutorials' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">Tutoriels Vidéo</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial) => (
                    <div key={tutorial.id} className="bg-slate-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                      <div className="relative">
                        <img
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white rounded-full p-3">
                            <Video className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                          {tutorial.duration}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-medium text-slate-900 mb-1">{tutorial.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{tutorial.description}</p>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className={`px-2 py-1 rounded ${
                            tutorial.difficulty === 'Débutant' ? 'bg-green-100 text-green-800' :
                            tutorial.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {tutorial.difficulty}
                          </span>
                          <span>{tutorial.views} vues</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'guides' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">Guides & Documentation</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Guide de Démarrage', icon: Rocket, color: 'bg-blue-100 text-blue-700', pages: 12 },
                    { title: 'Manuel Utilisateur', icon: Book, color: 'bg-purple-100 text-purple-700', pages: 45 },
                    { title: 'Guide Administrateur', icon: Shield, color: 'bg-red-100 text-red-700', pages: 28 },
                    { title: 'Bonnes Pratiques RH', icon: Users, color: 'bg-green-100 text-green-700', pages: 18 },
                    { title: 'Optimisation Commerciale', icon: Star, color: 'bg-orange-100 text-orange-700', pages: 22 },
                    { title: 'Intégrations API', icon: Zap, color: 'bg-indigo-100 text-indigo-700', pages: 15 }
                  ].map((guide, index) => (
                    <div
                      key={index}
                      className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className={`w-10 h-10 rounded-lg ${guide.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <guide.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-medium text-slate-900 mb-1">{guide.title}</h3>
                      <p className="text-xs text-slate-500">{guide.pages} pages • PDF</p>
                      <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        Télécharger
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-slate-900">Contactez-Nous</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-blue-900 mb-3">Créer un Ticket de Support</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Sujet *</label>
                          <input
                            type="text"
                            value={supportTicket.subject}
                            onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Problème de connexion"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Catégorie</label>
                          <select
                            value={supportTicket.category}
                            onChange={(e) => setSupportTicket({ ...supportTicket, category: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="general">Général</option>
                            <option value="technical">Technique</option>
                            <option value="billing">Facturation</option>
                            <option value="feature">Suggestion</option>
                            <option value="bug">Bug</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Priorité</label>
                          <select
                            value={supportTicket.priority}
                            onChange={(e) => setSupportTicket({ ...supportTicket, priority: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="low">Basse</option>
                            <option value="medium">Moyenne</option>
                            <option value="high">Haute</option>
                            <option value="urgent">Urgente</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
                          <textarea
                            value={supportTicket.description}
                            onChange={(e) => setSupportTicket({ ...supportTicket, description: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Décrivez votre problème en détail..."
                          />
                        </div>
                        
                        <button
                          onClick={submitTicket}
                          disabled={!supportTicket.subject || !supportTicket.description}
                          className={`w-full py-2 rounded-lg flex items-center justify-center ${
                            supportTicket.subject && supportTicket.description
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                          } transition-colors`}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h3 className="font-medium text-green-900 mb-3">Nous Contacter Directement</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <Mail className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Email</p>
                            <p className="text-sm text-slate-600">support@dziljo.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <Phone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Téléphone</p>
                            <p className="text-sm text-slate-600">+33 1 23 45 67 89</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <MessageCircle className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Chat en Direct</p>
                            <p className="text-sm text-slate-600">Disponible 24/7</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-900 mb-3 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Heures de Support
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-700">Lundi - Vendredi</span>
                          <span className="font-medium text-slate-900">8h - 20h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-700">Samedi</span>
                          <span className="font-medium text-slate-900">9h - 18h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-700">Dimanche</span>
                          <span className="font-medium text-slate-900">Chat uniquement</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;