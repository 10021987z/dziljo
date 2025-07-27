import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Providers pour l'authentification sociale
const googleProvider = new GoogleAuthProvider();

export interface UserRole {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'rh' | 'commercial' | 'comptable' | 'user';
  entrepriseId: string | null;
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date | null;
  isActive: boolean;
}

// Connexion avec email/mot de passe
export async function signInWithEmail(email: string, password: string): Promise<UserRole> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Mettre à jour la dernière connexion
    await updateLastLogin(user.uid);
    
    // Récupérer les données utilisateur
    return await getUserData(user.uid);
  } catch (error) {
    console.error('Erreur connexion email:', error);
    throw error;
  }
}

// Connexion avec Google
export async function signInWithGoogle(): Promise<UserRole> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Vérifier si c'est un nouvel utilisateur
    const userDoc = await getDoc(doc(db, 'utilisateurs', user.uid));
    
    if (!userDoc.exists()) {
      // Créer le profil utilisateur
      await createUserProfile(user, 'user', null);
    } else {
      // Mettre à jour la dernière connexion
      await updateLastLogin(user.uid);
    }
    
    return await getUserData(user.uid);
  } catch (error) {
    console.error('Erreur connexion Google:', error);
    throw error;
  }
}

// Inscription avec email/mot de passe
export async function signUpWithEmail(
  email: string, 
  password: string, 
  displayName: string,
  role: UserRole['role'] = 'user',
  entrepriseId: string | null = null
): Promise<UserRole> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Mettre à jour le profil
    await updateProfile(user, { displayName });
    
    // Créer le document utilisateur dans Firestore
    await createUserProfile(user, role, entrepriseId);
    
    return await getUserData(user.uid);
  } catch (error) {
    console.error('Erreur inscription:', error);
    throw error;
  }
}

// Réinitialisation du mot de passe
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Erreur réinitialisation mot de passe:', error);
    throw error;
  }
}

// Créer le profil utilisateur dans Firestore
async function createUserProfile(
  user: User, 
  role: UserRole['role'], 
  entrepriseId: string | null
): Promise<void> {
  const userData: Omit<UserRole, 'uid'> = {
    email: user.email!,
    displayName: user.displayName || '',
    role,
    entrepriseId,
    photoURL: user.photoURL || undefined,
    createdAt: new Date(),
    lastLoginAt: new Date(),
    isActive: true
  };
  
  await setDoc(doc(db, 'utilisateurs', user.uid), userData);
}

// Récupérer les données utilisateur
async function getUserData(uid: string): Promise<UserRole> {
  const userDoc = await getDoc(doc(db, 'utilisateurs', uid));
  
  if (!userDoc.exists()) {
    throw new Error('Utilisateur non trouvé');
  }
  
  const data = userDoc.data();
  return {
    uid,
    ...data,
    createdAt: data.createdAt.toDate(),
    lastLoginAt: data.lastLoginAt?.toDate() || null
  } as UserRole;
}

// Mettre à jour la dernière connexion
async function updateLastLogin(uid: string): Promise<void> {
  await setDoc(
    doc(db, 'utilisateurs', uid), 
    { lastLoginAt: new Date() }, 
    { merge: true }
  );
}

// Vérifier les permissions
export function hasPermission(user: UserRole, requiredRole: UserRole['role']): boolean {
  const roleHierarchy = {
    'admin': 4,
    'comptable': 3,
    'rh': 2,
    'commercial': 2,
    'user': 1
  };
  
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

// Middleware de vérification des rôles
export function requireRole(requiredRole: UserRole['role']) {
  return (user: UserRole | null) => {
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }
    
    if (!hasPermission(user, requiredRole)) {
      throw new Error('Permissions insuffisantes');
    }
    
    return true;
  };
}

export { getUserData }