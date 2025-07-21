import React, { useState } from 'react';
import { Download, FileText, Table, Loader2, CheckCircle } from 'lucide-react';
import { PDFGenerator } from '../../utils/pdfGenerator';
import { CSVExporter } from '../../utils/csvExporter';

interface ExportButtonsProps {
  data: any[];
  type: 'employees' | 'payroll' | 'contracts' | 'prospects' | 'opportunities' | 'leave' | 'trainings';
  title?: string;
  className?: string;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  data, 
  type, 
  title = 'Export', 
  className = '' 
}) => {
  const [isExporting, setIsExporting] = useState<'pdf' | 'csv' | null>(null);
  const [exportSuccess, setExportSuccess] = useState<'pdf' | 'csv' | null>(null);

  const handlePDFExport = async () => {
    setIsExporting('pdf');
    try {
      switch (type) {
        case 'employees':
          PDFGenerator.generateEmployeeListPDF(data);
          break;
        case 'payroll':
          // For payroll, we need to generate individual PDFs or a summary
          if (data.length === 1) {
            const payrollData = {
              employee: {
                name: data[0].employeeName,
                position: data[0].position,
                employeeId: data[0].employeeId || 'EMP001',
                department: data[0].department
              },
              period: data[0].payPeriod,
              salary: {
                base: data[0].baseSalary,
                overtime: data[0].overtime,
                bonuses: data[0].bonuses,
                deductions: data[0].deductions,
                gross: data[0].grossPay,
                taxes: data[0].taxes,
                socialCharges: data[0].socialCharges,
                net: data[0].netPay
              },
              workingDetails: {
                workingDays: data[0].workingDays,
                absenceDays: data[0].absenceDays,
                overtimeHours: data[0].overtimeHours
              },
              company: {
                name: 'dziljo SaaS',
                address: '123 Rue de la Tech, 75001 Paris',
                siret: '12345678901234'
              }
            };
            PDFGenerator.generatePayrollPDF(payrollData);
          } else {
            // Generate summary PDF for multiple entries
            PDFGenerator.generateEmployeeListPDF(data.map(entry => ({
              firstName: entry.employeeName.split(' ')[0],
              lastName: entry.employeeName.split(' ').slice(1).join(' '),
              position: entry.position,
              department: entry.department,
              email: entry.email || 'N/A',
              startDate: entry.payPeriod,
              status: entry.status
            })));
          }
          break;
        default:
          // For other types, generate a generic list PDF
          PDFGenerator.generateEmployeeListPDF(data);
      }
      
      setExportSuccess('pdf');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleCSVExport = async () => {
    setIsExporting('csv');
    try {
      switch (type) {
        case 'employees':
          CSVExporter.exportEmployees(data);
          break;
        case 'payroll':
          CSVExporter.exportPayroll(data);
          break;
        case 'contracts':
          CSVExporter.exportContracts(data);
          break;
        case 'prospects':
          CSVExporter.exportProspects(data);
          break;
        case 'opportunities':
          CSVExporter.exportOpportunities(data);
          break;
        case 'leave':
          CSVExporter.exportLeaveRequests(data);
          break;
        case 'trainings':
          CSVExporter.exportTrainings(data);
          break;
        default:
          console.warn('Type d\'export non supporté:', type);
      }
      
      setExportSuccess('csv');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <button
        onClick={handlePDFExport}
        disabled={isExporting === 'pdf' || data.length === 0}
        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting === 'pdf' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : exportSuccess === 'pdf' ? (
          <CheckCircle className="w-4 h-4 mr-2" />
        ) : (
          <FileText className="w-4 h-4 mr-2" />
        )}
        {isExporting === 'pdf' ? 'Export...' : exportSuccess === 'pdf' ? 'Exporté!' : 'PDF'}
      </button>

      <button
        onClick={handleCSVExport}
        disabled={isExporting === 'csv' || data.length === 0}
        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting === 'csv' ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : exportSuccess === 'csv' ? (
          <CheckCircle className="w-4 h-4 mr-2" />
        ) : (
          <Table className="w-4 h-4 mr-2" />
        )}
        {isExporting === 'csv' ? 'Export...' : exportSuccess === 'csv' ? 'Exporté!' : 'CSV'}
      </button>
    </div>
  );
};

export default ExportButtons;