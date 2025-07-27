// Gestionnaire global des raccourcis clavier pour dziljo
export class KeyboardShortcuts {
  private static shortcuts: Map<string, () => void> = new Map();
  private static isListening = false;

  static init() {
    if (this.isListening) return;
    
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.isListening = true;
  }

  static destroy() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    this.isListening = false;
    this.shortcuts.clear();
  }

  static register(key: string, callback: () => void) {
    this.shortcuts.set(key, callback);
  }

  static unregister(key: string) {
    this.shortcuts.delete(key);
  }

  private static handleKeyDown(event: KeyboardEvent) {
    const key = this.getKeyString(event);
    const callback = this.shortcuts.get(key);
    
    if (callback) {
      event.preventDefault();
      callback();
    }
  }

  private static getKeyString(event: KeyboardEvent): string {
    const parts: string[] = [];
    
    if (event.ctrlKey || event.metaKey) parts.push('ctrl');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    
    parts.push(event.key.toLowerCase());
    
    return parts.join('+');
  }

  // Raccourcis prédéfinis pour dziljo
  static getDefaultShortcuts() {
    return {
      'ctrl+k': 'Recherche globale / Actions rapides',
      'alt+a': 'Actions rapides',
      'alt+e': 'Nouvel événement',
      'alt+n': 'Notifications',
      'ctrl+shift+e': 'Nouvel employé',
      'ctrl+shift+o': 'Nouvelle opportunité',
      'ctrl+shift+c': 'Nouveau contrat',
      'ctrl+shift+i': 'Nouvelle facture',
      'ctrl+shift+m': 'Nouveau RDV',
      'ctrl+shift+r': 'Nouveau rapport',
      'ctrl+shift+p': 'Calculer paie',
      'ctrl+shift+l': 'Nouveau prospect',
      'ctrl+shift+q': 'Nouveau devis',
      'ctrl+shift+@': 'Nouvel email',
      'escape': 'Fermer modal/menu',
      'ctrl+s': 'Sauvegarder',
      'ctrl+z': 'Annuler',
      'ctrl+y': 'Refaire',
      'f1': 'Aide',
      'f5': 'Actualiser',
      'ctrl+f': 'Rechercher dans la page'
    };
  }

  // Afficher l'aide des raccourcis
  static showHelp() {
    const shortcuts = this.getDefaultShortcuts();
    const helpContent = Object.entries(shortcuts)
      .map(([key, description]) => `${key}: ${description}`)
      .join('\n');
    
    console.log('Raccourcis clavier dziljo:\n', helpContent);
    
    // Créer une modal d'aide
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-xl p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Raccourcis Clavier</h2>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${Object.entries(shortcuts).map(([key, description]) => `
            <div class="flex justify-between items-center p-2 bg-gray-50 rounded">
              <kbd class="px-2 py-1 bg-gray-200 rounded text-sm font-mono">${key}</kbd>
              <span class="text-sm text-gray-700 ml-3">${description}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
}

// Auto-initialisation
if (typeof window !== 'undefined') {
  KeyboardShortcuts.init();
  
  // Raccourci F1 pour l'aide
  KeyboardShortcuts.register('f1', () => KeyboardShortcuts.showHelp());
}