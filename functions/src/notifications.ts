import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';
import * as functions from 'firebase-functions';

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

export async function sendAutomaticReminders() {
  const db = admin.firestore();
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  // Rappels pour les factures échues
  const overdueInvoices = await db
    .collectionGroup('factures')
    .where('status', '==', 'sent')
    .where('dueDate', '<=', now)
    .get();
    
  for (const doc of overdueInvoices.docs) {
    const invoice = doc.data();
    const entrepriseId = doc.ref.parent.parent?.id;
    
    if (entrepriseId) {
      // Créer notification
      await db.collection('notifications').add({
        type: 'invoice_overdue',
        title: 'Facture en retard',
        message: `La facture ${invoice.number} est en retard de paiement`,
        entrepriseId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        priority: 'high',
        relatedDocumentId: doc.id
      });
      
      // Envoyer email au client
      if (invoice.clientEmail) {
        await transporter.sendMail({
          from: 'noreply@dziljo.com',
          to: invoice.clientEmail,
          subject: `Rappel - Facture ${invoice.number} en retard`,
          html: `
            <h2>Rappel de paiement</h2>
            <p>Votre facture ${invoice.number} d'un montant de ${invoice.amount}€ est en retard de paiement.</p>
            <p>Merci de procéder au règlement dans les plus brefs délais.</p>
          `
        });
      }
    }
  }
  
  // Rappels pour les contrats expirant bientôt
  const expiringContracts = await db
    .collectionGroup('contrats')
    .where('endDate', '<=', tomorrow)
    .where('endDate', '>', now)
    .get();
    
  for (const doc of expiringContracts.docs) {
    const contract = doc.data();
    const entrepriseId = doc.ref.parent.parent?.id;
    
    if (entrepriseId) {
      await db.collection('notifications').add({
        type: 'contract_expiring',
        title: 'Contrat expirant',
        message: `Le contrat ${contract.title} expire demain`,
        entrepriseId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        priority: 'medium',
        relatedDocumentId: doc.id
      });
    }
  }
  
  // Rappels pour les évaluations de performance
  const upcomingReviews = await db
    .collectionGroup('performance-reviews')
    .where('nextReviewDate', '<=', tomorrow)
    .where('nextReviewDate', '>', now)
    .get();
    
  for (const doc of upcomingReviews.docs) {
    const review = doc.data();
    const entrepriseId = doc.ref.parent.parent?.id;
    
    if (entrepriseId) {
      await db.collection('notifications').add({
        type: 'review_due',
        title: 'Évaluation programmée',
        message: `Évaluation de ${review.employeeName} prévue demain`,
        entrepriseId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isRead: false,
        priority: 'medium',
        relatedDocumentId: doc.id
      });
    }
  }
  
  console.log('Rappels automatiques envoyés');
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  await transporter.sendMail({
    from: 'noreply@dziljo.com',
    to: userEmail,
    subject: 'Bienvenue sur dziljo !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Bienvenue sur dziljo !</h1>
        <p>Bonjour ${userName},</p>
        <p>Votre compte dziljo a été créé avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités de notre plateforme de gestion d'entreprise.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Prochaines étapes :</h3>
          <ul>
            <li>Complétez votre profil</li>
            <li>Configurez votre entreprise</li>
            <li>Invitez votre équipe</li>
            <li>Explorez les modules disponibles</li>
          </ul>
        </div>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>L'équipe dziljo</p>
      </div>
    `
  });
}