import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16'
});

export async function handleStripeWebhook(req: functions.Request, res: functions.Response) {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = functions.config().stripe.webhook_secret;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }
  
  const db = admin.firestore();
  
  // Traiter l'événement
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Mettre à jour la facture correspondante
      const factureId = paymentIntent.metadata.factureId;
      const entrepriseId = paymentIntent.metadata.entrepriseId;
      
      if (factureId && entrepriseId) {
        await db
          .collection('entreprises')
          .doc(entrepriseId)
          .collection('factures')
          .doc(factureId)
          .update({
            status: 'paid',
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
            paymentIntentId: paymentIntent.id,
            amountPaid: paymentIntent.amount_received / 100 // Convertir de centimes
          });
          
        // Créer une transaction comptable
        await db
          .collection('entreprises')
          .doc(entrepriseId)
          .collection('transactions')
          .add({
            type: 'revenue',
            amount: paymentIntent.amount_received / 100,
            description: `Paiement facture ${factureId}`,
            date: admin.firestore.FieldValue.serverTimestamp(),
            paymentMethod: 'stripe',
            paymentIntentId: paymentIntent.id,
            factureId
          });
          
        // Envoyer notification
        await db.collection('notifications').add({
          type: 'payment_received',
          title: 'Paiement reçu',
          message: `Paiement de ${paymentIntent.amount_received / 100}€ reçu pour la facture ${factureId}`,
          entrepriseId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isRead: false
        });
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      
      // Notifier l'échec du paiement
      const failedFactureId = failedPayment.metadata.factureId;
      const failedEntrepriseId = failedPayment.metadata.entrepriseId;
      
      if (failedFactureId && failedEntrepriseId) {
        await db.collection('notifications').add({
          type: 'payment_failed',
          title: 'Échec de paiement',
          message: `Le paiement pour la facture ${failedFactureId} a échoué`,
          entrepriseId: failedEntrepriseId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isRead: false,
          priority: 'high'
        });
      }
      break;
      
    default:
      console.log(`Événement non géré: ${event.type}`);
  }
  
  res.json({ received: true });
}