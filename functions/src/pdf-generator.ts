import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';

// Templates HTML pour les différents types de documents
const TEMPLATES = {
  contract: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { color: #3B82F6; font-size: 24px; font-weight: bold; }
        .title { font-size: 20px; margin: 20px 0; }
        .section { margin: 20px 0; }
        .signature { margin-top: 60px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">dziljo</div>
        <h1 class="title">{{title}}</h1>
      </div>
      
      <div class="section">
        <h2>Parties contractantes</h2>
        <p><strong>Prestataire:</strong> dziljo SaaS</p>
        <p><strong>Client:</strong> {{clientName}}</p>
      </div>
      
      <div class="section">
        <h2>Objet du contrat</h2>
        <p>{{description}}</p>
      </div>
      
      <div class="section">
        <h2>Conditions financières</h2>
        <p><strong>Montant:</strong> {{amount}} €</p>
        <p><strong>Conditions de paiement:</strong> {{paymentTerms}}</p>
      </div>
      
      <div class="signature">
        <p>Fait le {{date}}</p>
        <br><br>
        <p>Signature du client: ________________</p>
      </div>
    </body>
    </html>
  `,
  
  payslip: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 40px; }
        .employee-info { background: #f8f9fa; padding: 20px; margin: 20px 0; }
        .salary-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .salary-table th, .salary-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .salary-table th { background-color: #3B82F6; color: white; }
        .total-row { background-color: #e3f2fd; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Bulletin de Paie</h1>
        <p>Période: {{period}}</p>
      </div>
      
      <div class="employee-info">
        <h2>Informations Employé</h2>
        <p><strong>Nom:</strong> {{employeeName}}</p>
        <p><strong>Poste:</strong> {{position}}</p>
        <p><strong>Département:</strong> {{department}}</p>
      </div>
      
      <table class="salary-table">
        <thead>
          <tr>
            <th>Élément</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Salaire de base</td><td>{{baseSalary}} €</td></tr>
          <tr><td>Heures supplémentaires</td><td>{{overtime}} €</td></tr>
          <tr><td>Primes</td><td>{{bonuses}} €</td></tr>
          <tr><td>Déductions</td><td>-{{deductions}} €</td></tr>
          <tr class="total-row"><td>BRUT</td><td>{{grossPay}} €</td></tr>
          <tr><td>Cotisations sociales</td><td>-{{socialCharges}} €</td></tr>
          <tr><td>Impôts</td><td>-{{taxes}} €</td></tr>
          <tr class="total-row"><td>NET À PAYER</td><td>{{netPay}} €</td></tr>
        </tbody>
      </table>
    </body>
    </html>
  `
};

export async function generatePDFDocument(
  documentData: any, 
  entrepriseId: string, 
  docId: string
): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Sélectionner le template approprié
    const templateName = documentData.type || 'contract';
    const template = TEMPLATES[templateName as keyof typeof TEMPLATES] || TEMPLATES.contract;
    
    // Compiler le template avec les données
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({
      ...documentData,
      date: new Date().toLocaleDateString('fr-FR')
    });
    
    // Générer le PDF
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    // Uploader vers Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = `documents/${entrepriseId}/${docId}.pdf`;
    const file = bucket.file(fileName);
    
    await file.save(pdfBuffer, {
      metadata: {
        contentType: 'application/pdf',
        metadata: {
          entrepriseId,
          documentId: docId,
          generatedAt: new Date().toISOString()
        }
      }
    });
    
    // Rendre le fichier accessible
    await file.makePublic();
    
    return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
  } finally {
    await browser.close();
  }
}