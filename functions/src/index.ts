import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { generatePDFDocument } from './pdf-generator';
import { calculatePayrollKPIs } from './kpi-calculator';
import { handleStripeWebhook } from './payment-webhooks';
import { sendAutomaticReminders } from './notifications';
import { generateMonthlyReports } from './reports';

// Initialiser Firebase Admin
admin.initializeApp();

// 📄 Génération automatique de documents PDF
export const generateDocument = functions.firestore
  .document('entreprises/{entrepriseId}/documents/{docId}')
  .onCreate(async (snap, context) => {
    const { entrepriseId, docId } = context.params;
    const documentData = snap.data();
    
    try {
      const pdfUrl = await generatePDFDocument(documentData, entrepriseId, docId);
      
      // Mettre à jour le document avec l'URL du PDF
      await snap.ref.update({
        pdfUrl,
        status: 'generated',
        generatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`PDF généré avec succès: ${pdfUrl}`);
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      await snap.ref.update({
        status: 'error',
        error: error.message
      });
    }
  });

// 💰 Calcul automatique des marges & KPIs comptables
export const calculateKPIs = functions.firestore
  .document('entreprises/{entrepriseId}/transactions/{txnId}')
  .onWrite(async (change, context) => {
    const { entrepriseId } = context.params;
    
    try {
      const kpis = await calculatePayrollKPIs(entrepriseId);
      
      // Sauvegarder les KPIs calculés
      await admin.firestore()
        .collection('entreprises')
        .doc(entrepriseId)
        .collection('kpis')
        .doc('current')
        .set({
          ...kpis,
          calculatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
      console.log('KPIs calculés avec succès');
    } catch (error) {
      console.error('Erreur calcul KPIs:', error);
    }
  });

// 💳 Webhooks Stripe pour les paiements
export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  try {
    await handleStripeWebhook(req, res);
  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    res.status(400).send('Webhook Error');
  }
});

// 🔔 Rappels automatiques par email
export const sendReminders = functions.pubsub
  .schedule('0 9 * * *') // Tous les jours à 9h
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    try {
      await sendAutomaticReminders();
      console.log('Rappels envoyés avec succès');
    } catch (error) {
      console.error('Erreur envoi rappels:', error);
    }
  });

// 📊 Génération mensuelle de rapports
export const generateReports = functions.pubsub
  .schedule('0 8 1 * *') // Le 1er de chaque mois à 8h
  .timeZone('Europe/Paris')
  .onRun(async (context) => {
    try {
      await generateMonthlyReports();
      console.log('Rapports mensuels générés avec succès');
    } catch (error) {
      console.error('Erreur génération rapports:', error);
    }
  });

// 👤 Fonction de création d'utilisateur avec rôle
export const createUserWithRole = functions.auth.user().onCreate(async (user) => {
  try {
    // Créer le document utilisateur dans Firestore
    await admin.firestore().collection('utilisateurs').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role: 'user', // Rôle par défaut
      entrepriseId: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: null,
      isActive: true
    });
    
    console.log(`Utilisateur créé: ${user.email}`);
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
  }
});

// 🗑️ Nettoyage lors de la suppression d'utilisateur
export const cleanupUserData = functions.auth.user().onDelete(async (user) => {
  try {
    // Supprimer le document utilisateur
    await admin.firestore().collection('utilisateurs').doc(user.uid).delete();
    
    // Supprimer les fichiers de l'utilisateur dans Storage
    const bucket = admin.storage().bucket();
    await bucket.deleteFiles({
      prefix: `avatars/${user.uid}`
    });
    
    console.log(`Données utilisateur supprimées: ${user.email}`);
  } catch (error) {
    console.error('Erreur suppression données utilisateur:', error);
  }
});

// 🔐 Fonction pour assigner un rôle (admin uniquement)
export const assignUserRole = functions.https.onCall(async (data, context) => {
  // Vérifier que l'utilisateur est authentifié et admin
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Utilisateur non authentifié');
  }
  
  const callerDoc = await admin.firestore()
    .collection('utilisateurs')
    .doc(context.auth.uid)
    .get();
    
  if (!callerDoc.exists || callerDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Permissions insuffisantes');
  }
  
  const { userId, role, entrepriseId } = data;
  
  try {
    await admin.firestore().collection('utilisateurs').doc(userId).update({
      role,
      entrepriseId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return { success: true, message: 'Rôle assigné avec succès' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Erreur lors de l\'assignation du rôle');
  }
});