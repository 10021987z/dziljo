import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export interface PayrollPDFData {
  employee: {
    name: string;
    position: string;
    employeeId: string;
    department: string;
  };
  period: string;
  salary: {
    base: number;
    overtime: number;
    bonuses: number;
    deductions: number;
    gross: number;
    taxes: number;
    socialCharges: number;
    net: number;
  };
  workingDetails: {
    workingDays: number;
    absenceDays: number;
    overtimeHours: number;
  };
  company: {
    name: string;
    address: string;
    siret: string;
    logo?: string;
  };
}

export interface ContractPDFData {
  title: string;
  client: {
    name: string;
    email: string;
    address?: string;
  };
  contract: {
    type: string;
    value: number;
    startDate: string;
    endDate: string;
    description: string;
    terms: string[];
  };
  company: {
    name: string;
    address: string;
    siret: string;
    logo?: string;
  };
}

export class PDFGenerator {
  private static addHeader(doc: jsPDF, title: string, companyInfo: any) {
    // Logo placeholder
    doc.setFillColor(59, 130, 246);
    doc.rect(20, 15, 30, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('dziljo', 35, 28);

    // Company info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(companyInfo.name, 60, 20);
    doc.setFontSize(10);
    doc.text(companyInfo.address, 60, 26);
    doc.text(`SIRET: ${companyInfo.siret}`, 60, 32);

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, 50);

    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 150, 50);

    return 60; // Return Y position for content start
  }

  private static addFooter(doc: jsPDF) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Document généré par dziljo - Gestion PME Intégrée', 20, pageHeight - 10);
    doc.text(`Page 1`, 180, pageHeight - 10);
  }

  static generatePayrollPDF(data: PayrollPDFData): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, `Fiche de Paie - ${data.period}`, data.company);

    // Employee info
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations Employé', 20, startY + 10);
    
    doc.autoTable({
      startY: startY + 15,
      head: [['Champ', 'Valeur']],
      body: [
        ['Nom', data.employee.name],
        ['Poste', data.employee.position],
        ['ID Employé', data.employee.employeeId],
        ['Département', data.employee.department],
        ['Période', data.period]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });

    // Salary breakdown
    const salaryStartY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Détail de la Rémunération', 20, salaryStartY);

    doc.autoTable({
      startY: salaryStartY + 5,
      head: [['Élément', 'Montant (€)']],
      body: [
        ['Salaire de base', data.salary.base.toFixed(2)],
        ['Heures supplémentaires', data.salary.overtime.toFixed(2)],
        ['Primes et bonus', data.salary.bonuses.toFixed(2)],
        ['Déductions', `-${data.salary.deductions.toFixed(2)}`],
        ['TOTAL BRUT', data.salary.gross.toFixed(2)],
        ['Impôts sur le revenu', `-${data.salary.taxes.toFixed(2)}`],
        ['Cotisations sociales', `-${data.salary.socialCharges.toFixed(2)}`],
        ['NET À PAYER', data.salary.net.toFixed(2)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      bodyStyles: {
        0: { fontStyle: 'normal' },
        1: { fontStyle: 'normal' },
        2: { fontStyle: 'normal' },
        3: { fontStyle: 'normal', textColor: [220, 38, 38] },
        4: { fontStyle: 'bold', fillColor: [243, 244, 246] },
        5: { fontStyle: 'normal', textColor: [220, 38, 38] },
        6: { fontStyle: 'normal', textColor: [220, 38, 38] },
        7: { fontStyle: 'bold', fillColor: [34, 197, 94], textColor: [255, 255, 255] }
      },
      margin: { left: 20, right: 20 }
    });

    // Working details
    const workingStartY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Détails de Présence', 20, workingStartY);

    doc.autoTable({
      startY: workingStartY + 5,
      head: [['Détail', 'Valeur']],
      body: [
        ['Jours travaillés', data.workingDetails.workingDays.toString()],
        ['Jours d\'absence', data.workingDetails.absenceDays.toString()],
        ['Heures supplémentaires', `${data.workingDetails.overtimeHours}h`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });

    // Footer
    this.addFooter(doc);

    // Save
    doc.save(`Fiche_Paie_${data.employee.name.replace(/\s+/g, '_')}_${data.period}.pdf`);
  }

  static generateContractPDF(data: ContractPDFData): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, data.title, data.company);

    // Contract details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Détails du Contrat', 20, startY + 10);
    
    doc.autoTable({
      startY: startY + 15,
      head: [['Champ', 'Valeur']],
      body: [
        ['Client', data.client.name],
        ['Email', data.client.email],
        ['Type de contrat', data.contract.type],
        ['Valeur', `${data.contract.value.toLocaleString()} €`],
        ['Date de début', data.contract.startDate],
        ['Date de fin', data.contract.endDate]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 }
    });

    // Description
    const descStartY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 20, descStartY);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const splitDescription = doc.splitTextToSize(data.contract.description, 170);
    doc.text(splitDescription, 20, descStartY + 10);

    // Terms
    const termsStartY = descStartY + 10 + (splitDescription.length * 5) + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Conditions', 20, termsStartY);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    data.contract.terms.forEach((term, index) => {
      doc.text(`${index + 1}. ${term}`, 25, termsStartY + 10 + (index * 8));
    });

    // Footer
    this.addFooter(doc);

    // Save
    doc.save(`Contrat_${data.client.name.replace(/\s+/g, '_')}.pdf`);
  }

  static generateEmployeeListPDF(employees: any[]): void {
    const doc = new jsPDF();
    
    // Header
    const startY = this.addHeader(doc, 'Liste des Employés', {
      name: 'dziljo SaaS',
      address: '123 Rue de la Tech, 75001 Paris',
      siret: '12345678901234'
    });

    // Employee table
    const tableData = employees.map(emp => [
      emp.firstName + ' ' + emp.lastName,
      emp.position,
      emp.department,
      emp.email,
      emp.startDate,
      emp.status === 'active' ? 'Actif' : 'Inactif'
    ]);

    doc.autoTable({
      startY: startY + 10,
      head: [['Nom', 'Poste', 'Département', 'Email', 'Date d\'embauche', 'Statut']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 10, right: 10 },
      styles: { fontSize: 9 }
    });

    // Footer
    this.addFooter(doc);

    // Save
    doc.save(`Liste_Employes_${new Date().toISOString().split('T')[0]}.pdf`);
  }
}