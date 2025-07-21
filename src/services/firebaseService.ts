// Service Firebase pour Dziljo
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

export class FirebaseService {
  // Collections Firestore
  static readonly COLLECTIONS = {
    USERS: 'users',
    PROSPECTS: 'prospects',
    OPPORTUNITIES: 'opportunities',
    CONTRACTS: 'contracts',
    QUOTES: 'quotes',
    QUOTES: 'quotes',
    DOCUMENTS: 'documents',
    ACTIVITIES: 'activities',
    NOTIFICATIONS: 'notifications'
  };

  // CRUD générique pour Firestore
  static async create(collectionName: string, data: any) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Erreur lors de la création dans ${collectionName}:`, error);
      throw error;
    }
  }

  static async update(collectionName: string, id: string, data: any) {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      return { id, ...data };
    } catch (error) {
      console.error(`Erreur lors de la mise à jour dans ${collectionName}:`, error);
      throw error;
    }
  }

  static async delete(collectionName: string, id: string) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression dans ${collectionName}:`, error);
      throw error;
    }
  }

  static async getById(collectionName: string, id: string) {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération dans ${collectionName}:`, error);
      throw error;
    }
  }

  static async getAll(collectionName: string, filters?: any[], orderByField?: string, limitCount?: number) {
    try {
      let q = collection(db, collectionName);
      
      // Appliquer les filtres
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }
      
      // Appliquer l'ordre
      if (orderByField) {
        q = query(q, orderBy(orderByField, 'desc'));
      }
      
      // Appliquer la limite
      if (limitCount) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error(`Erreur lors de la récupération dans ${collectionName}:`, error);
      throw error;
    }
  }

  // Écoute en temps réel
  static subscribeToCollection(
    collectionName: string, 
    callback: (data: any[]) => void,
    filters?: any[]
  ) {
    try {
      let q = collection(db, collectionName);
      
      if (filters && filters.length > 0) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }
      
      return onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback(data);
      });
    } catch (error) {
      console.error(`Erreur lors de l'écoute de ${collectionName}:`, error);
      throw error;
    }
  }

  // Gestion des fichiers avec Firebase Storage
  static async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      throw error;
    }
  }

  static async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      throw error;
    }
  }

  // Services spécifiques pour Dziljo
  static async createProspect(prospectData: any) {
    return this.create(this.COLLECTIONS.PROSPECTS, prospectData);
  }

  static async updateProspect(id: string, prospectData: any) {
    return this.update(this.COLLECTIONS.PROSPECTS, id, prospectData);
  }

  static async getProspects(filters?: any[]) {
    return this.getAll(this.COLLECTIONS.PROSPECTS, filters, 'createdAt');
  }

  static async createOpportunity(opportunityData: any) {
    return this.create(this.COLLECTIONS.OPPORTUNITIES, opportunityData);
  }

  static async updateOpportunity(id: string, opportunityData: any) {
    return this.update(this.COLLECTIONS.OPPORTUNITIES, id, opportunityData);
  }

  static async getOpportunities(filters?: any[]) {
    return this.getAll(this.COLLECTIONS.OPPORTUNITIES, filters, 'createdAt');
  }

  static async createContract(contractData: any) {
    return this.create(this.COLLECTIONS.CONTRACTS, contractData);
  }

  static async updateContract(id: string, contractData: any) {
    return this.update(this.COLLECTIONS.CONTRACTS, id, contractData);
  }

  static async getContracts(filters?: any[]) {
    return this.getAll(this.COLLECTIONS.CONTRACTS, filters, 'createdAt');
  }

  static async createQuote(quoteData: any) {
    return this.create(this.COLLECTIONS.QUOTES, quoteData);
  }

  static async updateQuote(id: string, quoteData: any) {
    return this.update(this.COLLECTIONS.QUOTES, id, quoteData);
  }

  static async getQuotes(filters?: any[]) {
    return this.getAll(this.COLLECTIONS.QUOTES, filters, 'createdAt');
  }

  static async logActivity(activityData: any) {
    return this.create(this.COLLECTIONS.ACTIVITIES, {
      ...activityData,
      timestamp: Timestamp.now()
    });
  }

  static async createNotification(notificationData: any) {
    return this.create(this.COLLECTIONS.NOTIFICATIONS, {
      ...notificationData,
      isRead: false,
      timestamp: Timestamp.now()
    });
  }

  static async markNotificationAsRead(id: string) {
    return this.update(this.COLLECTIONS.NOTIFICATIONS, id, { isRead: true });
  }
}

export default FirebaseService;