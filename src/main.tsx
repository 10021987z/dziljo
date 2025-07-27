import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import FirebaseProvider from './components/Firebase/FirebaseProvider';
import { KeyboardShortcuts } from './utils/keyboardShortcuts';

// Initialiser les raccourcis clavier globaux
KeyboardShortcuts.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  </StrictMode>
);
