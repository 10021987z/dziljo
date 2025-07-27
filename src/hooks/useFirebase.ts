// Hooks React pour Firebase
import { useState, useEffect, useCallback } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import FirebaseService from '../services/firebaseService';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

// Hook pour l'authentification Firebase
export const useFirebaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de déconnexion');
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
};

// Hook générique pour les collections Firestore
export const useFirebaseCollection = (collectionName: string, filters?: any[], orderByField?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await FirebaseService.getAll(collectionName, filters, orderByField);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [collectionName, filters, orderByField]);

  const create = useCallback(async (newData: any) => {
    try {
      const result = await FirebaseService.create(collectionName, newData);
      setData(prev => [result, ...prev]);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      throw err;
    }
  }, [collectionName]);

  const update = useCallback(async (id: string, updateData: any) => {
    try {
      const result = await FirebaseService.update(collectionName, id, updateData);
      setData(prev => prev.map(item => item.id === id ? result : item));
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  }, [collectionName]);

  const remove = useCallback(async (id: string) => {
    try {
      await FirebaseService.delete(collectionName, id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, [collectionName]);

  // Real-time subscription
  const subscribe = useCallback(() => {
    try {
      let q = collection(db, collectionName);
      
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(items);
        setLoading(false);
      }, (error) => {
        setError(error.message);
        setLoading(false);
      });
      
      return unsubscribe;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'abonnement');
      setLoading(false);
      return () => {};
    }
  }, [collectionName, filters, orderByField]);

  useEffect(() => {
    // Use real-time subscription by default
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [subscribe]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    subscribe,
    create,
    update,
    remove
  };
};

// Hook pour les prospects
export const useFirebaseProspects = (filters?: any[]) => {
  return useFirebaseCollection(FirebaseService.COLLECTIONS.PROSPECTS, filters);
};

// Hook pour les opportunités
export const useFirebaseOpportunities = (filters?: any[]) => {
  return useFirebaseCollection(FirebaseService.COLLECTIONS.OPPORTUNITIES, filters);
};

// Hook pour les contrats
export const useFirebaseContracts = (filters?: any[]) => {
  return useFirebaseCollection(FirebaseService.COLLECTIONS.CONTRACTS, filters);
};

// Hook pour les devis
export const useFirebaseQuotes = (filters?: any[]) => {
  return useFirebaseCollection(FirebaseService.COLLECTIONS.QUOTES, filters);
};

// Hook pour les notifications en temps réel
export const useFirebaseNotifications = (userId?: string) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const filters = [{ field: 'userId', operator: '==', value: userId }];
    
    const unsubscribe = FirebaseService.subscribeToCollection(
      FirebaseService.COLLECTIONS.NOTIFICATIONS,
      (data) => {
        setNotifications(data);
        setLoading(false);
      },
      filters
    );

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await FirebaseService.markNotificationAsRead(id);
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  }, []);

  return {
    notifications,
    loading,
    markAsRead,
    unreadCount: notifications.filter(n => !n.isRead).length
  };
};

// Hook pour l'upload de fichiers
export const useFirebaseStorage = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File, path: string) => {
    try {
      setUploading(true);
      setError(null);
      const url = await FirebaseService.uploadFile(file, path);
      return url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteFile = useCallback(async (path: string) => {
    try {
      await FirebaseService.deleteFile(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  }, []);

  return {
    uploading,
    error,
    uploadFile,
    deleteFile
  };
};