import * as admin from 'firebase-admin';
import { calculatePayrollKPIs } from './kpi-calculator';
import { generatePDFDocument } from './pdf-generator';
import { sendWelcomeEmail } from './notifications';

export async function generateMonthlyReports() {
  const db = admin.firestore();
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  // Récupérer toutes les entreprises actives
  const entreprisesSnapshot = await db
    .collection('entreprises')
    .where('status', '==', 'active')
    .get();
    
  for (const entrepriseDoc of entreprisesSnapshot.docs) {
    const entrepriseId = entrepriseDoc.id;
    const entrepriseData = entrepriseDoc.data();
    
    try {
      // Calculer les KPIs du mois précédent
      const kpis = await calculatePayrollKPIs(entrepriseId);
      
      // Générer le rapport mensuel
      const reportData = {
        type: 'monthly_report',
        title: `Rapport Mensuel - ${lastMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
        entrepriseName: entrepriseData.name,
        period: lastMonth.toISOString().slice(0, 7), // YYYY-MM
        kpis,
        generatedAt: new Date().toISOString()
      };
      
      // Créer le document de rapport
      const reportRef = await db
        .collection('entreprises')
        .doc(entrepriseId)
        .collection('reports')
        .add(reportData);
        
      // Générer le PDF du rapport
      const pdfUrl = await generatePDFDocument(reportData, entrepriseId, reportRef.id);
      
      // Mettre à jour avec l'URL du PDF
      await reportRef.update({ pdfUrl });
      
      // Envoyer par email aux administrateurs
      const adminsSnapshot = await db
        .collection('utilisateurs')
        .where('entrepriseId', '==', entrepriseId)
        .where('role', 'in', ['admin', 'comptable'])
        .get();
        
      for (const adminDoc of adminsSnapshot.docs) {
        const adminData = adminDoc.data();
        if (adminData.email) {
          await sendMonthlyReportEmail(
            adminData.email,
            adminData.displayName || 'Administrateur',
            entrepriseData.name,
            lastMonth,
            pdfUrl
          );
        }
      }
      
      console.log(`Rapport mensuel généré pour ${entrepriseData.name}`);
      
    } catch (error) {
      console.error(`Erreur génération rapport pour ${entrepriseId}:`, error);
    }
  }
}

async function sendMonthlyReportEmail(
  email: string, 
  name: string, 
  entrepriseName: string, 
  period: Date, 
  pdfUrl: string
) {
  const nodemailer = require('nodemailer');
  const functions = require('firebase-functions');
  
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: functions.config().email.user,
      pass: functions.config().email.password
    }
  });
  
  await transporter.sendMail({
    from: 'noreply@dziljo.com',
    to: email,
    subject: `Rapport mensuel ${entrepriseName} - ${period.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3B82F6;">Rapport Mensuel dziljo</h1>
        <p>Bonjour ${name},</p>
        <p>Voici le rapport mensuel automatique de ${entrepriseName} pour ${period.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}.</p>
        
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>📊 Contenu du rapport :</h3>
          <ul>
            <li>KPIs financiers et commerciaux</li>
            <li>Analyse de la masse salariale</li>
            <li>Performance des équipes</li>
            <li>Indicateurs RH</li>
          </ul>
        </div>
        
        <p style="text-align: center;">
          <a href="${pdfUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            📄 Télécharger le rapport PDF
          </a>
        </p>
        
        <p>Ce rapport est généré automatiquement le 1er de chaque mois.</p>
        <p>L'équipe dziljo</p>
      </div>
    `
  });
}