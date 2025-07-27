import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { UserRole, getUserData, signInWithEmail, signInWithGoogle, signUpWithEmail, resetPassword } from '../config/firebase-auth';

export function useFirebaseAuth() {
  const [user, setUser] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        if (firebaseUser) {
          // Récupérer les données utilisateur complètes
          const userData = await getUserData(firebaseUser.uid);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Erreur récupération données utilisateur:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await signInWithEmail(email, password);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await signInWithGoogle();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    displayName: string,
    role: UserRole['role'] = 'user',
    entrepriseId: string | null = null
  ) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await signUpWithEmail(email, password, displayName, role, entrepriseId);
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur d\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de déconnexion');
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      setError(null);
      await resetPassword(email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur réinitialisation');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    signup,
    logout,
    sendPasswordReset,
    isAuthenticated: !!user,
    hasRole: (role: UserRole['role']) => user ? hasPermission(user, role) : false
  };
}

// Fonction helper pour vérifier les permissions
function hasPermission(user: UserRole, requiredRole: UserRole['role']): boolean {
  const roleHierarchy = {
    'admin': 4,
    'comptable': 3,
    'rh': 2,
    'commercial': 2,
    'user': 1
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}